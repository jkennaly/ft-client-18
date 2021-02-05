// src/components/detailViewsPregame/profiles/ContentItem.js
// components: user-profile/components

/*
name | String | No | populates item display
value | String | No | populates item display
*/

import m from 'mithril'
import _ from 'lodash'


const ContentItem = {
	//oncreate: console.log('Launched'),
	//onupdate: () => console.log('ContentItem update'),
	view: ({attrs}) => 
        m('.c44-up-content-item.c44-df.c44-fjcsb', {},
            m(`span${attrs.extractable ? (attrs.extracted ? '.c44-ca.c44-bca' : '.c44-w-100.c44-coc.c44-bcoc') : ''}`, {onclick: attrs.extractToggle}, attrs.name),
            m(`span`, {}, attrs.value)
            
        )
}
export default ContentItem;
