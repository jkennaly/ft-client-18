// UserView.jsx


import m from 'mithril'
import _ from 'lodash'

import CardContainer from '../../components/layout/CardContainer.jsx';
import UserCard from '../../components/cards/UserCard.jsx';
import globals from '../../services/globals.js';

import { remoteData } from '../../store/data';

const user = _.memoize(attrs => _.isInteger(attrs.userId) ? attrs.userId : 0, attrs => attrs.userId)
const roles = attrs => _.isArray(attrs.userRoles) ? attrs.userRoles : []

const UserView = {
	oninit: ({ attrs }) => {

		if (attrs.titleSet) attrs.titleSet(`People`)
		return remoteData.Users.recent(10)
			.then(ids => remoteData.Users.getManyPromise(ids))
	},
	view: ({ attrs }) => <div class="main-stage">
		<CardContainer>
			{

				remoteData.Users.list
					.map(user => <UserCard
						contextObject={{ subjectType: globals.USER, subject: user.id }}
						data={user}
						small={false}
						gametime={false}
					/>)
			}
		</CardContainer>
	</div>
}
export default UserView;
