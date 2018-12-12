// DraggableCard.jsx


import m from 'mithril'

const DraggableCardWidget = {
  view: (vnode) => {
    return (
<section>
  <header>{vnode.attrs.header}</header>
  <ul id="columns" class="card-container">  
    { vnode.children }
  </ul>
  <footer>{vnode.attrs.footer}</footer>
</section>
    )
  }
};

export default DraggableCardWidget;