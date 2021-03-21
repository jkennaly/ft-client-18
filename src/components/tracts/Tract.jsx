// src/components/tracts/Tract.jsx

import m from 'mithril'


const jsx = {
  //oninit: ({attrs}) => remoteData.Artists.getLocakPromise(attrs.data.id).catch(console.error),
  view: ({ attrs, children }) => <div   >
  	{attrs.headline ? <h1 
  		class={`c44-w-100 c44-fvf ${attrs.extracted ? 'c44-ca c44-bca' : 'c44-coc c44-bcoc'}`}
  		onclick={attrs.tractToggle}
  	>{attrs.headline}</h1> : ''}
  	<div class={attrs.extracted ? '' : 'c44-dn'} >
  		{attrs.children}
  	</div>
  </div>
    
};
const Tract = {
  view: ({ attrs, children }) => {
    const mapping = {
      extracted: attrs.extracted,
      headline: attrs.headline,
      children: children,
      tractToggle: attrs.tractToggle
    }
    return m(jsx, mapping)
  }
}

export default Tract