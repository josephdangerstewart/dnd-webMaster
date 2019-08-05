import React from 'react';
import PropTypes from 'prop-types';

import ActionModal from '../modal/ActionModal';
import ImageUploader from '../image-uploader';

import { postForm } from 'Utility/fetch';

export default class CampaignIconModal extends React.Component {
	static propTypes = {
		isOpen: PropTypes.bool.isRequired,
		onClose: PropTypes.func.isRequired,
		campaignID: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.number,
		]).isRequired,
		onRefresh: PropTypes.func,
	}

	state = {
		file: null,
		loading: false,
	}

	handleSubmit = async () => {
		this.setState({
			loading: true,
		}, async () => {
			const { file } = this.state;
			const { campaignID, onRefresh, onClose } = this.props;

			const formData = new FormData();
			formData.append('image', file);

			await postForm(`/api/campaigns/${campaignID}/update`, formData);
			if (onRefresh) {
				await onRefresh();
			}
			onClose();
		});
	}

	render() {
		const {
			isOpen,
			onClose,
		} = this.props;
		const { loading } = this.state;

		return (
			<ActionModal
				open={isOpen}
				onCancel={onClose}
				onSubmit={this.handleSubmit}
				title="Set a campaign icon!"
				loading={loading}
			>
				<ImageUploader
					onChange={file => this.setState({ file })}
				/>
			</ActionModal>
		);
	}
}
