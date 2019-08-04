/**
 * @description This item renders the title and image (or default image) for an item in a carousel
 * 
 * @author Joseph Stewart
 */

import React from 'react';
import PropTypes from 'prop-types';
import SVG from 'react-inlinesvg';

import {
	Button,
	Popover,
	Classes,
	Position,
} from '@blueprintjs/core';

import generateID from 'Utility/generateId';
import classNames from 'Utility/classNames';

import styles from './styles.less';

export default class CarouselItem extends React.Component {
	static propTypes = {
		title: PropTypes.string.isRequired,
		defaultImage: PropTypes.string.isRequired,
		menu: PropTypes.node,
		imageUrl: PropTypes.string,
		onItemSelected: PropTypes.func,
	}

	state = {
		popoverOpen: false,
	}

	constructor(props) {
		super(props);
		this.boundaryID = generateID('bp3-click-boundary');
	}

	onItemClicked = event => {
		const {
			onItemSelected,
		} = this.props;

		let node = event.target;
		while (node && node.className !== styles.item) {
			if (
				node.id === this.boundaryID ||
				node.classList.contains(Classes.PORTAL)
			) {
				return;
			}
			node = node.parentElement;
		}

		onItemSelected();
	}

	togglePopoverOpen = () => {
		this.setState(({ popoverOpen }) => ({ popoverOpen: !popoverOpen }));
	}

	renderMoreMenu = () => {
		const { menu } = this.props;
		const { popoverOpen } = this.state;

		return (
			<div
				className={classNames(
					styles.editMenuContainer,
					popoverOpen ? styles.popoverOpen : null
				)}
			>
				<div id={this.boundaryID}>
					<Popover
						isOpen={popoverOpen}
						onClose={() => this.setState({ popoverOpen: false })}
						position={Position.BOTTOM}
						minimal
					>
						<Button
							icon="more"
							minimal
							small
							className={styles.iconButton}
							onClick={this.togglePopoverOpen}
						/>
						{menu}
					</Popover>
				</div>
			</div>
		);
	};
	
	render() {
		const {
			title,
			imageUrl,
			defaultImage,
			menu,
		} = this.props;

		return (
			<div className={styles.item} onClick={this.onItemClicked}>
				<p className={styles.title}>{title}</p>
				<div className={styles.imageContainer}>
					{
						imageUrl ?
							<img
								src={imageUrl}
								className={styles.image}
							/>
							:
							<SVG
								src={defaultImage}
								className={styles.defaultImage}
							/> 
					}
				</div>
				{menu && this.renderMoreMenu()}
			</div>
		);
	}
}