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
        modalFilm.style.maxWidth = '200px';
        modalFilm.style.overflowY = 'scroll';
    }

};





// Création élément film
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
    
    // Effet hover
    img.addEventListener("mouseenter", () => {
        img.style.transform = "scale(1.05)";
    });
    
    img.addEventListener("mouseleave", () => {
        img.style.transform = "scale(1)";
    });

    list.addEventListener("click", () => showMoviePopup(movie));
    list.appendChild(img);
    
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
let wasBelow550 = window.innerWidth <= 550; // Vérifie si la largeur initiale est <= 550px

window.addEventListener('resize', () => {
    const isBelow550 = window.innerWidth <= 550;

    // Si la condition change (passage sous ou au-dessus de 550px)
    if (isBelow550 !== wasBelow550) {
        wasBelow550 = isBelow550; // Met à jour l'état
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