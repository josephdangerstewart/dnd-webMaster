import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import {
	Spinner,
	NonIdealState,
	Button,
	Intent,
} from '@blueprintjs/core';
import { useGetOnMount, usePost } from '../../../hooks/useFetch';
import List from '../../../list';
import Title from '../../../title';
import { CreateResourceButton } from '../../../create-resource-button';

import styles from './styles.less';

export const ListPage = ({ campaignID, closePane, onMapSelected }) => {
	const {
		data,
		isLoading,
		error,
		reload,
	} = useGetOnMount(`/api/campaigns/${campaignID}/maps`);
	const post = usePost();

	const [ isCreatingMap, setIsCreatingMap ] = useState(false);

	const renderItem = useCallback((item) => (
		<span>{item.mapName}</span>
	), []);

	const handleItemSelected = useCallback((map) => {
		onMapSelected(map.mapID);
	}, [ onMapSelected ]);

	const createMap = useCallback(async (mapName) => {
		setIsCreatingMap(true);
		await post(`/api/campaigns/${campaignID}/maps`, { mapName });
		setIsCreatingMap(false);
		await reload();
	}, [ post, campaignID, reload ]);

	if (error) {
		return (
			<NonIdealState
				title="Uh oh"
				description="There was an error loading your maps, sorry"
				icon="error"
				action={
					<Button
						text="Close tab"
						onClick={closePane}
						intent={Intent.PRIMARY}
					/>
				}
			/>
		);
	}

	return (
		<div>
			<Title
				fontSize={25}
				rightComponent={
					<CreateResourceButton
						onCreate={createMap}
						resourceLabel="Map name"
						isLoading={isCreatingMap}
						buttonClassName={styles.button}
					/>
				}
			>
				Maps
			</Title>
			{isLoading ?
				<Spinner />
				:
				<List
					items={data.maps}
					renderItem={renderItem}
					onItemSelected={handleItemSelected}
				/>
			}
		</div>
	);
};

ListPage.propTypes = {
	closePane: PropTypes.func.isRequired,
	onMapSelected: PropTypes.func.isRequired,
	campaignID: PropTypes.string,
};
