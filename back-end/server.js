/* eslint-disable no-console */
import 'babel-polyfill';
import './polyfill';
import express from 'express';
import path from 'path';
import configureAuthentication from './authentication';
import registerRoutes from './route-registry';
import registerRoutesNoAuth from './route-registry-no-auth';
import noAuthStaticAssets from './no-auth-static-assets';
import bodyParser from 'body-parser';

const Sentry = require('@sentry/node');
let sentryApiTokens;
try {
	sentryApiTokens = require('./sentry-api.json');
} catch {
	sentryApiTokens = { key: '' };
}

// Initialize alerting
const environment = process.env.SERVER_TYPE === 'prod' ? 'prod' : 'dev';
Sentry.init({ dsn: sentryApiTokens.key, environment });

// Declare our server object
const app = express();

// Enable body parsing so we can accept post requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Enable CORS so that we can make HTTP request from webpack-dev-server
app.use((request, response, next) => {
	response.header('Access-Control-Allow-Origin', '*');
	response.header('Access-Control-Allow-Methods', 'GET');
	response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

	next();
});

// Set up routes that do not need authentication
noAuthStaticAssets.forEach(asset => {
	const cb = (request, response) => {
		response.sendFile(`front-end/dist${asset}`, { root: __dirname });
	};

	app.route(asset).get(cb);

	if (asset.endsWith('.html')) {
		const route = asset.substring(0, asset.length - 5);
		app.route(`${route}*`).get(cb);
		app.route(route).get(cb);
	}
});

registerRoutesNoAuth(app);

// Set up authentication so that any route below this method call requires the user be logged in
configureAuthentication(app);

// Tell the server to look for static resources (.css, .js, .html files, etc.) in front-end/dist
app.use(express.static(path.resolve(__dirname, 'front-end/dist/')));


// REGISTER API ROUTES HERE (PREFERABLY IN A FUNCTION EXPORTED FROM ANOTHER FILE)
registerRoutes(app);

// Tell the app that all other requests not defined by our restful API should send the user the main.html file
app.route('*').get((request, response) => {
	response.sendFile('front-end/dist/main.html', { root: __dirname });
});

export default app;
