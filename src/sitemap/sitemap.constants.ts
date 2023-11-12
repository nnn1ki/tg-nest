import { TopLevelCategory } from '../top-page/top-page.model'

type routeMapType = Record<TopLevelCategory, string>

export const CATEGORY_URL: routeMapType = {
	[TopLevelCategory.Courses]: '/courses',
	[TopLevelCategory.Services]: '/services',
	[TopLevelCategory.Books]: '/books',
	[TopLevelCategory.Products]: '/products',
}
