// MenuField.jsx

const m = require("mithril");

import MenuField from './MenuField.jsx';


const classes = attrs => 'menu-item ' + (attrs.selected ? 'menu-item-selected' : '')
const MenuItem = {
  view: ({ attrs }) =>
    <div class={classes(attrs)} onclick={() => attrs.stateChange(attrs.display)}>
      <div class="menu-item-fields">
        <MenuField display={attrs.display} selected={attrs.selected}/>
      </div>
    </div>
};

export default MenuItem;