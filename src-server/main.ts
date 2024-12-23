import express from 'express';
import ViteExpress from 'vite-express';
import { Server } from 'http';
import {
  AeSdk,
  toAettos,
  toAe,
  MemoryAccount,
  Node,
  isAddressValid,
  encode,
  Encoding,
  Encoded,
} from '@aeternity/aepp-sdk';
import cors from 'cors';
import pkg from '../package.json' with { type: 'json' };
import { timeAgo, getNumberVariable } from './utils.js';

function getSecretKey(): Encoded.AccountSecretKey {
  if (process.env.FAUCET_ACCOUNT_SECRET_KEY) {
    if (!isAddressValid(process.env.FAUCET_ACCOUNT_SECRET_KEY, Encoding.AccountSecretKey)) {
      throw new Error('FAUCET_ACCOUNT_SECRET_KEY is not encoded as sk_');
    }
    return process.env.FAUCET_ACCOUNT_SECRET_KEY;
  }
  if (process.env.FAUCET_ACCOUNT_PRIV_KEY) {
    console.warn(
      'FAUCET_ACCOUNT_PRIV_KEY is deprecated, provide FAUCET_ACCOUNT_SECRET_KEY instead',
    );
    const buffer = Buffer.from(process.env.FAUCET_ACCOUNT_PRIV_KEY, 'hex');
    if (buffer.length !== 64) {
      throw new Error(
        `Invalid FAUCET_ACCOUNT_PRIV_KEY length: expected 64 bytes, got ${buffer.length} instead`,
      );
    }
    return encode(buffer.subarray(0, 32), Encoding.AccountSecretKey);
  }
  throw new Error(`ENV-variable missing: FAUCET_ACCOUNT_SECRET_KEY`);
}

const TOPUP_AMOUNT = process.env.TOPUP_AMOUNT || '5';
const SPEND_TX_PAYLOAD = process.env.SPEND_TX_PAYLOAD || 'Faucet Tx';
const SPEND_TX_TTL = process.env.SPEND_TX_TTL || '3';
const NODE_URL = process.env.NODE_URL || 'https://testnet.aeternity.io';
const EXPLORER_URL = process.env.EXPLORER_URL || 'https://testnet.aescan.io';
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || 'aepp-dev@aeternity.com';
const SERVER_LISTEN_PORT = getNumberVariable('SERVER_LISTEN_PORT', 5000);

const { info, error } = console;
console.info = (...args: unknown[]) => info(`[${new Date().toISOString()}] INFO`, ...args);
console.error = (...args: unknown[]) => error(`[${new Date().toISOString()}] ERROR`, ...args);

const grayList = new Map<string, Date>();
const grayListInterval = setInterval(() => {
  grayList.forEach((date, address) => {
    if (date > new Date()) return;
    grayList.delete(address);
  });
}, 1000 * 60);

const aeSdk = new AeSdk({
  nodes: [{ name: 'node', instance: new Node(NODE_URL) }],
  accounts: [new MemoryAccount(getSecretKey())],
});

const app = express();
app.use(cors());

let nonce: number;
async function fetchNonce() {
  nonce = (await aeSdk.api.getAccountNextNonce(aeSdk.address)).nextNonce;
  console.info(`Synced nonce ${nonce}`);
}

const [currency] = await Promise.all([aeSdk.api.getCurrency(), fetchNonce()]);

let previousSpendPromise: ReturnType<typeof aeSdk.spend>;
app.post('/account/:recipient_address', async (req, res) => {
  const address = req.params.recipient_address;
  try {
    console.info(`Top up request for ${address}`);

    if (!isAddressValid(address)) {
      const message = `The provided address is not valid: ${address}`;
      console.info(message);
      res.status(400);
      res.send({ message });
      return;
    }

    const grayListTtl = grayList.get(address);
    if (grayListTtl) {
      const message = `The address ${address} is graylisted for another ${timeAgo(grayListTtl)}`;
      console.info(message);
      res.status(425);
      res.send({ message });
      return;
    }

    previousSpendPromise = (previousSpendPromise ?? Promise.resolve()).catch(fetchNonce).then(() =>
      aeSdk.spend(toAettos(TOPUP_AMOUNT), address, {
        // @ts-expect-error string not supported on sdk side
        payload: encode(Buffer.from(SPEND_TX_PAYLOAD), Encoding.Bytearray),
        nonce: nonce++,
        verify: false,
        ttl: +SPEND_TX_TTL,
      }),
    );
    const tx = await previousSpendPromise;
    grayList.set(address, new Date(Date.now() + 1000 * 60 * 60 * 4));
    console.info(`Top up ${address} with ${TOPUP_AMOUNT} ${currency.symbol}, tx hash ${tx.hash}`);
    const balance = await aeSdk.getBalance(address);
    res.send({ tx_hash: tx.hash, balance });
  } catch (err) {
    console.error(
      `Generic error: top up ${address} of ${TOPUP_AMOUNT} ${currency.symbol} on ${NODE_URL.replace('https://', '')} failed with error.`,
      err,
    );
    res.status(500);
    res.send({
      message: `Unknown error, please contact <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>`,
    });
  }
});

const server = await new Promise<Server>((resolve) => {
  const s = ViteExpress.listen(app, SERVER_LISTEN_PORT, () => resolve(s));
});

const revision = process.env.REVISION || 'local';
ViteExpress.config({
  transformer: (html: string) =>
    [
      ['NETWORK_NAME', currency.networkName],
      ['SYMBOL', currency.symbol],
      ['COLOR_PRIMARY', currency.primaryColour],
      ['NODE_URL', NODE_URL],
      ['TOPUP_AMOUNT', TOPUP_AMOUNT],
      ['EXPLORER_URL', EXPLORER_URL],
      ['VERSION', pkg.version],
      ['REVISION', revision],
      ['REVISION_SHORT', revision.slice(0, 7)],
    ].reduce((acc, [k, v]) => acc.replaceAll(`{{ ${k} }}`, v), html),
});

console.info(`Faucet listening at http://0.0.0.0:${SERVER_LISTEN_PORT}`);
console.info(`Faucet Address: ${aeSdk.address}`);
console.info(`Faucet Balance: ${toAe(await aeSdk.getBalance(aeSdk.address))} ${currency.symbol}`);

function closeServer() {
  server.close();
  clearInterval(grayListInterval);
}
process.on('SIGINT', closeServer);
process.on('SIGTERM', closeServer);
