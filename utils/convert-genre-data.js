'use strict';

const genreList = require('../db/seed/unfiltered-genre-search');

function convertGenreData(obj) {
  return obj._embedded.classifications[3].segment._embedded.genres.map(item => {
    return {
      id: item.id,
      genre: item.name
    };
  });
}

// console.log(convertGenreData(genreList));
// console.log(genreList._embedded.classifications[3].segment);
// convertGenreData(genreList);
