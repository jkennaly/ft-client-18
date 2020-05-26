// src/store/loading/archive.js
import localforage from 'localforage'
localforage.config({
	name: "Client-44",
	storeName: "Client-44"
})

export default function setLocalList(modelName, newList) {
	const localItem = `Model.${modelName}`

	//console.log('archive', localItem)
	return localforage.setItem(localItem, newList)
	
}
