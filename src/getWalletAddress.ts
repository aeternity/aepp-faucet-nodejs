import { SetResult } from './result.ts';
import {
  BrowserWindowMessageConnection,
  walletDetector,
  WalletConnectorFrame,
  Encoded,
} from '@aeternity/aepp-sdk';

export default async function getWalletAddress(
  setResult: SetResult,
): Promise<Encoded.AccountAddress> {
  let connection = new BrowserWindowMessageConnection();
  setResult('loading', 'Connecting to wallet', 'Waiting for wallet invitation.');
  let walletName;
  connection = await new Promise((resolve, reject) => {
    const stopDetection = walletDetector(connection, async ({ newWallet }) => {
      walletName = `${newWallet.info.name} wallet`;
      setResult('loading', 'Connecting to wallet', `Found ${walletName}.`);
      stopDetection();
      clearTimeout(rejectTimeout);
      resolve(newWallet.getConnection());
    });
    const rejectTimeout = setTimeout(() => {
      stopDetection();
      reject(new Error("We can't find a wallet."));
    }, 5000);
  });
  const connector = await WalletConnectorFrame.connect('Faucet Aepp', connection);
  setResult('loading', 'Connecting to wallet', `Asked ${walletName} for address.`);
  let accounts;
  try {
    accounts = await connector.getAccounts();
  } finally {
    connector.disconnect();
  }
  if (accounts.length === 0) throw new Error(`${walletName} didn\'t provide an address.`);
  return accounts[0].address;
}
