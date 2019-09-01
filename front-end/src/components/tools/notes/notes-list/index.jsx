import React from 'react';
import PropTypes from 'prop-types';

import {
	Button,
	Spinner,
} from '@blueprintjs/core';

import Title from '../../../title';
import List from '../../../list';
import FolderNameModal from '../folder-name-modal';
import FolderListItem from '../folder-list-item';
import NoteListItem from '../note-list-item';
import FolderBackButton from '../folder-back-button';

import { get, post, httpDelete } from 'Utility/fetch';
import classNames from 'Utility/classNames';
import { useFeature } from 'Utility/gtag';
import { displayError } from '../../../toast';

import styles from './styles.less';

export default class NotesList extends React.Component {
	static propTypes = {
		campaignID: PropTypes.number.isRequired,
		openNote: PropTypes.func.isRequired,
		currentFolder: PropTypes.object.isRequired,
		navigateToFolderID: PropTypes.func.isRequired,
	}

	state = {
		results: [],
		loading: true,
		creatingNote: false,
		creatingFolder: false,
		nameFolderModalOpen: false,
		renameFolderModalOpen: false,
		renameFolderID: 0,
	}

	componentDidMount() {
		this.loadNotes();
	}

	componentDidUpdate(prevProps) {
		const { currentFolder } = this.props;
		const { currentFolder: oldFolder } = prevProps;

		if (currentFolder.noteFolderID !== oldFolder.noteFolderID)
			this.loadNotes();
	}

	loadNotes = async () => {
		try {
			const { campaignID, currentFolder } = this.props;

			const apiResponse = await get(
				`/api/campaigns/${campaignID}/notes${
					currentFolder.noteFolderID ?
						`?folderID=${currentFolder.noteFolderID}`
						: ''
				}`);

			const results = [
				...apiResponse.folders.map(folder => ({ ...folder, name: folder.folderName, type: 'folder' })),
				...apiResponse.notes.map(note => ({ ...note, name: note.noteTitle, type: 'note' })),
			];

			this.setState({
				results,
				loading: false,
			});
		} catch (err) {
			displayError('There was an error retrieving your notes!');
		}
	}

	handleNewNote = () => {
		this.setState({
			creatingNote: true,
		}, async () => {
			try {
				const { campaignID, currentFolder } = this.props;

				await post(`/api/campaigns/${campaignID}/notes`, { folderID: currentFolder.noteFolderID });
				useFeature('create_note', 'notes');
				this.setState({
					creatingNote: false,
				}, this.loadNotes);
			} catch (err) {
				displayError('There was an error creating the note');
			}
		});
	}

	handleBack = () => {
		const { currentFolder, navigateToFolderID } = this.props;
		navigateToFolderID(currentFolder.parentID, true);
	}

	handleNewFolder = title => {
		this.setState({
			creatingFolder: true,
			nameFolderModalOpen: false,
		}, async () => {
			try {
				const { campaignID, currentFolder } = this.props;

				await post(`/api/campaigns/${campaignID}/notes/folders`, { parentID: currentFolder.noteFolderID, title });
				useFeature('create_folder');
				this.setState({
					creatingFolder: false,
				}, this.loadNotes);
			} catch (err) {
				displayError('There was an error creating the folder');
			}
		});
	}

	moveIntoFolder = async (dest, body) => {
		try {
			const { campaignID } = this.props;
			await post(`/api/campaigns/${campaignID}/notes/folders/move-into/${dest}`, body);
			useFeature('move_into_folder', 'notes');
			this.loadNotes();
		} catch (err) {
			displayError('Could not move item');
		}
	}

	moveUpOneDirectory = async body => {
		const { currentFolder } = this.props;

		try {
			const { campaignID } = this.props;
			await post(`/api/campaigns/${campaignID}/notes/folders/move-into/${currentFolder.parentID || '0'}`, body);
			this.loadNotes();
		} catch (err) {
			displayError('Could not move item');
		}
	}

	renderListItem = item => {
		if (item.type === 'note') {
			return (
				<NoteListItem
					noteID={item.noteID}
					onDelete={event => {
						event.stopPropagation();
						this.deleteNote(item.noteID);
					}}
					noteName={item.name}
				/>
			);	
		} else {
			return (
				<FolderListItem
					folderName={item.name}
					moveIntoFolder={this.moveIntoFolder}
					onDelete={event => {
						event.stopPropagation();
						this.deleteFolder(item.noteFolderID);
					}}
					onEdit={event => {
						event.stopPropagation();
						this.setState({
							renameFolderModalOpen: true,
							renameFolderID: item.noteFolderID,
						});
					}}
					folderID={item.noteFolderID}
				/>
			);
		}
	}

	handleItemClick = item => {
		const { openNote, navigateToFolderID } = this.props;

		if (item.type === 'note') {
			openNote(item.noteID);
		} else {
			navigateToFolderID(item.noteFolderID, true);
		}
	}

	deleteNote = async noteID => {
		try {
			const { campaignID } = this.props;
			await httpDelete(`/api/campaigns/${campaignID}/notes/${noteID}`);
			useFeature('delete_note', 'notes');
			this.loadNotes();
		} catch (err) {
			displayError('Could not delete note');
		}
	}

	deleteFolder = async folderID => {
		try {
			const { campaignID } = this.props;
			await httpDelete(`/api/campaigns/${campaignID}/notes/folders/${folderID}`);
			useFeature('delete_folder', 'notes');
			this.loadNotes();
		} catch (err) {
			displayError('Could not delete folder');
		}
	}

	renameFolder = async title => {
		try {
			const { campaignID } = this.props;
			const { renameFolderID } = this.state;
			await post(`/api/campaigns/${campaignID}/notes/folders/rename/${renameFolderID}`, { title });
			this.setState({
				renameFolderID: 0,
				renameFolderModalOpen: false,
			}, this.loadNotes);
		} catch (err) {
			displayError('Could not rename folder');
		}
	}

	render() {
		const { currentFolder } = this.props;

		const {
			results,
			loading,
			creatingNote,
			creatingFolder,
			nameFolderModalOpen,
			renameFolderModalOpen,
		} = this.state;

		if (loading) {
			return (
				<Spinner size={30} />
			);
		}

		return (
			<div className={styles.root}>
				<Title
					fontSize={25}
					rightComponent={
						<div className={styles.buttonContainer}>
							<Button
								minimal
								icon="plus"
								className={styles.button}
								loading={creatingNote}
								onClick={this.handleNewNote}
							/>
							<Button
								minimal
								icon="folder-new"
								className={styles.button}
								loading={creatingFolder}
								onClick={() => this.setState({ nameFolderModalOpen: true })}
							/>
						</div>
					}
					leftComponent={
						currentFolder.noteFolderID ?
							<FolderBackButton
								className={classNames(styles.button, styles.left)}
								onBack={this.handleBack}
								moveIntoFolder={this.moveUpOneDirectory}
							/>
							:
							undefined
					}
				>
					{currentFolder.noteFolderID ? currentFolder.folderName : 'Notes'}
				</Title>
				<List
					items={results}
					renderItem={this.renderListItem}
					onItemSelected={this.handleItemClick}
				/>
				<FolderNameModal
					open={nameFolderModalOpen}
					onSubmit={this.handleNewFolder}
					onCancel={() => this.setState({ nameFolderModalOpen: false })}
				/>
				<FolderNameModal
					open={renameFolderModalOpen}
					onSubmit={this.renameFolder}
					onCancel={() => this.setState({ renameFolderModalOpen: false })}
				/>
			</div>
		);
	}
}
