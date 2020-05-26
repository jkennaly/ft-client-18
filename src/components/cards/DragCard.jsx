// src/components/cards/DragCard.jsx

import m from 'mithril'

import  ComposedNameField from '../fields/ComposedNameField.jsx';

const DragCard = {
  view: ({ attrs }) =>
    <li class={"c44-card column" + attrs.uiClass ? attrs.uiClass : ''} onclick={attrs.action}>
      <div class="c44-fields">
        <ComposedNameField fieldValue={attrs.fieldValue} />
      </div>
    </li>
};

export default DragCard;