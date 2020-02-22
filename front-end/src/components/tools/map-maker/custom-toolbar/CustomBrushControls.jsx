import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@blueprintjs/core';
import { DefaultBrushKind } from 'react-super-canvas/dist/src/types/IBrush';
import { LocationPinBrush } from '../single-view/LocationPinBrush';

import styles from './styles.less';

const brushControlIconMap = {
	[DefaultBrushKind.Selection]: 'select',
	[DefaultBrushKind.PolygonBrush]: 'polygon-filter',
	[LocationPinBrush.brushName]: 'map-marker',
};

export function CustomBrushControls({ activeBrushName, brushes, setActiveBrush }) {
	return (
		<>
			{brushes.map(brush => (
				<Button
					key={`brush-${brush.brushName}`}
					icon={brushControlIconMap[brush.brushName]}
					active={activeBrushName === brush.brushName}
					onClick={() => setActiveBrush(brush)}
					className={styles.button}
					minimal
				/>
			))}
		</>
	);
}

CustomBrushControls.propTypes = {
	activeBrushName: PropTypes.string.isRequired,
	brushes: PropTypes.array.isRequired,
	setActiveBrush: PropTypes.func.isRequired,
};
