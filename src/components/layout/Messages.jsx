// Messages.jsx
// Services
import Auth from "../../services/auth.js";
const auth = new Auth();

import m from "mithril";
import _ from "lodash";
import localforage from "localforage";
import moment from "moment-timezone/builds/moment-timezone-with-data-2012-2022.min";

import LauncherBanner from "../../components/ui/LauncherBanner.jsx";
import MessageCategoryPane from "../../components/panes/MessageCategoryPane.jsx";
import DiscussionPane from "../../components/panes/DiscussionPane.jsx";

import { remoteData, subjectData } from "../../store/data";

const Messages = vnode => {
	let userId = 0;
	return {
		oninit: () => {
			//console.log("Messages init");
			localforage
				.getItem("status.messageLayout")
				.then(obj => {
					//console.log('Messages oncreate status:')
					//console.log(obj)
					if (!obj) return;
					/*
					const seriesValue = {target: {value: obj.status.series}}
					const festivalValue = {target: {value: obj.status.festival}}
					seriesChange(seriesValue)
					festivalChange(festivalValue)
					*/
				})
				.catch(err => console.log(err));
			auth.getFtUserId()
				.then(userId => {
					remoteData.Messages.loadList();
					remoteData.MessagesMonitors.loadList();
					remoteData.Images.loadList();
					remoteData.Series.loadList();
					remoteData.Festivals.loadList();
					remoteData.Dates.loadList();
					remoteData.Days.loadList();
					remoteData.Sets.loadList();
					remoteData.Venues.loadList();
					remoteData.Places.loadList();
					remoteData.Lineups.loadList();
					remoteData.ArtistPriorities.loadList();
					remoteData.StagePriorities.loadList();
					remoteData.ArtistAliases.loadList();
					remoteData.Artists.loadList();
					remoteData.Users.loadList();
					remoteData.MessageTypes.loadList();
					remoteData.SubjectTypes.loadList();
					return userId;
				})
				.then(id => {
					if (id !== userId) {
						userId = id;
						m.redraw();
					}
				})
				.catch(err => m.route.set("/auth"));
		},

		view: () => (
			<div class="main-stage">
				<LauncherBanner title="Message Center" />
				<div class="main-stage-content-panes">
					<div class="ft-horizontal-fields">
						<div class="ft-pane-single">
							<MessageCategoryPane />
						</div>
						<div class="ft-pane-double">
							<DiscussionPane userId={userId} />
						</div>
					</div>

					<div class="footer" />
				</div>
			</div>
		)
	};
};
export default Messages;
