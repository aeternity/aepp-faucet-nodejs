# aepp-faucet-nodejs

Send Online Top-up. Instant Account Recharge

Recharge your account on the Aeternity Testnet

## Provide address in URL

If you navigate the user to the faucet from a wallet, it would be friendly to substitute the user's address into the form. Use `address` query parameter for that. For example,

```
https://faucet.aepps.com/?address=ak_21A27UVVt3hDkBE5J7rhhqnH5YNb4Y1dqo4PnSybrH85pnWo7E
```

## JSON API

Instead of using web UI, you can make a POST request to `https://faucet.aepps.com/account/<address>`. It will respond with a JSON containing transaction hash and an increased balance (in aettos)

```json
{
  "tx_hash": "th_dxhmrcJY4bdqQrj5ZP1zBsuuKz4v4oyPNSqNS6TwTimPuJ3af",
  "balance": "10000000000000000000"
}
```

If you did top-up recently, you may get an error (425 code)

```json
{
  "message": "The address ak_21A27UVVt3hDkBE5J7rhhqnH5YNb4Y1dqo4PnSybrH85pnWo7E is graylisted for another 2h 59m 24s"
}
```

An example of requesting faucet using `fetch` API in JavaScript

```js
const address = 'ak_21A27UVVt3hDkBE5J7rhhqnH5YNb4Y1dqo4PnSybrH85pnWo7E';
const url = `https://faucet.aepps.com/account/${address}`;
const { status } = await fetch(url, { method: 'POST' });
if (status !== 200) throw new Error(`Unexpected faucet response code: ${status}`);
```

## Configuration

Configuring Faucet application via environment variable:

- `FAUCET_ACCOUNT_PRIV_KEY` The account that faucet aepp will top off the account. (Required)
- `TOPUP_AMOUNT` The amount of tokens that the faucet application will place into your account. (Default: 5AE)
- `SPEND_TX_PAYLOAD` Value to use to fill the payload for the transactions (Default: `Faucet Tx`)
- `NODE_URL` URL of the node that the faucet aepp is using. (Default: 'https://testnet.aeternity.io')
- `EXPLORER_URL` URL of the explorer app (Default: 'https://testnet.aescan.io')
- `SUPPORT_EMAIL` Email to display for support requests (Default: `aepp-dev@aeternity.com`)

### Server

- `SERVER_LISTEN_PORT` on which port to listen (Default: `5000`)

## Development

This repository bundles a simple frontend and a node (express) based backend into a single docker container.

To build and run it locally execute following commands in the root:

```
npm install
export FAUCET_ACCOUNT_PRIV_KEY=9ebd7beda0c79af72a42ece3821a56eff16359b6df376cf049aee995565f022f840c974b97164776454ba119d84edc4d6058a8dec92b6edc578ab2d30b4c4200
export TOPUP_AMOUNT=0.01
npm run dev
```
