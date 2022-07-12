// src/components/cards/SeriesCard.jsx

import m from 'mithril'
import _ from 'lodash'

import ComposedNameField from '../fields/ComposedNameField.js';
import { remoteData } from '../../store/data';


const SeriesCard = {
  view: ({ attrs }) =>
    <div class={"ft-card ft-card-series " + (attrs.uiClass ? attrs.uiClass : '')} onclick={() => m.route.set("/series" + "/pregame" + '/' + attrs.eventId)}>
      <div class="ft-fields">
        {_.isInteger(attrs.eventId) && attrs.eventId ? <ComposedNameField fieldValue={remoteData.Series.getEventName(attrs.eventId)} /> : <ComposedNameField fieldValue={'New Series'} />}
      </div>
    </div>
};

export default SeriesCard;
