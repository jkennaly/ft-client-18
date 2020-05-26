// src/components/cards/CenterMenuCard.jsx

import m from 'mithril'

import  ComposedNameField from '../fields/ComposedNameField.jsx'

const CenterMenuCard = {
  view: ({ attrs }) =>
    <div class="c44-card-large" onclick={attrs.action}>
      <div class="c44-fields">
        <ComposedNameField fieldValue={attrs.fieldValue} />
      </div>
    </div>
}

export default CenterMenuCard