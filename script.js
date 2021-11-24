const body = document.body;
const leftBtn = document.getElementById("left");
const rightBtn = document.getElementById("right");
const main = document.querySelector(".slider-container");
const countHolder = document.querySelector(".countHolder");
const form = document.getElementById("form");
const search = document.getElementById("search");
const genre = document.getElementById("genres");
let activeSlide = 0;
let slides = document.querySelectorAll(".slide");
let counters = document.querySelectorAll(".counters");

const API_URL =
  "https://api.themoviedb.org/3/discover/movie?certification_country=US&certification.lte=PG-13&sort_by=popularity.desc&api_key=57b50c9c0d129ac3131cf2180e2768f8&page=1";
const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
const SEARCH_API =
  "https://api.themoviedb.org/3/search/movie?api_key=57b50c9c0d129ac3131cf2180e2768f8&query='";

const GENRE_API =
  "https://api.themoviedb.org/3/discover/movie?certification_country=US&certification.lte=PG-13&sort_by=popularity.desc&api_key=57b50c9c0d129ac3131cf2180e2768f8&page=1&with_genres=";

const genreObj = {
  genres: [
    {
      id: 28,
      name: "Action",
    },
    {
      id: 12,
      name: "Adventure",
    },
    {
      id: 16,
      name: "Animation",
    },
    {
      id: 35,
      name: "Comedy",
    },
    {
      id: 80,
      name: "Crime",
    },
    {
      id: 99,
      name: "Documentary",
    },
    {
      id: 18,
      name: "Drama",
    },
    {
      id: 10751,
      name: "Family",
    },
    {
      id: 14,
      name: "Fantasy",
    },
    {
      id: 36,
      name: "History",
    },
    {
      id: 27,
      name: "Horror",
    },
    {
      id: 10402,
      name: "Music",
    },
    {
      id: 9648,
      name: "Mystery",
    },
    {
      id: 10749,
      name: "Romance",
    },
    {
      id: 878,
      name: "Science Fiction",
    },
    {
      id: 10770,
      name: "TV Movie",
    },
    {
      id: 53,
      name: "Thriller",
    },
    {
      id: 10752,
      name: "War",
    },
    {
      id: 37,
      name: "Western",
    },
  ],
};

//Movie Code
// Get initial movies
getMovies(API_URL);
async function getMovies(url) {
  const res = await fetch(url);
  const data = await res.json();
  if (data.results.length !== 0) {
    removeNodes();
    countHolder.innerHTML = "";
    activeSlide = 0;
    showMovies(data.results);
  }
}

function showMovies(movies) {
  movies.forEach((movie) => {
    //pulls title, poster_path ect from movie as constants
    const { poster_path, vote_average, popularity, genre_ids } = movie;

    const movieEl = document.createElement("div");
    movieEl.classList.add("slide");
    movieEl.style.backgroundImage = `url(${IMG_PATH + poster_path})`;
    main.appendChild(movieEl);

    //add counters
    const counterEl = document.createElement("div");
    counterEl.classList.add("counters");
    counterEl.innerHTML = `
    <div class="counter-container vote_average">
      <span>Vote Average:</span>
      <div class="counter left ${getClassByRate(
        vote_average
      )}" data-target="${vote_average}">${vote_average}</div>
    </div>
    <div class="counter-container genre">
      <span>Genres:</span>
      <div class="counter mid">${getGenre(genre_ids)}</div>
    </div>
    <div class="counter-container popularity">
      <span>Popularity:</span>
      <div class="counter right" data-target="${Math.round(popularity)}"></div>
    </div>
    `;
    countHolder.appendChild(counterEl);
  });

  slides = document.querySelectorAll(".slide");
  counters = document.querySelectorAll(".counters");
  slides[activeSlide].classList.add("active");
  counters[activeSlide].classList.add("active");
  setBgToBody();
  incrementCounter();
}

function getClassByRate(vote) {
  if (vote >= 8) {
    return "green";
  } else if (vote >= 5) {
    return "orange";
  } else {
    return "red";
  }
}

function getGenre(nums) {
  returnObj = "";
  nums.forEach((num) => {
    genreObj.genres.forEach((gt) => {
      if (gt.id === num) {
        returnObj += gt.name + "  ";
      }
    });
  });

  return returnObj;
}

function getGenreID(str) {
  returnObj = "";
  genreObj.genres.forEach((gt) => {
    if (gt.name === str) {
      returnObj = gt.id;
    }
  });
  return returnObj;
}

//Active Slide Code
rightBtn.addEventListener("click", () => {
  activeSlide++;
  if (activeSlide > slides.length - 1) {
    activeSlide = 0;
  }
  setBgToBody();
  setActiveSlide();
});

leftBtn.addEventListener("click", () => {
  activeSlide--;
  if (activeSlide < 0) {
    activeSlide = slides.length - 1;
  }
  setBgToBody();
  setActiveSlide();
});

function setBgToBody() {
  body.style.backgroundImage = slides[activeSlide].style.backgroundImage;
}

function setActiveSlide() {
  slides.forEach((slide) => slide.classList.remove("active"));
  counters.forEach((count) => count.classList.remove("active"));
  slides[activeSlide].classList.add("active");
  counters[activeSlide].classList.add("active");
  incrementCounter();
}

function incrementCounter() {
  //If you want to increment vote avg again, get rid of .right
  const counter1 = document.querySelectorAll(".counter.right");

  counter1.forEach((counter) => {
    counter.innerText = "0";
    const updateCounter = () => {
      const target = +counter.getAttribute("data-target");
      const c = +counter.innerText;
      const increment = target / 200;

      if (c < target) {
        counter.innerText = `${Math.ceil(c + increment)}`;
        setTimeout(updateCounter, 1);
      } else {
        counter.innerText = target;
      }
    };
    updateCounter();
  });
}

form.addEventListener("submit", (e) => {
  //tells the user agent that if the event does not get explicitly handled, it's defaut action should not be taken.
  e.preventDefault();

  const searchTerm = search.value;
  // if the search term exist and is not equal to ""
  if (searchTerm && searchTerm !== "") {
    search.value = "";
    console.log(SEARCH_API + searchTerm);
    getMovies(SEARCH_API + searchTerm);
  } else {
    //reloads the page.
    window.location.reload();
  }
});

genre.addEventListener("change", (e) => {
  console.log(e.target.value);
  const id = getGenreID(e.target.value);
  getMovies(GENRE_API + id);
});

function removeNodes() {
  main.querySelectorAll(".slide").forEach((e) => {
    e.remove();
  });
}
