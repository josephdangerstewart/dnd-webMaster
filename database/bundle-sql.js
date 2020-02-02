// Declare the order in which SQL files are to be bundled
const order = [
	'loadMaster.sql',
	'generate-scripts/output/insert-abilityscore.sql',
	'generate-scripts/output/insert-damagetype.sql',
	'generate-scripts/output/insert-equipment.sql',
	'generate-scripts/output/insert-feat.sql',
	'generate-scripts/output/insert-klass.sql',
	'generate-scripts/output/insert-featklasslist.sql',
	'generate-scripts/output/insert-proficiency.sql',
	'generate-scripts/output/insert-race.sql',
	'generate-scripts/output/insert-spellschool.sql',
	'generate-scripts/output/insert-skill.sql',
	'generate-scripts/output/insert-spell.sql',
	'generate-scripts/output/insert-spellklasslist.sql',
	'generate-scripts/output/insert-weaponproperty.sql',
	'plugins/levenshtein.sql',
	'change-scripts/add-character-is-deleted-bit.sql',
	'change-scripts/create-maps-table.sql',
];

const fs = require('fs');
const path = require('path');
let resultContents = '';

order.forEach((filePath, index) => {
	const fileContents = fs.readFileSync(path.resolve(`${__dirname}/${filePath}`));
	resultContents += `${fileContents}${index === 0 ? '' : ';'}\n\n`;
});

fs.writeFileSync(`${__dirname}/bundle.sql`, resultContents);

const testDatabaseScript = resultContents.replace(/dungeonbuddiesdb/gi, 'dndcampa_test').replace(
	/`dndcampa_test`.`([A-Z][^`]+)`/gi,
	(text, tableName) => `\`dndcampa_test\`.\`${tableName.toLowerCase()}\``
);

fs.writeFileSync(`${__dirname}/test.bundle.sql`, testDatabaseScript);

const prodDatabaseScript = testDatabaseScript.replace(/dndcampa_test/gi, 'dndcampa_prod');

fs.writeFileSync(`${__dirname}/prod.bundle.sql`, prodDatabaseScript);
