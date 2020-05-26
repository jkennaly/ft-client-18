// src/componenets/modals/ModalBox.jsx

import m from 'mithril'
import _ from 'lodash'

import Discuss from './DiscussModal.jsx'
import Flag from './FlagModal.jsx'
import Image from './ImageModal.jsx'
import OptionSelect from './OptionSelectModal.jsx'
import Review from './ReviewModal.jsx'
import Schedule from './SetScheduleModal.jsx'
import Text from './TextEntryModal.jsx'

const modals = {
	discuss: Discuss,
	flag: Flag,
	image: Image,
	option: OptionSelect,
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
		<div class="c44-modal-box">
			{!modals[display] ? '' : m(modals[display], modalAttrs)}
		</div>
}

export default ModalBox