// src/components/cards/UserCard.jsx


import m from 'mithril'
import _ from 'lodash'

import  UserAvatarField from '../fields/UserAvatarField.jsx';
import  NameField from '../fields/NameField.jsx';
import {subjectData} from '../../store/subjectData';

const defaultClick = ({contextObject}) => () => m.route.set(contextObject ? `/gametime/${contextObject.subjectType}/${contextObject.subject}` : m.route.get())


const UserCard = {
    view: ({ attrs }) =>
      <div class={attrs.small ? "c44-card" : "c44-card-large"} onclick={attrs.clickFunction ? attrs.clickFunction : defaultClick(attrs)}>
      {console.log('UserCard attrs.contextObject', attrs.contextObject)}
        <div class="c44-vertical-fields">
          <UserAvatarField data={attrs.data.id} />
        </div>
          {attrs.contextObject && (attrs.contextObject.subject !== attrs.data.id || attrs.contextObject.subjectType !== USER) ? <NameField fieldValue={subjectData.name(attrs.contextObject)} /> : ''}
      </div>
    
}

export default UserCard;