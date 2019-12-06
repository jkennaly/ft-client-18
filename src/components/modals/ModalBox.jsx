// src/componenets/modals/ModalBox.jsx

import m from 'mithril'
import _ from 'lodash'

import Artist from './ArtistEntryModal.jsx'
import Discuss from './DiscussModal.jsx'
import Flag from './FlagModal.jsx'
import Image from './ImageModal.jsx'
import Review from './ReviewModal.jsx'
import Schedule from './SetScheduleModal.jsx'
import Text from './TextEntryModal.jsx'

const modals = {
	artist: Artist,
	discuss: Discuss,
	flag: Flag,
	image: Image,
	review: Review,
	schedule: Schedule,
	text: Text
}

var display = ''
const baseAttrs = {
	hide: () => display = '',
	display: true
}

var modalAttrs = _.assign({}, baseAttrs)

const ModalBox = {
	popRequest: (modalType, modalData) => {
		//console.log('ModalBox popRequest', modalType, modalData)
		modalAttrs = _.assign({}, baseAttrs, modalData)
		display = modalType
		m.redraw()
	},
	view: () =>
		<div class="ft-modal-box">
			{!modals[display] ? '' : m(modals[display], modalAttrs)}
		</div>
}

export default ModalBox