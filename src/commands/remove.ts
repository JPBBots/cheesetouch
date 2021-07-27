import { ApplicationCommandOptionType } from 'discord-api-types'
import { CommandOptions } from 'discord-rose'

export default {
  command: 'remove',
  aliases: ['clear'],
  userPerms: ['manageGuild'],
  description: 'Removes all cheese touches related to a user',
  interaction: {
    name: 'remove',
    description: 'Removes all cheese touches related to a user',
    options: [{
      name: 'user',
      description: 'User to remove the cheese touch from',
      type: ApplicationCommandOptionType.User,
      required: true
    }]
  },
  exec: async (ctx) => {
    if (!ctx.guild) return

    const user = ctx.options.user ?? ctx.message.mentions[0]?.id ?? ctx.args[0]

    if (!user) return ctx.error(`Missing user, do ${ctx.prefix}remove [user]`)

    await ctx.worker.db.touches.deleteMany({
      guild: ctx.guild.id,
      current: user
    })
    await ctx.worker.db.touches.deleteMany({
      guild: ctx.guild.id,
      previous: user
    })

    void ctx.embed
      .description(`Cleared all touches associated with <@${user}>`)
      .send(true, false, true)
  }
} as CommandOptions
