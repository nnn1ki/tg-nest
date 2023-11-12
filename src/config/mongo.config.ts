import { ConfigService } from '@nestjs/config'
import { TypegooseModuleOptions } from 'nestjs-typegoose'

export const getMongoConfig = async (
	configService: ConfigService,
): Promise<TypegooseModuleOptions> => ({
	uri: getMongoUrl(configService),
	...getMongoOption(),
})

const getMongoOption = () => ({
	//useNewUrlParser: true,
	//useCreateIndex: true,
	useUnifiedTopology: true,
})

const getMongoUrl = (configService: ConfigService): string =>
	'mongodb://' +
	configService.get('MONGO_LOGIN') +
	':' +
	configService.get('MONGO_PASSWORD') +
	'@' +
	configService.get('MONGO_HOST') +
	':' +
	configService.get('MONGO_PORT') +
	'/' +
	configService.get('MONGO_AUTH_DATABASE')
