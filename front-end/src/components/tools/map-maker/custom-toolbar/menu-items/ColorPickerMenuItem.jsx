import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
	MenuItem,
} from '@blueprintjs/core';
import ColorPickerCore from 'coloreact';

import styles from './styles.less';
import { useCallback } from 'react';

export function ColorPickerMenuItem({ title, value, setValue }) {
	const color = value || 'rgba(0, 0, 0, 0)';
	return (
		<MenuItem
			text={(
				<div className={styles.menuItemTextContainer}>
					<ColorPreview
						color={color}
					/>
					<span className={styles.menuItemText}>
						{title}
					</span>
				</div>
			)}
			shouldDismissPopover={false}
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

function ColorPicker({ color, setColor }) {
	const [ previewColor, setPreviewColorCore ] = useState(color);
	const onComplete = useCallback((value) => {
		setColor(value.rgbString);
	}, [ setColor ]);

	const setPreviewColor = useCallback((value) => {
		setPreviewColorCore(value.rgbString);
	}, []);

	return (
		<div>
			<div className={styles.colorPickerContainer}>
				<div className={styles.colorPickerInner}>
					<ColorPickerCore
						color={previewColor}
						onChange={setPreviewColor}
						onComplete={onComplete}
						opacity
					/>
				</div>
			</div>
			<div className={styles.colorPickerControls}>
			</div>
		</div>
	);
}

ColorPicker.propTypes = {
	color: PropTypes.string.isRequired,
	setColor: PropTypes.func.isRequired,
};
