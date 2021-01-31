// src/components/layout/MainStage.jsx

import m from 'mithril'


const jsx = {
  //oninit: ({attrs}) => remoteData.Artists.getLocakPromise(attrs.data.id).catch(console.error),
  view: ({ attrs }) => <div 
    class={"ft-card ft-card-artist " + (attrs.uiClass ? attrs.uiClass : '')} 
    key={attrs.data ? 'artist-' + attrs.data.id : ''} 
    onclick={attrs.clickFunction ? attrs.clickFunction : defaultClick(attrs)}
  >
    <div class="ft-fields-with-thumbnail">
      {attrs.overlay === 'research' && attrs.data ? <ResearchOverlay 
        artistId={attrs.data.id}
        reviewSubject={attrs.reviewSubject}
      /> : ''}
      {attrs.data ? <CircleNail 
        subjectType={2} 
        subject={attrs.data.id}
      /> : ''}
      <div class="ft-vertical-fields">
        <div class="ft-fields">
          {attrs.data ? <ComposedNameField fieldValue={`${ attrs.data.name}`} /> : ''}
        </div>
        {attrs.festivalId ? <div class="ft-set-diff-fields">
          <NameField fieldValue={remoteData.ArtistPriorities.getName(remoteData.Lineups.getPriFromArtistFest(attrs.data.id, attrs.festivalId))} />
        </div> : ''}
      </div>
    </div>
  </div>
    
};
const WidgetAccordion = {
  view: ({ attrs }) => {
    //console.log('WidgetAccordion attrs', attrs)
    const mapping = {
      
    }
    return m(jsx, mapping)
  }
}

export default WidgetAccordion