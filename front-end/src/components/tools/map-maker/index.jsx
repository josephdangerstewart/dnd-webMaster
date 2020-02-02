import React from 'react';
import PropTypes from 'prop-types';
import { ListPage } from './list-page';

import styles from './styles.less';

export const MapMaker = ({ campaignID, closePane }) => (
	<div className={styles.root}>
		<ListPage
			campaignID={campaignID}
			closePane={closePane}
		/>
	</div>
);

MapMaker.propTypes = {
	closePane: PropTypes.func.isRequired,
	campaignID: PropTypes.campaignID,
};
