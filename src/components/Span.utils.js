const getNonce = (nonce = 'YXN0cm8tc3Bhbg==') => {
	for (let name in cache) delete cache[name]
	return nonce
}

/** Returns the given content as data-uri in a script tag. */
const getScript = (
	/** @type {string} */ data,
	/** @type {string} */ path,
	/** @type {string} */ nonce
) => {
	const hash = data ? getHash(data) : ''
	const isValidUsage = Boolean(data)
	const isFirstUsage = isValidUsage && (!cache[path] || !(hash in cache[path]))

	if (isValidUsage) {
		cache[path] = Object(cache[path])
		cache[path][hash] = true
	}

	return (
		isValidUsage
			? isFirstUsage
				? `<script type="module" async${nonce ? ` nonce="${nonce}"` : ''} id="${hash}">${
					`let $=(${hash}.length?[...${hash}]:[${hash}]),host;` +
					`for($ of $){` +
						`host=$.previousSibling;` +
						`$.remove();` +
						`${data}` +
					`}`
				}</script>`
			: `<meta id=${hash} />`
		: ''
	)
}

/** Returns an alphanumeric hash from the given content. */
const getHash = (/** @type {string} */ data) => {
	for (var index = data.length, hash = 9; index; ) {
		hash = Math.imul(hash ^ data.charCodeAt(--index), 9 ** 9)
	}

	return 'astro' + (hash ^ (hash >>> 9)).toString(36).slice(1)
}

const cache = {}

export { getNonce, getScript, nonce, cache }