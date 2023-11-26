import { Injectable } from '@nestjs/common'
import { Scenes, Telegraf } from 'telegraf'
import { InjectBot, Start, Update } from 'nestjs-telegraf'
import { UsersService } from '../user/users.service';

@Update()
@Injectable()
export class TelegramService {
	constructor(@InjectBot() private bot: Telegraf, private readonly usersService: UsersService) {
		this.bot.help((ctx) => ctx.reply('Send me a sticker'))
		this.bot.hears('hh', (ctx) => ctx.reply('👍 👍👍👍👍'))
	}

	//точка входа в программу
	@Start()
	start(ctx: Scenes.SceneContext) {
		ctx.scene.enter('story');

		const user = {//добавим перменную, которая повторяет поля пользователя, но только начальные
			telegramId: ctx.from.id,
			// Добавьте другие поля, если необходимо
		};

		this.usersService.create(user);
	}

	async sendMessage(message: string, chatId: string) {
		await this.bot.telegram.sendMessage(chatId, message)
	}
}
