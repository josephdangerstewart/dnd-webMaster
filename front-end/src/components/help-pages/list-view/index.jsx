import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';

import {
	InputGroup,
	Spinner,
	AnchorButton,
} from '@blueprintjs/core';

import Title from '../../title';

import { get } from 'Utility/fetch';
import debounce from 'Utility/debounce';

import styles from './styles.less';

export default class ArticleView extends React.Component {
	static propTypes = {
		location: PropTypes.object,
	}

	state = {
		query: '',
		articles: [],
		loading: true,
		backHref: '/',
	}

	componentDidMount() {
		this.fetchPinnedArticles();
		const { location: { search } } = this.props;
		const query = queryString.parse(search);
		if (query.backHref) {
			this.setState({
				backHref: query.backHref,
			});
		}
	}

	fetchPinnedArticles = async () => {
		const articles = await get('/api/help-pages/all');
		this.setState({
			articles,
			loading: false,
		});
	}

	searchArticles = debounce(async () => {
		const { query } = this.state;
		const articles = await get(`/api/help-pages/search?query=${query}`);
		this.setState({
			articles,
			loading: false,
		});
	}, 250);

	onQueryChange = event => {
		this.setState({
			loading: true,
			query: event.target.value,
		}, this.searchArticles);
	}

	renderArticle = article => (
		<div className={styles.article}>
			<Title
				fontSize={20}
			>
				<a href={`/help/${article.url}`}>{article.title}</a>
			</Title>
			<p>{article.description}</p>
		</div>
	)

	render() {
		const { loading, query, articles, backHref } = this.state;

		return (
			<div className={styles.root}>
				<Title
					className={styles.title}
					fontSize={50}
				>
					Campaign Buddy Help Pages
				</Title>
				<InputGroup
					placeholder="Roll investigation..."
					leftIcon="search"
					rightElement={
						loading ?
							<Spinner size={16} />
							:
							<AnchorButton
								href={backHref}
								icon="arrow-left"
								className={styles.button}
								minimal
							/>
					}
					className={styles.input}
					value={query}
					onChange={this.onQueryChange}
				/>
				<div className={styles.articleContainer}>
					{articles.map(this.renderArticle)}
				</div>
			</div>
		);
	}
}
