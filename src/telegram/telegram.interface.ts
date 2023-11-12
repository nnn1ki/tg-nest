import { ModuleMetadata } from '@nestjs/common'

export interface ITelegramOptions {
	token: string
	middlewares: any[]
}

export interface ITelegramModuleOptionAsync
	extends Pick<ModuleMetadata, 'imports'> {
	useFactory: (...args: any[]) => Promise<ITelegramOptions> | ITelegramOptions
	inject?: any[]
}
