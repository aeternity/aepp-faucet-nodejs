import { SetResult } from './result.ts';
import topUp from './topUp.ts';

export function setupForm(form: HTMLFormElement, setResult: SetResult) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = form.querySelector<HTMLButtonElement>('button')!;
    button.disabled = true;
    try {
      await topUp((form.elements.namedItem('address') as HTMLInputElement).value, setResult);
    } catch (error) {
      setResult('error', error instanceof Error ? error.message : String(error));
    } finally {
      button.disabled = false;
    }
  });
}
