// DragCard.jsx

import m from 'mithril'

import  ComposedNameField from '../fields/ComposedNameField.jsx';

const DragCard = {
  view: ({ attrs }) =>
    <li class={"ft-card column" + attrs.uiClass ? attrs.uiClass : ''} onclick={attrs.action}>
      <div class="ft-fields">
        <ComposedNameField fieldValue={attrs.fieldValue} />
      </div>
    </li>
};

export default DragCard;