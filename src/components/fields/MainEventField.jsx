// src/components/fields/MainEventField.jsx
//attrs: 	seriesId
//			festivalId

import m from 'mithril'

import  FestivalYearField from './FestivalYearField.jsx';
import  SeriesNameField from './SeriesNameField.jsx';

const MainEventField = {
  view: ({ attrs }) =>
    <div class="c44-name-fields">
        <SeriesNameField seriesId={attrs.seriesId} /> 
        <div class="c44-name-field c44-spacer" /> 
        <FestivalYearField festivalId={attrs.festivalId} />
      </div>
};

export default MainEventField;