import { Action, Ctx, Scene, SceneEnter } from 'nestjs-telegraf'
import { Context } from 'telegraf'
import { SceneContext } from 'telegraf/typings/scenes'
import { Update } from 'telegraf/typings/core/types/typegram'

/* just some service to save data in SQL database */
// import { UserSessionStorageService } from '../../storages'
import * as notValidatedStoryJson from './scenes.json'

type SessionValue = { storyStep?: string | null }

const userSessionService = {
	db: {} as Record<number, SessionValue>,
	getUserStoryStep(userId: number): string | null {
		return this.db[userId]?.storyStep || null
	},
	updateUserSession(userId: number, value: SessionValue) {
		this.db[userId] = value
	},
}

type UserSessionStorageService = typeof userSessionService

interface IStoryStep {
	replies: { type: string; message: string }[]
	buttons: { text: string; nextStep: string }[]
}

const storySteps: Record<string, IStoryStep> = notValidatedStoryJson

const getUserId = (context: Context): number => {
	if ('callback_query' in context.update) {
		return context.update.callback_query.from.id
	}

	if ('message' in context.update) {
		return context.update.message.from.id
	}

	if ('my_chat_member' in context.update) {
		return context.update.my_chat_member.from.id
	}

	return -1
}

@Scene('story')
export class StoryScene {
	// constructor(
	// 	private readonly userSessionService: UserSessionStorageService,
	// ) {}

	@SceneEnter()
	async start(@Ctx() context: SceneContext) {
		const userId = getUserId(context)
		const currentStep = await userSessionService.getUserStoryStep(userId)

		const story = storySteps[currentStep || 'info']
		if (!story) return

		const { replies, buttons } = story

		context.reply(replies.map(({ message }) => message).join('\n'), {
			reply_markup: {
				inline_keyboard: buttons.map(({ text, nextStep }) => [
					{
						text,
						callback_data: nextStep,
					},
				]),
			},
		})
	}

	@Action(/.*/)
	async onAnswer(
		@Ctx() context: SceneContext & { update: Update.CallbackQueryUpdate },
	) {
		const userId = getUserId(context)
		const cbQuery = context.update.callback_query
		const nextStep = 'data' in cbQuery ? cbQuery.data : null

		if (nextStep === 'stop') {
			await userSessionService.updateUserSession(userId, {})
			await context.reply('Отлично! Обращайся!')
			return
		}
		await userSessionService.updateUserSession(userId, {
			storyStep: nextStep,
		})
		context.scene.reenter()
	}
}
