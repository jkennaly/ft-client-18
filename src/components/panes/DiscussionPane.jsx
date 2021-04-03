// DiscussionPane.jsx

//given a list of bands to research, this widget
//filters out unneded ones, sorts the rest and displays artist cards

import m from "mithril"
import _ from "lodash"

import UIButton from "../../components/ui/UIButton.jsx"

import WidgetContainer from "../layout/WidgetContainer.jsx"

import DiscussionWidget from "../widgets/canned/DiscussionWidget.jsx"
import { remoteData } from "../../store/data"
import { subjectData } from "../../store/subjectData"

let count = 3
var discussing = false
var subjectObject = {}
var removed = []
let messageArray = []
let recentDiscussions = []

//the discussion pane receives the following (or uses default if none provided)
//message filter
//sort function

//first the filter is applied and all passing messages are sorted
//then the discussion for the first <count> messages is constructed
//the subjectCard for the baseMessage's subject is shown above the discussion
const DiscussionPane = {
	view: ({ attrs }) => (
		<WidgetContainer>
			{//find each message about this artist and order by user
			_.map(
				_.take(attrs.messageArrays, count)
					//.map(x => console.log("DiscussionPane", x) || x)
					.filter(x => x),
				//at least on message in each me must be unread
				//.map(x => {console.log('DiscussionPane jsx', x);return x;})
				me => (
					<DiscussionWidget
						messageArray={me}
						supressModal={true}
						headerCard={true}
						userId={attrs.userId}
						userRoles={attrs.userRoles}
						discussSubject={(so, me) =>
							attrs.popModal("discuss", {
								messageArray: me,
								subjectObject: so,
								reviewer: me[0].fromuser
							})
						}
						popModal={attrs.popModal}
					/>
				)
			)}
			{attrs.messageArrays.length > count ? (
				<UIButton
					action={e => {
						//attrs.hide()
						e.stopPropagation()
						//console.log('pre rating ' + rating)
						count += 3
						m.redraw()
					}}
					buttonName="Show More"
				/>
			) : (
				""
			)}
		</WidgetContainer>
	)
}

export default DiscussionPane
