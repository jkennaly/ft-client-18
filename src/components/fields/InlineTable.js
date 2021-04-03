// src/components/fields/InlineTable.js
// components: user-profile/components

/*
name | String | No | populates item display
value | String | No | populates item display
*/

import m from "mithril"
import _ from "lodash"
import IconText from "./IconText.jsx"

const InlineTable = {
	//oncreate: console.log('Launched'),
	//onupdate: () => console.log('InlineTable update'),
	view: ({ attrs }) =>
		m(
			".ft-field-inline-table.c44-w-ma90.c44-w-90.c44-fvf.c44-faic",
			{},
			!attrs.name
				? ""
				: m(
						`h3[name=${attrs.name
							.split(" ")
							.pop()}].c44-hov-cp.c44-faic${
							attrs.extractable
								? attrs.extracted
									? ".c44-ca.c44-bca"
									: ".c44-w-100.c44-coc.c44-bcoc"
								: ""
						}`,
						{ onclick: attrs.extractToggle },
						m(
							`span`,
							{},
							attrs.extracted
								? m(IconText, { name: "shrink" })
								: m(IconText, { name: "enlarge" }),
							attrs.name
						)
				  ),

			attrs.value
		),
}
export default InlineTable
