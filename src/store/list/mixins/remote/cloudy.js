// src/store/list/mixins/remote/cloudy.js

import _ from 'lodash'
import { Cloudinary } from "@cloudinary/base"
import { Actions } from "@cloudinary/base"
import { Qualifiers } from "@cloudinary/base"
//import { scale, fill, thumbnail } from "@cloudinary/base/actions/resize"
//import { autoGravity } from "@cloudinary/base/qualifiers/gravity"
import foreign from "../../../loading/foreign"
const {Resize} = Actions
const { scale, fill, thumbnail } = Resize
const {Gravity} = Qualifiers
const { autoGravity } = Gravity

// Create your instance
const cld = new Cloudinary({
	cloud: {
		cloudName: "dbezrymmc",
	},
	url: {
		secure: true, // force https, set to false to force http
	},
})

export default {
	cloudyId(id) {
		if (!id) return
		const img = this.get(id)
		if (!img) return
		const cloudyId = img.url.substring(img.url.indexOf("artists/"))
		return cloudyId
	},
	src(id, opts = {}) {
		if (!id) return
		const cloudyId = this.cloudyId(id)
		const scaleParam =
			opts.scale &&
			scale()
				.width(opts.scale.width)
				.height(opts.scale.height)
		const fillParam =
			opts.fill &&
			fill()
				.width(opts.fill.width)
				.height(opts.fill.height)
		const thumbParam =
			opts.thumbnail &&
			thumbnail()
				.width(opts.thumbnail.width)
				.height(opts.thumbnail.height)
				.gravity(autoGravity())
		const base = cld.image(cloudyId)
		const scaled = scaleParam ? base.resize(scaleParam) : base
		const filled = fillParam ? scaled.resize(fillParam) : scaled
		const thumbed = thumbParam ? filled.resize(thumbParam) : filled

		const final = thumbed
		const url = final.toURL()
		return url
	},
}
