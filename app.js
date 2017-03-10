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

function isItInNetflix(){
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

function isItInAmazon(){
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


function showMovieData(data) { //called by getShow as callback for getJSON. Pushes ten results to searchResults
	state.searchResults = [];
	state.idResults = [];
	state.totalResults = 0;
	state.isNetflix = [];
	state.isAmazon = [];
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
		state.isAmazon.push(data.results[0].show_id);
	}
}

function getAmazonStatus(){
	state.idResults.forEach(function asdf (data) {
		amazonAPICall(data, amazonTest);
	});
}

function renderResults(){
	let show = state.searchResults
	let showHtml ='';
	show.forEach(function(item){
		console.log(item.wikipedia_id);
		showHtml += `<div class="indv-result"><img src="${item.artwork_304x171}">\
		<p>${item.title}</p><p><a href="https://en.wikipedia.org/?curid=${item.wikipedia_id
}">Wikipedia Link</a></p><p><a href="http://www.imdb.com/title/${item.imdb_id}">IMDB</a></p>\
<p>Is it on Netflix? ${item.isNetflix}</p><p>Is it on Amazon Prime? ${item.isAmazon}</p></div>`;
	});
	$('.netflix').html(showHtml);
}

$('.search-input-form').on('click', '.search-string', function(event){
		event.preventDefault();
		let search = $('.search-input').val();
		getShow(search, showMovieData);
		setTimeout(getNetflixStatus, 1200);
		setTimeout(getAmazonStatus, 1200);
		setTimeout(isItInAmazon, 2400);
		setTimeout(isItInNetflix, 2400);
		setTimeout(renderResults, 2700);
		setTimeout(logIt, 2800);
})


// Event Listeners


// getShow("stranger", showMovieData);


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