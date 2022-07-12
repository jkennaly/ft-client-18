// src/components/cards/UserCard.jsx


import m from 'mithril'
import _ from 'lodash'

import UserAvatarField from '../fields/UserAvatarField.jsx';
import NameField from '../fields/NameField.js';
import { subjectData } from '../../store/subjectData';
import globals from '../../services/globals.js';

const defaultClick = ({ contextObject, gametime, data }) => evt => {
  const baseRoute = contextObject && gametime ? `/gametime/${contextObject.subjectType}/` : '/users/pregame/'
  const targetId = contextObject && contextObject.subject ? contextObject.subject :
    data && data.id ? data.id : 0
  if (!targetId) return false
  evt.stopPropagation()
  return m.route.set(baseRoute + targetId)
}


const UserCard = {
  view: ({ attrs }) =>
    <div class={attrs.small ? "ft-card" : "ft-card-large"} onclick={attrs.clickFunction ? attrs.clickFunction : defaultClick(attrs)}>
      {
        //console.log('UserCard attrs.contextObject', attrs.contextObject)
      }
      <div class="ft-vertical-fields">
        {attrs.data ? <UserAvatarField data={attrs.data.id} /> : ''}
      </div>
      {attrs.contextObject && (attrs.contextObject.subject !== attrs.data.id || attrs.contextObject.subjectType !== globals.USER) ? <NameField fieldValue={subjectData.name(attrs.contextObject)} /> : ''}
    </div>

}

export default UserCard;