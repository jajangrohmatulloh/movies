// const button = document.querySelector('.btn.btn-primary');
// button.addEventListener('click', function() {
//     const keyword = document.getElementsByClassName('form-control')[0];

//     fetch(`http://www.omdbapi.com/?apikey=330444f8&s=${keyword.value}`)
//         .then( response => response.json())
//         .then( response => {
//             let movies = response.Search.map( e => {
//                 return `<div class="col-md-3 my-3">
//                 <div class="card">
//                   <img src="${e.Poster}" class="card-img-top img-fluid">
//                   <div class="card-body">
//                     <h5 class="card-title">${e.Title}</h5>
//                     <h6 class="card-subtitle mb-2 text-muted">${e.Year}</h6>
//                     <a href="#" class="btn btn-primary modal-detail-button" data-toggle="modal" data-target="#exampleModal" data-imdbid="${e.imdbID}">Show Details</a>
//                   </div>
//                 </div>
//               </div>`
//             });
//             const movieContainer = document.getElementsByClassName('row')[1];
//             movieContainer.innerHTML = movies.join('');

//             const modalDetail = Array.from(document.getElementsByClassName('modal-detail-button'));
//             modalDetail.forEach( e => {
//               e.addEventListener('click', function () {
//                 fetch(`http://www.omdbapi.com/?apikey=330444f8&i=${e.dataset.imdbid}`)
//                   .then( response => response.json())
//                   .then( response => {
//                     const modal = `
//                           <div class="row">
//                             <div class="col">
//                               <img src="${response.Poster}" class="img-fluid">
//                             </div>
//                             <div class="col-md-8">
//                             <ul class="list-group">
//                               <li class="list-group-item">Title: ${response.Title}</li>
//                               <li class="list-group-item">Year: ${response.Year}</li>
//                               <li class="list-group-item">Writer: ${response.Writer}</li>
//                               <li class="list-group-item">Actors: ${response.Actors}</li>
//                               <li class="list-group-item">Plot: ${response.Plot}</li>
//                             </ul>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>`
//                   const modalContainer = document.getElementsByClassName('modal-body')[0];
//                   modalContainer.innerHTML = modal;
//                   })
//               })
//             })
//         });
// });

const button = document.querySelector('.btn.btn-primary');
const movieContainer = document.getElementsByClassName('row')[1];
const keyword = document.getElementsByClassName('form-control')[0];
const autoComplete = document.getElementsByClassName('auto-completes')[0];

// Input Keyword
keyword.addEventListener('keyup', async function () {
  const movies = await getMovies(keyword);
  const title = movies.map(e => `<li class="list-group-item auto-complete"><img src="${e.Poster}" width="30px" style="margin-right: 5px">${e.Title}</li>`);
  autoComplete.innerHTML = title.join('');

});
//Click Auto Complete
document.addEventListener('click', async function (e) {
  if (e.target.classList.contains('auto-complete')) {
    keyword.value = e.target.textContent;
    autoComplete.innerHTML = '';
    loader();
    try {
      const movies = await getMovies(keyword);
      const cards = movies.map(e => getCards(e));
      updateUI(cards);
    } catch (err) {
      movieContainer.innerHTML = `<div class="alert alert-primary" role="alert">
                              ${err}</div>`
    }
  }
});
// Shows Film
button.addEventListener('click', async function () {
  autoComplete.innerHTML = '';
  loader();
  try {
    const movies = await getMovies(keyword);
    const cards = movies.map(e => getCards(e));
    updateUI(cards);
  } catch (err) {
    movieContainer.innerHTML = `<div class="alert alert-primary" role="alert">
                              ${err}</div>`
  }
});
// Show Movie Detail
document.addEventListener('click', async function (e) {
  if (e.target.classList.contains('modal-detail-button')) {
    try {
      console.dir(e.target)
      const imdbid = await getImdbid(e.target);
      const modalDetail = getModalDetail(imdbid);
      updateUIDetail(modalDetail);
    } catch (err) {
      console.error(err);
    }
  }
});

// Function
function getMovies(keyword) {
  return fetch(`http://www.omdbapi.com/?apikey=330444f8&s=${keyword.value}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then(response => {
      if (response.Response === 'False') {
        throw new Error(response.Error);
      }
      return response.Search;
    });
}

function getCards(e) {
  return `<div class="col-md-3 my-3">
            <div class="card">
              <img src="${e.Poster}" class="card-img-top img-fluid">
              <div class="card-body">
                <h5 class="card-title">${e.Title}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${e.Year}</h6>
                <a href="#" class="btn btn-primary modal-detail-button" data-toggle="modal" data-target="#exampleModal" data-imdbid="${e.imdbID}">Show Details</a>
              </div>
            </div>
          </div>`
}

function updateUI(cards) {
  const movieContainer = document.getElementsByClassName('row')[1];
  movieContainer.innerHTML = cards.join('');
}

function getImdbid(id) {
  return fetch(`http://www.omdbapi.com/?apikey=330444f8&i=${id.dataset.imdbid}`)
    .then(response => response.json())
    .then(response => response)
}

function getModalDetail(response) {
  return `<div class="row">
            <div class="col">
              <img src="${response.Poster}" class="img-fluid">
            </div>
            <div class="col-md-8">
            <ul class="list-group">
              <li class="list-group-item"><strong>Title:</strong> ${response.Title}</li>
              <li class="list-group-item"><strong>Year:</strong> ${response.Year}</li>
              <li class="list-group-item"><strong>Writer:</strong> ${response.Writer}</li>
              <li class="list-group-item"><strong>Actors:</strong> ${response.Actors}</li>
              <li class="list-group-item"><strong>Plot:</strong> ${response.Plot}</li>
            </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`
}

function updateUIDetail(modal) {
  const modalContainer = document.getElementsByClassName('modal-body')[0];
  modalContainer.innerHTML = modal;
}

function loader() {
  movieContainer.innerHTML = `<div class="d-flex justify-content-center">
  <div class="spinner-border" role="status" 
  style="position: absolute; left: 50%; top: 50%;
  width: 7em; height: 7em;">
    <span class="sr-only">Loading...</span>
  </div>
</div>`;
}