import React from 'react';
import PropTypes from 'prop-types';

import {
	InputGroup,
	Radio,
} from '@blueprintjs/core';

import ActionModal from './ActionModal';
import ImageUploader from '../image-uploader';

import styles from './styles.less';

export default class ImagePickerModal extends React.Component {
	static propTypes = {
		onSubmit: PropTypes.func.isRequired,
		open: PropTypes.bool.isRequired,
		onClose: PropTypes.func.isRequired,
		allowUrl: PropTypes.bool,
		title: PropTypes.string,
		loading: PropTypes.bool,
	}

	state = {
		urlValue: '',
		file: null,
		uploadMethod: '',
	}

	handleSubmit = () => {
		const { onSubmit } = this.props;
		const { uploadMethod, file, urlValue } = this.state;

		onSubmit(
			uploadMethod === 'fileUpload' ? file : null,
			uploadMethod === 'url' ? urlValue : null
		);
	}

	handleFileInputChange = file => {
		this.setState({
			file,
			uploadMethod: 'fileUpload',
		});
	}

	handleInputValueChange = event => {
		this.setState({
			urlValue: event.target.value,
			uploadMethod: 'url',
		});
	}

	renderUrlInput = () => {
		const { urlValue, uploadMethod } = this.state;

		return (
			<div className={styles.urlInputContainer}>
				<Radio
					label="Use a link to an image"
					checked={uploadMethod === 'url'}
					onChange={() => this.setState({ uploadMethod: 'url' })}
					className={styles.subHeading}
				/>
				<InputGroup
					value={urlValue}
					onChange={this.handleInputValueChange}
					placeholder="http://www.example.com/image.png"
				/>
			</div>
		);
	}

	render() {
		const {
			open,
			onClose,
			allowUrl,
			title,
			loading,
		} = this.props;
		const { uploadMethod } = this.state;

		return (
			<ActionModal
				open={open}
				onCancel={onClose}
				onSubmit={this.handleSubmit}
				title={title || 'Select an image'}
				loading={loading}
				className={styles.imagePickerModal}
			>
				{allowUrl ? this.renderUrlInput() : null}
				<div>
					{allowUrl &&
						<Radio
							label="Or upload an image"
							checked={uploadMethod === 'fileUpload'}
							onChange={() => this.setState({ uploadMethod: 'fileUpload' })}
							className={styles.subHeading}
						/>
					}
					<ImageUploader
						onChange={this.handleFileInputChange}
					/>
				</div>
			</ActionModal>
		);
	}
}
