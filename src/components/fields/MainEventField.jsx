// src/components/fields/MainEventField.jsx
//attrs: 	seriesId
//			festivalId

import m from 'mithril'

import  FestivalYearField from './FestivalYearField.jsx';
import  SeriesNameField from './SeriesNameField.jsx';

const MainEventField = {
  view: ({ attrs }) =>
    <div class="ft-name-fields">
        <SeriesNameField seriesId={attrs.seriesId} /> 
        <div class="ft-name-field ft-spacer" /> 
        <FestivalYearField festivalId={attrs.festivalId} />
      </div>
};

export default MainEventField;