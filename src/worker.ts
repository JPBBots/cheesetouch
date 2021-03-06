import { CheeseTouch } from './structures/Worker'

import { Interface } from '@jpbbots/interface'

const int = new Interface()

const worker = new CheeseTouch()

int.setupSingleton(worker, 'cheesetouch')

module.exports = worker

declare module 'discord-rose/dist/typings/lib' {
  type worker = CheeseTouch
  interface CommandOptions {
    description: string
    admin?: boolean
  }
}

import '@discord-rose/permissions-middleware'
