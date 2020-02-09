import React, { createContext, useRef, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import keyboard from 'keyboardjs';

export const HotkeyContext = createContext(null);

export const HOTKEY_SOURCE = Object.freeze({
	local: 'local',
});

export const HotkeyProvider = ({ focusedPaneId, children }) => {
	const hotkeysForPanes = useRef({});
	const currentlyBoundHotkeys = useRef([]);

	const unbindHotkeys = useCallback(() => {
		currentlyBoundHotkeys.current.forEach(({ hotkey, callback }) => {
			keyboard.unbind(hotkey, callback);
		});
		currentlyBoundHotkeys.current = [];
	}, []);

	const bindHotkeysForPane = useCallback((paneId) => {
		unbindHotkeys();

		const hotkeysForPane = hotkeysForPanes.current[paneId];
		if (!hotkeysForPane) {
			return;
		}

		const hotkeysToBind = Object.entries(hotkeysForPane).map(([ hotkey, callback ]) => ({
			hotkey,
			callback,
		}));

		hotkeysToBind.forEach(({ hotkey, callback }) => {
			keyboard.bind(hotkey, callback);
		});
		
		currentlyBoundHotkeys.current = [ ...currentlyBoundHotkeys.current, ...hotkeysToBind ];
	}, [ unbindHotkeys ]);

	const registerHotkeyForPane = useCallback((paneId, hotkey, callback) => {
		if (!hotkeysForPanes.current[paneId]) {
			hotkeysForPanes.current[paneId] = {};
		}

		hotkeysForPanes.current[paneId][hotkey] = callback;

		if (paneId === focusedPaneId) {
			bindHotkeysForPane(paneId);
		}
	}, [ focusedPaneId ]);

	const unregisterHotkeyForPane = useCallback((paneId, hotkey, callback) => {
		if (focusedPaneId === paneId) {
			const hotkeyIndex = currentlyBoundHotkeys.current.findIndex(({ hotkey: hk, callback: cb }) => hotkey === hk && callback === cb);
			if (hotkeyIndex >= 0) {
				keyboard.unbind(currentlyBoundHotkeys.current[hotkeyIndex].hotkey, currentlyBoundHotkeys.current[hotkeyIndex].callback);
				currentlyBoundHotkeys.current.splice(hotkeyIndex, 1);
			}
		}

		if (hotkeysForPanes.current[paneId] && hotkeysForPanes.current[paneId][hotkey]) {
			delete hotkeysForPanes.current[paneId][hotkey];
		}
	});

	const unregisterAllHotkeysForPane = useCallback((paneId) => {
		if (focusedPaneId === paneId) {
			unbindHotkeys();
		}

		if (hotkeysForPanes.current[paneId]) {
			delete hotkeysForPanes.current[paneId];
		}
	}, [ focusedPaneId ]);

	useEffect(() => {
		bindHotkeysForPane(focusedPaneId);
	}, [ focusedPaneId ]);

	useEffect(() => () => {
		currentlyBoundHotkeys.current.forEach(({ hotkey, callback }) => keyboard.unbind(hotkey, callback));
	}, []);

	return (
		<HotkeyContext.Provider
			value={{
				registerHotkeyForPane,
				unregisterHotkeyForPane,
				unregisterAllHotkeysForPane,
			}}
		>
			{children}
		</HotkeyContext.Provider>
	);
};

HotkeyProvider.propTypes = {
	focusedPaneId: PropTypes.number,
	children: PropTypes.node,
};

export const GlobalHotkeyConsumer = HotkeyContext.Consumer;
