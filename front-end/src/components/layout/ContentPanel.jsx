/* A layout component that manages panes, 
displaying the active tab and allowing user to switch between tabs */

import React from 'react';
import PropTypes from 'prop-types';
import {
	ResizeSensor,
	Menu,
	MenuItem,
	ContextMenu,
} from '@blueprintjs/core';

import Tab from './DraggableTab';
import DropTargetOverlay from './DropTargetOverlay';
import TabContainer from './TabContainerDropTarget';

import styles from './styles.less';

export default class ContentPanel extends React.Component {
	static propTypes = {
		onTabChanged: PropTypes.func.isRequired,
		defaultSelected: PropTypes.number,
		removePane: PropTypes.func.isRequired,
		tools: PropTypes.array.isRequired,
		moveTabs: PropTypes.func.isRequired,
		panelId: PropTypes.number.isRequired,
		insertPaneIntoPanel: PropTypes.func.isRequired,
		panes: PropTypes.array,
		dropPaneIntoPanel: PropTypes.func,
		movePane: PropTypes.func,
		renderContent: PropTypes.func,
		focusedPanelId: PropTypes.number,
		setFocusedPanelId: PropTypes.func,
	}
	
	state = {
		currentTab: 0,
		width: 0,
		height: 0,
	}

	handleTabChanged = (currentTab, cb) => {
		const { onTabChanged } = this.props;
		this.setState({ currentTab }, () => {
			onTabChanged(currentTab);
			if (cb) {
				cb();
			}
		});
	}

	componentDidMount() {
		const { defaultSelected } = this.props;
		this.setState({ currentTab: defaultSelected });
	}

	handleRemovePane = (index, pane) => event => {
		event.stopPropagation();
		const { removePane } = this.props;
		const { currentTab } = this.state;
		if (currentTab > 0) {
			this.handleTabChanged(0, () => removePane(pane) );
		} else {
			removePane(pane);
		}
	}

	mapTabs = (pane, index) => {
		const { currentTab } = this.state;
		const { tools, moveTabs, panelId, focusedPanelId } = this.props;

		const tool = tools.find(tool => tool.name === pane.getType());
		let label;

		if (pane.tabName) {
			label = pane.tabName;
		} else if (tool && tool.defaultLabel) {
			label = tool.defaultLabel;
		} else {
			label = 'Not Found';
		}

		return (
			<Tab
				label={label}
				pane={pane}
				selected={currentTab === index}
				onClick={() => this.handleTabChanged(index)}
				onClose={this.handleRemovePane(index, pane)}
				key={index}
				panelId={panelId}
				moveTabs={moveTabs}
				index={index}
				hasPanelFocus={focusedPanelId === panelId}
			/>
		);
	}

	componentWillReceiveProps(nextProps) {
		let { currentTab } = this.state;
		const nextState = {};

		if (nextProps.defaultSelected !== currentTab) {
			nextState.currentTab = nextProps.defaultSelected;
			currentTab = nextProps.defaultSelected;
		}

		if (!nextProps.panes[currentTab]) {
			nextState.currentTab = 0;
		}

		this.setState(nextState);
	}

	componentResized = entries => {
		this.setState({
			width: entries[0].contentRect.width,
			height: entries[0].contentRect.height,
		});
	}

	mapToolMenuItem = tool => {
		const { insertPaneIntoPanel } = this.props;

		return (
			<MenuItem
				text={tool.displayName}
				onClick={() => insertPaneIntoPanel(tool.name)}
			/>
		);
	}

	renderContextMenu = event => {
		const { tools } = this.props;

		ContextMenu.show(
			<Menu>
				<MenuItem text="Add New Tool">
					{tools.map(this.mapToolMenuItem)}
				</MenuItem>
				<MenuItem
					text="Duplicate Active Tab"
					onClick={() => {
						const { insertPaneIntoPanel, panes } = this.props;
						const { currentTab } = this.state;
						const currentPane = panes[currentTab];

						insertPaneIntoPanel(
							currentPane.type,
							currentPane.state,
							currentPane.tabName,
						);
					}}
				/>
			</Menu>,
			{ left: event.clientX, top: event.clientY }
		);
	}

	handleFocus = () => {
		const { panelId, focusedPanelId, setFocusedPanelId } = this.props;

		if (panelId !== focusedPanelId) {
			setFocusedPanelId(panelId);
		}
	}

	render() {
		const { panes, dropPaneIntoPanel, movePane, renderContent, panelId } = this.props;
		const { currentTab, width, height } = this.state;

		return (
			<ResizeSensor onResize={this.componentResized}>
				<div className={styles.pane} onClick={this.handleFocus}>
					<div className={styles.paneHeader}>
						<TabContainer
							onDrop={item => {
								dropPaneIntoPanel(item.pane, () => {
									this.focusPane(item.pane);
								});
							}}
							panelId={panelId}
							renderContextMenu={this.renderContextMenu}
						>
							{panes && panes.map(this.mapTabs)}
						</TabContainer>
					</div>
					<div className={styles.paneContent}>
						{renderContent(currentTab, width, height)}
						<DropTargetOverlay
							type="half"
							direction="left"
							onDrop={item => movePane('before', 'soft', item.pane)}
						/>
						
						<DropTargetOverlay
							type="half"
							onDrop={item => movePane('after', 'soft', item.pane)}
						/>
						
						<DropTargetOverlay
							type="top-half"
							onDrop={item => movePane('above', 'soft', item.pane)}
						/>
						
						<DropTargetOverlay
							type="bottom-half"
							onDrop={item => movePane('below', 'soft', item.pane)}
						/>
					</div>
				</div>
			</ResizeSensor>
		);
	}
}