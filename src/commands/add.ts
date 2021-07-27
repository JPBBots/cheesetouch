import { ApplicationCommandOptionType } from 'discord-api-types'
import { CommandOptions } from 'discord-rose'

export default {
  command: 'add',
  userPerms: ['manageGuild'],
  description: 'Adds a cheese touch to a user',
  interaction: {
    name: 'add',
    description: 'Adds a cheese touch to a user',
    options: [{
      name: 'user',
      description: 'User to add a cheese touch to',
      type: ApplicationCommandOptionType.User,
      required: true
    }]
  },
  exec: async (ctx) => {
    if (!ctx.guild) return

    const user = ctx.options.user ?? ctx.message.mentions[0]?.id ?? ctx.args[0]

    const current = await ctx.worker.db.touches.findOne({ guild: ctx.guild.id, current: user })
    if (current) return ctx.error('This user already has the cheese touch!')

    await ctx.worker.db.touches.insertOne({
      guild: ctx.guild.id,
      current: user
    })

    void ctx.embed
      .description(`<@${user}> now has the cheese touch!`)
      .send()
  }
} as CommandOptions
