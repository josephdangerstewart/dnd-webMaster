import fs from 'fs';
import util from 'util';
import parseMd from 'parse-md';
import Fuse from 'fuse.js';

const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
let fuse = undefined;
const articles = [];
const fuseOptions = {
	keys: [
		{
			name: 'content',
			weight: .3,
		},
		{
			name: 'metadata.title',
			weight: .4,
		},
		{
			name: 'metadata.keywords',
			weight: .3,
		},
	],
	sort: true,
	findAllMatches: true,
	threshold: .5,
};

const init = async () => {
	const articleNames = await readdir(`${__dirname}/back-end/help-pages/articles`);

	await articleNames.asyncMap(
		async (articleName) => {
			const markdownSource = await readFile(`${__dirname}/back-end/help-pages/articles/${articleName}`, 'utf-8');
			const articleObject = parseMd(markdownSource);

			articleObject.metadata.keywords = articleObject.metadata.keywords.split(/\s*,\s*/);

			articles.push(articleObject);
		}
	);

	fuse = new Fuse(articles, fuseOptions);
};

const formatArticlePreview = ({
	metadata: {
		title,
		author,
		description,
		url,
	},
}) => ({
	title,
	author,
	description,
	url,
});

export const getPinnedArticles = () =>
	articles
		// Only show pinned articles
		.filter(article => article.metadata.pinned)
		// Only return the metadata that the client needs
		.map(formatArticlePreview);

export const searchArticles = (path, queryString) => {
	const { query } = queryString;
	const results = fuse.search(query);
	return results.map(formatArticlePreview);
};

export const getArticle = path => {
	const { url } = path;
	return articles.find(value => value.metadata.url === url) || {};
};

init();
