import { useContext, useEffect } from 'react';
import { PaneContext } from '../pane-context-provider';
import { HotkeyContext } from '../hotkey-provider';

export function useHotkey(hotkey, callback) {
	const { paneId } = useContext(PaneContext) || {};
	const {
		registerHotkeyForPane,
		unregisterHotkeyForPane,
	} = useContext(HotkeyContext) || {};

	useEffect(
		() => {
			if (!paneId && paneId !== 0) {
				return;
			}

			registerHotkeyForPane(paneId, hotkey, callback);

			return () => {
				unregisterHotkeyForPane(paneId, hotkey, callback);
			};
		},
		[
			hotkey,
			callback,
			paneId,
			registerHotkeyForPane,
			unregisterHotkeyForPane,
		],
	);
}
