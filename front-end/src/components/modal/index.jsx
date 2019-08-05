/**
 * @description A generic modal component
 */

import React from 'react';
import PropTypes from 'prop-types';

import {
	Overlay,
	Classes,
} from '@blueprintjs/core';

import classNames from 'Utility/classNames';

import styles from './styles.less';

export default class SaveLayoutDialog extends React.Component {
	static propTypes = {
		open: PropTypes.bool.isRequired,
		children: PropTypes.node.isRequired,
		maxWidth: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.number,
		]),
	}
	
	render() {
		const {
			open,
			children,
			maxWidth,
			...rest
		} = this.props;

		return (
			<Overlay
				isOpen={open}
				backdropClassName={styles.dialogRoot}
				{...rest}
			>
				<div className={styles.dialogRoot}>
					<div
						className={classNames(
							styles.dialogCard,
							Classes.ELEVATION_3
						)}
						style={{ maxWidth }}
					>
						{children}
					</div>
				</div>
			</Overlay>
		);
	}
}
