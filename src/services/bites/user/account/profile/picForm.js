// src/services/bites/user/account/profile/picFormjs

//get the subjectCard for the three subjects the user has discussed most


import m from 'mithril'
import _ from 'lodash'

import StringUpdate from '../../../../../components/fields/form/StringUpdate.jsx'
import UIButton from '../../../../../components/ui/UIButton.jsx'

const biteCache = {}
const biteTimes = {}
const cacheLife = 1000

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

const dataPromise = (userId, remoteDataField) => remoteDataField
	.getLocalPromise(userId)
	.then(fav => {
		_.set(biteTimes, `dataPromise[${userId}]`, Date.now())
		_.set(biteCache, `dataPromise[${userId}]`, fav)
		return fav
	})
const cachedBite = (userId, remoteDataField) => {
	const cacheTime = _.get(biteTimes, `dataPromise[${userId}]`, 0)
	const cacheOk = cacheTime + cacheLife > Date.now()
	if (!cacheOk) dataPromise(userId, remoteDataField)
		.catch(console.log)
	return _.get(biteCache, `dataPromise[${userId}]`, [])
}
const formCache = {}
const formStringValue = fieldIndex => newStringValue => {
	if(!_.isString(newStringValue)) return _.get(formCache, fieldIndex)
	return _.set(formCache, fieldIndex, newStringValue)

}
var extracted = false

const extractToggle = () => {
	extracted = !extracted
	//console.log('extractToggle', extracted)
}
export default  (userId, remoteDataField) => {
	const data = cachedBite(userId, remoteDataField)[0]
	//console.log('picForm data', data)
	const title = 'Change Profile Picture'
	if(!data) return {
		value: 'Loading',
		title: title,
		public: false,
		name: title
	}

	//change picture
	const picString = formStringValue('picture')
	if(!picString()) picString(data.picture)
	const imgSrc = /^http/i.test(picString()) ? picString() : emptyUser
	const picForm = m(`form${extracted ? '' : '.c44-dn'}`, {

	},
		//current pic
		m('header.c44-up-header.c44-pr.c44-fvf', {}, 
           m(`img.c44-h-ma25vh.c44-of-con[src=${imgSrc}]`)
        ),
		//input field
		m(StringUpdate, {
			keyField: userId ? userId : 0,
			patternChange: picString,
			name: 'Change Profile Picture',
			value: picString()
		}),
		//Preview Cahnge/Save Change/Discard Change buttons
		m(UIButton, {
			action: e => {
				//console.log('discarding changes', data.picture)
                picString(data.picture ? data.picture : '')
                m.redraw()


            },
        	buttonName: 'Discard Change'
		}),
		m(UIButton, {
			action: e => {
				const newData = Object.assign(_.clone(data), {picture: picString()})
				//console.log(newData)
                return remoteDataField.updateInstance(newData, newData.id)
                	.then(() => extracted = false)
                	.catch(console.log)


            },
        	buttonName: 'Accept Change'
		})
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