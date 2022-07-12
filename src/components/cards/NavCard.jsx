// src/components/cards/NavCard.jsx

import m from 'mithril'

import ComposedNameField from '../fields/ComposedNameField.js';

const NavCard = {
  view: ({ attrs }) =>
    <div class={"ft-card " + (attrs.uiClass ? attrs.uiClass : '')} onclick={attrs.action} data-id={attrs.key} key={attrs.key}>
      <div class="ft-fields">
        <ComposedNameField fieldValue={attrs.fieldValue} />
      </div>
    </div>
};

export default NavCard;