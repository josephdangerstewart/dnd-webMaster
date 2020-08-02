import { categories } from './categories';
import { useState, useEffect, useCallback } from 'react';
import { usePatternCache } from '../../use-pattern-cache';

export function usePatternCategories() {
	const {
		getCachedCategories,
		cacheCategories,
		getCachedSelectedCategory,
		cacheSelectedCategory,
	} = usePatternCache();

	const cachedCategories = getCachedCategories();
	const cachedSelectedCategory = getCachedSelectedCategory();

	const [ categories, setCategories ] = useState(cachedCategories);
	const [ selectedCategory, setSelectedCategory ] = useState(cachedSelectedCategory || null);
	const [ isLoadingCategories, setIsLoadingCategories ] = useState(true);

	useEffect(() => {
		if (cachedCategories) {
			setIsLoadingCategories(false);
			return;
		}

		let isCancelled = false;
		getPatternCategories().then((value) => {
			if (isCancelled) {
				return;
			}

			setCategories(value);
			setIsLoadingCategories(false);
			cacheCategories(value);
		});

		return () => {
			isCancelled = true;
		};
	}, [ cachedCategories, cacheCategories ]);

	const wrappedSetSelectedCategory = useCallback((value) => {
		cacheSelectedCategory(value);
		setSelectedCategory(value);
	}, [ cacheSelectedCategory, setSelectedCategory ]);

	return {
		categories,
		isLoadingCategories,
		selectedCategory,
		setSelectedCategory: wrappedSetSelectedCategory,
	};
}

function getPatternCategories() {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(Object.keys(categories).map(key => ({
				name: categories[key].name,
				value: key,
			})));
		}, 1000);
	});
}
