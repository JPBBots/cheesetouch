import { Master } from 'discord-rose'
import { token } from './config'
import path from 'path'

const master = new Master(path.resolve(__dirname, './worker.js'), {
  token
})

master.start()
