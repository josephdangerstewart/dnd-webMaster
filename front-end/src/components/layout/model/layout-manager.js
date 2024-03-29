import Layout from './Layout';
import LayoutRow from './LayoutRow';
import LayoutPanel from './LayoutPanel';
import LayoutPane from './LayoutPane';

export const addPane = (layout, type, state) => {
	const jsonModel = layout.toJson({});
	let newModel = {};
	if (jsonModel.rows.length > 1) {
		newModel = { rows: [
			{ panels: [
				jsonModel,
				{ panes: [
					{ type, state },
				] },
			] },
		] };
	} else if (jsonModel.rows.length === 1) {
		newModel = { rows: [
			{ panels: [
				...jsonModel.rows[0].panels,
				{ panes: [
					{ type, state },
				] },
			] },
		] };
	} else {
		newModel = { rows: [
			{ panels: [
				{ panes: [
					{ type, state },
				] },
			] },
		] };
	}
	return new Layout(newModel);
};

export const insertIntoFirstPanel = (layout, type, state) => {
	if (layout.getRows().length > 0) {
		const row = layout.getRows()[0];
		const panel = row.getPanels()[0];
		if (panel instanceof Layout) {
			insertIntoFirstPanel(panel, type, state);
		} else {
			const pane = new LayoutPane(
				{
					type,
					state,
				}
			);
			panel.addPane(pane);
			panel.focusPane(pane);
		}
	} else {
		layout.addRow(new LayoutRow(
			{
				panels: [
					{ panes: [
						{ type, state },
					] },
				],
			}
		));
	}
	return layout;
};

export const insertPaneIntoPanel = (object, target) => {
	target.addPane(new LayoutPane(object));
};

export const movePane = (direction, variant, pane, targetPanel) => {
	if ((direction === 'before' || direction === 'after') && variant === 'soft') {
		return movePaneNextToSoft(direction, pane, targetPanel);
	} else if ((direction === 'above' || direction === 'below') && variant === 'soft') {
		return movePaneVerticallySoft(direction, pane, targetPanel);
	}
	return false;
};

export const getAllPanes = (layout) => {
	const rows = layout.getRows();
	const panes = [];

	rows.forEach(row => {
		const panels = row.getPanels();

		panels.forEach((panel) => {
			if (panel instanceof Layout) {
				panes.push(...getAllPanes(panel));
			} else {
				panes.push(...panel.getPanes());
			}
		});
	});

	return panes;
};

const movePaneNextToSoft = (direction, pane, targetPanel) => {
	const paneJson = pane.toJson({});
	if (pane.remove()) {
		const parentRow = targetPanel.getParent();
		parentRow.addPanel(new LayoutPanel({
			panes: [
				paneJson,
			],
		}), direction, targetPanel);
		return true;
	}
	return false;
};

const movePaneVerticallySoft = (direction, pane, targetPanel) => {
	const paneJson = pane.toJson({ ignoreWidths: true });
	if (pane.remove()) {
		const parentRow = targetPanel.getParent();
		if (parentRow.getPanels().length === 1) {
			const parentLayout = parentRow.getParent();
			parentLayout.addRow(new LayoutRow({ panels: [
				{ panes: [ paneJson ] },
			] }), direction, parentRow);
		} else {
			const targetPanelJson = targetPanel.toJson({});
			parentRow.replace(targetPanel, new Layout({ rows: [
				{ panels: [ targetPanelJson ] },
				{ panels: [
					{ panes: [ paneJson ] },
				] },
			] }));
		}
		return true;
	}
	return false;
};