import React from 'react';
import PropTypes from 'prop-types';
import {
	Button,
	Tooltip,
	Menu,
	MenuItem,
	MenuDivider,
	Popover,
} from '@blueprintjs/core';
import { constants } from './constants';

import styles from './styles.less';
import { useSuperCanvas } from '../use-super-canvas';

export function CustomCanvasControls({ clear, currentSelection, deleteSelectedCanvasItems }) {
	return (
		<>
			{currentSelection && currentSelection.selectedItemCount > 0 ? (
				<>
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
					<AdvancedSelectionControls />
				</>
			) : (
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
			)}
		</>
	);
}

CustomCanvasControls.propTypes = {
	clear: PropTypes.func.isRequired,
	deleteSelectedCanvasItems: PropTypes.func.isRequired,
	currentSelection: PropTypes.object,
};

function AdvancedSelectionControls() {
	const {
		lockCurrentSelection,
		unlockCurrentSelection,
		moveForward,
		moveBackward,
		moveToFront,
		moveToBack,
	} = useSuperCanvas();

	return (
		<Popover
			content={(
				<Menu>
					<MenuItem
						text="Lock (Select again with Alt)"
						onClick={lockCurrentSelection}
					/>
					<MenuItem
						text="Unlock"
						onClick={unlockCurrentSelection}
					/>
					<MenuDivider />
					<MenuItem
						text="Bring to front"
						onClick={moveToFront}
					/>
					<MenuItem
						text="Bring forward"
						onClick={moveForward}
					/>
					<MenuItem
						text="Send backward"
						onClick={moveBackward}
					/>
					<MenuItem
						text="Send to back"
						onClick={moveToBack}
					/>
				</Menu>
			)}
			modifiers={{
				arrow: {
					enabled: false,
				},
			}}
		>
			<Button
				icon="more"
				minimal
				className={styles.button}
			/>
		</Popover>
	);
}
