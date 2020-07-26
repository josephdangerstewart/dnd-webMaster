import React, { useState, useCallback, useMemo, useRef } from 'react';
import { SuperCanvas } from 'react-super-canvas';
import { GridBackground, PolygonBrush } from 'react-super-canvas/defaults';
import PropTypes from 'prop-types';
import {
	EditableText,
	Spinner,
	NonIdealState,
	Button,
	Intent,
} from '@blueprintjs/core';
import {
	useGetOnMount,
	useDebouncedAsyncCallback,
	usePost,
} from '../../../hooks/useFetch';
import { useHotkey } from '../../../hooks/useHotkey';
import { useResizeObserver } from '../../../hooks/useResizeObserver';
import Title from '../../../title';
import { LocationPinBrush } from './LocationPinBrush';

import styles from './styles.less';
import { CustomToolbarContainer } from '../custom-toolbar/CustomToolbarContainer';
import { CustomBrushControls } from '../custom-toolbar/CustomBrushControls';
import { CustomCanvasControls } from '../custom-toolbar/CustomCanvasControls';
import { CustomStyleControls } from '../custom-toolbar/CustomStyleControls';
import { StampBrush } from './StampBrush';

export const SingleView = ({ campaignID, mapID, onBack }) => {
	const [ mapName, setMapName ] = useState('');
	const [ isUpdating, setIsUpdating ] = useState(false);
	const currentStampImage = useRef('https://res.cloudinary.com/josephdangerstewart/image/upload/v1593902211/campaign-buddy/map-maker/stamps/door-symbol.png');
	const { ref: mapContainerRef, width, height } = useResizeObserver();
	const post = usePost();
	const superCanvasRef = useRef(null);

	const undoLastAction = useCallback((e) => {
		e.preventDefault();
		if (superCanvasRef.current) {
			superCanvasRef.current.undo();
		}
	}, []);

	const redoLastAction = useCallback((e) => {
		e.preventDefault();
		if (superCanvasRef.current) {
			superCanvasRef.current.redo();
		}
	}, []);

	useHotkey('ctrl + z', undoLastAction);
	useHotkey('ctrl + y', redoLastAction);
	useHotkey('ctrl + shift + z', redoLastAction);

	const postDebounced = useDebouncedAsyncCallback(async (path, body) => {
		await post(path, body);
		setIsUpdating(false);
	}, 1000, [ post ]);

	const onInitialLoad = useCallback((data) => {
		setMapName(data.map.mapName);
	}, []);

	const {
		isLoading,
		data,
		error,
	} = useGetOnMount(`/api/campaigns/${campaignID}/maps/${mapID}`, onInitialLoad);

	const onMapNameChange = useCallback(async (mapName) => {
		setMapName(mapName);
		setIsUpdating(true);
		await postDebounced(`/api/campaigns/${campaignID}/maps/${mapID}`, { mapName });
	}, []);

	const onMapDataChange = useCallback(async (mapData) => {
		setIsUpdating(true);
		await postDebounced(`/api/campaigns/${campaignID}/maps/${mapID}`, { mapData });
	});

	const availableBrushes = useMemo(() => [
		new PolygonBrush(),
		new LocationPinBrush(),
		new StampBrush(() => currentStampImage.current),
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
						intent={Intent.PRIMARY}
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
					onChange={onMapNameChange}
					placeholder="Title..."
				/>
			</Title>
			<div className={styles.mapContainer} ref={mapContainerRef}>
				<SuperCanvas
					width={width}
					activeBackgroundElement={backgroundElement}
					height={height}
					availableBrushes={availableBrushes}
					onChange={onMapDataChange}
					initialValue={data.map.mapData}
					ref={superCanvasRef}
					toolbarComponents={{
						Toolbar: CustomToolbarContainer,
						BrushControls: CustomBrushControls,
						CanvasControls: CustomCanvasControls,
						StyleControls: CustomStyleControls,
					}}
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
