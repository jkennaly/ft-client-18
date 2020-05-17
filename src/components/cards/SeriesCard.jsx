// src/components/cards/SeriesCard.jsx

import m from 'mithril'
import _ from 'lodash'

import  ComposedNameField from '../fields/ComposedNameField.jsx';
import {remoteData} from '../../store/data';


const SeriesCard = {
  view: ({ attrs }) =>
    <div class={"c44-card c44-card-series " + (attrs.uiClass ? attrs.uiClass : '')} onclick={() => m.route.set("/series" + "/pregame" + '/' + attrs.eventId)}>
      <div class="c44-fields">
        {_.isInteger(attrs.eventId) && attrs.eventId ? <ComposedNameField fieldValue={remoteData.Series.getEventName(attrs.eventId)} /> : <ComposedNameField fieldValue={'New Series'} />}
      </div>
    </div>
};

export default SeriesCard;