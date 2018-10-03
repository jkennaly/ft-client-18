// WidgetContainer.jsx

const m = require("mithril");

const WidgetContainer = {
  view: ({ children }) => {
    return (
      <div class="widget-container">
        {children}
      </div>
    )
  }
};

export default WidgetContainer;