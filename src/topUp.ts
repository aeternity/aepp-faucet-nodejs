import { SetResult } from './result.ts'

declare const TOPUP_AMOUNT: string
declare const SYMBOL: string
declare const EXPLORER_URL: string

export default async function topUp(address: string, setResult: SetResult): Promise<void> {
  setResult('loading', `Adding ${TOPUP_AMOUNT} ${SYMBOL}`, `
    Account: <a href="${EXPLORER_URL}/accounts/${address}" target="_blank">${address}</a>
  `)

  let response, json
  try {
    response = await fetch(`/account/${address}`, { method: 'POST' })
    json = await response.json()
    if (response.status !== 200) throw new Error(`Unexpected response status: ${response.status}`)
    setResult('success', `Added ${TOPUP_AMOUNT} ${SYMBOL}!`, `
      Transaction: <a href="${EXPLORER_URL}/transactions/${json.tx_hash}" target="_blank">${json.tx_hash}</a><br>
      Account: <a href="${EXPLORER_URL}/accounts/${address}" target="_blank">${address}</a><br>
      Balance: ${json.balance / 1e18} ${SYMBOL}<br>
    `)
  } catch (error) {
    throw new Error(`${json?.message ?? (error instanceof Error ? error.message : String(error))}`)
  }
}
