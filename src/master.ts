import { Master } from 'discord-rose'
import { token } from './config'
import path from 'path'

import { Interface } from 'interface'
const int = new Interface()

const master = new Master(path.resolve(__dirname, './worker.js'), {
  token,
  cacheControl: {
    guilds: ['owner_id'],
    channels: ['permission_overwrites'],
    roles: ['permissions', 'position']
  }
})

int.setupMaster(master, 'cheesetouch')

master.start()
