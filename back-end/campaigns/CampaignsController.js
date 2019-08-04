import {
	promiseQuery,
	getSQLConnection,
	unauthorizedError,
	uploadImage,
	ServerError,
	ERROR_CODES,
} from '../utility';

/**
 * @description This is a piece of express middleware that checks if a user has
 * access to the given campaign, if they do have access, the request continues as
 * normal, if not, the request returns a non-authorized http error code
 */
export const userCanAccessCampaign = async (request, response, next) => {
	const { user, params } = request;

	const connection = await getSQLConnection();
	const campaign = await checkIfCampaignExists(params, null, user, connection);
	connection.release();

	if (campaign.exists) {
		return next();
	}
	return unauthorizedError(response, 'You do not have access to this campaign');
};

/**
 * @description Returns an array of all the campaigns associated with the user
 */
export const getAllCampaigns = async (path, query, user, connection) => {
	const { id } = user;
	const results = await promiseQuery(
		connection,
		`
			SELECT 
				campaign.campaignID,
				campaignTitle
			FROM
				campaignlist JOIN
				campaign ON campaign.campaignID = campaignlist.campaignID
			WHERE
				campaignlist.dmID = :id
		`,
		{ id }
	);
	return results;
};

/**
 * @description Creates a new campaign in the database
 */
export const createNewCampaign = async (path, query, user, connection, body) => {
	const { id } = user;
	const { campaignTitle } = body;
	const campaignResults = await promiseQuery(
		connection,
		`
			INSERT INTO campaign
				(campaignTitle, campaignDesc, settingData)
			VALUES
				(:campaignTitle, '', '{}')
		`,
		{
			campaignTitle,
		}
	);
	await promiseQuery(
		connection,
		`
			INSERT INTO campaignlist
				(campaignID, dmID)
			VALUES
				(:campaignID, :id)
		`,
		{
			id,
			campaignID: campaignResults.insertId,
		}
	);
	return {
		campaignID: campaignResults.insertId,
	};
};

/**
 * @description Updates campaign information and uploads a new profile picture if necessary
 */
export const updateCampaignDetails = async (path, query, user, connection, body, files, file) => {
	const {
		campaignTitle,
	} = body;
	let {
		imageUrl,
	} = body;
	const {
		campaignID,
	} = path;

	if (!imageUrl && file) {
		try {
			imageUrl = await uploadImage(file);
		} catch (e) {
			return new ServerError(ERROR_CODES.INTERNAL_SERVER_ERROR, 'Could not upload image for campaign icon');
		}
	}

	const updateStatement = [
		imageUrl ? 'imageUrl = :imageUrl' : null,
		campaignTitle ? 'campaignTitle = :campaignTitle' : null,
	].filter(str => str).join(',');

	const results = await promiseQuery(
		connection,
		`
			UPDATE campaigns
			SET
				${updateStatement}
			WHERE
				campaignID = :campaignID
		`,
		{ campaignTitle, campaignID, imageUrl }
	);

	return {
		changed: results.changedRows > 0,
	};
};

/**
 * @description Finds if a specific campaign exists in the database returns
 * the result as a boolean in the return JSON by the property "exists"
 */
export const checkIfCampaignExists = async (path, query, user, connection) => {
	const { campaignID } = path;
	const { id } = user;

	const result = await promiseQuery(
		connection,
		`
		SELECT 
			COUNT(campaign.campaignID) as result
		FROM
			campaignlist
				JOIN
			campaign ON campaignlist.campaignID = campaign.campaignID
		WHERE
			campaignlist.dmID = :id
			AND campaign.campaignID = :campaignID
		`,
		{ campaignID, id }
	);

	return {
		exists: result[0].result > 0,
	};
};

/**
 * @description Returns tool settings for a specific tool associated with a campaign
 */
export const getToolSettings = async (path, query, user, connection) => {
	const { campaignID, tool } = path;

	const result = await promiseQuery(
		connection,
		`
			SELECT
				settingData
			FROM
				campaign
			WHERE
				campaignID = :campaignID
		`,
		{ campaignID }
	);

	const allToolResults = JSON.parse(result[0].settingData);

	if (allToolResults[tool]) {
		return allToolResults[tool];
	} else {
		return {};
	}
};

/**
 * @description Updates the settings for a specific tool
 */
export const updateToolSettings = async (path, query, user, connection, body) => {
	const { campaignID, tool } = path;
	const { value } = body;

	const settingDataResults = await promiseQuery(
		connection,
		`
			SELECT settingData
			FROM campaign
			WHERE campaignID = :campaignID
		`,
		{ campaignID }
	);

	const settingData = JSON.parse(settingDataResults[0].settingData);

	settingData[tool] = value;

	const result = await promiseQuery(
		connection,
		`
			UPDATE
				campaign
			SET
				settingData = :settingData
			WHERE
				campaignID = :campaignID
		`,
		{ campaignID, settingData: JSON.stringify(settingData) }
	);

	return {
		updated: result.changedRows > 0,
	};
};

/**
 * @description Get UI saved layout configurations
 */
export const getSavedLayouts = async (path, query, user, connection) => {
	const { campaignID } = path;

	const results = await promiseQuery(
		connection,
		`
			SELECT layoutData
			FROM campaign
			WHERE campaignID = :campaignID
		`,
		{ campaignID }
	);

	return JSON.parse(results[0].layoutData) || [];
};

/**
 * @description Set the saved layout configurations
 */
export const saveLayoutConfiguration = async (path, query, user, connection, body) => {
	const { campaignID } = path;
	const { layoutData } = body;

	const results = await promiseQuery(
		connection,
		`
			UPDATE campaign
			SET layoutData = :layoutData
			WHERE campaignID = :campaignID
		`,
		{ campaignID, layoutData: JSON.stringify(layoutData) }
	);

	return {
		saved: results.changedRows > 0,
	};
};
