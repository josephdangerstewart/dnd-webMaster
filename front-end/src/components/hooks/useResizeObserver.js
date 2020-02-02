import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

export function useResizeObserver() {
	const ref = useRef(null);
	const [ width, setWidth ] = useState(null);
	const [ height, setHeight ] = useState(null);

	const onResize = useCallback((entries) => {
		const entry = entries[0];

		if (entry) {
			const rect = entry.target.getBoundingClientRect();
			setWidth(rect.width);
			setHeight(rect.height);
		}
	}, []);

	const resizeObserver = useMemo(() => new ResizeObserver(onResize), []);

	useEffect(() => {
		const el = ref.current;
		if (el) {
			const rect = el.getBoundingClientRect();
			if (rect) {
				setWidth(rect.width);
				setHeight(rect.height);
			}
			resizeObserver.observe(el);
		}

		return () => el && resizeObserver.unobserve(el);
	}, [ ref.current ]);

	return {
		ref,
		width,
		height,
		isSupported: Boolean(ResizeObserver),
	};
}
