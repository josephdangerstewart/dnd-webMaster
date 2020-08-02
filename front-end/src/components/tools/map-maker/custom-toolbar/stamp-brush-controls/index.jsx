/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { ImagePicker } from '../../../../image-picker';

import { Button, Tooltip, Popover, Menu, Classes, Spinner } from '@blueprintjs/core';
import { constants } from '../constants';
import { StampBrush } from '../../single-view/StampBrush';
import { useMapContext } from '../../use-map-context';

import styles from './styles.less';
import classNames from 'Utility/classNames';
import { useStampCollection } from './useStampCollection';
import { useStampCategories } from './useStampCategories';
import { BasicSelect } from '../../../../basic-select';

export function StampBrushControls({
	activeBrushName,
	brush,
	setActiveBrush,
}) {
	return (
		<Popover
			content={(
				<Menu>
					<StampPicker />
				</Menu>
			)}
			modifiers={{
				arrow: {
					enabled: false,
				},
			}}
			position="bottom"
		>
			<Tooltip
				content="Stamp"
				hoverOpenDelay={constants.TOOLTIP_DELAY}
			>
				<Button
					icon="cube-add"
					active={activeBrushName === StampBrush.brushName}
					onClick={() => setActiveBrush(brush)}
					className={styles.button}
					minimal
				/>
			</Tooltip>
		</Popover>
	);
}

StampBrushControls.propTypes = {
	activeBrushName: PropTypes.string,
	brush: PropTypes.object,
	setActiveBrush: PropTypes.func,
	currentStamp: PropTypes.string,
	setCurrentStamp: PropTypes.func,
};

function StampPicker() {
	const { categories, isLoadingCategories, selectedCategory, setSelectedCategory } = useStampCategories();
	const { stamps, isLoadingStamps } = useStampCollection(selectedCategory && selectedCategory.value);
	const { setStampImage } = useMapContext();

	if (isLoadingCategories) {
		return (
			<LoadingSpinner />
		);
	}

	return (
		<>
			<div className={Classes.POPOVER_DISMISS_OVERRIDE}>
				<BasicSelect
					items={categories}
					onChange={setSelectedCategory}
					getDisplay={(item) => item.name}
					getKey={(item) => item.value}
					value={selectedCategory}
					noItemsText="Select a category"
				/>
			</div>
			<div className={classNames(styles.imagePickerContainer, Classes.POPOVER_DISMISS)}>
				{isLoadingStamps ? (
					<LoadingSpinner />
				) : (!stamps.length || !selectedCategory) ? (
					<p>Please select a category</p>
				) : (
					<ImagePicker
						images={stamps}
						onSelect={setStampImage}
					/>
				)}
			</div>
		</>
	);
}

function LoadingSpinner() {
	return (
		<div className={styles.spinnerContainer}>
			<Spinner />
		</div>
	);
}
