import 'babel-polyfill';
// This file needs to be imported like this to escape css modules (which is the default)
import '!style-loader!css-loader!less-loader!./styles/blueprint-overrides.less';
import '!style-loader!css-loader!less-loader!./styles/globals.less';
import '!style-loader!css-loader!react-quill/dist/quill.bubble.css';
import '!style-loader!css-loader!less-loader!./styles/quill-overrides.less';

import React from 'react';
import ReactDOM from 'react-dom';
import HelpPageApp from './components/help-pages';

ReactDOM.render(
	<HelpPageApp/>,
	document.getElementById('container')
);