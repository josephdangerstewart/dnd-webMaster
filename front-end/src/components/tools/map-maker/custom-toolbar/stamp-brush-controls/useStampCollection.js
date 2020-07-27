import { useState } from 'react';
import { categories } from './categories';
import { useEffect } from 'react';

export function useStampCollection(collectionName) {
	const [ stamps, setStamps ] = useState([]);
	const [ isLoadingStamps, setIsLoadingStamps ] = useState(true);

	useEffect(() => {
		if (!collectionName) {
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
