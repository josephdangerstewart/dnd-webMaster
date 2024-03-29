import React from 'react';
import PropTypes from 'prop-types';

import CollapsibleSection from '../../../collapsible-section';
import HeaderRow from '../header-row';
import Proficiencies from '../proficiencies';
import Spells from '../spells';
import Equipment from '../equipment';
import Appearance from '../appearance';
import Backstory from '../backstory';
import KlassFeatures from '../klass-features';

import styles from './styles.less';

export default class CharacterDisplay extends React.Component {
	static propTypes = {
		navigateBack: PropTypes.func.isRequired,
		character: PropTypes.object.isRequired,
		onPropertyChanged: PropTypes.func.isRequired,
		navigateToSettings: PropTypes.func.isRequired,
		mediaQuery: PropTypes.func.isRequired,

		sections: PropTypes.object.isRequired,
		sortings: PropTypes.object.isRequired,
		searches: PropTypes.object.isRequired,
		
		handleSectionExpandedChange: PropTypes.func.isRequired,
		handleSortingChange: PropTypes.func.isRequired,
		handleSearchChange: PropTypes.func.isRequired,
		setTabName: PropTypes.func.isRequired,

		toolSettings: PropTypes.object.isRequired,
	}

	handleProficiencyRemove = prof => {
		const {
			character,
			onPropertyChanged,
		} = this.props;

		onPropertyChanged('proficiencies')(
			character.proficiencies
				.filter(item => item.proficiencyID !== prof.proficiencyID)
				.map(item => item.proficiencyID)
		);
	}

	handleProficiencyNew = prof => {
		const {
			character,
			onPropertyChanged,
		} = this.props;

		onPropertyChanged('proficiencies')([
			...character.proficiencies.map(item => item.proficiencyID),
			prof.proficiencyID,
		]);
	}

	// renders a given section
	renderSection = section => {
		const {
			character,
			onPropertyChanged,
			mediaQuery,
			sections,
			handleSectionExpandedChange,
			sortings,
			searches,
			handleSearchChange,
			handleSortingChange,
		} = this.props;

		switch (section) {
		case 'proficiencies':
			return (
				<CollapsibleSection
					title="Proficiencies"
					expanded={sections.proficiencies}
					changeExpanded={handleSectionExpandedChange('proficiencies')}
					className={styles.section}
					key={section}
				>
					<Proficiencies
						proficiencies={character.proficiencies || []}
						onRemove={this.handleProficiencyRemove}
						onNew={this.handleProficiencyNew}
					/>
				</CollapsibleSection>
			);
		case 'classInfo':
			return (
				<CollapsibleSection
					title="Class Features"
					expanded={sections.classInfo}
					changeExpanded={handleSectionExpandedChange('classInfo')}
					className={styles.section}
					key={section}
				>
					<KlassFeatures
						features={character.klassFeatures || []}
						sortingColumn={sortings.klassFeatures.column}
						sortingDirection={sortings.klassFeatures.direction}
						handleSortingChange={handleSortingChange('klassFeatures')}
						search={searches.klassFeatures}
						onSearchChange={handleSearchChange('klassFeatures')}
					/>
				</CollapsibleSection>
			);
		case 'spells':
			return (
				<CollapsibleSection
					title="Spells"
					expanded={sections.spells}
					changeExpanded={handleSectionExpandedChange('spells')}
					className={styles.section}
					key={section}
				>
					<Spells
						spells={character.spells || []}
						sortingColumn={sortings.spells.column}
						sortingDirection={sortings.spells.direction}
						handleSortingChange={handleSortingChange('spells')}
						onPropertyChanged={onPropertyChanged}
						search={searches.spells}
						onSearchChange={handleSearchChange('spells')}
					/>
				</CollapsibleSection>
			);
		case 'equipment':
			return (
				<CollapsibleSection
					title="Equipment"
					expanded={sections.equipment}
					changeExpanded={handleSectionExpandedChange('equipment')}
					className={styles.section}
					key={section}
				>
					<Equipment
						equipment={character.equipment || []}
						sortingColumn={sortings.equipment.column}
						sortingDirection={sortings.equipment.direction}
						handleSortingChange={handleSortingChange('equipment')}
						onPropertyChanged={onPropertyChanged}
						onSearchChange={handleSearchChange('equipment')}
						search={searches.equipment}
					/>
				</CollapsibleSection>
			);
		case 'appearance':
			return (
				<CollapsibleSection
					title="Appearance"
					expanded={sections.appearance}
					changeExpanded={handleSectionExpandedChange('appearance')}
					className={styles.section}
					key={section}
				>
					<Appearance
						imageUrl={character.avatarURL}
						onPropertyChanged={onPropertyChanged}
						age={character.age}
						skinDesc={character.skinDesc}
						hairDesc={character.hairDesc}
						weight={character.weight}
						height={character.height}
						mediaQuery={mediaQuery}
						description={character.characterDesc}
					/>
				</CollapsibleSection>
			);
		case 'backstory':
			return (
				<CollapsibleSection
					title="Backstory/Other Notes"
					expanded={sections.backstory}
					changeExpanded={handleSectionExpandedChange('backstory')}
					className={styles.section}
					key={section}
				>
					<Backstory
						value={character.backstory}
						onPropertyChanged={onPropertyChanged}
					/>
				</CollapsibleSection>
			);
		}
	}

	renderAllSections = () => {
		const { toolSettings } = this.props;

		// Returns an array of all visible sections in the correct order
		return toolSettings
			.orderings
			.map(
				config => config.visible ? this.renderSection(config.name) : null
			)
			.filter(item => item);
	}
	
	render() {
		const {
			navigateBack,
			character,
			onPropertyChanged,
			mediaQuery,
			navigateToSettings,
			setTabName,
		} = this.props;

		return (
			<div className={styles.root}>
				<HeaderRow
					navigateBack={navigateBack}
					navigateToSettings={navigateToSettings}
					name={character.characterName}
					level={character.level}
					className={character.klassName}
					race={character.raceName}
					stats={{
						con: character.constitution,
						dex: character.dexterity,
						int: character.intelligence,
						wis: character.wisdom,
						cha: character.charism,
						str: character.strength,
					}}
					ac={character.ac}
					hp={character.hp}
					maxHp={character.maxHp}
					speed={character.raceSpeed}
					onPropertyChanged={onPropertyChanged}
					mediaQuery={mediaQuery}
					setTabName={setTabName}
				/>
				{this.renderAllSections()}
			</div>
		);
	}
}