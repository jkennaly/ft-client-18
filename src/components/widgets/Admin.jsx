// src/components/widgets/Admin.jsx


import m from 'mithril'

const AdminWidget = {
  view: (vnode) => {
    return (
<section class={(vnode.attrs.quarter ? 'ft-quarter ' : '')}>
  <header>{vnode.attrs.header}</header>
  <div class={"ft-card-container " + (vnode.attrs.containerClasses ? vnode.attrs.containerClasses : '')}>  
    { vnode.children }
  </div>
  <footer>{vnode.attrs.footer}</footer>
</section>
    )
  }
};

export default AdminWidget;