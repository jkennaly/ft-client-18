// DragCardContainer.jsx

import m from 'mithril'

const DragCardContainer = {
  view: ({ children }) => {
    return (
      <ul id="columns" class="card-container">
        {children}
      </ul>
    )
  }
};

export default DragCardContainer;