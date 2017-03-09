http://api-public.guidebox.com/v2/search?api_key=7ceacb5ffc481ff8aed9719a341cb2bda30df935

var SEARCHURL = "http://api-public.guidebox.com/v2/search?";

function getData(searchTerm, showOrMovie, callback){
  let searchQueryTerms = {
    api_key: '7ceacb5ffc481ff8aed9719a341cb2bda30df935',
    type: showOrMovie,
    query: searchTerm
  };
  $.getJSON(SEARCHURL, searchQueryTerms, callback);
}
function cB (results) {
	console.log(results);
}

getData("stranger", "show", cB);