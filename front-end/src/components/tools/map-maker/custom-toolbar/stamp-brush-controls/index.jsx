import React from 'react';
import PropTypes from 'prop-types';
import { ImagePicker } from '../../../../image-picker';

import { Button, Tooltip, Popover, Menu, Classes } from '@blueprintjs/core';
import { constants } from '../constants';
import { StampBrush } from '../../single-view/StampBrush';
import { useMapContext } from '../../use-map-context';

import styles from '../styles.less';
import stampBrushStyles from './styles.less';
import classNames from 'Utility/classNames';

export function StampBrushControls({
	activeBrushName,
	brush,
	setActiveBrush,
}) {
	const { setStampImage } = useMapContext();
	return (
		<Popover
			content={(
				<Menu>
					<div className={classNames(stampBrushStyles.imagePickerContainer, Classes.POPOVER_DISMISS)}>
						<ImagePicker
							images={[
								'https://via.placeholder.com/150?text=Image1',
								'https://via.placeholder.com/150?text=Image2',
								'https://via.placeholder.com/150?text=Image3',
								'https://via.placeholder.com/150?text=Image4',
								'https://via.placeholder.com/150?text=Image5',
								'https://via.placeholder.com/150?text=Image6',
								'https://via.placeholder.com/150?text=Image7',
								'https://via.placeholder.com/150?text=Image8',
								'https://via.placeholder.com/150?text=Image9',
								'https://via.placeholder.com/150?text=Image10',
								'https://via.placeholder.com/150?text=Image11',
								'https://via.placeholder.com/150?text=Image12',
								'https://via.placeholder.com/150?text=Image13',
								'https://via.placeholder.com/150?text=Image14',
								'https://via.placeholder.com/150?text=Image15',
								'https://via.placeholder.com/150?text=Image16',
								'https://via.placeholder.com/150?text=Image17',
							]}
							onSelect={setStampImage}
						/>
					</div>
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
