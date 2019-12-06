// src/components/layout/DragCardContainer.jsx

import m from 'mithril'

const DragCardContainer = {
  view: ({ children }) => {
    return (
      <ul id="columns" class="ft-card-container">
        {children}
      </ul>
    )
  }
};

export default DragCardContainer;