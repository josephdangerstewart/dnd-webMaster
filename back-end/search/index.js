import {
	asRouteFunction,
} from '../utility';

import * as searchController from './SearchController';
import { userCanAccessCampaign } from '../campaigns/CampaignsController';

export default app => {
	app.route('/api/search/spells')
		.get(asRouteFunction(
			searchController.search({
				tableName: 'spell',
				nameColumn: 'spellName',
				idColumn: 'spellID',
				joins: [
					'JOIN spellschool ON spellschool.schoolID = spell.schoolID',
				],
				fieldNameMap: {
					'klasses': `(
						SELECT GROUP_CONCAT(klassName SEPARATOR ', ')
						FROM klass
						WHERE klassID IN (
							SELECT klassID
							FROM spellklasslist
							WHERE spellklasslist.spellID = spell.spellID
						)
					) AS klasses`,
				},
			}),
			true
		));
	
	app.route('/api/search/proficiencies')
		.get(asRouteFunction(
			searchController.search({
				tableName: 'proficiency',
				nameColumn: 'proficiencyName',
				idColumn: 'proficiencyID',
			}),
			true
		));

	app.route('/api/search/klasses')
		.get(asRouteFunction(
			searchController.search({
				tableName: 'klass',
				nameColumn: 'klassName',
				idColumn: 'klassID',
			}),
			true
		));

	app.route('/api/search/races')
		.get(asRouteFunction(
			searchController.search({
				tableName: 'race',
				nameColumn: 'raceName',
				idColumn: 'raceID',
			}),
			true
		));
	
	app.route('/api/search/equipment')
		.get(asRouteFunction(
			searchController.search({
				tableName: 'equipment',
				idColumn: 'equipmentID',
				nameColumn: 'equipmentName',
			}),
			true
		));

	app.route('/api/search/feats')
		.get(asRouteFunction(
			searchController.search({
				tableName: 'feat',
				idColumn: 'featID',
				nameColumn: 'featName',
				fieldNameMap: {
					'klassName': `(
						SELECT GROUP_CONCAT(klassName SEPARATOR ', ') FROM klass WHERE klass.klassID IN (
							SELECT klassID FROM featklasslist WHERE featklasslist.featID = feat.featID
						)
					) AS klassName`,
				},
			}),
			true
		));
	
	app.route('/api/search/global/:campaignID')
		.get(
			userCanAccessCampaign,
			asRouteFunction(
				searchController.globalSearch,
				true
			)
		);
};