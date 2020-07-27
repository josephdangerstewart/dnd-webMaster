/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { ImagePicker } from '../../../../image-picker';

import { Button, Tooltip, Popover, Menu, Classes, Spinner, MenuItem } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import { constants } from '../constants';
import { StampBrush } from '../../single-view/StampBrush';
import { useMapContext } from '../../use-map-context';

import styles from './styles.less';
import classNames from 'Utility/classNames';
import { useStampCollection } from './useStampCollection';
import { useStampCategories } from './useStampCategories';

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
				<Select
					items={categories}
					itemRenderer={renderCategory}
					itemsEqual={areCategoriesEqual}
					onItemSelect={setSelectedCategory}
					popoverProps={{
						modifiers: {
							arrow: false,
						},
						usePortal: false,
						captureDismiss: true,
						targetTagName: 'div',
						targetClassName: styles.selectTarget,
					}}
					filterable={false}
				>
					<Button
						text={(selectedCategory && selectedCategory.name) || 'Select a category'}
						rightIcon="caret-down"
						minimal
						fill
						className={styles.button}
					/>
				</Select>
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

function renderCategory(item, props) {
	return (
		<MenuItem
			text={item.name}
			onClick={props.handleClick}
			className={classNames(
				styles.menuItem,
				props.modifiers.active && styles.active,
			)}
			key={item.value}
		/>
	);
}

function areCategoriesEqual(category1, category2) {
	return category1.value === category2.value;
}

function LoadingSpinner() {
	return (
		<div className={styles.spinnerContainer}>
			<Spinner />
		</div>
	);
}
