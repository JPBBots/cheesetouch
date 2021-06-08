import Collection from '@discordjs/collection'
import { Snowflake } from 'discord-api-types'

export class KeepsManager {
  entries: Collection<string, true> = new Collection()

  is (guild: Snowflake, user: Snowflake) {
    return this.entries.has(`${guild}-${user}`)
  }

  set (guild?: Snowflake, user?: Snowflake) {
    this.entries.set(`${guild}-${user}`, true)

    setTimeout(() => {
      this.entries.delete(`${guild}-${user}`)
    }, 59e3)
  }
}