// SetCard.jsx
// attrs: 	
//  eventId
//  superId
//	nameFrag
//  artistName
//  artistPriorityName
//	stageId
//	dayId
//	seriesId
//	festivalId
//  averageRating

import m from 'mithril'
import _ from 'lodash'

import  CheckedInUsersField from '../fields/CheckedInUsersField.jsx';
import  NameField from '../fields/NameField.jsx';
import  StageNameField from '../fields/StageNameField.jsx';
import  AverageRatingField from '../fields/AverageRatingField.jsx';
import {subjectData} from '../../store/subjectData.js';
import {remoteData} from '../../store/data.js';

const currentSet = _.memoize(id => subjectData.get({subject: id, subjectType: subjectData.SET}))
const setIdField = (field, id) => currentSet(id) ? currentSet(id)[field] : 0

const SetCard = {
  view: ({ attrs }) =>
    <div class={"ft-card " + (attrs.uiClass ? attrs.uiClass : '')} onclick={() => m.route.set('/gametime/3/' + attrs.subjectObject.subject)}>
      <div class="ft-set-name-fields">
        <NameField fieldValue={subjectData.name(attrs.subjectObject)} />
      <AverageRatingField ratingObject={subjectData.ratingObject(attrs.subjectObject)}/>
      </div>
      <div class="ft-set-diff-fields">
          <CheckedInUsersField subjectObject={attrs.subjectObject} />
          {/*
        <NameField fieldValue={remoteData.ArtistPriorities.getName(remoteData.Lineups.getPriFromArtistFest(setIdField('band', attrs.subjectObject.subject), remoteData.Days.getFestivalId(setIdField('day', attrs.subjectObject.subject))))} />
      */}
        <StageNameField stageId={setIdField('stage', attrs.subjectObject.subject)} />

      </div>
    </div>
};

export default SetCard;
