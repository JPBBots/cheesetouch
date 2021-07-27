import { Snowflake } from 'discord-api-types'
import { Database as Db } from '@jpbbots/interface/dist/Database'
import { Collection } from 'mongodb'

import { Modifiers } from './Modifiers'

export interface ITouch {
  guild: Snowflake
  current: Snowflake
  previous?: Snowflake
  modifiers?: Modifiers
}

export interface IGuild {
  id: Snowflake
  reactions: boolean
  role: Snowflake|null
}

export class Database extends Db {
  get touches (): Collection<ITouch> {
    return this.collection('touches')
  }

  get guilds (): Collection<IGuild> {
    return this.collection('guilds')
  }
}
