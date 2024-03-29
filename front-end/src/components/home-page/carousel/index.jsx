/**
 * @description This component allows the user to pick an item from a horizontally scrollable list
 * 
 * @author Joseph Stewart
 */

import React from 'react';
import PropTypes from 'prop-types';
import {
	Button,
} from '@blueprintjs/core';

import Title from '../../title';
import CarouselItem from './CarouselItem';

import styles from './styles.less';

export default class Carousel extends React.Component {
	static propTypes = {
		title: PropTypes.string.isRequired,
		items: PropTypes.array.isRequired,
		defaultImage: PropTypes.string.isRequired,
		onItemSelected: PropTypes.func.isRequired,
		noItemsText: PropTypes.string,
		renderItemMenu: PropTypes.func,
	}

	mapItem = item => {
		const { defaultImage, onItemSelected, renderItemMenu } = this.props;

		return (
			<CarouselItem
				title={item.title}
				imageUrl={item.imageUrl}
				defaultImage={defaultImage}
				onItemSelected={() => onItemSelected(item.id)}
				menu={renderItemMenu && renderItemMenu(item)}
			/>
		);
	}

	scrollLeft = () => {
		if (this.content) {
			let scrollOffset;
			if (this.content.scrollLeft % 260 !== 0) {
				scrollOffset = this.content.scrollLeft % 260;
			} else {
				scrollOffset = 260;
			}
			this.content.scroll({
				left: this.content.scrollLeft - scrollOffset,
				behavior: 'smooth',
			});
		}
	}

	scrollRight = () => {
		if (this.content) {
			this.content.scroll({
				left: this.content.scrollLeft + 260,
				behavior: 'smooth',
			});
		}
	}
	
	render() {
		const {
			title,
			items,
			noItemsText,
		} = this.props;

		return (
			<div className={styles.root}>
				<Title color="primary">{title}</Title>
				<div className={styles.carousel}>
					<Button
						icon="chevron-left"
						minimal
						className={styles.button}
						onClick={this.scrollLeft}
					/>
					{
						items.length > 0 ?
							<div
								className={styles.carouselContent}
								ref={ref => this.content = ref}
							>
								{items.map(this.mapItem)}
							</div>
							:
							<div
								className={styles.carouselContentNoItems}
							>
								<p className={styles.carouselContentNoItemsText}>{noItemsText}</p>
							</div>
					}
					<Button
						icon="chevron-right"
						minimal
						className={styles.button}
						onClick={this.scrollRight}
					/>
				</div>
			</div>
		);
	}
}