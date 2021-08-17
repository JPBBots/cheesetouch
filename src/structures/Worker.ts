import { Embed, SingleWorker } from 'discord-rose'
import config from '../config'

const cheese = '🧀'

import path from 'path'

import { Database } from './Database'
import { KeepsManager } from './KeepsManager'
import { ModifierManager } from './Modifiers'

import { Snowflake } from 'discord-api-types'

import { Handler } from '../handlers/message'

global.ROSE_DEFAULT_EMBED.color = 0xfac10c

export class CheeseTouch extends SingleWorker {
  db = new Database('localhost', 'cheesetouch', config.dbPass)
  mods = new ModifierManager(this)
  keeps = new KeepsManager()

  constructor () {
    super({
      token: config.token,
      cacheControl: {
        guilds: ['owner_id'],
        channels: ['permission_overwrites'],
        roles: ['permissions', 'position']
      }
    })

    this.setStatus('watching', 'the Cheese')

    this.commands
      .prefix('ct!')
      .load(path.resolve(__dirname, '../commands'))

    this.on('MESSAGE_CREATE', async (msg) => {
      if (!msg.guild_id) return

      const guild = await this.db.guilds.findOne({ id: msg.guild_id }) ?? { id: msg.guild_id, reactions: true, role: null }
      try {
        const res = await Handler(this, msg, guild)
        if (res) {
          if (guild.reactions) {
            this.api.messages.react(msg.channel_id, msg.id, cheese)
              .then(() => {
                if (thing.persist) { return }
                setTimeout(() => {
                  this.api.messages.deleteReaction(msg.channel_id, msg.id, cheese)
                }, 3e3)
              })
          }
        }
      } catch (err) {
        void this.send(msg.channel_id)
          .title('Error')
          .description(err.message)
          .send().then(m => {
            setTimeout(() => {
              this.api.messages.delete(msg.channel_id, m.id)
            }, 3e3)
          })
      }
    })
  }

  send (id: Snowflake): Embed {
    return new Embed((embed) => {
      return this.api.messages.send(id, embed)
    })
  }
}
