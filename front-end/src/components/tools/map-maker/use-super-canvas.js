import { createContext, useContext } from 'react';

const SuperCanvasContext = createContext();

export const SuperCanvasProvider = SuperCanvasContext.Provider;

export function useSuperCanvas() {
	return useContext(SuperCanvasContext);
}
