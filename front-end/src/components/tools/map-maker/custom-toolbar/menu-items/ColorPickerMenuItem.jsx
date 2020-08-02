import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
	MenuItem,
	Button,
	Spinner,
} from '@blueprintjs/core';
import styles from './styles.less';
import { ColorPicker } from '../../../../color-picker';
import ActionModal from '../../../../modal/ActionModal';
import { usePatternCategories } from './usePatternCategories';
import { BasicSelect } from '../../../../basic-select';
import { ImagePicker } from '../../../../image-picker';
import { usePatternCollection } from './usePatternCollection';

export function ColorPickerMenuItem({ title, value, setValue, hasMedia, mediaValue }) {
	const [ isModalOpen, setIsModalOpen ] = useState(false);
	const [ tempColor, setTempColor ] = useState(value);
	const [ tempPattern, setTempPattern ] = useState(mediaValue);
	const [ view, setView ] = useState(hasMedia && mediaValue ? 'pattern' : 'color');

	const {
		isLoadingCategories,
		categories,
		setSelectedCategory,
		selectedCategory,
	} = usePatternCategories();

	const {
		patterns,
		isLoadingPatterns,
	} = usePatternCollection(selectedCategory && selectedCategory.value);

	const openModal = useCallback(() => setIsModalOpen(true), []);
	const closeModal = useCallback(() => setIsModalOpen(false), []);

	const onSubmit = useCallback(() => {
		if (view === 'color') {
			setValue(tempColor, null);
		} else {
			setValue(null, tempPattern);
		}

		setIsModalOpen(false);
	}, [ setValue, tempColor, tempPattern ]);

	const color = value || 'rgba(0, 0, 0, 0)';
	return (
		<>
			<MenuItem
				text={(
					<div className={styles.menuItemTextContainer}>
						{hasMedia && mediaValue ? (
							<div className={styles.mediaPreview}>
								<img src={mediaValue} />
							</div>
						) : (
							<ColorPreview
								color={color}
							/>
						)}
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
				{hasMedia ? (
					<div className={styles.modalContent}>
						<div className={styles.tabControls}>
							<Button
								icon="tint"
								minimal
								className={styles.button}
								onClick={() => setView('color')}
								active={view === 'color'}
							/>
							<Button
								icon="media"
								minimal
								className={styles.button}
								onClick={() => setView('pattern')}
								active={view === 'pattern'}
							/>
						</div>
						<div className={styles.tabContent}>
							{view === 'color' ? (
								<ColorPicker
									color={tempColor}
									setColor={setTempColor}
								/>
							) : isLoadingCategories ? (
								<LoadingSpinner />
							) : (
								<div className={styles.mediaContainer}>
									<BasicSelect
										items={categories}
										getDisplay={(item) => item.name}
										getKey={(item) => item.value}
										onChange={setSelectedCategory}
										value={selectedCategory}
										noItemsText="Select a category"
									/>
									<div className={styles.imagePicker}>
										{isLoadingPatterns ? (
											<LoadingSpinner />
										) : (
											<ImagePicker
												images={patterns}
												onSelect={setTempPattern}
												selectedImage={tempPattern}
											/>
										)}
									</div>
								</div>
							)}
						</div>
					</div>
				) : (
					<ColorPicker
						color={tempColor}
						setColor={setTempColor}
					/>
				)}
			</ActionModal>
		</>
	);
}

ColorPickerMenuItem.propTypes = {
	title: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	mediaValue: PropTypes.string.isRequired,
	setValue: PropTypes.func.isRequired,
	hasMedia: PropTypes.bool,
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

function LoadingSpinner() {
	return (
		<div className={styles.spinnerContainer}>
			<Spinner />
		</div>
	);
}
