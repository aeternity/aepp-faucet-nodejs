import express from 'express';
import ViteExpress from 'vite-express';
import {
  AeSdk, toAettos, toAe, MemoryAccount, Node, isAddressValid, encode, Encoding,
} from '@aeternity/aepp-sdk';
import cors from 'cors';
import { timeAgo, getRequiredVariable, getNumberVariable } from './utils.ts';

const FAUCET_ACCOUNT_PRIV_KEY = getRequiredVariable('FAUCET_ACCOUNT_PRIV_KEY');
const TOPUP_AMOUNT = process.env.TOPUP_AMOUNT || '5';
const SPEND_TX_PAYLOAD = process.env.SPEND_TX_PAYLOAD || 'Faucet Tx';
const NODE_URL = process.env.NODE_URL || 'https://testnet.aeternity.io';
const EXPLORER_URL = process.env.EXPLORER_URL || 'https://testnet.aescan.io';
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || 'aepp-dev@aeternity.com';
const SERVER_LISTEN_PORT = getNumberVariable('SERVER_LISTEN_PORT', 5000);

const { info, error } = console;
console.info = (...args: unknown[]) => info(`[${new Date().toISOString()}] INFO`, ...args);
console.error = (...args: unknown[]) => error(`[${new Date().toISOString()}] ERROR`, ...args);

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
  console.info(`Synced nonce ${nonce}`);
}
await fetchNonce();

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
    console.info(`Top up ${address} with ${TOPUP_AMOUNT} AE, tx hash ${tx.hash}`);
    const balance = await aeSdk.getBalance(address);
    res.send({ tx_hash: tx.hash, balance });
  } catch (err) {
    console.error(`Generic error: top up ${address} of ${TOPUP_AMOUNT} AE on ${NODE_URL.replace('https://', '')} failed with error.`, err);
    res.status(500);
    res.send({ message: `Unknown error, please contact <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>` });
  }
});

await new Promise<void>((resolve) => ViteExpress.listen(app, SERVER_LISTEN_PORT, resolve));

ViteExpress.config({
  transformer: (html: string) => [
    ['NODE_URL', NODE_URL],
    ['TOPUP_AMOUNT', TOPUP_AMOUNT],
    ['EXPLORER_URL', EXPLORER_URL],
    ['REVISION', process.env.REVISION ?? 'local'],
  ].reduce((acc, [k, v]) => acc.replace(`{{ ${k} }}`, v), html),
});

console.info(`Faucet listening at http://0.0.0.0:${SERVER_LISTEN_PORT}`);
console.info(`Faucet Address: ${aeSdk.address}`);
console.info(`Faucet Balance: ${toAe(await aeSdk.getBalance(aeSdk.address))} AE`);
