import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
	MenuItem,
} from '@blueprintjs/core';
import styles from './styles.less';
import { ColorPicker } from '../../../../color-picker';
import ActionModal from '../../../../modal/ActionModal';

export function ColorPickerMenuItem({ title, value, setValue }) {
	const [ isModalOpen, setIsModalOpen ] = useState(false);
	const [ tempColor, setTempColor ] = useState(value);

	const openModal = useCallback(() => setIsModalOpen(true), []);
	const closeModal = useCallback(() => setIsModalOpen(false), []);

	const onSubmit = useCallback(() => {
		setValue(tempColor);
		setIsModalOpen(false);
	}, [ setValue, tempColor ]);

	const color = value || 'rgba(0, 0, 0, 0)';
	return (
		<>
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
				onClick={openModal}
			/>
			<ActionModal
				open={isModalOpen}
				onClose={closeModal}
				onCancel={closeModal}
				onSubmit={onSubmit}
				submitButtonText="Save"
				title={title}
			>
				<div className={styles.modalContent}>
					<ColorPicker
						color={tempColor}
						setColor={setTempColor}
					/>
				</div>
			</ActionModal>
		</>
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
