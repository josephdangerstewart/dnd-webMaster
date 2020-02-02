import React, { useState, useCallback, useMemo } from 'react';
import { SuperCanvas } from 'react-super-canvas/dist';
import { GridBackground, PolygonBrush } from 'react-super-canvas/dist/defaults';
import PropTypes from 'prop-types';
import {
	EditableText,
	Spinner,
	NonIdealState,
	Button,
} from '@blueprintjs/core';
import {
	useGetOnMount,
	useDebouncedAsyncCallback,
	usePost,
} from '../../../hooks/useFetch';
import { useResizeObserver } from '../../../hooks/useResizeObserver';
import Title from '../../../title';

import styles from './styles.less';

export const SingleView = ({ campaignID, mapID, onBack }) => {
	const [ mapName, setMapName ] = useState('');
	const [ mapData, setMapData ] = useState(null);
	const [ isUpdating, setIsUpdating ] = useState(false);
	const { ref: mapContainerRef, width, height } = useResizeObserver();
	const post = usePost();

	const postDeboucned = useDebouncedAsyncCallback(async (path, body) => {
		await post(path, body);
		setIsUpdating(false);
	}, 1000, [ post ]);

	const onInitialLoad = useCallback((data) => {
		setMapName(data.map.mapName);
		setMapData(data.map.mapData);
	}, []);

	const {
		isLoading,
		error,
	} = useGetOnMount(`/api/campaigns/${campaignID}/maps/${mapID}`, onInitialLoad);

	const onMapChange = useCallback(async (mapName) => {
		setMapName(mapName);
		setIsUpdating(true);
		await postDeboucned(`/api/campaigns/${campaignID}/maps/${mapID}`, { mapName });
	}, []);

	const availableBrushes = useMemo(() => [
		new PolygonBrush(),
	], []);

	const backgroundElement = useMemo(() => new GridBackground(10));

	if (isLoading) {
		return <Spinner />;
	}

	if (error) {
		return (
			<NonIdealState
				title="Uh oh"
				description="There was an error loading your map"
				icon="error"
				action={
					<Button
						text="Go back"
						onClick={onBack}
					/>
				}
			/>
		);
	}

	return (
		<div className={styles.root}>
			<Title
				fontSize={25}
				leftComponent={
					<Button
						minimal
						className={styles.button}
						icon="arrow-left"
						onClick={onBack}
					/>
				}
				rightComponent={
					isUpdating && <Spinner size={20} className={styles.spinner} />
				}
				className={styles.title}
			>
				<EditableText
					value={mapName}
					onChange={onMapChange}
					placeholder="Title..."
				/>
			</Title>
			<div className={styles.mapContainer} ref={mapContainerRef}>
				<SuperCanvas
					width={width}
					activeBackgroundElement={backgroundElement}
					height={height}
					availableBrushes={availableBrushes}
				/>
			</div>
		</div>
	);
};

SingleView.propTypes = {
	campaignID: PropTypes.string,
	mapID: PropTypes.string,
	onBack: PropTypes.func,
};
