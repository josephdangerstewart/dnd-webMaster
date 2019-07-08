import React from 'react';
import PropTypes from 'prop-types';
import showdown from 'showdown';

import { get } from 'Utility/fetch';

export default class ArticleView extends React.Component {
	static propTypes = {
		match: PropTypes.object,
	}

	state = {
		article: '',
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
		});
	}
	
	render() {
		const { article } = this.state;
		return (
			<p>{article}</p>
		);
	}
}
