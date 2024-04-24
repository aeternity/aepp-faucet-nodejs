function showResult (resultEl) {
  const className = 'hidden'
  if (resultEl.classList) {
    resultEl.classList.remove('hidden', 'lg:hidden')
  } else {
    resultEl.className = resultEl.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ')
  }
}

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

    showResult(resultEl)

    resultEl.innerHTML = `<div class="flex flex-col">
      <img src="/assets/images/cycle-loader.svg" class="inline-block">
      <div class="font-mono inline-block text-center mt-4">Adding ${amount} AE to:<br>
        <strong class="mt-4 inline-block text-xs">${account}</strong>
      </div>
    </div>`

    let response, json
    try {
      response = await window.fetch(`/account/${account}`, { method: 'POST' })
      json = await response.json()
      if (response.status !== 200) throw new Error(`Unexpected response status: ${response.status}`)
      resultEl.innerHTML = `
        <strong>Added ${amount} AE!</strong><br>
        <br>Transaction: <a class="text-purple font-mono text-xs" href="${explorerURL}/transactions/${json.tx_hash}" target="_blank">${json.tx_hash}</a><br>
        <br>Account: <a class="text-purple font-mono text-xs" href="${explorerURL}/accounts/${account}" target="_blank">${account}</a>
        <br>Balance: <strong> ${json.balance / 1e18} AE </strong><br>`
    } catch (error) {
      resultEl.innerHTML = `
        Something went wrong. ¯\\_(ツ)_/¯<br>
        ${(json && json.message) || error.message}<br>
        Please try again later.`
      console.warn(error)
    }
  })
})
