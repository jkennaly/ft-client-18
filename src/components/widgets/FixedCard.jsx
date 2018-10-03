// FixedCard.jsx


const m = require("mithril");

const FixedCardWidget = {
  view: (vnode) => {
    return (
<section class={(vnode.attrs.quarter ? 'quarter ' : '')}>
  <header>{vnode.attrs.header}</header>
  <div class={"card-container " + (vnode.attrs.containerClasses ? vnode.attrs.containerClasses : '')}>  
    { vnode.children }
  </div>
  <footer>{vnode.attrs.footer}</footer>
</section>
    )
  }
};

export default FixedCardWidget;