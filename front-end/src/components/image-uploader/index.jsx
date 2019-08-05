import React from 'react';
import PropTypes from 'prop-types';

import {
	Icon,
	Button,
} from '@blueprintjs/core';

import ImageUploader from 'Utility/imageUploader';

import styles from './styles.less';

const MAX_FILE_UPLOAD_SIZE = 102400;

export default class ImageUploaderComponent extends React.Component {
	static propTypes = {
		onChange: PropTypes.func,
	}

	state = {
		fileName: '',
		fileSize: '0 Bytes',
		showFileSizeError: false,
	}
	
	constructor(props) {
		super(props);
		this.uploader = new ImageUploader();
	}

	componentDidMount() {
		this.uploader.registerCallback(this.handleOnChange);
	}

	componentWillUnmount() {
		this.uploader.unRegisterCallback(this.handleOnChange);
	}

	handleOnChange = file => {
		const { onChange } = this.props;
		if (file && file.size > MAX_FILE_UPLOAD_SIZE) {
			this.clearInput();
			this.setState({ showFileSizeError: true });
		}

		this.setState({
			fileName: file.name,
			fileSize: this.uploader.getFileSizeString(),
		});
		if (onChange) {
			onChange(file);
		}
	}

	clearInput = () => {
		const { onChange } = this.props;
		this.uploader.clearInput();
		this.setState({
			fileName: '',
			fileSize: '0 Bytes',
		});
		onChange(null);
	}

	renderUploadPrompt = () => {
		const { showFileSizeError } = this.state;

		return (
			<div className={styles.inputContainer} onClick={this.uploader.openFilePicker}>
				<Icon
					icon="cloud-upload"
					className={styles.icon}
					iconSize={48}
				/>
				<p>Upload Image</p>
				{showFileSizeError && (
					<p className={styles.fileSizeError}>File size must not exceed 100 KB</p>
				)}
			</div>
		);
	}

	renderFileName = () => {
		const { fileName, fileSize } = this.state;
		return (
			<div className={styles.fileNameContainer}>
				<p>{fileName} - {fileSize}</p>
				<Button
					icon="trash"
					className={styles.button}
					minimal
					onClick={() => this.clearInput()}
				/>
			</div>
		);
	}

	render() {
		const { fileName } = this.state;

		return (
			<div className={styles.container}>
				{fileName ? this.renderFileName() : this.renderUploadPrompt()}
			</div>
		);
	}
}
