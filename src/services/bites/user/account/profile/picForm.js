// src/services/bites/user/account/profile/picForm.js

//get the subjectCard for the three subjects the user has discussed most

import m from "mithril"
import _ from "lodash"

import StringUpdate from "../../../../../components/fields/form/StringUpdate.jsx"
import UIButton from "../../../../../components/ui/UIButton.jsx"
import CloudinaryUploadWidget from "../../../../../components/widgets/CloudinaryUpload.jsx"

const biteCache = {}
const biteTimes = {}
const cacheLife = 1000
var _widgetExists = false
function widgetExists(state) {
	if (_.isUndefined(state)) return _widgetExists
	return (_widgetExists = state)
}

//retrieve data Promise
//cache Promise Result; trigger update if needed
//export return cached data

//editable profile fields:
//username
//picture
//short bio
//long bio
//highlight text color

const emptyUser = `data:image/svg+xml;utf8,%3C%3Fxml version='1.0' encoding='UTF-8' standalone='no'%3F%3E%3C!-- Written by Treer (gitlab.com/Treer) --%3E%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='600' height='600' fill='white' color='%2300d7d7'%3E%3Ctitle%3EAbstract user icon%3C/title%3E%3Cdefs%3E%3CclipPath id='circular-border'%3E%3Ccircle cx='300' cy='300' r='280' /%3E%3C/clipPath%3E%3CclipPath id='avoid-antialiasing-bugs'%3E%3Crect width='100%25' height='498' /%3E%3C/clipPath%3E%3C/defs%3E%3Ccircle cx='300' cy='300' r='280' fill='currentcolor' clip-path='url(%23avoid-antialiasing-bugs)' /%3E%3Ccircle cx='300' cy='230' r='115' /%3E%3Ccircle cx='300' cy='550' r='205' clip-path='url(%23circular-border)' /%3E%3C/svg%3E`

const dataPromise = (userId, remoteDataField) =>
	remoteDataField.getLocalPromise(userId).then(fav => {
		_.set(biteTimes, `dataPromise[${userId}]`, Date.now())
		_.set(biteCache, `dataPromise[${userId}]`, fav)
		return fav
	})
const cachedBite = (userId, remoteDataField) => {
	const cacheTime = _.get(biteTimes, `dataPromise[${userId}]`, 0)
	const cacheOk = cacheTime + cacheLife > Date.now()
	if (!cacheOk) dataPromise(userId, remoteDataField).catch(console.log)
	return _.get(biteCache, `dataPromise[${userId}]`, [])
}
const formCache = {}
const formStringValue = fieldIndex => newStringValue => {
	if (!_.isString(newStringValue)) return _.get(formCache, fieldIndex)
	return _.set(formCache, fieldIndex, newStringValue)
}
var extracted = false

const extractToggle = () => {
	extracted = !extracted
	//console.log('extractToggle', extracted)
}
export default (userId, remoteDataField, images) => {
	const data = cachedBite(userId, remoteDataField)[0]
	//console.log('picForm data', data)
	const title = "Change Profile Picture"
	if (!data)
		return {
			value: "Loading",
			title: title,
			public: false,
			name: title
		}

	//change picture
	const picString = formStringValue("picture")
	if (!picString()) picString(data.picture)
	const imgSrc = /^http/i.test(picString()) ? picString() : emptyUser
	const picForm = m(
		`form.c44-fvf${extracted ? "" : ".c44-dn"}`,
		{},
		//current pic
		m(
			"header.c44-up-header.c44-pr.c44-fvf",
			{},
			m(`img.c44-h-ma25vh.c44-of-con[src=${imgSrc}]`)
		),
		//Preview Cahnge/Save Change/Discard Change buttons
		m(UIButton, {
			action: e => {
				widgetExists(true)
			},
			buttonName: "Change Picture"
		}),
		widgetExists()
			? m(CloudinaryUploadWidget, {
					subject: userId,
					subjectType: USER,
					resultFunction: result => {
						//fail silently
						if (!result) return
						console.log(result)
						if (result.info.secure_url.indexOf("image" > 0)) {
							images
								.create({
									subject: userId,
									subjectType: USER,
									url: result.info.secure_url,
									title: "Profile Pic",
									sourceUrl: result.info.secure_url,
									author: userId,
									license: "self",
									licenseUrl: "http://festigram"
								})
								.then(img => {
									console.log("img uploaded", img)
									const newData = Object.assign(_.clone(data), {
										picture: img.url
									})
									return remoteDataField.updateInstance(
										newData,
										newData.id
									)
								})
								.catch(console.log)
							widgetExists(false)
						}
					},
					cancelFunction: result => {
						//fail silently
						if (!result) return
						//console.log("cancelFunction", result.event)
						widgetExists(false)
						m.redraw()
					}
			  })
			: ""
	)

	return {
		value: picForm,
		title: title,
		public: false,
		name: title,
		extractable: true,
		extractToggle: extractToggle,
		extracted: extracted
	}
}
