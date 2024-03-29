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
	autoCreate: true,
	// connectTimeoutMS: 30000,
	// socketTimeoutMS: 45000,
})

const getMongoUrl = (configService: ConfigService): string =>
	'mongodb+srv://admin:admin@cluster0.4awrspq.mongodb.net/?retryWrites=true&w=majority'
  //'mongodb+srv://admin:admin@cluster0.4awrspq.mongodb.net/?retryWrites=true&w=majority'
   //'mongodb+srv://admin:admin@atlascluster.c0mq32o.mongodb.net/?retryWrites=true&w=majority'
	// 'mongodb://' +
	// configService.get('MONGO_LOGIN') +
	// ':' +
	// configService.get('MONGO_PASSWORD') +
	// '@' +
	// configService.get('MONGO_HOST') +
	// ':' +
	// configService.get('MONGO_PORT') +
	// '/' +
	// configService.get('MONGO_AUTH_DATABASE')
