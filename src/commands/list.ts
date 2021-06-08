import { CommandOptions } from 'discord-rose'

export default {
  command: 'list',
  description: 'Lists all users who have the cheese touch',
  interaction: {
    name: 'list',
    description: 'Lists all users who have the cheese touch'
  },
  exec: async (ctx) => {
    const current = await ctx.worker.db.touches.find({ guild: ctx.guild?.id }).toArray()

    ctx.embed
      .title('Users with the Cheese Touch')
      .description(`${current.map(x => `<@${x.current}>`)}`)
      .send()
  }
} as CommandOptions
