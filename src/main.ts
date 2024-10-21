import './style.css';
import { setupInput } from './input.ts';
import { setupResult } from './result.ts';
import { setupForm } from './form.ts';
import { setupWallet } from './connectWallet.ts';

setupInput(document.querySelector<HTMLInputElement>('[name=address]')!);

const setResult = setupResult(document.querySelector<HTMLDivElement>('#result')!);

setupForm(document.querySelector('#form')!, setResult);

setupWallet(document.querySelector('.connect-wallet')!, setResult);
