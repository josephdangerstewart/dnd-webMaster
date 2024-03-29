import React from 'react';
import PropTypes from 'prop-types';

const Toolbar = ({ id }) => (
	<div id={id}>
		<select className="ql-header" defaultValue={''} onChange={e => e.persist()}>
			<option value="1"></option>
			<option value="2"></option>
			<option selected></option>
		</select>
		<button className="ql-bold"></button>
		<button className="ql-italic"></button>
	</div>
);

Toolbar.propTypes = {
	id: PropTypes.string.isRequired,
};

export default Toolbar;
