export function isFunction(value) {
	return typeof value === 'function'
}

export function isInLocal() {
	if (!location) {
		return false
	}

	return location.hostname === 'localhost' || location.hostname === '0.0.0.0'
}
