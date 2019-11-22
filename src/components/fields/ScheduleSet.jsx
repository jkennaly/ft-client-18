// ScheduleSet.jsx

import m from 'mithril'


import  ArtistNameField from './ArtistNameField.jsx';
import moment from 'moment-timezone/builds/moment-timezone-with-data-2012-2022.min'

import {remoteData} from '../../store/data';
import {subjectData} from '../../store/subjectData';

const sets = remoteData.Sets

const ScheduleSet = (vnode) => {
  //const elId = "schedule-set-" + (vnode.attrs.artistId ? 'artist-' + vnode.attrs.artistId : vnode.attrs.set.id)
let baseMoment, startMoment, endMoment

  const initDom = vnode => {
    //console.log('ScheduleSet')
    //console.log(vnode.attrs.set.start)
    //console.log(vnode.dom.style.bottom)
    const reference = !vnode.attrs.bottom ? 'top' : 'bottom'
    vnode.dom.style[reference] = '' + (vnode.attrs.set.start - (vnode.attrs.startOffset ? vnode.attrs.startOffset: 0)) +'px'
    vnode.dom.style.height = '' + (vnode.attrs.set.end - vnode.attrs.set.start) +'px'
    const feelingClass = subjectData.feelingClass({subject: vnode.attrs.set.id, subjectType: subjectData.SET})
    if(feelingClass) vnode.dom.classList.add(feelingClass)
    //console.log(vnode.dom.style.bottom)
  }

  return {
    oncreate: initDom,
    onupdate: initDom,
    view: ({attrs}) => <div 
        class="schedule-set" 
        data-stage={attrs.set.stage}
        onclick={attrs.clickFunction ? attrs.clickFunction : () => 0}
        key={'_' + (attrs.set.id ? attrs.set.id : '' + attrs.set.band + '.' + attrs.set.start)}
      >
    	<ArtistNameField artistId={attrs.set.band} />
    	<div>
        <span>
          {sets.getSetTimeText(attrs.set.id)}
        </span>
      </div>
    </div>
}};

export default ScheduleSet;