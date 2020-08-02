/* eslint-disable react/prop-types */
import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { MenuItem, Button } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';

import styles from './styles.less';
import classNames from 'Utility/classNames';

export function BasicSelect({
	value,
	onChange,
	items,
	noItemsText,
	getKey,
	getDisplay,
}) {
	const [ activeItem, setActiveItem ] = useState(value);
	
	const renderItemCallback = useCallback(renderItem(getDisplay, getKey), [ getDisplay, getKey ]);
	const areItemsEqualCallback = useCallback(areItemsEqual(getKey), [ getKey ]);
	const selectedItemDisplay = getDisplay && value ? getDisplay(value) : value;

	return (
		<Select
			items={items}
			itemRenderer={renderItemCallback}
			itemsEqual={areItemsEqualCallback}
			onItemSelect={onChange}
			popoverProps={{
				modifiers: {
					arrow: false,
				},
				usePortal: false,
				captureDismiss: true,
				targetTagName: 'div',
			}}
			filterable={false}
			activeItem={activeItem}
			onActiveItemChange={setActiveItem}
		>
			<Button
				text={selectedItemDisplay || noItemsText || 'Select an item'}
				rightIcon="caret-down"
				minimal
				fill
				className={styles.button}
			/>
		</Select>
	);
}

BasicSelect.propTypes = {
	value: PropTypes.any.isRequired,
	onChange: PropTypes.func.isRequired,
	items: PropTypes.array.isRequired,
	getKey: PropTypes.func,
	getDisplay: PropTypes.func,
};

const renderItem = (getDisplay, getKey) => (item, props) => (
	<MenuItem
		text={getDisplay ? getDisplay(item) : item}
		onClick={props.handleClick}
		className={classNames(
			styles.menuItem,
			props.modifiers.active && styles.active,
		)}
		key={getKey ? getKey(item) : item}
	/>
);

const areItemsEqual = (getKey) => (item1, item2) => {
	if (getKey) {
		return getKey(item1) === getKey(item2);
	}
	return item1 === item2;
};
