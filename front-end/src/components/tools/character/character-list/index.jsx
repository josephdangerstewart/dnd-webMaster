/**
 * @description In this component, users can see a list of available characters and navigate to one of 
 * those characters. They can also create new characters.
 * 
 * @author Joseph Stewart
 */

import React from 'react';
import PropTypes from 'prop-types';

import Title from '../../../title';
import List from '../../../list';

import styles from './styles.less';

import {
	Button,
	Icon,
	Popover,
	InputGroup,
	Keys,
	Spinner,
} from '@blueprintjs/core';

import { get, post, httpDelete } from 'Utility/fetch';
import classNames from 'Utility/classNames';
import { useFeature } from 'Utility/gtag';
import { displayError } from '../../../toast';

export default class CharacterList extends React.Component {
	static propTypes = {
		navigateToCharacter: PropTypes.func.isRequired,
		navigateToSettings: PropTypes.func.isRequired,
		campaignID: PropTypes.number.isRequired,
	}

	state = {
		newPCName: '',
		newNPCName: '',
		creatingPC: false,
		creatingNPC: false,
		characters: [],
	}

	cancelAsync = false;

	componentDidMount() {
		this.fetchCharacters();
	}

	componentWillUnmount() {
		this.cancelAsync = true;
	}

	fetchCharacters = async () => {
		const { campaignID } = this.props;
		const characters = await get(`/api/campaigns/${campaignID}/characters`);

		if (this.cancelAsync) return;
		
		this.setState({
			characters: characters.map(character => ({
				characterID: character.characterID,
				name: character.characterName,
				isNPC: character.isNPC,
			})),
		});
	}

	handleEnter = (name, isNPC) => event => {
		if (event.keyCode === Keys.ENTER) {
			this.handleNewCharacter(name, isNPC);
		}
	}

	handleNewCharacter = (characterName, isNPC) => {
		const { campaignID } = this.props;
		this.setState({
			[isNPC ? 'creatingNPC' : 'creatingPC']: true,
		}, async () => {
			await post(`/api/campaigns/${campaignID}/characters`, { characterName, isNPC });
			await this.fetchCharacters();
			useFeature('create_character', 'character');
			this.setState({
				[isNPC ? 'creatingNPC' : 'creatingPC']: false,
				[isNPC ? 'newNPCName' : 'newPCName']: '',
			});
		});
	}

	renderListItem = character => (
		<div className={styles.listItem}>
			<span>
				{character.name}
			</span>
			<div className={styles.spacer}></div>
			<Button
				className={styles.button}
				minimal
				small
				icon="trash"
				onClick={() => this.deleteCharacter(character.characterID, character.name)}
			/>
		</div>
	);

	deleteCharacter = async (characterID, name) => {
		const { campaignID } = this.props;

		try {
			const results = await httpDelete(`/api/campaigns/${campaignID}/characters/${characterID}`);
			useFeature('delete_character', 'character');
			if (results.deleted) {
				await this.fetchCharacters();
			}
		} catch (err) {
			displayError(`Could not delete ${name}`);
		}
	}
	
	render() {
		const {
			navigateToCharacter,
			navigateToSettings,
		} = this.props;

		const {
			newPCName,
			newNPCName,
			characters,
			creatingNPC,
			creatingPC,
		} = this.state;

		return (
			<div className={styles.root}>
				<Title
					fontSize={28}
					rightComponent={
						<Button
							minimal
							icon={
								<Icon
									icon="cog"
									className={styles.icon}
								/>
							}
							onClick={navigateToSettings}
							className={styles.button}
						/>
					}
					className={classNames(styles.title, styles.header)}
				>
					Characters
				</Title>
				<Title
					fontSize={20}
					rightComponent={
						<Popover popoverClassName={styles.popover}>
							<Button
								minimal
								icon="plus"
								className={styles.button}
							/>
							<div className={styles.popoverContent}>
								<p className={styles.popoverContentTitle}>Character&#39;s Name</p>
								<InputGroup
									autoFocus
									value={newPCName}
									onChange={event => this.setState({ newPCName: event.target.value })}
									rightElement={creatingPC ?
										<Spinner size={20}/>
										:
										<Button
											minimal
											icon="tick"
											onClick={() => this.handleNewCharacter(newPCName, false)}
										/>
									}
									onKeyDown={this.handleEnter(newPCName, false)}
								/>
							</div>
						</Popover>
					}
					className={styles.title}
				>
					PCs
				</Title>
				<List
					items={characters.filter(character => !character.isNPC)}
					className={styles.list}
					onItemSelected={navigateToCharacter}
					renderItem={this.renderListItem}
				/>

				<Title
					fontSize={20}
					rightComponent={
						<Popover popoverClassName={styles.popover}>
							<Button
								minimal
								icon="plus"
								className={styles.button}
							/>
							<div className={styles.popoverContent}>
								<p className={styles.popoverContentTitle}>NPC&#39;s Name</p>
								<InputGroup
									autoFocus
									value={newNPCName}
									onChange={event => this.setState({ newNPCName: event.target.value })}
									rightElement={creatingNPC ?
										<Spinner size={20} />
										:
										<Button
											minimal
											icon="tick"
											onClick={() => this.handleNewCharacter(newNPCName, true)}
										/>
									}
									onKeyDown={this.handleEnter(newNPCName, true)}
								/>
							</div>
						</Popover>
					}
					className={styles.title}
				>
					NPCs
				</Title>
				<List
					items={characters.filter(character => character.isNPC)}
					className={styles.list}
					onItemSelected={navigateToCharacter}
					renderItem={this.renderListItem}
				/>
			</div>
		);
	}
}