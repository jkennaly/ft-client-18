// src/components/cards/CenterMenuCard.jsx

import m from 'mithril'

import ComposedNameField from '../fields/ComposedNameField.js'

const CenterMenuCard = {
  view: ({ attrs }) =>
    <div class="ft-card-large" onclick={attrs.action}>
      <div class="ft-fields">
        <ComposedNameField fieldValue={attrs.fieldValue} />
      </div>
    </div>
}

export default CenterMenuCard