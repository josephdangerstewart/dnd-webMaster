/**
 * @description This component is responsible for rendering everything on the right hand of the homepage
 * @author Joseph Stewart
 */

import React from 'react';
import PropTypes from 'prop-types';
import {
	Button,
	AnchorButton,
	Intent,
	Icon,
	Popover,
	Menu,
	MenuItem,
	Position,
} from '@blueprintjs/core';

import Carousel from './carousel';
import CampaignNameModal from '../campaign-name-modal';

import styles from './styles.less';

export default class Content extends React.Component { 
	static propTypes = {
		navigateToCampaign: PropTypes.func.isRequired,
		campaigns: PropTypes.array.isRequired,
		loadCampaigns: PropTypes.func.isRequired,
	}

	state = {
		campaignNameModalOpen: false,
		campaignIconModalOpen: false,
		focusedCampaignID: 0,
		focusedCampaignName: '',
	}

	renderCampaignsCarouselItemMenu = campaign => (
		<Menu>
			<MenuItem
				text="Rename this campaign"
				onClick={() => this.setState({
					campaignNameModalOpen: true,
					focusedCampaignID: campaign.id,
					focusedCampaignName: campaign.title,
				})}
			/>
			<MenuItem
				text="Change icon"
			/>
		</Menu>
	)

	render() {
		const {
			navigateToCampaign,
			campaigns,
			loadCampaigns,
		} = this.props;
		const {
			focusedCampaignID,
			focusedCampaignName,
			campaignNameModalOpen,
		} = this.state;

		return (
			<div className={styles.content}>
				<div className={styles.headerRow}>
					<Popover
						minimal
						position={Position.BOTTOM_RIGHT}
					>
						<Button
							minimal
							icon={
								<Icon
									icon="user"
									iconSize={24}
								/>
							}
							large
							intent={Intent.PRIMARY}
						/>
						<Menu>
							<MenuItem text="Logout" href="/api/auth/logout" />
							<MenuItem text="Profile" href="/profile" />
						</Menu>
					</Popover>
					<AnchorButton
						minimal
						icon={
							<Icon
								icon="help"
								iconSize={24}
							/>
						}
						large
						intent={Intent.PRIMARY}
						href="/help"
					/>
				</div>
				<Carousel
					title="Campaigns"
					items={campaigns}
					defaultImage="/svg/d20.svg"
					onItemSelected={navigateToCampaign}
					noItemsText="No Campaigns"
					renderItemMenu={this.renderCampaignsCarouselItemMenu}
				/>
				<CampaignNameModal
					previousName={focusedCampaignName}
					campaignID={focusedCampaignID}
					isOpen={campaignNameModalOpen}
					onClose={() => this.setState({ campaignNameModalOpen: false })}
					onRefresh={loadCampaigns}
				/>
			</div>
		);
	}
}