import React from 'react';
import PropTypes from 'prop-types';
import {
	Button,
	Popover,
	Menu,
} from '@blueprintjs/core';
import { ColorPickerMenuItem } from './menu-items/ColorPickerMenuItem';

import styles from './styles.less';
import { useCallback } from 'react';

export function CustomStyleControls({ styleContext, setStyleContext }) {
	const setFillColor = useCallback((value) => {
		setStyleContext({ fillColor: value });
	}, [ setStyleContext ]);

	const setStrokeColor = useCallback((value) => {
		setStyleContext({ strokeColor: value });
	}, [ setStyleContext ]);

	return (
		<>
			<Popover
				content={(
					<Menu>
						<ColorPickerMenuItem
							title="Fill Color"
							value={styleContext.fillColor}
							setValue={setFillColor}
							canClear
						/>
						<ColorPickerMenuItem
							title="Stroke Color"
							value={styleContext.strokeColor}
							setValue={setStrokeColor}
						/>
					</Menu>
				)}
				modifiers={{
					arrow: {
						enabled: false,
					},
				}}
				position="bottom"
			>
				<Button
					icon="settings"
					minimal
					className={styles.button}
				/>
			</Popover>
		</>
	);
}

CustomStyleControls.propTypes = {
	setStyleContext: PropTypes.func.isRequired,
	styleContext: PropTypes.object.isRequired,
};
