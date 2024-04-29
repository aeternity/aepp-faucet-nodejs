import { SetResult } from './result.ts'
import topUp from './topUp.ts'

export function setupWallet(div: HTMLDivElement, setResult: SetResult) {
  const isInIframe = window.parent !== window
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent#Mobile_Tablet_or_Desktop
  const isMobile = window.navigator.userAgent.includes('Mobi')
  if (!isInIframe && isMobile) {
    div.remove()
    return
  }

  const button = div.querySelector<HTMLButtonElement>('button')!
  button.addEventListener('click', async () => {
    button.disabled = true
    setResult('loading', 'Connection to wallet', 'Loading dependencies.')
    try {
      const getWalletAddress = (await import('./getWalletAddress.ts')).default
      const address = await getWalletAddress(setResult)
      await topUp(address, setResult)
    } catch (error) {
      setResult('error', error instanceof Error ? error.message : String(error))
    } finally {
      button.disabled = false
    }
  })
}
