/**
 * @description Utility code for Google Analytics
 */

export const screenView = screen_name => {
	gtag(
		'event',
		'screen_view',
		{
			screen_name,
			app_name: 'campaign_buddy_' + (location.hostname === 'app.dndcampaignbuddy.com' ? 'prod' : 'test'),
		}
	);
};

export const openTool = (toolName, tool_open_method) => {
	gtag(
		'event',
		`open_${toolName}`,
		{
			event_label: toolName,
			event_category: 'open_tool',
			tool_open_method,
		}
	);
};

export const useFeature = (featureName, toolName) => {
	gtag(
		'event',
		'use_feature',
		{
			event_category: toolName ? 'tool_feature' : 'system_feature',
			event_label: `${featureName} in ${toolName ? toolName : 'system'}`,
		}
	);
};
