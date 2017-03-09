http://api-public.guidebox.com/v2/search?api_key=7ceacb5ffc481ff8aed9719a341cb2bda30df935

const SEARCHURL = "http://api-public.guidebox.com/v2/search?";

function getData(searchTerm, showOrMovie, callback){
  let searchQueryTerms = {
    api_key: '7ceacb5ffc481ff8aed9719a341cb2bda30df935',
    type: showOrMovie,
    query: searchTerm
  };
  $.getJSON(SEARCHURL, searchQueryTerms, callback);
}

//get stuff from api
//correctly take information from what the API returns, then render html based on that
//event listeners

//html: basic DOM
//samples of what some of the stuff inserted into DOM should look like (e.g. what classes it should have)
//slightly more detailed HTML that has like, sample divs and texts

//CSS: needs to be responsive, maybe flexbox or something
//needs to look nice