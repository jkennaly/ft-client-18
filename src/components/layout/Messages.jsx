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

import { remoteData } from "../../store/data";

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
			userId = auth.userId()
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
