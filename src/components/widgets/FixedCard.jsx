// FixedCard.jsx


import m from 'mithril'

import FiftyButton from '../cardOverlays/fifty/FiftyButton.jsx'

const classes = attrs => {
	return (attrs.quarter ? 'quarter ' : '') + 
	(attrs.display ? '' : 'hidden ') + 
	(attrs.tall ? 'ft-widget-tall ' : '')
}

const FixedCardWidget = {
  view: (vnode) => {
    return (
<section class={`ft-widget-fixed-card ${classes(vnode.attrs)}`}>
  <header class="ft-widget-header"><div class="ft-widget-header-text">{vnode.attrs.header}</div>{vnode.attrs.button ? <FiftyButton>{vnode.attrs.button}</FiftyButton> : ''}</header>
  <div class={"card-container " + (vnode.attrs.containerClasses ? vnode.attrs.containerClasses : '')}>  
    { vnode.children }
  </div>
  <footer>{vnode.attrs.footer}</footer>
</section>
    )
  }
};

export default FixedCardWidget;