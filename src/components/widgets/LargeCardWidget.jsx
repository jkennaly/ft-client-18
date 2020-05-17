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
     <span class="c44-quarter c44-close-click" onclick={vnode.attrs.closeClick}><i class="fas fa-times"/></span> :
      ''}
  {vnode.attrs.headerCard}
  </header>
  <div class={"c44-card-container " + (vnode.attrs.containerClasses ? vnode.attrs.containerClasses : '')}>  
    { vnode.children }
  </div>
  <footer>{vnode.attrs.footer}</footer>
</section>
    )
  }
};

export default LargeCardWidget;