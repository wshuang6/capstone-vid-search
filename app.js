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
function isNull(website, str){
	if(str != null){
		if(website === 'wiki'){
			return `<p><a href="https://en.wikipedia.org/?curid=${str}">Wikipedia Link</a></p>`;
		}
		else if(website === 'imdb'){
			return  `<p><a href="http://www.imdb.com/title/${str}">IMDB Link</a></p>`;
		}
	}
	else{
		return '';
	}
}
function getShow(searchTerm, callback){ //calls showMovieData, makes API call
  let searchQueryTerms = {
    api_key: '7ceacb5ffc481ff8aed9719a341cb2bda30df935',
    type: 'show',
    query: searchTerm,
  };
  $.getJSON(SEARCHURL, searchQueryTerms, callback);
}

function showMovieData(data) { //called by getShow as callback for getJSON. Resets, gets up to 10 results to limit no. of API calls, pushes it to state 
	state.searchResults = [];
	state.idResults = [];
	state.totalResults = 0;
	state.isNetflix = [];
	state.isAmazon = [];
	function extractData(data){
		for(var i= 0; i<10; i++){ //for loop instead of array method to limit to 10 results and limit no. of API calls
			if (data[i] !==undefined) {
			state.searchResults.push(data[i]);
			state.idResults.push(`http://api-public.guidebox.com/v2/shows/${data[i].id}/episodes?`); //url for getting episode info for show and thus netflix/amazon status
			}
		}
	}
	extractData(data.results);
	state.totalResults = data.total_results;
}

// Functions related to determining if Netflix has show
function netflixAPICall(URL, callback){ //API Call
	let searchQueryTerms = {
		api_key: '7ceacb5ffc481ff8aed9719a341cb2bda30df935',
		sources: 'Netflix',
	};
	$.getJSON(URL, searchQueryTerms, callback);
}
function netflixTest(data){ //callback for above function, if more than one episode exists on netflix pushes the show id to state
	if(data.total_results !== 0){ //pushes only show ids that exist. array index becomes asynchronous, hard to pass identifier to object
		console.log(data.total_results);
		state.isNetflix.push(data.results[0].show_id);
	}
}
function getNetflixStatus(){ //runs API call/callback for every show in the state
	state.idResults.forEach(function (data) {
		netflixAPICall(data, netflixTest);
	});
}
function isItInNetflix(){ //marks whether show is in netflix or not
	state.searchResults.forEach(test);
	function test (data, i) {
		if ((state.isNetflix.some(function(netflixId) {return netflixId===data.id})) === true) {
			state.searchResults[i].isNetflix = "Yes";
		}
		else {
			state.searchResults[i].isNetflix = "No";
		}
	}
}

//Functions for determining if Amazon Prime has show
function amazonAPICall(URL, callback){ //API call
	let searchQueryTerms = {
		api_key: '7ceacb5ffc481ff8aed9719a341cb2bda30df935',
		sources: 'amazon_prime',
	};
	$.getJSON(URL, searchQueryTerms, callback);
}
function amazonTest(data){ //callback for above function, if more than one episode exists on netflix pushes the show id to state
	if(data.total_results !== 0){
		state.isAmazon.push(data.results[0].show_id);
	}
}
function getAmazonStatus(){ //runs API call/callback for every show in the state
	state.idResults.forEach(function (data) {
		amazonAPICall(data, amazonTest);
	});
}
function isItInAmazon(){ //marks whether show is in Amazon or not
	state.searchResults.forEach(test);
	function test (data, i) {
		if ((state.isAmazon.some(function(amazonId) {return amazonId===data.id})) === true) {
			state.searchResults[i].isAmazon = "Yes";
		}
		else {
			state.searchResults[i].isAmazon = "No";
		}
	}
}

function renderResults(){ //will render html after state is settled, search is submitted
	let show = state.searchResults
	let showHtml ='';
	show.forEach(function(item){
		let wikiLink = item.wikipedia_id;
		let imdbLink = item.imdb_id;
		console.log(wikiLink);
		console.log(wikiLink);
		var year = item.first_aired.slice(0, 4);
		showHtml += `<div class="indv-result four columns"><img src="${item.artwork_304x171}">\
		<p>${item.title} (${year})</p>${isNull('wiki', wikiLink)}${isNull('imdb', imdbLink)}\
<p>Is it on Netflix? ${item.isNetflix}</p><p>Is it on Amazon Prime? ${item.isAmazon}</p></div>`;
	});
	$('.netflix').html(showHtml);
}
$(function() {
	    $('.search-input-form').on('click', '.search-string', function(event){ //event listener
		event.preventDefault();
		let search = $('.search-input').val();
		getShow(search, showMovieData);
		setTimeout(getNetflixStatus, 1500); //unclear how long API call takes, sometimes 1200 ms does not appear like enough
		setTimeout(getAmazonStatus, 1500);
		setTimeout(isItInAmazon, 3000);
		setTimeout(isItInNetflix, 3000);
		setTimeout(renderResults, 3300);
		setTimeout(logIt, 3400);
	})
});



// getShow("stranger", showMovieData);


function logIt () {console.log(state)};



//RESULTS IS AN ARRAY -> forEach (let's say data is the parameter)
//data.title
//data.first_aired //e.g. 2016-07-15
//data.wikipedia_id

//SHOWS
//"artwork_448x252": "http://static-api.guidebox.com/thumbnails_large/11166-6745653190-448x252.jpg",

	//render function in fact runs the getShow as a callback
