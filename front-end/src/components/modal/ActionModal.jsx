import React from 'react';
import PropTypes from 'prop-types';

import {
	Button,
	Intent,
	Spinner,
} from '@blueprintjs/core';

import Title from '../title';
import Modal from './index';

import styles from './styles.less';

export default class ActionModal extends React.Component {
	static propTypes = {
		open: PropTypes.bool.isRequired,
		onCancel: PropTypes.func.isRequired,
		onSubmit: PropTypes.func.isRequired,
		children: PropTypes.node.isRequired,
		title: PropTypes.string.isRequired,
		submitButtonText: PropTypes.string,
		cancelButtonText: PropTypes.string,
		maxWidth: PropTypes.oneOfType([
			PropTypes.number,
			PropTypes.string,
		]),
		onOpening: PropTypes.func,
		loading: PropTypes.bool,
	}

	render() {
		const {
			open,
			onCancel,
			onSubmit,
			children,
			title,
			submitButtonText,
			cancelButtonText,
			maxWidth,
			loading,
			...rest
		} = this.props;

		return (
			<Modal
				open={open}
				maxWidth={maxWidth}
				onClose={onCancel}
				{...rest}
			>
				<Title fontSize={24}>{title}</Title>
				<div className={styles.childrenContainer}>
					{children}
				</div>
				<div className={styles.buttonContainer}>
					<Button
						minimal
						className={styles.buttonMinimal}
						onClick={onCancel}
						disabled={loading}
					>
						{cancelButtonText || 'Cancel'}
					</Button>
					<Button
						intent={Intent.PRIMARY}
						onClick={() => onSubmit(name)}
						disabled={loading}
					>
						{loading ? <Spinner size={16} /> : submitButtonText || 'Submit'}
					</Button>
				</div>
			</Modal>
		);
	}
}