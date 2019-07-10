import React from 'react';
import PropTypes from 'prop-types';
import showdown from 'showdown';

import {
	AnchorButton,
} from '@blueprintjs/core';

import { get } from 'Utility/fetch';

import styles from './styles.less';
import Title from '../../title';

export default class ArticleView extends React.Component {
	static propTypes = {
		match: PropTypes.object,
	}

	state = {
		article: '',
		title: '',
	}
	
	componentDidMount() {
		const { match: { params } } = this.props;
		this.fetchArticle(params.url);
	}

	fetchArticle = async url => {
		const converter = new showdown.Converter();
		const articleObject = await get(`/api/help-pages/get/${url}`);
		this.setState({
			article: converter.makeHtml(articleObject.content),
			title: articleObject.metadata.title,
		});
	}
	
	render() {
		const { article, title } = this.state;
		return (
			<div className={styles.articleContainer}>
				<Title
					fontSize={48}
					color="primary"
					leftComponent={
						<AnchorButton
							icon="arrow-left"
							minimal
							href="/help"
							className={styles.button}
						/>
					}
				>
					{title}
				</Title>
				<div
					dangerouslySetInnerHTML={{ __html: article }}
					className={styles.articleContent}
				/>
			</div>
		);
	}
}
