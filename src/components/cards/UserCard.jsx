// src/components/cards/UserCard.jsx


import m from 'mithril'
import _ from 'lodash'

import  UserAvatarField from '../fields/UserAvatarField.jsx';
import  NameField from '../fields/NameField.jsx';
import {subjectData} from '../../store/subjectData';

const defaultClick = ({contextObject}) => () => m.route.set(contextObject ? `/gametime/${contextObject.subjectType}/${contextObject.subject}` : m.route.get())


const UserCard = vnode => {
  
  return {
    view: ({ attrs }) =>
      <div class="ft-card-large" onclick={attrs.clickFunction ? attrs.clickFunction : defaultClick(attrs)}>
      {console.log('CheckedInUsersField attrs.contextObject', attrs.contextObject)}
        <div class="ft-vertical-fields">
          <UserAvatarField data={attrs.data.id} />
        </div>
          {attrs.contextObject ? <NameField fieldValue={subjectData.name(attrs.contextObject)} /> : ''}
      </div>
    
}};

export default UserCard;