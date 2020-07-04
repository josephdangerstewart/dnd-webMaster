import { useCallback } from 'react';

export function useColorState(value, setValue) {
	const setRedValue = useCallback((r) => {
		setValue({
			...value,
			r,
		});
	}, [ value, value ]);

	const setGreenValue = useCallback((g) => {
		setValue({
			...value,
			g,
		});
	}, [ value, value ]);

	const setBlueValue = useCallback((b) => {
		setValue({
			...value,
			b,
		});
	}, [ value, value ]);

	const setAlphaValue = useCallback((a) => {
		setValue({
			...value,
			a,
		});
	}, [ value, value ]);

	return {
		setRedValue,
		setGreenValue,
		setBlueValue,
		setAlphaValue,
	};
}
