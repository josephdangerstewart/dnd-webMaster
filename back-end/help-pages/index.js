import {
	asRouteFunction,
} from '../utility';

import * as helpPageRoutes from './HelpPageController';

export default app => {
	app.route('/api/help-pages/all')
		.get(asRouteFunction(helpPageRoutes.getPinnedArticles));
	
	app.route('/api/help-pages/search')
		.get(asRouteFunction(helpPageRoutes.searchArticles));

	app.route('/api/help-pages/get/:url')
		.get(asRouteFunction(helpPageRoutes.getArticle));
};
