// requests.js

export const tokenFunction = token => function (xhr) {
	xhr.setRequestHeader('Authorization', 'Bearer ' + token)
}

const apiUrl = API_URL

export const reqOptionsCreate = config => (dataFieldName, method = 'POST') => data => {
	//console.log('reqOptionsCreate missing dataFieldName ', dataFieldName, data)
	return {
		method: method,
		url: apiUrl + '/api/' + dataFieldName,
		config: config,
		data: data,
		background: true
	}
}