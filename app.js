// Déclaration de l'API Read Access Token
const API_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4NGVhMWIwZjYwNTNmM2NiYmM4MTY2MDExMjFlM2IzNCIsIm5iZiI6MTczMTA4MTg2Ny4xMjE5OTQzLCJzdWIiOiI2NzI4YzhmMDU5MTgxMzdjZmMzOWJkMTYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.TjJX15tHCdG_gjk4OD8cHfj10KoCO_nIq1TJ_XjEtBM";

// URLs de base
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// En-têtes pour l'authentification
const headers = {
    'Authorization': `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json'
};



// Sélecteurs DOM
const input = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const searchTitle = document.querySelector("#splide h2");
const container1 = document.querySelector("#splide .splide__list");
const container2 = document.querySelector("#splide1 .splide__list");
const container3 = document.querySelector("#splide2 .splide__list");
const modalSign = document.querySelector(".modalSign");
const modalFilm = document.querySelector(".modalFilm");
const filmContainer = document.querySelector('.filmContainer');
const filmImg = document.querySelector(".modalFilm .filmImg");
const filmContent = document.querySelector(".filmContent");
const signInBtn = document.querySelector(".menu li:nth-child(5) a");
const allClosers = document.querySelectorAll(".closer");
const genreList = document.querySelector(".s3List");

const carouselPrevArrow = document.querySelector("#splide .splide__arrow--prev");
const carouselNextArrow = document.querySelector("#splide .splide__arrow--next");

// Liste des genres prédéfinis
const genres = {
    'Comedy': 35,
    'Drama': 18,
    'Action': 28,
    'Romance': 10749,
    'Fantasy': 14,
    'Animation': 16
};

// Gestion des popups
signInBtn.addEventListener("click", (e) => {
    e.preventDefault();
    modalSign.classList.add("active");
});

// const loginBtn = document.querySelector('.modalSign .content button');
// loginBtn.addEventListener('click', () => {
//     // Récupérer les valeurs des champs de formulaire
//     const username = document.querySelector('.modalSign #user').value;
//     const password = document.querySelector('.modalSign #pass').value;

//     // Ajouter ici votre logique de connexion
//     console.log('Tentative de connexion avec:', username, password);

//     // Fermer le pop-up après la connexion réussie
//     modalSign.classList.remove('active');   <p> (`${BASE_URL}/movie/${movie.id}/credits`, { headers })</p>
// });

allClosers.forEach(closer => {
    closer.addEventListener("click", () => {
        modalSign.classList.remove("active");
        modalFilm.classList.remove("active");
    });
});


// Fonction popup film
const showMoviePopup = async (movie) => {
    filmContent.innerHTML = `
        <div class="movie-details">
            <h2>${movie.title || movie.original_title}</h2>
            <p><strong>Date de sortie :</strong> ${movie.release_date || 'Non disponible'}</p>
            <p><strong>Note :</strong> ${movie.vote_average} / 10</p>
            <p><strong>Synopsis :</strong> ${movie.overview || 'Aucune description disponible.'}</p>

        </div>
    `;
    


    const movieImage = document.createElement("img");
    movieImage.src = `${IMAGE_BASE_URL}${movie.poster_path}`;
    movieImage.alt = movie.title || movie.original_title;

    filmImg.innerHTML="";
    filmImg.appendChild(movieImage);


    try{

        const castRes = await fetch(`${BASE_URL}/movie/${movie.id}/credits`, {headers});
        const castData = await castRes.json();
        
        const casting = document.createElement('div')
        casting.innerHTML= `
            <h3>Casting</h3>
            <ul>
            ${castData.cast.slice(0,5).map(actor =>`<li>${actor.name}</li>`).join("")}
            </ul>`;
        
        filmContent.appendChild(casting);
    } 
    catch (error){
        console.error("une erreur")
    };

    modalFilm.classList.add("active");
    if(window.innerWidth < 765){
        filmContainer.style.flexDirection = 'column';
        filmContainer.style.overflow = 'auto';
        modalFilm.style.Width = '500px';
        filmContent.style.diplay = 'flex';
        filmContent.style.flexDirection = 'column';
        filmContent.style.wrap = 'wrap';

    }

};





// Création élément film
const genreTranslations = {
    28: "Action",
    12: "Aventure",
    16: "Animation",
    35: "Comédie",
    80: "Crime",
    99: "Documentaire",
    18: "Drame",
    10751: "Familial",
    14: "Fantastique",
    36: "Histoire",
    27: "Horreur",
    10402: "Musique",
    9648: "Mystère",
    10749: "Romance",
    878: "Science-Fiction",
    10770: "Téléfilm",
    53: "Thriller",
    10752: "Guerre",
    37: "Western"
};

const createMovieElement = (movie) => {
    if (!movie.poster_path) return null;

    const list = document.createElement("li");
    list.className = "splide__slide";
    list.style.height = "280px";
    list.style.overflow = "hidden";
    list.style.margin = "0 1rem"; 

    const img = document.createElement("img");
    img.src = `${IMAGE_BASE_URL}${movie.poster_path}`;
    img.alt = movie.title || movie.original_title;
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "contain";
    img.style.transition = "transform 0.3s ease";
    
    // Créer une div pour l'affichage des détails du film
    const movieDetails = document.createElement("div");
    movieDetails.style.width = "100%";
    movieDetails.style.height = "100%";
    movieDetails.style.backgroundColor = "black";
    movieDetails.style.color = "white";
    movieDetails.style.display = "flex";
    movieDetails.style.flexDirection = "column";
    movieDetails.style.justifyContent = "center";
    movieDetails.style.alignItems = "center";
    movieDetails.style.gap = "10px";
    movieDetails.style.position = "absolute";
    movieDetails.style.top = "0";
    movieDetails.style.left = "0";
    movieDetails.style.right = "0";
    movieDetails.style.bottom = "0";
    movieDetails.style.padding = "10px";
    movieDetails.style.overflow = "auto";
    movieDetails.style.transition = "opacity 0.3s ease";
    movieDetails.style.opacity = "0";

    // Ajouter les informations du film dans la div
    const title = document.createElement("h3");
    title.textContent = movie.title || movie.original_title;
    title.style.textAlign = "center";

    const releaseDate = document.createElement("p");
    releaseDate.textContent = `${movie.release_date}`;

    const genre = document.createElement("p");
    const translatedGenres = movie.genre_ids.map(id => genreTranslations[id] || "Inconnu").join(", ");
    genre.textContent = `${translatedGenres}`;
    const star = document.createElement("h2");
    star.innerHTML = `&#9733`;
    star.style.color = "red";
    const rating = document.createElement("p");
    rating.textContent = `${movie.vote_average}`;
    rating.style.color = "red";
    movieDetails.appendChild(title);
    movieDetails.appendChild(releaseDate);
    movieDetails.appendChild(genre);
    movieDetails.appendChild(star);
    movieDetails.appendChild(rating);

    // Positionnement relatif du conteneur
    list.style.position = "relative";

    // Effet hover pour afficher la div au lieu de l'image
    list.addEventListener("mouseenter", () => {
        img.style.opacity = "0";
        movieDetails.style.opacity = "1";
    });

    list.addEventListener("mouseleave", () => {
        img.style.opacity = "1";
        movieDetails.style.opacity = "0";
    });

    list.addEventListener("click", () => showMoviePopup(movie));

    list.appendChild(img);
    list.appendChild(movieDetails);

    return list;
};

// Affichage des films
const displayMovies = (movies, container, sliderId) => {
    container.innerHTML = "";
    
    movies.slice(0, 8).forEach(movie => {
        const movieElement = createMovieElement(movie);
        if (movieElement) {
            container.appendChild(movieElement);
        }
    });

    // Réinitialiser le slider
    const splide = new Splide(`#${sliderId}`, splideParam);
    splide.mount();
};

// Recherche de films
const fetchSearch = async (query) => {
    try {
        const response = await fetch(
            `${BASE_URL}/search/movie?query=${query}&language=fr-FR`, 
            { headers }
        );
        const data = await response.json();
        
        searchTitle.textContent = `Résultats pour : ${query}`;
        displayMovies(data.results, container1, 'splide');
    } 
    catch (error) {
        console.error("Erreur lors de la recherche:", error);
    }
};

// Films populaires
const fetchPopular = async () => {
    try {
        const response = await fetch(
            `${BASE_URL}/movie/popular?language=fr-FR`, 
            { headers }
        );
        const data = await response.json();
        searchTitle.textContent = "Films populaires";
        displayMovies(data.results, container1, 'splide');
    } 
    catch (error) {
        console.error("Erreur lors du chargement des films populaires:", error);
    }
};

// Dernières sorties
const fetchLatest = async () => {
    try {
        const response = await fetch(
            `${BASE_URL}/movie/now_playing?language=fr-FR`, 
            { headers }
        );
        const data = await response.json();
        displayMovies(data.results, container2, 'splide1');
    } 
    catch (error) {
        console.error("Erreur lors du chargement des derniers films:", error);
    }
};

// Films par genre
const fetchByGenre = async (genreId) => {
    try {
        const response = await fetch(
            `${BASE_URL}/discover/movie?with_genres=${genreId}&language=fr-FR`, 
            { headers }
        );
        const data = await response.json();
        displayMovies(data.results, container3, 'splide2');
    } 
    catch (error) {
        console.error("Erreur lors du chargement des films par genre:", error);
    }
};

// Gestion des clics sur les genres
genreList.querySelectorAll('a').forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        
        // Gestion de l'état actif
        genreList.querySelectorAll('a').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        // Chargement des films du genre
        const genreId = genres[link.textContent];
        if (genreId) fetchByGenre(genreId);
    });
});

// Événements de recherche
searchBtn.addEventListener("click", () => {
    const query = input.value.trim();
    if (query) fetchSearch(query);
});

input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        const query = input.value.trim();
        if (query) fetchSearch(query);
    }
});

fetchPopular();
fetchLatest();
let breakpoints = {
    1440: window.innerWidth <= 1440,
    1200: window.innerWidth <= 1200,
    850: window.innerWidth <= 850,
    700: window.innerWidth <= 700,
    550: window.innerWidth <= 550
};

window.addEventListener('resize', () => {
    // Vérifie pour chaque breakpoint si la condition a changé
    let shouldReload = false;

    for (const breakpoint in breakpoints) {
        const isBelow = window.innerWidth <= breakpoint;
        if (isBelow !== breakpoints[breakpoint]) {
            breakpoints[breakpoint] = isBelow; // Met à jour l'état pour ce breakpoint
            shouldReload = true; // Indique qu'une recharge est nécessaire
        }
    }

    if (shouldReload) {
        location.reload(); // Recharge la page
    }
});
// Initialisation au chargement
// document.addEventListener('DOMContentLoaded', () => {
//     // Initialiser les sliders vides
//     new Splide('#splide', splideParam).mount();
//     new Splide('#splide1', splideParam).mount();
//     new Splide('#splide2', splideParam).mount();

//     // Charger les données initiales
//     fetchPopular();
//     fetchLatest();
    
//     // Clic automatique sur le premier genre
//     const firstGenreLink = genreList.querySelector('a');
//     if (firstGenreLink) firstGenreLink.click();
// });