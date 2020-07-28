import React, { useContext, createContext, useCallback, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';

const StampCacheContext = createContext();
const { Provider } = StampCacheContext;

export function useStampCache() {
	return useContext(StampCacheContext);
}

export function StampCacheProvider({ children }) {
	const stampCache = useRef({});
	const categories = useRef();
	const selectedCategory = useRef();

	const cacheCollection = useCallback((category, stamps) => {
		stampCache.current[category] = stamps;
	}, []);

	const getCachedCollection = useCallback((category) => stampCache.current[category], []);

	const getCachedCategories = useCallback(() => categories.current, []);
	const cacheCategories = useCallback((value) => {
		categories.current = value;
	}, []);

	const getCachedSelectedCategory = useCallback(() => selectedCategory.current, []);
	const cacheSelectedCategory = useCallback((value) => {
		selectedCategory.current = value;
	}, []);

	const value = useMemo(() => ({
		getCachedCollection,
		cacheCollection,
		getCachedCategories,
		cacheCategories,
		getCachedSelectedCategory,
		cacheSelectedCategory,
	}), [
		getCachedCollection,
		cacheCollection,
		getCachedCategories,
		cacheCategories,
		getCachedSelectedCategory,
		cacheSelectedCategory,
	]);

	return (
		<Provider value={value}>
			{children}
		</Provider>
	);
}

StampCacheProvider.propTypes = {
	children: PropTypes.node.isRequired,
};
