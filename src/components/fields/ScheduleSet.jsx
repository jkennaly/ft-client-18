// ScheduleSet.jsx

const m = require("mithril");


import  ArtistNameField from './ArtistNameField.jsx';

import {remoteData} from '../../store/data';


const ScheduleSet = (vnode) => {
  //const elId = "schedule-set-" + (vnode.attrs.artistId ? 'artist-' + vnode.attrs.artistId : vnode.attrs.set.id)


  const initDom = vnode => {
    //console.log('ScheduleSet')
    //console.log(vnode.attrs.set.start)
    //console.log(vnode.dom.style.bottom)
      vnode.dom.style.bottom = '' + vnode.attrs.set.start +'px'
      vnode.dom.style.height = '' + (vnode.attrs.set.end - vnode.attrs.set.start) +'px'
    //console.log(vnode.dom.style.bottom)
  }

  return {
    oncreate: initDom,
    onupdate: initDom,
    view: ({attrs}) => <div 
        class="schedule-set" 
        onclick={attrs.clickFunction ? attrs.clickFunction : () => 0}
        key={'_' + (attrs.set.id ? attrs.set.id : '' + attrs.set.band + '.' + attrs.set.start)}
      >
    	<ArtistNameField artistId={attrs.set.band} />
    	<div>
        <span>
          {
           remoteData.Days
              .getBaseMoment(attrs.set.day)
              .add(attrs.set.start, 'minutes').format('h:mm') + '-' + remoteData.Days
              .getBaseMoment(attrs.set.day)
              .add(attrs.set.end, 'minutes').format('h:mm')
          }
        </span>
      </div>
    </div>
}};

export default ScheduleSet;