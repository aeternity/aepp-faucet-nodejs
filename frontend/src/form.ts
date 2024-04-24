import { SetResult } from './result.ts'

export function setupForm(form: HTMLFormElement, setResult: SetResult) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault()

    const account = (form.elements.namedItem('address') as HTMLInputElement).value
    const amount = form.dataset.amount
    const explorerURL = form.dataset.explorerUrl

    setResult('loading', `Adding ${amount} AE`, `
      Account: <a href="${explorerURL}/accounts/${account}" target="_blank">${account}</a>
    `)

    let response, json
    try {
      response = await window.fetch(`/account/${account}`, { method: 'POST' })
      json = await response.json()
      if (response.status !== 200) throw new Error(`Unexpected response status: ${response.status}`)
      setResult('success', `Added ${amount} AE!`, `
        Transaction: <a href="${explorerURL}/transactions/${json.tx_hash}" target="_blank">${json.tx_hash}</a><br>
        Account: <a href="${explorerURL}/accounts/${account}" target="_blank">${account}</a><br>
        Balance: ${json.balance / 1e18} AE<br>
      `)
    } catch (error) {
      setResult('error', 'Something went wrong. ¯\\_(ツ)_/¯', `
        ${json?.message ?? (error instanceof Error && error.message)}<br>
        Please try again later.
      `)
      console.warn(error)
    }
  })
}
