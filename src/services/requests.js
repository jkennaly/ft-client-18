// requests.js

export const tokenFunction = token => function(xhr) {
	xhr.setRequestHeader('Authorization', 'Bearer ' + token)
}

export const reqOptionsCreate = config => (dataFieldName, method = 'POST') => data => { 
	//console.log('reqOptionsCreate missing dataFieldName ', dataFieldName, data)
	return {
	method: method,
	url: '/api/' + dataFieldName,
  	config: config,
  	data: data,
  	background: true
}}