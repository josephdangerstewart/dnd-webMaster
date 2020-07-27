import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@blueprintjs/core';

import styles from './styles.less';

export function ImagePicker({
	images,
	onSelect,
}) {
	return (
		<div className={styles.root}>
			{images.map((src) => (
				<Button
					minimal
					key={src}
					onClick={() => onSelect(src)}
				>
					<div
						className={styles.imageContainer}
					>
						<img src={src} />
					</div>
				</Button>
			))}
		</div>
	);
}

ImagePicker.propTypes = {
	images: PropTypes.arrayOf(PropTypes.string).isRequired,
	onSelect: PropTypes.func.isRequired,
};
