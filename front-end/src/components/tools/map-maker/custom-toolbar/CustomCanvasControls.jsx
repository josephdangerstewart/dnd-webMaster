import React from 'react';
import PropTypes from 'prop-types';
import {
	Button,
	Tooltip,
} from '@blueprintjs/core';
import { constants } from './constants';

import styles from './styles.less';

export function CustomCanvasControls({ clear, currentSelection, deleteSelectedCanvasItems }) {
	return (
		<>
			<Tooltip
				content="Clear all"
				hoverOpenDelay={constants.TOOLTIP_DELAY}
			>
				<Button
					icon="cross"
					onClick={clear}
					minimal
					className={styles.button}
				/>
			</Tooltip>
			{currentSelection && currentSelection.selectedItemCount > 0 && (
				<Tooltip
					content="Delete current selection"
					hoverOpenDelay={constants.TOOLTIP_DELAY}
				>
					<Button
						icon="trash"
						onClick={deleteSelectedCanvasItems}
						minimal
						className={styles.button}
					/>
				</Tooltip>
			)}
		</>
	);
}

CustomCanvasControls.propTypes = {
	clear: PropTypes.func.isRequired,
	deleteSelectedCanvasItems: PropTypes.func.isRequired,
	currentSelection: PropTypes.object,
};
