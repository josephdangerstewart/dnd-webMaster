import React from 'react';
import PropTypes from 'prop-types';

import {
	Omnibar,
} from '@blueprintjs/select';
import {
	Spinner,
	MenuItem,
} from '@blueprintjs/core';

import debounce from 'Utility/debounce';
import { get } from 'Utility/fetch';
import { bindKeys, unbindKeys } from 'Utility/keyboard';

import styles from './styles.less';

export default class GlobalSearchBar extends React.Component {
	static propTypes = {
		campaignID: PropTypes.string.isRequired,
		addTool: PropTypes.func.isRequired,
	}
	
	state = {
		open: false,
		items: [],
		loading: false,
	}

	hotkeys = {
		'ctrl + shift + f': () => this.setState({ open: true }),
	}

	componentDidMount() {
		bindKeys(this.hotkeys);
	}

	componentWillUnmount() {
		unbindKeys(this.hotkeys);
	}

	fetchQuery = debounce(async query => {
		const { campaignID } = this.props;
		const items = await get(`/api/search/global/${campaignID}?query=${query}`);
		this.setState({
			items,
			loading: false,
		});
	}, 250);

	onQueryChange = query => {
		this.setState({
			loading: true,
		}, () => this.fetchQuery(query));
	}

	renderItem = (item, props) => (
		<MenuItem
			text={(
				<div>
					<p className={styles.itemType}>{item.type}</p>
					<p className={styles.itemName}>{item.name}</p>
				</div>
			)}
			onClick={props.handleClick}
			className={[
				styles.menuItem,
				props.modifiers.active ? styles.active : '',
			].join(' ')}
			key={`${item.type}-${item.id}`}
		/>
	);

	handleSelect = item => {
		const { addTool } = this.props;
		const { type, id } = item;

		this.setState({ open: false });

		switch (type) {
		case 'spell':
		case 'feat':
			return addTool('search', { type: `${type}s`, resourceID: id });
		case 'equipment':
			return addTool('search', { type, resourceID: id });
		case 'character':
			return addTool(
				'character',
				{
					defaultCharacterID: id,
					view: 'display',
					toolSettings: {
						orderings: [],
					},
				}
			);
		case 'note':
			return addTool(
				'notes',
				{
					defaultNoteID: id,
				}
			);
		case 'folder':
			return addTool(
				'notes',
				{
					defaultFolderID: id,
				}
			);
		}
	}

	render() {
		const {
			items,
			open,
			loading,
		} = this.state;

		return (
			<Omnibar
				isOpen={open}
				items={items}
				onQueryChange={this.onQueryChange}
				inputProps={{
					rightElement: loading ? <Spinner size={20} /> : undefined,
					placeholder: 'Search...',
				}}
				onClose={() => this.setState({ open: false })}
				itemRenderer={this.renderItem}
				onItemSelect={this.handleSelect}
			/>
		);
	}
}
