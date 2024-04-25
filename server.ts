import express from 'express';
import ViteExpress from 'vite-express';
import winston from 'winston';
import {
  AeSdk, toAettos, toAe, MemoryAccount, Node, isAddressValid, encode, Encoding,
} from '@aeternity/aepp-sdk';
import cors from 'cors';
import { timeAgo, getRequiredVariable, getNumberVariable } from './utils.ts';

// faucet transactions
const FAUCET_ACCOUNT_PRIV_KEY = getRequiredVariable('FAUCET_ACCOUNT_PRIV_KEY');
const TOPUP_AMOUNT = process.env.TOPUP_AMOUNT || '5';
const SPEND_TX_PAYLOAD = process.env.SPEND_TX_PAYLOAD || 'Faucet Tx';
// node, explorer & support
const NODE_URL = process.env.NODE_URL || 'https://testnet.aeternity.io';
const EXPLORER_URL = process.env.EXPLORER_URL || 'https://testnet.aescan.io';
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || 'aepp-dev@aeternity.com';
// logging
const FAUCET_LOG_LEVEL = process.env.FAUCET_LOG_LEVEL || 'info';
// server
const SERVER_LISTEN_PORT = getNumberVariable('SERVER_LISTEN_PORT', 5000);

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

const grayList = new Map<string, Date>();
setInterval(() => {
  grayList.forEach((date, address) => {
    if (date > new Date()) return;
    grayList.delete(address);
  });
}, 1000 * 60);

const aeSdk = new AeSdk({
  nodes: [{ name: 'node', instance: new Node(NODE_URL) }],
  accounts: [new MemoryAccount(FAUCET_ACCOUNT_PRIV_KEY)],
});

const app = express();
app.use(cors());

let nonce;
async function fetchNonce() {
  nonce = (await aeSdk.api.getAccountNextNonce(aeSdk.address)).nextNonce;
}
await fetchNonce();

// top up address
let previousSpendPromise: ReturnType<typeof aeSdk.spend>;
app.post('/account/:recipient_address', async (req, res) => {
  const address = req.params.recipient_address;
  try {
    logger.info(`Top up request for ${address}`);
    // validate address
    if (!isAddressValid(address)) {
      const message = `The provided address is not valid: ${address}`;
      logger.error(message);
      res.status(400);
      res.send({ message });
      return;
    }
    // check if address is still in cache
    const grayListTtl = grayList.get(address);
    if (grayListTtl) {
      const message = `The address ${address} is graylisted for another ${timeAgo(grayListTtl)}`;
      logger.warn(message);
      res.status(425);
      res.send({ message });
      return;
    }
    grayList.set(address, new Date(Date.now() + 1000 * 60 * 60 * 4));
    previousSpendPromise = (previousSpendPromise ?? Promise.resolve())
      .catch(fetchNonce)
      .then(() => aeSdk.spend(toAettos(TOPUP_AMOUNT), address, {
        // @ts-expect-error string not supported on sdk side
        payload: encode(Buffer.from(SPEND_TX_PAYLOAD), Encoding.Bytearray),
        nonce: nonce++,
        verify: false,
      }));
    const tx = await previousSpendPromise;
    logger.info(`Top up address ${address} with ${TOPUP_AMOUNT} AE tx_hash: ${tx.hash} completed.`);
    const newBalance = await aeSdk.getBalance(address);
    res.send({ tx_hash: tx.hash, balance: newBalance });
  } catch (err) {
    logger.error(`Generic error: top up account ${address} of ${TOPUP_AMOUNT} AE on ${NODE_URL.replace('https://', '')} failed with error.`, err);
    res.status(500);
    res.send({ message: `""Unknown error, please contact <a href="${SUPPORT_EMAIL}" class="hover:text-pink-lighter">${SUPPORT_EMAIL}</a>""` });
  }
});

await new Promise<void>((resolve) => ViteExpress.listen(app, SERVER_LISTEN_PORT, resolve));

ViteExpress.config({
  transformer: (html: string) => (
    [['node', NODE_URL], ['amount', TOPUP_AMOUNT], ['explorer_url', EXPLORER_URL]]
      .reduce((acc, [k, v]) => acc.replace(`{{ ${k} }}`, v), html)
  ),
});

logger.info(`Faucet listening at http://0.0.0.0:${SERVER_LISTEN_PORT}`);
logger.info(`Faucet Address: ${aeSdk.address}`);
logger.info(`Faucet Balance: ${toAe(await aeSdk.getBalance(aeSdk.address))} AE`);
logger.info(`Log-level: ${FAUCET_LOG_LEVEL}`);
