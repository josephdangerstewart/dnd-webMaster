import React, { createContext } from 'react';
import PropTypes from 'prop-types';

export const PaneContext = createContext(null);

export const PaneContextProvider = ({ paneId, children }) => (
	<PaneContext.Provider
		value={{
			paneId,
		}}
	>
		{children}
	</PaneContext.Provider>
);

PaneContextProvider.propTypes = {
	paneId: PropTypes.number,
	children: PropTypes.node,
};
