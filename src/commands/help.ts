import { CommandOptions } from 'discord-rose'

export default {
  command: 'help',
  description: 'Lists all commands and helpful links',
  exec: (ctx) => {
    const emb = ctx.embed
      .title('Help')
      .description('**Commands**\n')

    ctx.worker.commands.commands?.forEach(cmd => {
      if (cmd.admin) return
      emb.obj.description += `\n**${ctx.prefix}${cmd.command}**: ${cmd.description}`
    })

    emb
      .field('Links', `[Support](https://discord.gg/v3r2rKP) | [Site](https://cheesetouch.jpbbots.org)`)
      .send()
  }
} as CommandOptions
