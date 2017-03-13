// authors: William Huang & Ramon Reyes
// project: FlixZon
// description: Queries tv shows availability on netflix & amazon
// assignment: Thinkful Capstone I
// date: 3.9.17
/*------------------------------------------------------------*/

// I) Create Object State
/*------------------------------------------------------------*/

const SEARCHURL = "http://api-public.guidebox.com/v2/search?";

var state = {
	searchResults: [],
	idResults: [],
	totalResults: 0,
	isNetflix: [],
	isAmazon: []
}

// II) State Modification
/*------------------------------------------------------------*/
// Functions related obtaining to getting show information
// getShow, showMovieData followed by individual queries for both Netflix & Amazon

function getShow(searchTerm, callback){ //calls showMovieData, makes API call
  let searchQueryTerms = {
    api_key: '7ceacb5ffc481ff8aed9719a341cb2bda30df935',
    type: 'show',
    query: searchTerm,
  };
  $.getJSON(SEARCHURL, searchQueryTerms, callback);
}

function showMovieData(data) { //called by getShow as callback for getJSON. Resets, gets up to 12 results to limit no. of API calls, pushes it to state 
	state.searchResults = [];
	state.idResults = [];
	state.totalResults = 0;
	state.isNetflix = [];
	state.isAmazon = [];
	function extractData(data){
		for(var i= 0; i<12; i++){ //for loop instead of array method to limit to 12 results and limit no. of API calls
			if (data[i] !==undefined) {
			state.searchResults.push(data[i]);
			state.idResults.push(`http://api-public.guidebox.com/v2/shows/${data[i].id}/episodes?`); //url for getting episode info for show and thus netflix/amazon status
			}
		}
	}
	extractData(data.results);
	state.totalResults = data.total_results;
}

//--- Netflix ------------------------------------------
// Functions related to determining if Netflix has show

function netflixAPICall(URL, callback){ //API call
	let searchQueryTerms = {
		api_key: '7ceacb5ffc481ff8aed9719a341cb2bda30df935',
		sources: 'netflix',
	};
	$.getJSON(URL, searchQueryTerms, function (data) {//callback for above function, if more than one episode exists on netflix pushes the show id to state
		if(data.total_results !== 0){
			state.isNetflix.push(data.results[0].show_id);
		}
		callback(); //callback hell
	});
}

function getNetflixStatus(callback){ //runs API call/callback for every show in the state
	let responses = 0;
	state.idResults.forEach(function (data) {
		netflixAPICall(data, function(){
			responses++;
			if (responses === state.idResults.length) {
				callback(); //callback hell
			}
		});
	});
}

function isItInNetflix(){ //marks whether show is in netflix or not
	state.searchResults.forEach(test);
	function test (data, i) {
		var resultsGoHere = state.searchResults[i];
		if ((state.isNetflix.some(function(netflixId) {return netflixId===data.id})) === true) {
			resultsGoHere.isNetflix = "Yes";
		}
		else {
			resultsGoHere.isNetflix = "No";
		}
	}
}

//--- Amazon ------------------------------------------
// Functions related to determining if Amazon has show

function amazonAPICall(URL, callback){ //API call
	let searchQueryTerms = {
		api_key: '7ceacb5ffc481ff8aed9719a341cb2bda30df935',
		sources: 'amazon_prime',
	};
	$.getJSON(URL, searchQueryTerms, function (data) {//callback for above function, if more than one episode exists on netflix pushes the show id to state
		if(data.total_results !== 0){
			state.isAmazon.push(data.results[0].show_id);
		}
		callback(); //callback hell
	});
}

function getAmazonStatus(callback){ //runs API call/callback for every show in the state
	let responses = 0;
	state.idResults.forEach(function (data) {
		amazonAPICall(data, function(){
			responses++;
			if (responses === state.idResults.length) {
				callback(); //callback hell
			}
		});
	});
}

function isItInAmazon(){ //marks whether show is in Amazon or not
	state.searchResults.forEach(test);
	function test (data, i) {
		var resultsGoHere = state.searchResults[i];
		if ((state.isAmazon.some(function(amazonId) {return amazonId===data.id})) === true) {
			resultsGoHere.isAmazon = "Yes";
		}
		else {
			resultsGoHere.isAmazon = "No";
		}
	}
}

// III) Rendering Object
/*------------------------------------------------------------*/
// Injects yes/no, wiki, imdb & link data into index.html

function renderResults(){ //will render html after state is settled, search is submitted
	let show = state.searchResults
	let showHtml ='';
	show.forEach(function(item){
		let wikiLink = item.wikipedia_id;
		let imdbLink = item.imdb_id;
		var year ="";
		if (item.first_aired != undefined && item.first_aired != false && item.first_aired !=null) {
			year = `(${item.first_aired.slice(0, 4)})`;
		}
		showHtml += `<div class="indv-result"><img src="${item.artwork_304x171}">\
		<p class="bold">${item.title} ${year}</p><p>${isWikiNull(wikiLink)}</p><p>${isImdbNull(imdbLink)}</p>\
		<p>Is it on Netflix? ${item.isNetflix}</p><p>Is it on Amazon Prime? ${item.isAmazon}</p></div>`;
	});
	$('.search-results').html(showHtml);
}

function isWikiNull(str){
	if(str != null){
		return `<a href="https://en.wikipedia.org/?curid=${str}">Wikipedia Link</a>`;
		}
	else {
		return `No Wikipedia Link`;
	}
}

function isImdbNull(str){
	if (str.length > 0){
		return  `<a href="http://www.imdb.com/title/${str}">IMDB Link</a>`;
		}
	else {
		return `No IMDB Link`;
	}
}

// IV) Event Listeners
/*------------------------------------------------------------*/
// Listeners for click events, regex, and error alerts

$(function() {
	$('.search-input-form').on('click', '.search-string', function(event){ //event listener
		event.preventDefault();
		let search = $('.search-input').val();
		if (/^[\w\-\s]+$/.test(search) && (/\d/.test(search) || /[A-Z]/i.test(search))) {
			getShow(search, function(data){ //callback hell
				showMovieData(data);
				getNetflixStatus(function() {
					isItInNetflix();
				getAmazonStatus(function () {
					isItInAmazon();
					renderResults();
					});
				});
			});
		}
		else {
			alert('Please enter a valid search.')
		}
	})
});