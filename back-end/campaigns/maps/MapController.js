import { promiseQuery } from '../../utility';

/**
 * @description Creates an empty map
 */
export const createMap = async (path, query, user, connection, body) => {
	const { campaignID } = path;
	const {
		mapName,
	} = body;

	const results = await promiseQuery(
		connection,
		`INSERT INTO map
			(campaignID, mapName, mapData)
		VALUES
			(:campaignID, :mapName, '')`,
		{ campaignID, mapName }
	);

	return {
		mapID: results.insertId,
	};
};

/**
 * @description Updates a map with title or map data or both
 */
export const updateMap = async (path, query, user, connection, body) => {
	const { mapID, campaignID } = path;
	const {
		mapName,
		mapData,
	} = body;

	const results = await promiseQuery(
		connection,
		`UPDATE map
		SET
			mapName = :mapName,
			mapData = :mapData
		WHERE
			mapID = :mapID AND
			campaignID = :campaignID`,
		{ mapID, mapName, mapData, campaignID }
	);

	return {
		changed: results.changedRows > 0,
	};
};

/**
 * @description Lists all available maps
 */
export const listMaps = async (path, query, user, connection) => {
	const { campaignID } = path;
	
	const maps = await promiseQuery(
		connection,
		'SELECT mapName, mapID FROM map WHERE campaignID = :campaignID',
		{ campaignID }
	);

	return { maps };
};

/**
 * @description Gets a single map
 */
export const getMap = async (path, query, user, connection) => {
	const { mapID, campaignID } = path;

	const maps = await promiseQuery(
		connection,
		'SELECT mapName, mapID FROM map WHERE mapID = :mapID AND campaignID = :campaignID',
		{ mapID, campaignID },
	);

	if (maps[0]) {
		return { map: maps[0] };
	}
	return null;
};
