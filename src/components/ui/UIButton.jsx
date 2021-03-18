// src/components/ui/UIButton.jsx

import m from 'mithril'

const UIButton = {
  view: ({ attrs }) =>
    <div onclick={attrs.action ? e => {e.preventDefault(); attrs.action(e)}: ''} class="ft-ui-button c44-hov-cp">
      <span>{attrs.buttonName}</span>
    </div>
};

export default UIButton;