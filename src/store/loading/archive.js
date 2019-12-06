// src/store/loading/archive.js
import localforage from 'localforage'
localforage.config({
	name: "FestiGram",
	storeName: "FestiGram"
})

export default function setLocalList(modelName, newList) {
	const localItem = `Model.${modelName}`

	//console.log('archive', localItem)
	return localforage.setItem(localItem, newList)
	
}
