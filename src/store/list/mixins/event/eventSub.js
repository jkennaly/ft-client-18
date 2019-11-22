// eventSub.js

export default (subList) => { return  {
	getSubIds (id) { 
		return subList.getFiltered(s => s[this.idField] === id)
			.map(s => s.id)
	}  
}}