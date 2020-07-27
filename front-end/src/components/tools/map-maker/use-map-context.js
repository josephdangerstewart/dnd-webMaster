import { useContext, createContext } from 'react';

const mapContext = createContext({});

export function useMapContext() {
	return useContext(mapContext);
}

export const MapContextProvider = mapContext.Provider;
