import React from 'react';
import PropTypes from 'prop-types';

import {
	InputGroup,
	Keys,
} from '@blueprintjs/core';

import ActionModal from '../modal/ActionModal';

import { post } from 'Utility/fetch';

export default class CampaignNameModal extends React.Component {
	static propTypes = {
		isOpen: PropTypes.bool.isRequired,
		onClose: PropTypes.func.isRequired,
		campaignID: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.number,
		]).isRequired,
		previousName: PropTypes.string,
		onRefresh: PropTypes.func,
	}

	state = {
		name: '',
		loading: false,
	}

	onSubmit = () => {
		this.setState({
			loading: true,
		}, async () => {
			const { campaignID, onClose, onRefresh } = this.props;
			const { name } = this.state;
			const response = await post(`/api/campaigns/${campaignID}/update`, { campaignTitle: name });
			if (response.changed && onRefresh) {
				await onRefresh();
			}
			this.setState({ loading: false }, onClose);
		});
	}

	handleKeyDown = event => {
		const { name } = this.state;

		if (event.keyCode === Keys.ENTER) {
			this.onSubmit(name);
		}
	}

	render() {
		const {
			isOpen,
			onClose,
			previousName,
		} = this.props;
		const {
			name,
			loading,
		} = this.state;

		return (
			<ActionModal
				open={isOpen}
				onCancel={onClose}
				onSubmit={this.onSubmit}
				title="Rename this campaign!"
				onOpening={() => this.setState({ name: '' })}
				loading={loading}
			>
				<InputGroup
					placeholder={previousName}
					value={name}
					onChange={event => this.setState({ name: event.target.value })}
					autoFocus
					onKeyDown={this.handleKeyDown}
				/>
			</ActionModal>
		);
	}
}
