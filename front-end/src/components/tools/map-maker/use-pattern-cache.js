import React, { useContext, createContext, useCallback, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';

const PatternCacheContext = createContext();
const { Provider } = PatternCacheContext;

export function usePatternCache() {
	return useContext(PatternCacheContext);
}

export function PatternCacheProvider({ children }) {
	const patternCache = useRef({});
	const categories = useRef();
	const selectedCategory = useRef();

	const cacheCollection = useCallback((category, patterns) => {
		patternCache.current[category] = patterns;
	}, []);

	const getCachedCollection = useCallback((category) => patternCache.current[category], []);

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

PatternCacheProvider.propTypes = {
	children: PropTypes.node.isRequired,
};
