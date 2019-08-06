import React from 'react';
import PropTypes from 'prop-types';

import ReactQuill, { Quill } from 'react-quill';

import Toolbar from './Toolbar';

import Mention from './mention/Mention';
import getMentionBlot from './mention/MentionBlot';

import generateId from 'Utility/generateId';

const MentionBlot = getMentionBlot(Quill);

Quill.register('modules/mention', Mention);
Quill.register(MentionBlot);

export default class RichTextEditor extends React.Component {
	static propTypes = {
		insertPaneIntoPanel: PropTypes.func.isRequired,
		campaignID: PropTypes.number.isRequired,
		value: PropTypes.string,
		onChange: PropTypes.func,
	}

	state = {
		value: '',
	}

	constructor(props) {
		super(props);
		this.toolbarId = generateId('rte-toolbar');
	}

	handleChange = value => {
		const { onChange, value: propValue } = this.props;

		if (onChange) {
			onChange(value);
		}

		if (propValue === undefined) {
			this.setState({ value });
		}
	}

	handleClick = event => {
		if (event.target.parentElement.classList.contains('ql-mention-blot')) {
			const { insertPaneIntoPanel } = this.props;
			const value = MentionBlot.value(event.target.parentElement);
			const type = value.type;
			const id = value.id;
			
			switch (type) {
			case 'spell':
			case 'feat':
				return insertPaneIntoPanel('search', { type: `${type}s`, resourceID: id });
			case 'equipment':
				return insertPaneIntoPanel('search', { type, resourceID: id });
			case 'character':
				return insertPaneIntoPanel(
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
				return insertPaneIntoPanel(
					'notes',
					{
						defaultNoteID: id,
					}
				);
			case 'folder':
				return insertPaneIntoPanel(
					'notes',
					{
						defaultFolderID: id,
					}
				);
			}
		}
	}

	render() {
		const { value: propValue, campaignID } = this.props;
		const { value: stateValue } = this.state;

		return (
			<div onClick={this.handleClick}>
				<Toolbar id={this.toolbarId} />
				<ReactQuill
					value={propValue === undefined ? stateValue : propValue}
					onChange={this.handleChange}
					theme="bubble"
					modules={{
						toolbar: {
							container: `#${this.toolbarId}`,
						},
						mention: {
							container: '.ql-container',
							campaignID,
						},
						clipboard: {
							matchVisual: false,
						},
					}}
					placeholder="Your note..."
				/>
			</div>
		);
	}
}
