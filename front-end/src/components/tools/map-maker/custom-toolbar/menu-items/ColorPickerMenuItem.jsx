import React from 'react';
import PropTypes from 'prop-types';
import {
	MenuItem,
} from '@blueprintjs/core';
import styles from './styles.less';
import { ColorPicker } from '../../../../color-picker';

export function ColorPickerMenuItem({ title, value, setValue }) {
	const color = value || 'rgba(0, 0, 0, 0)';
	return (
		<MenuItem
			text={(
				<div className={styles.menuItemTextContainer}>
					<ColorPreview
						color={color}
					/>
					<span>
						{title}
					</span>
				</div>
			)}
			shouldDismissPopover={false}
			popoverProps={{
				captureDismiss: true,
			}}
		>
			<ColorPicker
				color={color}
				setColor={setValue}
			/>
		</MenuItem>
	);
}

ColorPickerMenuItem.propTypes = {
	title: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	setValue: PropTypes.func.isRequired,
};

function ColorPreview({ color }) {
	return (
		<div
			className={styles.colorPreview}
			style={{
				backgroundColor: color,
			}}
		/>
	);
}

ColorPreview.propTypes = {
	color: PropTypes.string.isRequired,
};
