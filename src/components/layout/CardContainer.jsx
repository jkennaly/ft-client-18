// CardContainer.jsx

import m from 'mithril'

const CardContainer = {
  view: ({ children }) => {
    return (
      <div class="card-container">
        {children}
      </div>
    )
  }
};

export default CardContainer;