import { CheeseTouch } from '../structures/Worker'
import { APIMessage } from 'discord-api-types'
import { IGuild, ITouch } from '../structures/Database'

export async function Handler (worker: CheeseTouch, message: APIMessage, db: IGuild): Promise<boolean> {
  if (!message.guild_id || message.author.bot) return false

  const mentions = message.mentions.filter(x => (x.id !== message.author.id) && !x.bot)

  const currentTouch = await worker.db.touches.findOne({
    guild: message.guild_id,
    current: message.author.id
  })

  let mentionedTouch: ITouch|null = null
  let mentioned: typeof mentions[number]|null = null
  if (mentions) {
    const touches = await worker.db.touches.find({
      guild: message.guild_id,
      current: {
        $in: mentions.map(x => x.id)
      }
    }).toArray()

    if (touches) {
      mentionedTouch = touches[0]
      if (mentionedTouch) {
        mentioned = mentions.find(x => x.id === mentionedTouch?.current) ?? null
      }
    }
  }

  if (!mentioned) mentioned = mentions[0]
  if (!mentioned) return !!currentTouch

  if (currentTouch && !mentionedTouch) {
    if (currentTouch.previous === mentioned.id) throw new Error('You cannot give the touch back!')

    if (worker.keeps.is(message.guild_id, message.author.id)) throw new Error('You have to keep for a minute!')

    return worker.mods.exec(currentTouch, mentioned.id, message, db)
  }

  if (!currentTouch && mentionedTouch) {
    if (mentionedTouch.previous === message.author.id) throw new Error('You cannot take the touch back')

    return worker.mods.exec(mentionedTouch, message.author.id, message, db)
  }

  return !!currentTouch
}
