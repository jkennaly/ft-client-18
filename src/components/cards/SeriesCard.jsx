// SeriesCard.jsx

import m from 'mithril'

import  ComposedNameField from '../fields/ComposedNameField.jsx';


const SeriesCard = {
  view: ({ attrs }) =>
    <div class="ft-card" onclick={() => m.route.set("/series" + "/pregame" + '/' + attrs.eventId)}>
      <div class="ft-fields">
        {attrs.data ? <ComposedNameField fieldValue={`${attrs.data.name}`} /> : <ComposedNameField fieldValue={'New Series'} />}
      </div>
    </div>
};

export default SeriesCard;