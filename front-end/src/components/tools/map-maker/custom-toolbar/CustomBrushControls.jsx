import React from 'react';
import PropTypes from 'prop-types';
import { Button, Tooltip } from '@blueprintjs/core';
import { DefaultBrushKind } from 'react-super-canvas/dist/src/types/IBrush';
import { LocationPinBrush } from '../single-view/LocationPinBrush';

import styles from './styles.less';
import { constants } from './constants';

const brushMap = {
	[DefaultBrushKind.Selection]: {
		icon: 'select',
		name: 'Selection',
	},
	[DefaultBrushKind.PolygonBrush]: {
		icon: 'polygon-filter',
		name: 'Polygon',
	},
	[LocationPinBrush.brushName]: {
		icon: 'map-marker',
		name: 'Location Pin',
	},
};

export function CustomBrushControls({ activeBrushName, brushes, setActiveBrush }) {
	return (
		<>
			{brushes.map(brush => (
				<Tooltip
					key={`brush-${brush.brushName}`}
					content={brushMap[brush.brushName].name}
					hoverOpenDelay={constants.TOOLTIP_DELAY}
				>
					<Button
						icon={brushMap[brush.brushName].icon}
						active={activeBrushName === brush.brushName}
						onClick={() => setActiveBrush(brush)}
						className={styles.button}
						minimal
					/>
				</Tooltip>
			))}
		</>
	);
}

CustomBrushControls.propTypes = {
	activeBrushName: PropTypes.string.isRequired,
	brushes: PropTypes.array.isRequired,
	setActiveBrush: PropTypes.func.isRequired,
};
