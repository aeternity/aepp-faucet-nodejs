import { fileURLToPath } from 'url';
import path from 'path';
import express from 'express';
import mustache from 'mustache-express';
import winston from 'winston';
import NodeCache from 'node-cache';
import { DateTime } from 'luxon';
import {
    AeSdk, toAettos, toAe, MemoryAccount, Node, isAddressValid, encode, Encoding,
} from '@aeternity/aepp-sdk';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const setRequiredVariable = (variableName) => {
    if (process.env[variableName]) {
        return process.env[variableName];
    }
    throw new Error(`ENV-variable missing: ${variableName}`);
}

// faucet transactions
const FAUCET_ACCOUNT_PRIV_KEY = setRequiredVariable('FAUCET_ACCOUNT_PRIV_KEY');
const TOPUP_AMOUNT = process.env.TOPUP_AMOUNT || '5';
const SPEND_TX_PAYLOAD = process.env.SPEND_TX_PAYLOAD || 'Faucet Tx';
// node, explorer & support
const NODE_URL = process.env.NODE_URL || 'https://testnet.aeternity.io';
const EXPLORER_URL = process.env.EXPLORER_URL || 'https://explorer.testnet.aeternity.io';
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || 'aepp-dev@aeternity.com';
// graylisting
const CACHE_MAX_SIZE = process.env.CACHE_MAX_SIZE || 6000;
const CACHE_MAX_AGE = process.env.CACHE_MAX_AGE || 3600 * 4; // default 4h
// logging
const FAUCET_LOG_LEVEL = process.env.FAUCET_LOG_LEVEL || 'info';
// server
const SERVER_LISTEN_ADDRESS = process.env.SERVER_LISTEN_ADDRESS || '0.0.0.0';
const SERVER_LISTEN_PORT = process.env.SERVER_LISTEN_PORT || 5000;

const logger = winston.createLogger({
    level: FAUCET_LOG_LEVEL,
    format: winston.format.combine(
        winston.format.errors({ stack: true }),
        winston.format.simple(),
        winston.format.timestamp(),
        winston.format.printf(info => `[${info.timestamp}] ${info.level.toUpperCase()} - ${info.message}`)
    ),
    transports: [new winston.transports.Console()]
});

const addressCache = new NodeCache({
    maxKeys: CACHE_MAX_SIZE,
    stdTTL: CACHE_MAX_AGE,
    checkperiod: 60
});

const aeSdk = new AeSdk({
    nodes: [{ name: 'node', instance: new Node(NODE_URL) }],
    accounts: [new MemoryAccount(FAUCET_ACCOUNT_PRIV_KEY)],
});
const app = express();

app.use(cors());

// set up mustache templating
app.engine('mustache', mustache());
app.set('view engine', 'mustache');
app.set('views', `${__dirname}/templates`);

// static assets
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// serve frontend
app.get('/', (req, res) => {
    res.render('index', {amount: `${TOPUP_AMOUNT} AE`, node: NODE_URL, explorer_url: EXPLORER_URL});
});

let nonce;
async function fetchNonce() {
    nonce = (await aeSdk.api.getAccountNextNonce(aeSdk.address)).nextNonce;
}
await fetchNonce();

// top up address
let previousSpendPromise = Promise.resolve();
app.post('/account/:recipient_address', async (req, res) => {
    const address = req.params.recipient_address;
    try {
        logger.info(`Top up request for ${address}`);
        // validate address
        if (!isAddressValid(address)) {
            const message = `The provided address is not valid: ${address}`;
            logger.error(message);
            res.status(400);
            res.send({message});
            return;
        }
        // check if address is still in cache
        const topUpDate = addressCache.get(address);
        if (topUpDate) {
            const graylistExpDate = topUpDate.plus({seconds: CACHE_MAX_AGE});
            const delta = graylistExpDate.diffNow().toFormat("h'h' mm'm' ss's'");
            const message = `The address ${address} is graylisted for another ${delta}`;
            logger.warn(message);
            res.status(425);
            res.send({message});
            return;
        }
        addressCache.set(address, DateTime.now());
        previousSpendPromise = previousSpendPromise
            .catch(fetchNonce)
            .then(() => aeSdk.spend(toAettos(TOPUP_AMOUNT), address, {
                payload: encode(Buffer.from(SPEND_TX_PAYLOAD), Encoding.Bytearray),
                nonce: nonce++,
                verify: false,
            }));
        const tx = await previousSpendPromise;
        logger.info(`Top up address ${address} with ${TOPUP_AMOUNT} AE tx_hash: ${tx.hash} completed.`);
        const newBalance = await aeSdk.getBalance(address);
        res.send({tx_hash: tx.hash, balance: newBalance});
    } catch (err) {
        logger.error(`Generic error: top up account ${address} of ${TOPUP_AMOUNT} AE on ${NODE_URL.replace('https://', '')} failed with error.`, err);
        res.status(500);
        res.send({message: `""Unknown error, please contact <a href="${SUPPORT_EMAIL}" class="hover:text-pink-lighter">${SUPPORT_EMAIL}</a>""`});
    }
});

await new Promise((resolve, reject) => app.listen(
    SERVER_LISTEN_PORT,
    SERVER_LISTEN_ADDRESS,
    error => error ? reject(error) : resolve(),
));

logger.info(`Faucet listening at http://${SERVER_LISTEN_ADDRESS}:${SERVER_LISTEN_PORT}`);
logger.info(`Faucet Address: ${aeSdk.address}`);
logger.info(`Faucet Balance: ${toAe(await aeSdk.getBalance(aeSdk.address))} AE`);
logger.info(`Log-level: ${FAUCET_LOG_LEVEL}`);
