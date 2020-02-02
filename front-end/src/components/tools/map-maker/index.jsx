import React from 'react';
import PropTypes from 'prop-types';
import { ListPage } from './list-page';

export const MapMaker = ({ campaignID, closePane }) => (
	<div>
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
