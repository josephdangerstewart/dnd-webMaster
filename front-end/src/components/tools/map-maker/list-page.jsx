import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Spinner, NonIdealState, Button, Intent } from '@blueprintjs/core';
import { useGetOnMount } from '../../hooks/useFetch';
import List from '../../list';
import Title from '../../title';

export const ListPage = ({ campaignID, closePane }) => {
	const {
		data,
		isLoading,
		error,
	} = useGetOnMount(`/api/campaigns/${campaignID}/maps`);

	const renderItem = useCallback((item) => (
		<span>{item.mapName}</span>
	), []);

	if (isLoading) {
		return <Spinner />;
	}

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
			<Title>Maps</Title>
			<List
				items={data.maps}
				renderItem={renderItem}
			/>
		</div>
	);
};

ListPage.propTypes = {
	closePane: PropTypes.func.isRequired,
	campaignID: PropTypes.string,
};
