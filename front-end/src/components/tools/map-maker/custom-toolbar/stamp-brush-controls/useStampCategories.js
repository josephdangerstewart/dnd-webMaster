import { categories } from './categories';
import { useState, useEffect } from 'react';

export function useStampCategories() {
	const [ categories, setCategories ] = useState();
	const [ selectedCategory, setSelectedCategory ] = useState();
	const [ isLoadingCategories, setIsLoadingCategories ] = useState(true);

	useEffect(() => {
		let isCancelled = false;
		getStampCategories().then((value) => {
			if (isCancelled) {
				return;
			}

			setCategories(value);
			setIsLoadingCategories(false);
		});

		return () => {
			isCancelled = true;
		};
	}, []);

	return {
		categories,
		isLoadingCategories,
		selectedCategory,
		setSelectedCategory,
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
