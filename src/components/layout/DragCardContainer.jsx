// DragCardContainer.jsx

const m = require("mithril");

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