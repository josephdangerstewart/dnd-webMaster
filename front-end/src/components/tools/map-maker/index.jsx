import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { ListPage } from './list-page';

import styles from './styles.less';

const views = Object.freeze({
	list: 'list',
	single: 'single',
});

export const MapMaker = ({ campaignID, closePane }) => {
	const [ currentView, setCurrentView ] = useState(views.list);
	const [ currentMapID, setCurrentMapID ] = useState(-1);

	const goToSingle = useCallback((mapID) => {
		setCurrentMapID(mapID);
		setCurrentView(views.single);
	}, []);

	const goToList = useCallback(() => setCurrentView(views.list), []);

	if (currentView === views.list) {
		return (
			<div className={styles.root}>
				<ListPage
					campaignID={campaignID}
					closePane={closePane}
					onMapSelected={goToSingle}
				/>
			</div>
		);
	}

	return (
		<div className={styles.root}>
			<button onClick={goToList}>LEAVE MAP {currentMapID}</button>
		</div>
	);
};

MapMaker.propTypes = {
	closePane: PropTypes.func.isRequired,
	campaignID: PropTypes.campaignID,
};
