import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Button, Popover, InputGroup, Spinner } from '@blueprintjs/core';

import styles from './styles.less';

export const CreateResourceButton = ({ onCreate, resourceLabel, isLoading }) => {
	const [ resourceName, setResourceName ] = useState('');

	const handleInputChange = useCallback((event) => {
		setResourceName(event.target.value);
	}, []);

	const handleCreate = useCallback(() => {
		onCreate(resourceName);
	}, [ onCreate, resourceName ]);

	return (
		<Popover popoverClassName={styles.popover}>
			<Button
				minimal
				icon="plus"
				className={styles.button}
			/>
			<div className={styles.popoverContent}>
				<p className={styles.popoverTitle}>{resourceLabel}</p>
				<InputGroup
					value={resourceName}
					onChange={handleInputChange}
					autoFocus
					rightElement={
						isLoading ?
							<Spinner size={20} />
							:
							<Button
								minimal
								icon="tick"
								onClick={handleCreate}
							/>
					}
				/>
			</div>
		</Popover>
	);
};

CreateResourceButton.propTypes = {
	onCreate: PropTypes.func,
	resourceLabel: PropTypes.string,
	isLoading: PropTypes.bool,
};
