import { ApplicationCommandOptionType } from 'discord-api-types'
import { CommandOptions } from 'discord-rose'

export default {
  command: 'settings',
  description: 'Changes settings for the current guild',
  userPerms: ['manageGuild'],
  interaction: {
    name: 'settings',
    description: 'Changes settings for a server',
    options: [{
      name: 'reactions',
      description: 'Sets whether or not reactions will be added if a user has the cheesetouch',
      type: ApplicationCommandOptionType.SubCommand,
      options: [{
        name: 'value',
        description: 'Whether or not to enable cheesetouch reactions',
        type: ApplicationCommandOptionType.Boolean,
        required: true
      }]
    }, {
      name: 'role',
      description: 'Sets a role that gets added to a user when they get the cheesetouch',
      type: ApplicationCommandOptionType.SubCommand,
      options: [{
        name: 'role',
        description: 'Role to set as the cheesetouch role',
        type: ApplicationCommandOptionType.Role,
        required: true
      }]
    }]
  },
  exec: async (ctx) => {
    if (!ctx.guild) return

    if (ctx.isInteraction) {
      if (ctx.options.reactions) {
        ctx.args = ['reactions', ctx.options.reactions.value]
      } else if (ctx.options.role) {
        ctx.args = ['role', ctx.options.role.role]
      }
    }

    const current = await ctx.worker.db.guilds.findOne({ id: ctx.guild.id }) ?? { reactions: true, role: null, id: ctx.guild.id }

    if (!ctx.args[0]) return ctx.embed
      .title('Settings')
      .description('Current settings:\n\n' +
        `${ctx.prefix}settings **reactions** [true/false]: turns on/off :cheese: reactions\n` +
        `${ctx.prefix}settings **role** [@Role/Role ID]: sets a role to give to users when they have the cheese touch`
      )
      .send()

    switch (ctx.args[0]) {
      case 'reactions': {
        const onOff = typeof ctx.args[1] === 'boolean'
          ? ctx.args[1]
          : ctx.args[1] === 'true'
            ? true
            : ctx.args[1] === 'false'
              ? false : null

        if (onOff === null) return ctx.error(`Expected true/false, got ${ctx.args[1]}`)

        current.reactions = onOff

        await ctx.worker.db.guilds.updateOne({ id: ctx.guild.id }, {
          $set: current
        }, { upsert: true })

        ctx.embed
          .title('Set reactions')
          .description(`Set reactions to ${onOff ? 'on' : 'off'}`)
          .send()

        return
      }
      case 'role': {
        const role = ctx.isInteraction ? ctx.args[1] : ctx.message.mention_roles?.[0] ?? ctx.args[1]

        if (!role) return ctx.error(`Expected a role mention/id, got ${role}`)

        if (!ctx.worker.guildRoles.get(ctx.guild.id)?.has(role)) return ctx.error(`Invalid role ${role}`)

        current.role = role

        await ctx.worker.db.guilds.updateOne({ id: ctx.guild.id }, {
          $set: current
        }, { upsert: true })

        ctx.embed
          .title('Set cheesetouch role')
          .description(`Set cheesetouch role to <@&${role}>`)
          .send()

        return
      }
      default:
        ctx.error(`Invalid setting ${ctx.args[0]}. Do ${ctx.prefix}settings to see available options`)
        break
    }
  }
} as CommandOptions
