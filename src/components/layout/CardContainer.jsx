// src/components/layout/CardContainer.jsx

import m from 'mithril'

const CardContainer = {
  view: ({ children }) => {
    return (
      <div class="ft-card-container">
        {children}
      </div>
    )
  }
};

export default CardContainer;