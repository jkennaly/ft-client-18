// FixedCard.jsx


import m from 'mithril'
const classes = attrs => {return (attrs.quarter ? 'quarter ' : '') + (attrs.display ? '' : 'hidden');}

const FixedCardWidget = {
  view: (vnode) => {
    return (
<section class={classes(vnode.attrs)}>
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