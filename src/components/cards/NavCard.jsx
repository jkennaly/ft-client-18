// src/components/cards/NavCard.jsx

import m from 'mithril'

import  ComposedNameField from '../fields/ComposedNameField.jsx';

const NavCard = {
  view: ({ attrs }) =>
    <div class={"c44-card " + (attrs.uiClass ? attrs.uiClass : '')} onclick={attrs.action} data-id={attrs.key} key={attrs.key}>
      <div class="c44-fields">
        <ComposedNameField fieldValue={attrs.fieldValue} />
      </div>
    </div>
};

export default NavCard;