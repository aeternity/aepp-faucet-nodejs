export function setupInput(element: HTMLInputElement) {
  const urlParams = new URLSearchParams(window.location.search)
  const address = urlParams.get('address')
  if (address) element.value = address
}
