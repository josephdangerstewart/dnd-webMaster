import React from 'react';
import PropTypes from 'prop-types';
import { SuperCanvas } from 'react-super-canvas/dist';
import { GridBackground, PolygonBrush } from 'react-super-canvas/dist/defaults';

export const MapMaker = ({ width }) => (
	<div>
		<h2>Map Maker</h2>
		<SuperCanvas
			width={width}
			height={500}
			availableBrushes={[
				new PolygonBrush(),
			]}
			activeBackgroundElement={new GridBackground(10)}
		/>
	</div>
);

MapMaker.propTypes = {
	width: PropTypes.number,
};
