import { Injectable } from '@nestjs/common'
import { Scenes, Telegraf } from 'telegraf'
import { InjectBot, Start, Update } from 'nestjs-telegraf'

@Update()
@Injectable()
export class TelegramService {
	constructor(@InjectBot() private bot: Telegraf) {
		this.bot.help((ctx) => ctx.reply('Send me a sticker'))
		this.bot.hears('hh', (ctx) => ctx.reply('👍 👍👍👍👍'))
	}


	//точка входа в программу
	@Start()
	start(ctx: Scenes.SceneContext) {
		ctx.scene.enter('story')
	}

	async sendMessage(message: string, chatId: string) {
		await this.bot.telegram.sendMessage(chatId, message)
	}
}
