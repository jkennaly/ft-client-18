// src/components/widgets/FixedCard.jsx


import m from 'mithril'

import FiftyButton from '../cardOverlays/fifty/FiftyButton.jsx'

const classes = attrs => {
	return (attrs.quarter ? 'c44-quarter ' : '') + 
	(attrs.display ? '' : 'hidden ') + 
  (attrs.tall ? 'c44-widget-tall ' : '')
}

const FixedCardWidget = {
  view: (vnode) => {
    return (
<section class={`c44-widget-fixed-card ${classes(vnode.attrs)}`}>
  <header class="c44-widget-header"><div class="c44-widget-header-text">{vnode.attrs.header}</div>{vnode.attrs.button ? <FiftyButton>{vnode.attrs.button}</FiftyButton> : ''}</header>
  <div class={"c44-card-container " + (vnode.attrs.containerClasses ? vnode.attrs.containerClasses : '')}>  
    { vnode.children }
  </div>
  <footer>{vnode.attrs.footer}</footer>
</section>
    )
  }
};

export default FixedCardWidget;