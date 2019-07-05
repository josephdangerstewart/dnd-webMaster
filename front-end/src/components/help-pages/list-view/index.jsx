import React from 'react';

import {
	InputGroup,
	Spinner,
} from '@blueprintjs/core';

import Title from '../../title';

import { get } from 'Utility/fetch';
import debounce from 'Utility/debounce';

import styles from './styles.less';

export default class ArticleView extends React.Component {
	state = {
		query: '',
		articles: [],
		loading: true,
	}

	componentDidMount() {
		this.fetchPinnedArticles();
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

	render() {
		const { loading, query } = this.state;

		return (
			<div className={styles.root}>
				<Title
					className={styles.title}
					fontSize={50}
				>
					Campaign Buddy Help Pages
				</Title>
				<InputGroup
					placeholder="Roll initiative..."
					leftIcon="search"
					rightElement={
						loading ? <Spinner size={16} /> : undefined
					}
					className={styles.input}
					value={query}
				/>
			</div>
		);
	}
}
