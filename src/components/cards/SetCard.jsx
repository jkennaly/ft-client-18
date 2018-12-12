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

import  SetNameField from '../fields/SetNameField.jsx';
import  NameField from '../fields/NameField.jsx';
import  EventNameField from '../fields/EventNameField.jsx';
import  StageNameField from '../fields/StageNameField.jsx';
import  DayNameField from '../fields/DayNameField.jsx';
import  DateNameField from '../fields/DateNameField.jsx';
import  AverageRatingField from '../fields/AverageRatingField.jsx';
import {getAppContext} from '../../store/ui';

const SetCard = {
  view: ({ attrs }) =>
    <div class="ft-card" onclick={() => m.route.set("/sets" + "/" + getAppContext() + '/' + attrs.eventId)}>
      <div class="ft-set-name-fields">
        <SetNameField 
          artistName={attrs.artistName} 
          seriesId={attrs.seriesId} 
          festivalId={attrs.festivalId} 
        />
        <AverageRatingField averageRating={attrs.averageRating} pretext={'Average Rating'}/>
      </div>
      <div class="ft-set-diff-fields">
       	<StageNameField stageId={attrs.stageId} />
       	<DateNameField dateId={attrs.dateId} />
       	<DayNameField dayId={attrs.dayId} />
        <NameField fieldValue={attrs.artistPriorityName} />
       	{
      //artistPriority
  		}
      </div>
    </div>
};

export default SetCard;