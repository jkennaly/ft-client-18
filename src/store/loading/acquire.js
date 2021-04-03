// src/store/loading/acquire.js

import m from "mithril"
import _ from "lodash"
import localforage from "localforage"
localforage.config({
	name: "FestiGram",
	storeName: "FestiGram",
})
import archive from "./archive"
import fetchT from "../../services/fetchT"
import Auth from "../../services/auth"
const auth = Auth

//core
/*
[
'Artists',
'Images',
'Series',
'Festivals',
'Dates',
'Days',
'Sets',
'Lineups',
'Venues',
'Organizers',
'Places',
'ArtistPriorities',
'StagePriorities',
'StageLayouts',
'PlaceTypes',
'ArtistAliases',
'ParentGenres',
'Genres',
'ArtistGenres',
'MessageTypes',
'SubjectTypes',
]
*/
//core acquisition is done on app start if there is no core already present

const authOnly = ["MessagesMonitors", "Intentions"]

const loggedOnly = [/Intentions/, /MessagesMonitors/]

const headerBase = {
	"Content-Type": "application/json",
}
export const coreCheck = () =>
	localforage
		.getItem("Model.core")
		.then(coreData => coreData || window.mockery === true)
		.then(
			coreData =>
				(coreData &&
					coreData.timestamp &&
					coreData.timestamp + 7 * 24 * 3600 * 1000 < Date.now()) ||
				fetchT("/api/Core/all/data", {
					method: "get",
					headers: new Headers(headerBase),
				})
		)
		//.then(data => (console.dir("coreCheck data", data) && false) || data)
		.then(response => (response.json ? response.json() : response))
		.then(data => (data.data ? data.data : data))
		.then(coreData => archive("core", coreData))
		.then(coreData =>
			Promise.all(
				_.map(coreData, (list, modelName) => archive(modelName, list))
			).then(() => coreData)
		)
		.catch(err => {
			console.error("acquire core error", err)
		})

export const coreChecked = coreCheck()

export function updateModel(modelName, queryString = "", url, simResponse) {
	let updated = false
	if (!modelName) return Promise.reject("missing model name")

	const reqUrl = url
		? url + (queryString ? "?" : "") + queryString
		: `/api/${modelName}${queryString ? "?" : ""}${
				queryString ? queryString : ""
		  }`
	const localItem = `Model.${modelName}`
	const setModel = _.curry(archive)(modelName)

	//console.log(modelName, queryString = '', url, simResponse)
	const resultChain = coreChecked
		.catch(err => {})
		.then(() =>
			simResponse && simResponse.remoteData
				? Promise[simResponse.remoteResult](simResponse.remoteData)
				: auth
						.getBothTokens()
						.catch(err => {
							if (
								err.error === "login_required" ||
								err === "login required" ||
								err === "auth fail"
							)
								return
							throw err
						})

						//.then(x => console.log('getBothTokens', x) && x || x)
						//.then(([authResult, gtt]) => authResult ? [authResult, gtt] : [false])

						.then(([authResult, gtt]) =>
							!authResult && authOnly.includes(modelName)
								? { ok: true, json: () => [] }
								: fetchT(reqUrl, {
										method: "get",
										headers: new Headers(
											authResult
												? _.assign({}, headerBase, {
														Authorization: `Bearer ${authResult}`,
														"X-GT-Access-Token": gtt,
												  })
												: headerBase
										),
								  })
						)
						//.then(x => console.log(modelName, 'authResult ', x) && x || x)
						.then(response => {
							if (!response.ok) {
								throw new Error("Network response was not ok")
							}
							return response
						})
						.then(response => response.json())
		)

		.then(response =>
			_.isArray(response.data) || (response.data && response.data.id)
				? response.data
				: response
		)
		/*
		.then(x => {
			console.log('resultChain', x)
			return x
		})
		*/
		.then(response => (response.id ? [response] : response))
		.then(data => {
			updated = Boolean(data.length)
			return data
		})
		.catch(err => {
			if (!simResponse) console.trace("updateModel err", err)
			throw err
		})
	const localChain =
		simResponse && simResponse.localData
			? Promise[simResponse.localResult](simResponse.localData)
			: localforage
					.getItem(localItem)

					.then(item => (_.isArray(item) ? item : []))
	return Promise.all([resultChain, localChain])
		.then(([newData, oldData]) => [
			_.unionBy(newData, oldData, "id"),
			newData,
		])
		.then(([data, newData]) => {
			setModel(data)
			return data
		})
		.then(data => [updated, data])
}
