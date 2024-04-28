import './style.css'
import { setupInput } from './input.ts'
import { setupResult } from './result.ts'
import { setupForm } from './form.ts'

setupInput(document.querySelector<HTMLInputElement>('[name=address]')!)

const setResult = setupResult(document.querySelector<HTMLDivElement>('#result')!)

setupForm(document.querySelector('#form')!, setResult)
