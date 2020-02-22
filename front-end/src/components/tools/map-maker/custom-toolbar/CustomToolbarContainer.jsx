import React from 'react';
import PropTypes from 'prop-types';
import {
	Card,
	Divider,
	ButtonGroup,
} from '@blueprintjs/core';

import styles from './styles.less';

export function CustomToolbarContainer({
	brushControls,
	canvasControls,
	styleControls,
}) {
	return (
		<div className={styles.toolbarContainer}>
			<Card className={styles.card} elevation={3}>
				<ButtonGroup>
					{brushControls}
					<Divider />
					{styleControls}
					<Divider />
					{canvasControls}
				</ButtonGroup>
			</Card>
		</div>
	);
}

CustomToolbarContainer.propTypes = {
	brushControls: PropTypes.node.isRequired,
	canvasControls: PropTypes.node.isRequired,
	styleControls: PropTypes.node.isRequired,
};
