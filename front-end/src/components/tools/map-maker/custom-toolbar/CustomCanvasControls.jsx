import React from 'react';
import PropTypes from 'prop-types';
import {
	Button,
} from '@blueprintjs/core';

import styles from './styles.less';

export function CustomCanvasControls({ clear, currentSelection, deleteSelectedCanvasItems }) {
	return (
		<>
			<Button
				icon="cross"
				onClick={clear}
				minimal
				className={styles.button}
			/>
			{currentSelection && currentSelection.selectedItemCount > 0 && (
				<Button
					icon="trash"
					onClick={deleteSelectedCanvasItems}
					minimal
					className={styles.button}
				/>
			)}
		</>
	);
}

CustomCanvasControls.propTypes = {
	clear: PropTypes.func.isRequired,
	deleteSelectedCanvasItems: PropTypes.func.isRequired,
	currentSelection: PropTypes.object,
};
