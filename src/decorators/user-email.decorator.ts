import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const UserEmailDecorator = createParamDecorator(
	(data: unknown, context: ExecutionContext) => {
		const request = context.switchToHttp().getRequest()
		return request.user
	},
)