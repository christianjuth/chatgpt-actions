
import data from '../../data.json'
import Fuse from 'fuse.js'


const fuseOptions = {
	// isCaseSensitive: false,
	includeScore: true,
	shouldSort: true,
	// includeMatches: false,
	// findAllMatches: false,
	// minMatchCharLength: 1,
	// location: 0,
	// threshold: 0.6,
	// distance: 100,
	// useExtendedSearch: true,
	ignoreLocation: true,
	// ignoreFieldNorm: false,
	// fieldNormWeight: 1,
	keys: [
		"title",
    ["categoryHierarchy"]
	]
};

const fuse = new Fuse(data, fuseOptions);

export default eventHandler((event) => {
  let { query } = event.context.params
  query = decodeURI(query).trim()
  return fuse.search(query).slice(0, 50).map(result => result.item)
})
