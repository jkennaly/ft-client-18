// src/store/list/mixins/remote/www/getWikiPromise.js



import m from 'mithril'
import _ from 'lodash'
import foreign from '../../../../loading/foreign'
var stash = {}

export default {
	getWikiId (id) {
		if(!id) {
			return Promise.reject('No id for getWikiPromise ' + this.fieldName)
		}
		if(!_.isInteger(id)) {
			throw new Error('Invalid getWikiPromise id', id)
		}
		//console.log(this.fieldName, 'getWikiPromise start', id)
		//get subjectData from the model, loading from the server if needed
		//const get = this.get(id)
		//if(get) return Promise.resolve(get)

		//for each subject Type, collect detail information
		const key = `${this.fieldName}[${id}].id`
		const cached = _.get(stash, key)
		if(_.isNumber(cached)) return Promise.resolve(cached)
		return this.getLocalPromise(id)
			.then(() => this.getName(id))
			.then(n => `https://en.wikipedia.org/w/rest.php/v1/search/title?q=${n}`)
			.then(foreign)
			.then(wiki => {
				const noResult = !wiki || !wiki.pages || !wiki.pages.filter
				if(noResult) return
					const artistName = this.getName(id)
				const matches = wiki.pages.filter(x => x.title.indexOf(artistName) > -1)
				const possibles = matches.length ? matches : wiki.pages
				const bands = possibles.filter(x => /band\)$/i.test(x.title))
				const musicians = possibles.filter(x => /musician\)$/i.test(x.title))
				const choice = [...bands, ...musicians, ...possibles][0]

				//console.log('getWikiId', possibles, bands, musicians)
				_.set(stash, key, choice.id)
				return choice.id
			})
			.catch(err => {
				console.error('getWikiPromise error', this.fieldName, id, err)
			})
	},
	getWikiPromise (id) {
		if(!id) {
			return Promise.reject('No id for getWikiPromise ' + this.fieldName)
		}
		if(!_.isInteger(id)) {
			throw new Error('Invalid getWikiPromise id', id)
		}
		//console.log(this.fieldName, 'getWikiPromise start', id)
		//get subjectData from the model, loading from the server if needed
		//const get = this.get(id)
		//if(get) return Promise.resolve(get)

		//for each subject Type, collect detail information
		const key = `${this.fieldName}[${id}].value`
		const cached = _.get(stash, key)
		if(cached) return Promise.resolve(cached)
		return this.getWikiId(id)
			.then(n => `http://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&pageids=${n}`)
			.then(foreign)
			.then(wiki => {
				const wikiExtract = _.get(_.values(_.get(wiki, 'query.pages', {})), '[0].extract', '')
				const wikiPage = parseInt(_.get(_.keys(_.get(wiki, 'query.pages', {})), '[0]', '0'), 10)
				const wikiGraphStart = wikiExtract.indexOf('<p')
				const wikiGraphEnd = wikiExtract.lastIndexOf('</p>') + 4
				const wikiGraph = wikiExtract.slice(wikiGraphStart, wikiGraphEnd)
				const wikiLink = `https://en.wikipedia.org/?curid=${wikiPage}`
				//console.log('getWikiPromise', wiki)
				_.set(stash, key, [wikiGraph, wikiLink])
				return [wikiGraph, wikiLink]
			})
			.catch(err => {
				console.error('getWikiPromise error', this.fieldName, id, err)
			})
	},
	getWiki (id) {
		const key = `${this.fieldName}[${id}].value`
		const cached = _.get(stash, key)
		if(!cached) this.getWikiPromise(id)
		if(!cached) return ['', '']
		return cached

	}
}