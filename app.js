//http://api-public.guidebox.com/v2/search?api_key=7ceacb5ffc481ff8aed9719a341cb2bda30df935

const SEARCHURL = "http://api-public.guidebox.com/v2/search?";

var state = {
	searchResults: [],
	idResults: [],
	totalResults: 0,
	isNetflix: [],
	isAmazon: []
}

//Functions related to getting show information
function getShow(searchTerm, callback){
  let searchQueryTerms = {
    api_key: '7ceacb5ffc481ff8aed9719a341cb2bda30df935',
    type: 'show',
    query: searchTerm,
  };
  $.getJSON(SEARCHURL, searchQueryTerms, callback);
}

function showMovieData(data) { //called by getShow as callback for getJSON. Pushes five results to searchResults
	state.searchResults = [];
	function extractData(data){
		for(var i= 0; i<10; i++){
			if (data[i] !==undefined) {
			state.searchResults.push(data[i]);
			state.idResults.push(`http://api-public.guidebox.com/v2/shows/${data[i].id}/episodes?`);
		}
		}
	}
	extractData(data.results);
	state.totalResults = data.total_results;
}

// Functions related to determining if Netflix has show
function netflixAPICall(URL, callback){
	let searchQueryTerms = {
		api_key: '7ceacb5ffc481ff8aed9719a341cb2bda30df935',
		sources: 'Netflix',
	};
	$.getJSON(URL, searchQueryTerms, callback);
}

function netflixTest(data){
	if(data.total_results !== 0){
		console.log(data.total_results);
		state.isNetflix.push(data.results[0].show_id);
	}
}

function getNetflixStatus(){
	state.idResults.forEach(function (data) {
		netflixAPICall(data, netflixTest);
	});
	
}

function amazonAPICall(URL, callback){
	let searchQueryTerms = {
		api_key: '7ceacb5ffc481ff8aed9719a341cb2bda30df935',
		sources: 'amazon_prime',
	};
	$.getJSON(URL, searchQueryTerms, callback);
}

function amazonTest(data){
	if(data.total_results !== 0){
		console.log(data.total_results);
		state.isAmazon.push(data.results[0].show_id);
	}
}

function getAmazonStatus(){
	state.idResults.forEach(function asdf (data) {
		amazonAPICall(data, amazonTest);
	});
}

getShow("Star%20Wars", showMovieData);
setTimeout(getNetflixStatus, 1000);
setTimeout(getAmazonStatus, 1000);
setTimeout(logIt, 2000);
function logIt () {console.log(state)};
// function renderSearchResults (state) {
// 	state.totalResults;
// 	state.searchResults.forEach(function (){

// 	});
// }
//data.total_results maybe interesting!

//RESULTS IS AN ARRAY -> forEach (let's say data is the parameter)
//data.title
//data.first_aired //e.g. 2016-07-15
//data.wikipedia_id

//MOVIES
//"poster_240x342": "http://static-api.guidebox.com/060515/thumbnails_movies_medium/128834-6261370131-5270804721-9970804303-medium-240x342-alt-.jpg",

//SHOWS
//"artwork_448x252": "http://static-api.guidebox.com/thumbnails_large/11166-6745653190-448x252.jpg",

//render function in fact runs the getShow as a callback


//get stuff from api
//correctly take information from what the API returns, then render html based on that
//event listeners

//html: basic DOM
//samples of what some of the stuff inserted into DOM should look like (e.g. what classes it should have)
//slightly more detailed HTML that has like, sample divs and texts

//CSS: needs to be responsive, maybe flexbox or something
//needs to look nice