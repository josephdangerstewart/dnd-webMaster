import { categories } from './categories';
import { useState, useEffect, useCallback } from 'react';
import { useStampCache } from '../../use-stamp-cache';

export function useStampCategories() {
	const {
		getCachedCategories,
		cacheCategories,
		getCachedSelectedCategory,
		cacheSelectedCategory,
	} = useStampCache();

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
		getStampCategories().then((value) => {
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

function getStampCategories() {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(Object.keys(categories).map(key => ({
				name: categories[key].name,
				value: key,
			})));
		}, 1000);
	});
}
