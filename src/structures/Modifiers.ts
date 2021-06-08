import { APIMessage, Snowflake } from "discord-api-types";
import { IGuild, ITouch } from "./Database";
import { CheeseTouch } from "./Worker";

export enum Modifiers {
  Permanent = 1,
  Manifest
}

export class ModifierManager {
  constructor (private worker: CheeseTouch) {}

  async exec (touch: ITouch, to: Snowflake, msg: APIMessage, db: IGuild): Promise<boolean> {
    switch (touch.modifiers) {
      case Modifiers.Permanent:
        return this.permanent(touch, to, msg, db)
      case Modifiers.Manifest:
        return this.manifest(touch, to, msg, db)
      default:
        return this.normal(touch, to, msg, db)
    }
  }

  async normal (touch: ITouch, to: Snowflake, msg: APIMessage, db: IGuild): Promise<boolean> {
    await this.worker.db.touches.updateOne(touch, {
      $set: {
        current: to,
        previous: touch.current
      }
    })

    await this.worker.send(msg.channel_id)
      .description(to === msg.author.id
        ? `Whoops! You caught the cheese touch from <@${touch.current}>`
        : `You gave the cheese touch to <@${to}>`
      )
      .send()
    
    if (db.role && this.worker.guildRoles.get(touch.guild)?.has(db.role)) {
      void this.worker.api.members.removeRole(touch.guild, touch.current, db.role)
      void this.worker.api.members.addRole(touch.guild, to, db.role)
    }

    this.worker.keeps.set(msg.guild_id, to)

    return to === msg.author.id
  }

  async permanent (touch: ITouch, to: Snowflake, msg: APIMessage, db: IGuild): Promise<boolean> {
    // throw new Error('This cheese touch is permanent and can\'t be transfered.')
    return true
  }

  async manifest (touch: ITouch, to: Snowflake, msg: APIMessage, db: IGuild): Promise<boolean> {
    await this.worker.db.touches.insertOne({
      ...touch,
      _id: undefined,
      current: to
    })

    await this.worker.send(msg.channel_id)
      .description(to === touch.current
        ? `Whoops, you caught the cheese touch spread from <@${msg.author.id}>`
        : `You just spread the cheese touch to <@${to}>`
      )
      .send()

    if (db.role && this.worker.guildRoles.get(touch.guild)?.has(db.role)) {
      void this.worker.api.members.addRole(touch.guild, to, db.role)
    }

    return true
  }
}