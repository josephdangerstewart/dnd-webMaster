import React from 'react';
import ToolBase from '../ToolBase';

import NotesList from './notes-list';
import NoteEditor from './note-editor';

import { get, post } from 'Utility/fetch';
import { useFeature } from 'Utility/gtag';
import debounce from 'Utility/debounce';
import { displayError } from '../../toast';

export default class NotesTool extends ToolBase {
	state = {
		view: 'list',
		note: {
			noteContent: '',
			noteTitle: '',
		},
		noteID: 0,
		savingNote: false,
	}

	componentDidUpdate = () => {
		const { defaultNoteID } = this.state;

		if (defaultNoteID || defaultNoteID === 0) {
			this.setState({
				noteID: defaultNoteID,
				defaultFolderID: null,
				defaultNoteID: null,
			}, this.loadNote);
		}
	}

	loadNote = async () => {
		try {
			const { campaignID } = this.props;
			const { noteID } = this.state;
			const note = await get(`/api/campaigns/${campaignID}/notes/${noteID}`);

			useFeature('open_note', 'notes');

			this.setState({
				note,
				view: 'editor',
			}, () => {
				this.setTabName(note.noteTitle || 'Notes');
			});
		} catch (err) {
			displayError('There was an error loading your note!');
		}
	}

	onBack = () => {
		this.setState({
			view: 'list',
		}, () => {
			this.setTabName('Notes');
		});
	}

	onPropertyChanged = property => value => {
		this.setState(({ note }) => ({
			note: {
				...note,
				[property]: value,
			},
			savingNote: true,
		}), () => {
			if (property === 'noteTitle') {
				const { note: { noteTitle } } = this.state;
				this.postTitle();
				this.setTabName(noteTitle || 'Notes');
			} else if (property === 'noteContent') {
				this.postNoteContent();
			}
		});
	}

	setTabName = debounce(
		tabName => {
			const { setTabName } = this.props;
			setTabName(tabName);
		},
		250
	)

	postTitle = debounce(
		async () => {
			const { note, noteID } = this.state;
			const { campaignID } = this.props;
			try {
				await post(`/api/campaigns/${campaignID}/notes/${noteID}`, {
					field: 'noteTitle',
					value: note.noteTitle,
				});
				this.setState({ savingNote: false });
			} catch (err) {
				displayError('There was an error saving the note title');
			}
		},
		250,
	)

	postNoteContent = debounce(
		async () => {
			const { note, noteID } = this.state;
			const { campaignID } = this.props;
			try {
				await post(`/api/campaigns/${campaignID}/notes/${noteID}`, {
					field: 'noteContent',
					value: note.noteContent,
				});
				this.setState({ savingNote: false });
			} catch (err) {
				displayError('There was an error saving the note content');
			}
		},
		250
	)

	openNote = noteID => {
		this.setState(
			{ noteID },
			this.loadNote
		);
	}

	clearDefaultFolderID = callback => {
		this.setState({
			defaultFolderID: null,
		}, callback);
	}
	
	render() {
		const { campaignID, insertPaneIntoPanel } = this.props;
		const { view, note, savingNote, defaultFolderID } = this.state;

		if (view === 'editor') {
			return (
				<NoteEditor
					note={note.noteContent}
					title={note.noteTitle}
					onBack={this.onBack}
					onPropertyChanged={this.onPropertyChanged}
					savingNote={savingNote}
					campaignID={campaignID}
					insertPaneIntoPanel={insertPaneIntoPanel}
				/>
			);
		}

		return (
			<NotesList
				campaignID={campaignID}
				openNote={this.openNote}
				defaultFolderID={defaultFolderID}
				clearDefaultFolderID={this.clearDefaultFolderID}
			/>
		);
	}
}
