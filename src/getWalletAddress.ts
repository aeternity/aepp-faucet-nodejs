import { SetResult } from './result.ts'
import {
  BrowserWindowMessageConnection, walletDetector, AeSdkAepp, Encoded,
} from '@aeternity/aepp-sdk'

export default async function getWalletAddress(
  setResult: SetResult,
): Promise<Encoded.AccountAddress> {
  const aeSdk = new AeSdkAepp({ name: 'Faucet Aepp' })
  // TODO: remove after merging https://github.com/aeternity/aepp-sdk-js/pull/1981
  aeSdk._ensureAccountAccess = () => {}
  let connection = new BrowserWindowMessageConnection()
  setResult('loading', 'Connecting to wallet', 'Waiting for wallet invitation.')
  let walletName
  connection = await new Promise((resolve, reject) => {
    const stopDetection = walletDetector(connection, async ({ newWallet }) => {
      walletName = `${newWallet.info.name} wallet`
      setResult('loading', 'Connecting to wallet', `Found ${walletName}.`)
      stopDetection()
      clearTimeout(rejectTimeout)
      resolve(newWallet.getConnection())
    })
    const rejectTimeout = setTimeout(() => {
      stopDetection()
      reject(new Error('We can\'t find a wallet.'))
    }, 5000)
  })
  await aeSdk.connectToWallet(connection)
  setResult('loading', 'Connecting to wallet', `Asked ${walletName} for address.`)
  let addresses
  try {
    addresses = await aeSdk.askAddresses()
  } finally {
    aeSdk.disconnectWallet()
  }
  if (addresses.length === 0) throw new Error(`${walletName} didn\'t provide an address.`)
  return addresses[0]
}
