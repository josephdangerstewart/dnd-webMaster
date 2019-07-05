/* This is the root container for the project */

import React from 'react';
import ListView from './list-view';
import ArticleView from './article-view';
import { DragDropContextProvider } from 'react-dnd';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import HTML5Backend from 'react-dnd-html5-backend';

import { FocusStyleManager } from '@blueprintjs/core';

FocusStyleManager.onlyShowFocusOnTabs();

export default class App extends React.Component {
	render() {
		return (
			<DragDropContextProvider backend={HTML5Backend}>
				<BrowserRouter>
					<Switch>
						<Route path="/help/:url?" component={ArticleView} />
						<Route default component={ListView} />
					</Switch>
				</BrowserRouter>
			</DragDropContextProvider>
		);
	}
}