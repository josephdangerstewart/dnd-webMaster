import { useEffect, useState, useCallback, useRef } from 'react';
import { get, post, httpDelete, postForm } from '../../utility/fetch';

const noop = () => false;

/**
 * @description Similar to use callback, but wraps an async method
 * and adds cancellation functionality to it and auto cancels when the
 * component unmounts
 */
export function useAsyncCallback(callback, deps = []) {
	const promises = useRef([]);
	const asyncCallback = useCallback((...params) => {
		const promise = makeCancellable(callback(...params));
		promises.current.push(promise);

		const wrappedPromise = promise.then((value) => {
			const index = promises.current.findIndex((p) => p === promise);

			if (index > 0) {
				promises.current.splice(index, 1);
			}

			return value;
		});
		wrappedPromise.cancel = promise.cancel;

		return wrappedPromise;
	}, deps);

	useEffect(() => () => promises.current.forEach((promise) => promise.cancel()), []);

	return asyncCallback;
}

export function useGet() {
	return useAsyncCallback(get);
}

export function usePost() {
	return useAsyncCallback(post);
}

export function useHttpDelete() {
	return useAsyncCallback(httpDelete);
}

export function usePostForm() {
	return useAsyncCallback(postForm);
}

export function makeCancellable(promise) {
	let cancel = noop;

	const cancelPromise = new Promise((_, reject) => {
		cancel = (reason) => {
			reject(new Error(reason));
			return true;
		};
	});

	const wrappedPromise = Promise.race([ promise, cancelPromise ]);
	wrappedPromise.cancel = cancel;

	return wrappedPromise;
}

export function useGetOnMount(path) {
	const [ data, setData ] = useState(null);
	const [ isLoading, setIsLoading ] = useState(true);
	const [ error, setError ] = useState(null);
	const getJson = useGet();

	const loadData = useCallback(() => {
		setIsLoading(true);
		getJson(path)
			.then(data => {
				setData(data);
				setIsLoading(false);
			})
			.catch((error) => {
				setError(error);
				setIsLoading(false);
			});
	}, []);

	useEffect(() => {
		loadData();
	}, []);

	return {
		data,
		isLoading,
		error,
		reload: loadData,
	};
}
