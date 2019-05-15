import Fuse from 'fuse.js';
import {
	promiseQuery,
} from '../utility';

export const search = ({
	tableName,
	nameColumn,
	idColumn,
	joins, // Optional
	fieldNameMap, // Optional
}) => async (path, queryString, user, connection) => {
	const {
		query,
		filter,
		fields,
		id,
	} = queryString;

	// Default count to 10 if it is not provided, if it is not a number then don't include a limit
	let { count } = queryString;
	if (!count) {
		count = '10';
	}
	let countSegment = '';
	if (count && !isNaN(count)) {
		countSegment = 'LIMIT :count';
	}

	// Don't include a query condition in the where clause if there is no query provided (i.e. return all)
	let whereSegment = [];
	if (query) {
		whereSegment.push(`${nameColumn} LIKE :query`);
	}

	// Add any filters to the where clause and create an insert object to protect against sql injection
	const sqlFilterObject = {};

	if (filter) {
		filter.split(',').forEach(
			(filterItem, index) => {
				const parts = filterItem.split(':');
				if (parts.length === 2) {
					whereSegment.push(`:(filterID${index}) LIKE :filterValue${index}`);
					sqlFilterObject[`filterID${index}`] = parts[0];
					sqlFilterObject[`filterValue${index}`] = `%${parts[1]}%`;
				}
			}
		);
	}

	// If we want a specific id let's get it
	if (id) {
		whereSegment = [ `${idColumn} = :id` ];
	}

	// If additional fields are required create an array to include in the query
	let fieldsArray = [];
	const customFields = [];
	if (fields) {
		fieldsArray =
			fields
				.split(',')
				.map(field => {
					if (fieldNameMap && fieldNameMap[field]) {
						customFields.push(fieldNameMap[field]);
						return null;
					}
					return field;
				})
				.filter(field => field);
	}

	// Now we actually execute the query
	const results = await promiseQuery(
		connection,
		`
			SELECT * FROM (
				SELECT
					${idColumn},
					${nameColumn}
					${fieldsArray.length > 0 ? ', :(fieldsArray)' : ''}
					${customFields.length > 0 ? `, ${customFields.join(',')}` : ''}
				FROM
					${tableName}
					${joins ? joins.join(' ') : ''}
			) T
			${whereSegment.length > 0 ? `WHERE ${whereSegment.join(' AND ')}` : ''}
			ORDER BY ${nameColumn}
			${countSegment}
		`,
		{
			query: `%${query}%`,
			...sqlFilterObject,
			count: parseInt(count),
			fieldsArray,
			id,
		}
	);

	return results;
};

export const globalSearch = async (path, queryString, user, connection) => {
	const {
		query,
	} = queryString;
	const { campaignID } = path;

	// Define a default limit of 10 if one is not provided
	let { count } = queryString;
	if (!count) {
		count = 10;
	}

	// Define the segment of the query that limits the results
	let countSegment = '';
	if (count && !isNaN(count)) {
		countSegment = 'LIMIT :count';
	}

	// Define one object for SQL variables for convenience
	const variables = {
		query: `%${query}%`,
		count,
		campaignID,
	};

	const promises = [];

	// Search spells
	promises[0] = promiseQuery(
		connection,
		`
			SELECT 
				spellName AS name,
				spellID AS id,
				'spell' AS type
			FROM spell
			WHERE spellName LIKE :query OR spellDesc LIKE :query
			${countSegment}
		`,
		variables
	);

	// Search equipment
	promises[1] = promiseQuery(
		connection,
		`
			SELECT
				equipmentName AS name,
				equipmentID AS id,
				'equipment' AS type
			FROM equipment
			WHERE equipmentName LIKE :query
			${countSegment}
		`,
		variables
	);

	// Search class features
	promises[2] = promiseQuery(
		connection,
		`
			SELECT
				featName AS name,
				featID AS id,
				'feat' AS type
			FROM feat
			WHERE featName LIKE :query
			${countSegment}
		`,
		variables
	);

	// Search characters
	promises[3] = promiseQuery(
		connection,
		`
			SELECT
				characterName AS name,
				\`character\`.characterID AS id,
				'character' AS type
			FROM
				\`character\`
				JOIN characterlist
					ON \`character\`.characterID = characterlist.characterID
			WHERE
				characterName LIKE :query
				AND
				characterlist.campaignID = :campaignID
			${countSegment}
		`,
		variables
	);

	// Search notes
	promises[4] = promiseQuery(
		connection,
		`
			SELECT
				noteTitle AS name,
				noteID AS id,
				'note' AS type,
				noteContent AS other
			FROM note
			WHERE
				(noteTitle LIKE :query OR noteContent LIKE :query)
				AND
				campaignID = :campaignID
			${countSegment}
		`,
		variables
	);

	// Search note folders
	promises[5] = promiseQuery(
		connection,
		`
			SELECT
				folderName AS name,
				noteFolderID AS id,
				'folder' AS type
			FROM notefolder
			WHERE
				folderName LIKE :query
				AND
				campaignID = :campaignID
			${countSegment}
		`,
		variables
	);

	// Resolve all of the promises and flatten the array
	const promiseResolution = (await Promise.all(promises)).flat();

	// Do fuzy search
	const options = {
		shouldSort: true,
		threshold: 0.6,
		location: 0,
		distance: 100,
		maxPatternLength: 32,
		minMatchCharLength: 1,
		keys: [
			'name',
			'other',
		],
	};

	const fuse = new Fuse(promiseResolution, options);

	return fuse.search(query).filter((value, index) => index < count);
};
