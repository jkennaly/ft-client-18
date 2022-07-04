// src/services/fetchT.js

export default async function fetchWithTimeout(resource, options = {}) {
	const { timeout = 1000 } = options

	const controller = new AbortController()
	const id = setTimeout(() => {
		//console.log('fetchT timed out')
		return controller.abort()
	}, timeout)
	try {
		const response = await fetch(resource, {
			...options,
			signal: controller.signal
		})
		clearTimeout(id)


		return response
	} catch (err) {
		return
	}
}
