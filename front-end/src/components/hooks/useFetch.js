import { useEffect, useState, useCallback, useRef } from 'react';
import { get, post, httpDelete, postForm } from '../../utility/fetch';
import debounce from '../../utility/debounce';

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

export function useDebouncedAsyncCallback(callback, timeout, deps = []) {
	return useAsyncCallback(debounce(callback, timeout), [ ...deps, timeout ]);
}

export function useGet() {
	return useAsyncCallback(get);
}

export function useDebouncedGet(timeout) {
	return useDebouncedAsyncCallback(get, timeout);
}

export function usePost() {
	return useAsyncCallback(post);
}

export function useDebouncedPost(timeout) {
	return useDebouncedAsyncCallback(post, timeout);
}

export function useHttpDelete() {
	return useAsyncCallback(httpDelete);
}

export function useDebouncedHttpDelete(timeout) {
	return useDebouncedAsyncCallback(httpDelete, timeout);
}

export function usePostForm() {
	return useAsyncCallback(postForm);
}

export function useDeboucnedPostForm(timeout) {
	return useDebouncedAsyncCallback(postForm, timeout);
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

export function useGetOnMount(path, onInitialLoad) {
	const [ data, setData ] = useState(null);
	const [ isLoading, setIsLoading ] = useState(true);
	const [ error, setError ] = useState(null);
	const getJson = useGet();

	const loadData = useCallback(() => {
		setIsLoading(true);
		console.log('path is', path);
		return getJson(path)
			.then(data => {
				setData(data);
				setIsLoading(false);

				if (onInitialLoad) {
					onInitialLoad(data);
				}

				return data;
			})
			.catch((error) => {
				setError(error);
				setIsLoading(false);
			});
	}, [ onInitialLoad ]);

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
