import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@blueprintjs/core';

import styles from './styles.less';

export function ImagePicker({
	images,
	onSelect,
	selectedImage,
}) {
	return (
		<div className={styles.root}>
			{images.map((src) => (
				<div key={src} className={styles.imageContainer}>
					<Button
						minimal
						onClick={() => onSelect(src)}
						active={src === selectedImage}
					>
						<img src={src} />
					</Button>
				</div>
			))}
		</div>
	);
}

ImagePicker.propTypes = {
	images: PropTypes.arrayOf(PropTypes.string).isRequired,
	onSelect: PropTypes.func.isRequired,
	selectedImage: PropTypes.string,
};
