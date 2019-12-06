// src/components/widgets/LargeCardWidget.jsx


import m from 'mithril'
const classes = ({display}) => {return (display ? '' : 'hidden');}

const LargeCardWidget = {
  view: (vnode) => {
    return (
<section class={classes(vnode.attrs) + " full"}>
  <header>
  {vnode.attrs.header}
  {vnode.attrs.closeClick ? 
     <span class="quarter ft-close-click" onclick={vnode.attrs.closeClick}><i class="fas fa-times"/></span> :
      ''}
  {vnode.attrs.headerCard}
  </header>
  <div class={"ft-card-container " + (vnode.attrs.containerClasses ? vnode.attrs.containerClasses : '')}>  
    { vnode.children }
  </div>
  <footer>{vnode.attrs.footer}</footer>
</section>
    )
  }
};

export default LargeCardWidget;