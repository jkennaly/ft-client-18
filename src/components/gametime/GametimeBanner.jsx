// src/components/gametime/GametimeBanner.jsx

import m from "mithril"

import Icon from "../fields/Icon.jsx"
import BannerButton from "../ui/BannerButton.jsx"
import GametimeSearchBar from "./GametimeSearchBar.jsx"

const GametimeBanner = {
	view: ({ attrs, children }) => (
		<div class="gametime-banner-container">
			<div class="gametime-banner">
				<GametimeSearchBar gtDate={{ subject: attrs.dateId, subjectType: 8 }} />
				{
					/*
			<CollapsibleMenu 
				menu={menuList.concat([userValid ? validUserItem : invalidUserItem])} 
				collapsed={menuHidden}
				itemClicked={() => menuHidden = true}
			/>


					*/
					//console.log('GametimeBanner dateId/dayId', attrs.dateId, attrs.dayId)
				}

				{attrs.dateId ? (
					//go to locations
					<BannerButton
						icon={<Icon name="location" />}
						clickFunction={e =>
							m.route.set(`/gametime/locations/8/${attrs.dateId}`)
						}
					/>
				) : (
					""
				)}

				{attrs.dateId ? (
					//go to now playing
					<BannerButton
						icon={<Icon name="clock" />}
						clickFunction={e => m.route.set(`/gametime/8/${attrs.dateId}`)}
					/>
				) : (
					""
				)}
				{attrs.dayId ? (
					//go to schedule view
					<BannerButton
						icon={<Icon name="calendar" />}
						clickFunction={e => m.route.set(`/gametime/9/${attrs.dayId}`)}
					/>
				) : (
					""
				)}
				{
					//exit back to launcher
					<BannerButton
						icon={<Icon name="share" />}
						clickFunction={e => m.route.set("/launcher")}
					/>
				}
			</div>

			{children}
		</div>
	)
}

export default GametimeBanner
