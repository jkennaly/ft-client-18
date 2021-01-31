// src/components/cards/SetCard.jsx

import m from 'mithril'
import _ from 'lodash'
import moment from 'moment-timezone/builds/moment-timezone-with-data-2012-2022.min'


import  CheckedInUsersField from '../fields/CheckedInUsersField.jsx';
import  NameField from '../fields/NameField.jsx';
import  StageNameField from '../fields/StageNameField.jsx';
import  AverageRatingField from '../fields/AverageRatingField.jsx';
import {subjectData} from '../../store/subjectData.js';
import {remoteData} from '../../store/data.js';

const {Sets: sets} = remoteData

const currentSet = id => sets.get(id)
const setIdField = (field, id) => currentSet(id) ? currentSet(id)[field] : 0

var detailsLoaded = {} 

const SetCard = {
  oninit: (vnode) => {
    const id = vnode.attrs.subjectObject.subject
    return sets.subjectDetails(vnode.attrs.subjectObject)
      .then(upd => detailsLoaded[id] = true)
  },
  view: ({ attrs }) =>
    <div class={"ft-card ft-card-set " + (attrs.uiClass ? attrs.uiClass : '')} onclick={() => m.route.set('/gametime/3/' + attrs.subjectObject.subject)}>
      {!detailsLoaded[attrs.subjectObject.subject] ? '' : <div>
      <div class="ft-set-name-fields">
       {
        //console.log('SetCard', attrs, detailsLoaded)
     }
      <NameField fieldValue={subjectData.name(attrs.subjectObject)} />
      <AverageRatingField ratingObject={subjectData.ratingObject(attrs.subjectObject, attrs.userID)}/>
      </div>
      <div class="ft-set-diff-fields">
          <CheckedInUsersField subjectObject={attrs.subjectObject} />
        <NameField fieldValue={moment(remoteData.Sets.getStartMoment(attrs.subjectObject.subject)).fromNow()} />
        <NameField fieldValue={remoteData.Sets.getTimeString(attrs.subjectObject.subject)} />
          {/*
      */}
        <StageNameField stageId={setIdField('stage', attrs.subjectObject.subject)} />

      </div>
      </div>}
    </div>
};

export default SetCard;
