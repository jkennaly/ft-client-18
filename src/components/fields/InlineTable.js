// src/components/fields/InlineTable.js
// components: user-profile/components

/*
name | String | No | populates item display
value | String | No | populates item display
*/

import m from 'mithril'
import _ from 'lodash'


const InlineTable = {
	//oncreate: console.log('Launched'),
	//onupdate: () => console.log('InlineTable update'),
	view: ({attrs}) => 
        m('.ft-field-inline-table', {},
            m(`h3${attrs.extractable ? (attrs.extracted ? '.c44-ca.c44-bca' : '.c44-w-100.c44-coc.c44-bcoc') : ''}`, {onclick: attrs.extractToggle}, attrs.name),
            attrs.value
            
        )
}
export default InlineTable;
