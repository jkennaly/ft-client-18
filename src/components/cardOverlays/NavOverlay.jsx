// NavOverlay.jsx

import m from 'mithril'



const NavOverlay = {
  view: ({ attrs }) => <div class="ft-card-overlay" onclick={e => {
  	e.stopPropagation()
  	m.route.set(attrs.route)
  }}>
  </div>
    
};

export default NavOverlay;