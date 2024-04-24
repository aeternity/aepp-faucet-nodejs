function passQueryAccountAddressToInput (inputEl) {
  const urlParams = new URLSearchParams(window.location.search)
  const address = urlParams.get('address')
  if (address) {
    inputEl.value = address
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#faucetForm')
  const recipientEl = document.querySelector('#recipientAddress')
  const resultEl = document.querySelector('#result')

  passQueryAccountAddressToInput(recipientEl)

  form.addEventListener('submit', async (event) => {
    event.preventDefault()

    const account = recipientEl.value
    const amount = form.dataset.amount
    const explorerURL = form.dataset.explorerUrl

    resultEl.style.display = 'block'
    resultEl.classList.remove('error')
    resultEl.innerHTML = `
      <img src="/assets/images/cycle-loader.svg">
      <span class="status">Adding ${amount} AE</span>
      Account: <a href="${explorerURL}/accounts/${account}" target="_blank">${account}</a>`

    let response, json
    try {
      response = await window.fetch(`/account/${account}`, { method: 'POST' })
      json = await response.json()
      if (response.status !== 200) throw new Error(`Unexpected response status: ${response.status}`)
      resultEl.innerHTML = `
        <span class="status">Added ${amount} AE!</span>
        Transaction: <a href="${explorerURL}/transactions/${json.tx_hash}" target="_blank">${json.tx_hash}</a><br>
        Account: <a href="${explorerURL}/accounts/${account}" target="_blank">${account}</a><br>
        Balance: ${json.balance / 1e18} AE<br>`
    } catch (error) {
      resultEl.classList.add('error')
      resultEl.innerHTML = `
        <span class="status">Something went wrong. ¯\\_(ツ)_/¯</span>
        ${(json && json.message) || error.message}<br>
        Please try again later.`
      console.warn(error)
    }
  })
})
