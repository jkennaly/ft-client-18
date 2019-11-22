// src/components/fields/DateNail.jsx

import m from 'mithril'
import _ from 'lodash'

import CircleNail from './CircleNail.jsx'

import {remoteData} from '../../store/data.js'

const images = remoteData.Images


const DateNail = {
        view: ({attrs}) => <CircleNail 
        subjectType={ARTIST} 
        subject={_.get(images.forDateSingle(attrs.eventId), 'subject', 0)}
      />
}

export default DateNail;