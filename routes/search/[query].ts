
import data from '../../data.json'
import Fuse from 'fuse.js'


const fuseOptions = {
	// isCaseSensitive: false,
	// includeScore: false,
	shouldSort: true,
	// includeMatches: false,
	// findAllMatches: false,
	// minMatchCharLength: 1,
	// location: 0,
	// threshold: 0.6,
	// distance: 100,
	// useExtendedSearch: false,
	// ignoreLocation: false,
	// ignoreFieldNorm: false,
	// fieldNormWeight: 1,
	keys: [
		"title",
	]
};

const fuse = new Fuse(data, fuseOptions);

export default eventHandler((event) => {
  const { query } = event.context.params
  return fuse.search(query).slice(0, 100).map(result => result.item)
})
