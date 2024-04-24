import loader from './cycle-loader.svg'

export type SetResult = (
  status: 'loading' | 'success' | 'error', header: string, content: string,
) => void;

export function setupResult(element: HTMLDivElement): SetResult {
  return (status, header, content) => {
    element.style.display = 'block'
    element.classList.toggle('error', status === 'error');
    element.innerHTML = `
      ${status === 'loading' ? `<img src="${loader}">` : ''}
      <span class="status">${header}</span>
      ${content}
    `
  }
}
