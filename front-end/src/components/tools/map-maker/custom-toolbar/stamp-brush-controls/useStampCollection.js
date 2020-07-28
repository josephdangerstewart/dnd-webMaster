import { useState } from 'react';
import { categories } from './categories';
import { useEffect } from 'react';
import { useStampCache } from '../../use-stamp-cache';

export function useStampCollection(collectionName) {
	const { getCachedCollection, cacheCollection } = useStampCache();
	const [ stamps, setStamps ] = useState([]);
	const [ isLoadingStamps, setIsLoadingStamps ] = useState(true);

	useEffect(() => {
		if (!collectionName) {
			setIsLoadingStamps(false);
			return;
		}

		const cachedCollection = getCachedCollection(collectionName);
		if (cachedCollection) {
			setStamps(cachedCollection);
			setIsLoadingStamps(false);
			return;
		}

		let isCancelled = false;
		setIsLoadingStamps(true);
		getCollection(collectionName).then((value) => {
			if (isCancelled) {
				return;
			}

			setStamps(value);
			setIsLoadingStamps(false);
			cacheCollection(collectionName, value);
		});

		return () => {
			isCancelled = true;
		};
	}, [ collectionName ]);

	return {
		stamps,
		isLoadingStamps,
	};
}

function getCollection(collectionName) {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(categories[collectionName].stamps);
		}, 1000);
	});
}
