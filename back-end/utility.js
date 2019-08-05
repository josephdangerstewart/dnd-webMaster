/**
 * @description This file contains server utility functions to simplify various
 * server functions
 * 
 * @author Joseph Stewart
 */

import STATUS_CODES from 'http-status-codes';
import mysql from 'mysql';
import cloudinary from 'cloudinary';
import DataURI from 'datauri';
import path from 'path';

let databaseCredentials;
try {
	databaseCredentials = require('./database-credentials.json');
} catch (err) {
	databaseCredentials = {
		user: 'root',
		pass: '',
		host: 'localhost',
		schema: 'dungeonbuddiesdb',
	};
}

let cloudinaryCredentials;
try {
	cloudinaryCredentials = require('./cloudinary-api.json');
} catch (err) {
	cloudinaryCredentials = {
		key: '',
		secret: '',
	};
}

Array.prototype.asyncMap = function(callback) {
	return Promise.all(this.map(callback));
};

// Configure cloudinary with campaign buddy credentials
cloudinary.config({ 
	cloud_name: 'josephdangerstewart', 
	api_key: cloudinaryCredentials.key, 
	api_secret: cloudinaryCredentials.secret,
});

const dataUri = new DataURI();

const extractDataUri = file => 
	dataUri.format(path.extname(file.originalname).toString(), file.buffer);

/**
 * @description This is a utility function for the mysql module that typecasts the MySQL BIT
 * datatype to a javascript boolean
 */
function typeCast(field, useDefaultTypeCasting) {
	if ((field.type === 'BIT') && (field.length === 1)) {
		const bytes = field.buffer();
		return (bytes[0] === 1);
	}
	return (useDefaultTypeCasting());
}

/**
 * @description This is a utility function for the mysql module that formats queries and safely
 * escapes user entered input
 */
function queryFormat(query, values) {
	if (!values) return query;
	query = query.replace(/:"([\w\d]+)"/g, function (txt, key) {
		if (values.hasOwnProperty(key)) {
			if (Array.isArray(values[key])) {
				return this.escape(values[key].join(','));
			}
			return `"${this.escape(values[key])}"`;
		}
		return 'NULL';
	}.bind(this));
	query = query.replace(/:\(([\w\d]+)\)/g, function (txt, key) {
		if (values.hasOwnProperty(key)) {
			return this.escapeId(values[key]);
		}
		return '';
	}.bind(this));
	return query.replace(/:([\w\d]+)/g, function (txt, key) {
		if (values.hasOwnProperty(key)) {
			return this.escape(values[key]);
		}
		return 'NULL';
	}.bind(this));
}

// Define our database connection pool
const pool = mysql.createPool({
	user: databaseCredentials.user,
	password: databaseCredentials.pass,
	host: databaseCredentials.host,
	database: databaseCredentials.schema,
	typeCast,
	queryFormat,
});

/**
 * @description Returns a promise that resolves to a database connection
 */
export const getSQLConnection = () => (
	new Promise((resolve, reject) => {
		pool.getConnection((err, connection) => {
			if (err) {
				return reject(err);
			}
			return resolve(connection);
		});
	})
);

/**
 * @description Wraps a mysql query in a promise for readability (so it can be used with async/await)
 */
export const promiseQuery = (connection, query, options) => (
	new Promise((resolve, reject) => {
		const args = [];
		if (options) {
			args.push(options);
		}

		connection.query(
			query,
			...args,
			(err, results) => {
				if (err) {
					reject(err);
				}
				resolve(results);
			}
		);
	})
);

/**
 * @description Ends an http request with a internal server error error code.
 * @param {Object} response Express request object
 * @param {Object} err Error to be sent to the client
 */
export const serverError = (response, err) => {
	response.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(err || { reason: 'Internal Server Error' });
};

export const unauthorizedError = (response, reason) => {
	response.status(STATUS_CODES.UNAUTHORIZED).json({ reason: reason || 'You are not authorized to view this' });
};

/**
 * @description This function wraps a server method so that it can be connected to an API route
 * @param {Function} callback The server method to be wrapped
 * @param {boolean} withDBConnection If this parameter is true, a database connection will be passed
 * into the callback as the fourth parameter.
 */
export const asRouteFunction = (callback, withDBConnection) => async (request, response) => {
	let connection;
	if (withDBConnection) {
		connection = await getSQLConnection();
	}
	
	try {
		const results = await callback(request.params, request.query, request.user, connection, request.body, request.files, request.file);
		if (withDBConnection) {
			connection.release();
		}

		if (results instanceof ServerError) {
			return response.status(results.type).json({ error: results.message });
		}

		return response.json(results || {});
	} catch (err) {
		// eslint-disable-next-line
		console.log(err);
		if (connection && connection.release) {
			connection.release();
		}

		return serverError(response, err);
	}
};

/**
 * Uploads an image to cloudinary and returns the url
 * 
 * @param {Object} image The image being uploaded
 * @returns {Promise<String>} A promise resolving to the url of the new uploaded image in cloudinary 
 */
export const uploadImage = async image => 
	new Promise((resolve, reject) => {
		cloudinary.v2.uploader.upload(
			extractDataUri(image).content,
			{
				folder: 'campaign-buddy/uploads',
				quality: 'auto:eco',
				width: 150,
				height: 150,
				crop: 'fit',
			}, 
			(error, result) => {
				if (error) {
					return reject(error);
				}
				return resolve(result.url);
			}
		);
	});

export const deleteImage = async url =>
	new Promise((resolve, reject) => {
		const match = /.+\/uploads\/(.+)\.png/g.exec(url);
		if (!match && url.startsWith('https://res.cloudinary.com/josephdangerstewart')) {
			reject({
				error: 'Non-valid cloudinary url',
				url,
			});
		} else if (!match) {
			resolve();
		}

		cloudinary.v2.uploader.destroy(
			`campaign-buddy/uploads/${match[1]}`,
			(result, error) => {
				if (error) {
					reject({
						error,
						url,
					});
				}

				resolve();
			}
		);
	});

/*
 * A custom error class for quietly throwing errors
 */
export class ServerError extends Error {
	type = 0;

	constructor(type, message) {
		super(message);
		this.type = type;
	}
}

// Export the error codes
export const ERROR_CODES = STATUS_CODES;
