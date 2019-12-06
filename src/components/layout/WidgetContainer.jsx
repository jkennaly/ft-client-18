// src/components/layout/WidgetContainer.jsx

import m from 'mithril'

const WidgetContainer = {
  view: ({ children }) => {
    return (
      <div class="ft-widget-container">
        {children}
      </div>
    )
  }
};

export default WidgetContainer;