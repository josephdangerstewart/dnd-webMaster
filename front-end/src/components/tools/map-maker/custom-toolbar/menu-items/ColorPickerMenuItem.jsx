import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
	MenuItem,
} from '@blueprintjs/core';
import ColorPickerCore from 'coloreact';
import { stringToRgba, rgbaToString } from 'react-super-canvas/color-util';
import styles from './styles.less';
import { useCallback } from 'react';
import CalculatorInput from '../../../../calculator-input';
import { useColorState } from '../../../../hooks/useColorState';

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

function ColorPicker({ color, setColor }) {
	const [ previewColor, setPreviewColorCore ] = useState(color);
	const onComplete = useCallback((value) => {
		setColor(value.rgbString);
	}, [ setColor ]);

	const setPreviewColor = useCallback((value) => {
		setPreviewColorCore(value.rgbString);
	}, []);

	const rgba = stringToRgba(previewColor) || {
		r: 0,
		g: 0,
		b: 0,
		a: 0,
	};
	const setColorViaControls = useCallback((value) => {
		const colorString = rgbaToString(value);
		setPreviewColorCore(colorString);
		setColor(colorString);
	}, [ setColor ]);

	const {
		setRedValue,
		setGreenValue,
		setBlueValue,
		setAlphaValue,
	} = useColorState(rgba, setColorViaControls);

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
				<ColorPickerInput
					value={rgba.r}
					onChange={setRedValue}
					label="R"
				/>
				<ColorPickerInput
					value={rgba.g}
					onChange={setGreenValue}
					label="G"
				/>
				<ColorPickerInput
					value={rgba.b}
					onChange={setBlueValue}
					label="B"
				/>
				<ColorPickerInput
					value={rgba.a}
					onChange={setAlphaValue}
					label="A"
				/>
			</div>
		</div>
	);
}

ColorPicker.propTypes = {
	color: PropTypes.string.isRequired,
	setColor: PropTypes.func.isRequired,
};

function ColorPickerInput({ value, label, onChange }) {
	return (
		<div className={styles.colorPickerControl}>
			<span className={styles.colorPickerControlLabel}>{label}: </span>
			<CalculatorInput
				value={value}
				onChange={onChange}
			/>
		</div>
	);
}

ColorPickerInput.propTypes = {
	value: PropTypes.string,
	label: PropTypes.string,
	onChange: PropTypes.func,
};
