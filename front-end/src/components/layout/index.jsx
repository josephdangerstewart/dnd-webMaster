/* This component is the root layout component, it manages which tools are on the screen
and where they go. It also handles rearranging of tools through drag and drop. */

import React from 'react';
import PropTypes from 'prop-types';
import {
	NonIdealState,
	Spinner,
	Popover,
	Position,
	Button,
	Intent,
	Menu,
	MenuItem,
} from '@blueprintjs/core';
import * as portals from 'react-reverse-portal';

import PanelGroup from './PanelGroup';
import ContentPanel from './ContentPanel';
import CustomDragLayer from './CustomDragLayer';
import Toolbar from './toolbar';
import GlobalSearchBar from './global-search';
import { PaneContextProvider } from '../pane-context-provider';
import { HotkeyProvider } from '../hotkey-provider';

import styles from './styles.less';

import {
	addPane,
	movePane,
	insertPaneIntoPanel,
	insertIntoFirstPanel,
	getAllPanes,
} from './model/layout-manager';
import { get } from 'Utility/fetch';
import { screenView, openTool } from 'Utility/gtag';

import Layout from './model/Layout';
import tools from '../tools';
import { displayError } from '../toast';

const defaultLayout = {
	rows: [],
};

const noop = () => {};

export default class Grid extends React.Component {
	static propTypes = {
		match: PropTypes.object,
	}
	
	state = {
		layout: new Layout(defaultLayout),
		reloading: false,
		currentCampaignID: '0',
		campaignTitle: '',
		savedLayouts: [],
		validating: true,
		focusedPanelId: -1,
		focusedPaneId: -1,
	}

	async componentDidMount() {
		const { match } = this.props;
		const currentCampaignID = match.params.id;
		const campaign = await get(`/api/campaigns/${currentCampaignID}/exists`);

		screenView('app');

		if (campaign.exists) {
			this.setState({
				currentCampaignID,
				validating: false,
			});
		} else {
			// TODO: Handle case where campaign does not exist for user
		}
	}

	renderLayout = layout => (
		<PanelGroup
			borderColor="black"
			direction="column"
			panelWidths={layout.getPanelWidths()}
			onUpdate={layout.monitorUpdates()}
			key={`layout-${layout.getId()}`}
		>
			{layout.getRows().map(this.mapLayoutRows)}
		</PanelGroup>
	)

	mapLayoutRows = row => (
		<PanelGroup
			borderColor="black"
			panelWidths={row.getPanelWidths()}
			onUpdate={row.monitorUpdates()}
			key={`row-${row.getId()}`}
		>
			{row.getPanels().map(this.mapLayoutPanels)}
		</PanelGroup>
	)

	mapLayoutPanels = panel => {
		if (panel.constructor === Layout) {
			return this.renderLayout(panel);
		}
		const { focusedPanelId } = this.state;

		return (
			<ContentPanel
				panes={panel.getPanes()}
				removePane={pane => {
					if (pane.remove()) {
						// Reload rendered layout if the pane was removed
						this.setLayout(this.state.layout);
					}
				}}
				dropPaneIntoPanel={(pane, cb) => {
					if (pane.getParent() !== panel && pane.remove()) {
						panel.addPane(pane);
						panel.focusPane(pane);
						this.setLayout(this.state.layout, cb);
					}
				}}
				movePane={(direction, variant, pane) => {
					if (movePane(direction, variant, pane, panel)) {
						this.setLayout(this.state.layout);
					}
				}}
				onTabChanged={panel.monitorUpdates()}
				defaultSelected={panel.getSelectedTab()}
				panelId={panel.getId()}
				key={`panel-${panel.getId()}`}
				renderContent={(currentTab, width, height) => (
					<React.Fragment>
						{panel.getPanes().map(this.mapContent(currentTab, width, height, panel, focusedPanelId === panel.getId()))}
					</React.Fragment>
				)}
				tools={tools}
				moveTabs={(from, to) => {
					panel.swapPanes(from, to);
					this.setLayout(this.state.layout);
				}}
				insertPaneIntoPanel={
					(type, state, tabName) => this.insertPaneIntoPanel({ type, state, tabName }, panel)
				}
				focusedPanelId={focusedPanelId}
				setFocusedPanelId={(focusedPanelId, focusedPaneId) => this.setState({ focusedPanelId, focusedPaneId })}
			/>
		);
	}

	renderComponentForPane = (pane) => {
		const tool = tools.find(tool => tool.name === pane.getType());
		let Content;

		if (tool && tool.component) {
			Content = tool.component;
		} else {
			Content = () => (
				<NonIdealState
					title="Tool Not Found"
					description={
						<span>
							We could not find a tool with the type <strong>{pane.getType()}</strong>
						</span>
					}
					icon="error"
				/>
			);
		}

		const { currentCampaignID } = this.state;

		return (
			<Content
				pane={pane}
				width={0}
				height={0}
				campaignID={currentCampaignID}
				setTabName={name => {
					pane.tabName = name;
					this.setLayout(this.state.layout);
				}}
				insertPaneIntoPanel={noop}
				closePane={noop}
				panelHasFocus={false}
			/>
		);
	}

	mapContent = (currentTab, width, height, panel, panelHasFocus) => (pane, index) => {
		const portal = pane.getPortal();

		const { currentCampaignID } = this.state;

		return (
			<div style={{ display: currentTab !== index ? 'none' : undefined }}>
				<portals.OutPortal
					node={portal}
					pane={pane}
					width={width}
					height={height}
					campaignID={currentCampaignID}
					setTabName={name => {
						pane.tabName = name;
						this.setLayout(this.state.layout);
					}}
					insertPaneIntoPanel={
						(type, state, tabName) => {
							// Analytics code
							openTool(type, 'pane_context_menu');
							this.insertPaneIntoPanel({ type, state, tabName }, panel);
						}
					}
					closePane={() => {
						if (pane.remove()) {
							this.setLayout(this.state.layout);
						}
					}}
					panelHasFocus={panelHasFocus}
				/>
			</div>
		);
	}

	setLayout = newLayout => {
		this.setState(
			{ reloading: true },
			() => {
				this.setState(
					{ layout: newLayout },
					() => this.setState({ reloading: false })
				);
			});
	}

	addPane = (type, state) => {
		const { layout } = this.state;
		this.setLayout(addPane(layout, type, state));
	}

	insertPaneIntoPanel = (paneObject, target) => {
		insertPaneIntoPanel(paneObject, target);
		this.setLayout(this.state.layout);
	}

	insertIntoFirstPanel = (type, state) => {
		this.setState(({ layout }) => ({
			layout: insertIntoFirstPanel(layout, type, state),
		}));
	}

	loadLayout = layoutData => {
		this.setState(() => {

			let layout = {};
			try {
				layout = new Layout(layoutData);
			} catch (err) {
				displayError('There was an error loading the layout');
			}

			return {
				layout,
			};

		});
	}

	goHome = () => {
		window.location.href = '/';
	}

	mapToolMenuItem = (tool, index) => (
		<MenuItem
			text={tool.displayName}
			onClick={() => {
				// Analytics code
				openTool(tool.name, 'initial_non_ideal_state');
				this.addPane(tool.name);
			}}
			key={index}
		/>
	)

	render() {
		const { layout, validating, currentCampaignID, focusedPaneId } = this.state;
		const panes = getAllPanes(layout);

		return (
			<HotkeyProvider
				focusedPaneId={focusedPaneId}
			>
				<>
					<div style={{ display: 'none' }}>
						{panes.map((pane) => (
							<portals.InPortal node={pane.getPortal()} key={`pane-${pane.getId()}`}>
								<PaneContextProvider
									paneId={pane.getId()}
								>
									{this.renderComponentForPane(pane)}
								</PaneContextProvider>
							</portals.InPortal>
						))}
					</div>
					<div className={styles.root}>
						<div className={styles.rootFlex}>
							<Toolbar
								loadLayout={this.loadLayout}
								addTool={(toolName) => {
									// Analytics code
									openTool(toolName, 'toolbar');
									this.addPane(toolName);
								}}
								goHome={this.goHome}
								tools={tools}
								campaignID={currentCampaignID}
								currentLayout={layout}
							/>
							{validating ?
								<div className={styles.spinnerContainer}>
									<Spinner />
								</div>
								: layout.rows.length > 0 ?
									<div className={styles.grid}>
										{this.renderLayout(layout)}
									</div>
									:
									<div className={styles.grid}>
										<NonIdealState
											title="No tools"
											description="It looks like you don't have any tools open!"
											icon="info-sign"
											action={
												<Popover
													position={Position.BOTTOM_LEFT}
													modifiers={{ arrow: false }}
												>
													<Button
														intent={Intent.PRIMARY}
														rightIcon="caret-down"
													>
														Open one!
													</Button>
													<Menu>
														{tools.map(this.mapToolMenuItem)}
													</Menu>
												</Popover>
											}
										/>
									</div>
							}
						</div>
						<GlobalSearchBar
							campaignID={currentCampaignID}
							addTool={this.insertIntoFirstPanel}
						/>
						<CustomDragLayer />
					</div>
				</>
			</HotkeyProvider>
		);
	}
}
