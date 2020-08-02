import { useState } from 'react';
import { categories } from './categories';
import { useEffect } from 'react';
import { usePatternCache } from '../../use-pattern-cache';

export function usePatternCollection(collectionName) {
	const { getCachedCollection, cacheCollection } = usePatternCache();
	const [ patterns, setPatterns ] = useState([]);
	const [ isLoadingPatterns, setIsLoadingPatterns ] = useState(true);

	useEffect(() => {
		if (!collectionName) {
			setIsLoadingPatterns(false);
			return;
		}

		const cachedCollection = getCachedCollection(collectionName);
		if (cachedCollection) {
			setPatterns(cachedCollection);
			setIsLoadingPatterns(false);
			return;
		}

		let isCancelled = false;
		setIsLoadingPatterns(true);
		getCollection(collectionName).then((value) => {
			if (isCancelled) {
				return;
			}

			setPatterns(value);
			setIsLoadingPatterns(false);
			cacheCollection(collectionName, value);
		});

		return () => {
			isCancelled = true;
		};
	}, [ collectionName ]);

	return {
		patterns,
		isLoadingPatterns,
	};
}

function getCollection(collectionName) {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(categories[collectionName].patterns);
		}, 1000);
	});
}
