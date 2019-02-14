import m from 'mithril'

const UIButton = {
  view: ({ attrs }) =>
    <div onclick={attrs.action ? e => {e.preventDefault(); attrs.action(e)}: ''} class="ui-button">
      <span>{attrs.buttonName}</span>
    </div>
};

export default UIButton;