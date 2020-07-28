import React, { useContext, createContext, useCallback, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';

const StampCacheContext = createContext();
const { Provider } = StampCacheContext;

export function useStampCache() {
	return useContext(StampCacheContext);
}

export function StampCacheProvider({ children }) {
	const stampCache = useRef({});

	const cacheCollection = useCallback((category, stamps) => {
		stampCache.current[category] = stamps;
	}, []);

	const getCachedCollection = useCallback((category) => stampCache.current[category], []);

	const value = useMemo(() => ({
		getCachedCollection,
		cacheCollection,
	}));

	return (
		<Provider value={value}>
			{children}
		</Provider>
	);
}

StampCacheProvider.propTypes = {
	children: PropTypes.node.isRequired,
};
