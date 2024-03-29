import multer from 'multer';

import {
	asRouteFunction,
} from '../utility';

import * as campaignRoutes from './CampaignsController';
import * as characterRoutes from './characters/CharacterController';
import * as notesRoutes from './notes/NotesController';
import * as linkedPlaylistRoutes from './music/LinkedPlaylistController';

const uploader = multer({ storage: multer.memoryStorage() });

export default app => {
	app.route('/api/campaigns/:campaignID/exists')
		.get(asRouteFunction(campaignRoutes.checkIfCampaignExists, true));

	app.route('/api/campaigns/:campaignID/playlists')
		.get(
			asRouteFunction(linkedPlaylistRoutes.getLinkedPlaylists, true)
		);

	app.route('/api/campaigns/:campaignID/playlists')
		.post(
			asRouteFunction(linkedPlaylistRoutes.linkSpotifyPlaylists, true)
		);

	app.route('/api/campaigns/:campaignID/playlists/:spotifyUris')
		.delete(
			asRouteFunction(linkedPlaylistRoutes.unlinkSpotifyPlaylists, true)
		);

	app.route('/api/campaigns/:campaignID/playlists/hotkey')
		.post(
			asRouteFunction(linkedPlaylistRoutes.changePlaylistHotkey, true)
		);

	app.route('/api/campaigns/:campaignID/characters/:characterID')
		.get(
			campaignRoutes.userCanAccessCampaign,
			characterRoutes.characterBelongsToCampaign,
			asRouteFunction(characterRoutes.getCharacter, true)
		);
	
	app.route('/api/campaigns/:campaignID/characters/:characterID')
		.delete(
			campaignRoutes.userCanAccessCampaign,
			characterRoutes.characterBelongsToCampaign,
			asRouteFunction(characterRoutes.deleteCharacter, true)
		);

	app.route('/api/campaigns/:campaignID/characters/:characterID')
		.post(
			campaignRoutes.userCanAccessCampaign,
			characterRoutes.characterBelongsToCampaign,
			uploader.single('image'),
			asRouteFunction(characterRoutes.updateCharacter, true)
		);

	app.route('/api/campaigns/:campaignID/characters')
		.get(
			campaignRoutes.userCanAccessCampaign,
			asRouteFunction(characterRoutes.getAllCharacters, true)
		);

	app.route('/api/campaigns/:campaignID/characters')
		.post(
			campaignRoutes.userCanAccessCampaign,
			asRouteFunction(characterRoutes.createNewCharacter, true)
		);

	app.route('/api/campaigns/:campaignID/notes')
		.get(
			campaignRoutes.userCanAccessCampaign,
			asRouteFunction(notesRoutes.getAllNotes, true)
		);

	app.route('/api/campaigns/:campaignID/notes')
		.post(
			campaignRoutes.userCanAccessCampaign,
			asRouteFunction(notesRoutes.createNewNote, true)
		);

	app.route('/api/campaigns/:campaignID/notes/folders')
		.post(
			campaignRoutes.userCanAccessCampaign,
			asRouteFunction(notesRoutes.createNewFolder, true)
		);
	
	app.route('/api/campaigns/:campaignID/notes/folders/:folderID')
		.get(
			campaignRoutes.userCanAccessCampaign,
			asRouteFunction(notesRoutes.getFolder, true)
		);

	app.route('/api/campaigns/:campaignID/notes/folders/:folderID')
		.delete(
			campaignRoutes.userCanAccessCampaign,
			asRouteFunction(notesRoutes.deleteFolder, true)
		);

	app.route('/api/campaigns/:campaignID/notes/folders/move-into/:destFolderID')
		.post(
			campaignRoutes.userCanAccessCampaign,
			asRouteFunction(notesRoutes.moveIntoFolder, true)
		);

	app.route('/api/campaigns/:campaignID/notes/folders/rename/:folderID')
		.post(
			campaignRoutes.userCanAccessCampaign,
			asRouteFunction(notesRoutes.renameFolder, true)
		);

	app.route('/api/campaigns/:campaignID/notes/:noteID')
		.get(
			campaignRoutes.userCanAccessCampaign,
			asRouteFunction(notesRoutes.getNote, true)
		);

	app.route('/api/campaigns/:campaignID/notes/:noteID')
		.post(
			campaignRoutes.userCanAccessCampaign,
			asRouteFunction(notesRoutes.updateNote, true)
		);

	app.route('/api/campaigns/:campaignID/notes/:noteID')
		.delete(
			campaignRoutes.userCanAccessCampaign,
			asRouteFunction(notesRoutes.deleteNote, true)
		);

	app.route('/api/campaigns/:campaignID/tool-settings/:tool')
		.get(
			campaignRoutes.userCanAccessCampaign,
			asRouteFunction(campaignRoutes.getToolSettings, true)
		);

	app.route('/api/campaigns/:campaignID/tool-settings/:tool')
		.post(
			campaignRoutes.userCanAccessCampaign,
			asRouteFunction(campaignRoutes.updateToolSettings, true)
		);

	app.route('/api/campaigns/:campaignID/layouts')
		.get(
			campaignRoutes.userCanAccessCampaign,
			asRouteFunction(campaignRoutes.getSavedLayouts, true)
		);

	app.route('/api/campaigns/:campaignID/layouts')
		.post(
			campaignRoutes.userCanAccessCampaign,
			asRouteFunction(campaignRoutes.saveLayoutConfiguration, true)
		);

	app.route('/api/campaigns/:campaignID/update')
		.post(
			campaignRoutes.userCanAccessCampaign,
			uploader.single('image'),
			asRouteFunction(campaignRoutes.updateCampaignDetails, true)
		);

	app.route('/api/campaigns')
		.get(asRouteFunction(campaignRoutes.getAllCampaigns, true));

	app.route('/api/campaigns')
		.post(asRouteFunction(campaignRoutes.createNewCampaign, true));
};