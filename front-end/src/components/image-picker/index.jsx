import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.less';

export function ImagePicker({
	images,
	onSelect,
}) {
	return (
		<div className={styles.root}>
			{images.map((src) => (
				<div
					className={styles.imageContainer}
					onClick={() => onSelect(src)}
					key={src}
				>
					<img src={src} />
				</div>
			))}
		</div>
	);
}

ImagePicker.propTypes = {
	images: PropTypes.arrayOf(PropTypes.string).isRequired,
	onSelect: PropTypes.func.isRequired,
};
