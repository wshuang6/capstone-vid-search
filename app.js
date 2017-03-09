//http://api-public.guidebox.com/v2/search?api_key=7ceacb5ffc481ff8aed9719a341cb2bda30df935
/v2/shows
/v2/movies
const SEARCHURL = "http://api-public.guidebox.com/v2/search?";

var state = {
	netflixResults: [],
	amazonResults: [],
	huluResults: [],
	totalNetflixResults: 0,
	totalAmazonResults: 0,
	totalHuluResults: 0,
}


function getData(searchTerm, showOrMovie, callback, limitNo, provider){
  let searchQueryTerms = {
    api_key: '7ceacb5ffc481ff8aed9719a341cb2bda30df935',
    type: showOrMovie,
    query: searchTerm,
    limit: limitNo,
    sources: provider
  };
  $.getJSON(SEARCHURL, searchQueryTerms, callback);
}

getData("high castle", "movie", stateNetflixData, "10", "netflix");
getData("high castle", "movie", stateAmazonData, "10", "amazon_prime");
getData("high castle", "movie", stateHuluData, "10", "hulu");
console.log(state);
function stateNetflixData(data) {
	state.netflixResults = [];
	function extractData (data) {
		state.netflixResults.push(data);
	}
	data.results.forEach(extractData);
	state.totalNetflixResults = data.total_results;
}

function stateAmazonData(data) {
	state.amazonResults = [];
	function extractData (data) {
		state.amazonResults.push(data);
	}
	data.results.forEach(extractData);
	state.amazonResults = data.total_results;
}

function stateHuluData(data) {
	state.huluResults = [];
	function extractData (data) {
		state.huluResults.push(data);
	}
	data.results.forEach(extractData);
	state.huluResults = data.total_results;
}

function renderSearchResults (state) {
	state.totalResults
	state.searchResults.forEach(function (){

	});
}
//data.total_results maybe interesting!

//RESULTS IS AN ARRAY -> forEach (let's say data is the parameter)
//data.title
//data.first_aired //e.g. 2016-07-15
//data.wikipedia_id

//MOVIES
//"poster_240x342": "http://static-api.guidebox.com/060515/thumbnails_movies_medium/128834-6261370131-5270804721-9970804303-medium-240x342-alt-.jpg",

//SHOWS
//"artwork_448x252": "http://static-api.guidebox.com/thumbnails_large/11166-6745653190-448x252.jpg",

//render function in fact runs the getData as a callback


//get stuff from api
//correctly take information from what the API returns, then render html based on that
//event listeners

//html: basic DOM
//samples of what some of the stuff inserted into DOM should look like (e.g. what classes it should have)
//slightly more detailed HTML that has like, sample divs and texts

//CSS: needs to be responsive, maybe flexbox or something
//needs to look nice