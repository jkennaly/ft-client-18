// NavCard.jsx

import m from 'mithril'

import  ComposedNameField from '../fields/ComposedNameField.jsx';

const NavCard = {
  view: ({ attrs }) =>
    <div class="ft-card" onclick={attrs.action} data-id={attrs.key} key={attrs.key}>
      <div class="ft-fields">
        <ComposedNameField fieldValue={attrs.fieldValue} />
      </div>
    </div>
};

export default NavCard;