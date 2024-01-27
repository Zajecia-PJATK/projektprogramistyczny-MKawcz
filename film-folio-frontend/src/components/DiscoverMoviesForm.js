import React, { useState, useEffect } from 'react';
import {Link} from "react-router-dom";
import "../styles/components/_discover_movies_form.scss"
import withAuth from "./withAuth";
import Loader from "./Loader";

const DiscoverMoviesForm = () => {
    const [genres, setGenres] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [sortBy, setSortBy] = useState('popularity.desc');
    const [language, setLanguage] = useState('en');
    const [page, setPage] = useState(1);
    const [includeAdult, setIncludeAdult] = useState(false);
    const [includeVideo, setIncludeVideo] = useState(false);
    const [primaryReleaseYear, setPrimaryReleaseYear] = useState('');
    const [movies, setMovies] = useState([]);
    const [maxPages, setMaxPages] = useState(1);
    const [isGenresMenuOpen, setIsGenresMenuOpen] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const baseURL = "https://image.tmdb.org/t/p/w500";

    const languages = [
        { "iso_639_1": "en", "english_name": "English", "name": "English" },
        { "iso_639_1": "fr", "english_name": "French", "name": "Français" },
        { "iso_639_1": "de", "english_name": "German", "name": "Deutsch" },
        { "iso_639_1": "it", "english_name": "Italian", "name": "Italiano" },
        { "iso_639_1": "es", "english_name": "Spanish", "name": "Español" },
        { "iso_639_1": "ru", "english_name": "Russian", "name": "Русский" },
        { "iso_639_1": "ja", "english_name": "Japanese", "name": "日本語" },
        { "iso_639_1": "zh", "english_name": "Mandarin", "name": "普通话" },
        { "iso_639_1": "ko", "english_name": "Korean", "name": "한국어/조선말" },
        { "iso_639_1": "ar", "english_name": "Arabic", "name": "العربية" },
        { "iso_639_1": "hi", "english_name": "Hindi", "name": "हिन्दी" },
        { "iso_639_1": "pt", "english_name": "Portuguese", "name": "Português" },
        { "iso_639_1": "pl", "english_name": "Polish", "name": "Polski" },
        { "iso_639_1": "tr", "english_name": "Turkish", "name": "Türkçe" },
        { "iso_639_1": "nl", "english_name": "Dutch", "name": "Nederlands" },
        { "iso_639_1": "sv", "english_name": "Swedish", "name": "Svenska" },
        { "iso_639_1": "da", "english_name": "Danish", "name": "Dansk" },
        { "iso_639_1": "fi", "english_name": "Finnish", "name": "Suomi" },
        { "iso_639_1": "no", "english_name": "Norwegian", "name": "Norsk" },
        { "iso_639_1": "cs", "english_name": "Czech", "name": "Český" },
        { "iso_639_1": "hu", "english_name": "Hungarian", "name": "Magyar" },
        { "iso_639_1": "el", "english_name": "Greek", "name": "Ελληνικά" },
        { "iso_639_1": "th", "english_name": "Thai", "name": "ภาษาไทย" },
        { "iso_639_1": "he", "english_name": "Hebrew", "name": "עִבְרִית" },
        { "iso_639_1": "vi", "english_name": "Vietnamese", "name": "Tiếng Việt" }
    ];

    useEffect(() => {
        const fetchGenres = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const response = await fetch('http://localhost:8080/api/tmdb/genres', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch genres');
                    }

                    const data = await response.json();
                    setGenres(data);
                    setError('');
                    setIsLoading(false);
                }
            } catch (err) {
                setError(err.message);
            }
        };

        fetchGenres();
    }, []);

    const handleGenreChange = (genreId) => {
        // Znajduje gatunek filmu na podstawie przekazanego ID gatunku.
        const genre = genres.find(g => g.id === genreId);
        // Jeśli gatunek nie został znaleziony, funkcja zakończy działanie.
        // Jest to zabezpieczenie, które uniemożliwia dalsze działanie funkcji,
        // gdyby nie znaleziono gatunku (co teoretycznie nie powinno się zdarzyć).
        if (!genre) return;

        // Aktualizuje stan `selectedGenreNames`, który przechowuje zaznaczone nazwy gatunków.
        setSelectedGenres(prevSelectedGenreNames => {
            // Sprawdza, czy nazwa gatunku jest już w tablicy zaznaczonych gatunków.
            if (prevSelectedGenreNames.includes(genre.id)) {
                // Jeśli tak, to filtruje tablicę, usuwając z niej ten gatunek,
                // ponieważ użytkownik odznaczył checkbox dla tego gatunku.
                return prevSelectedGenreNames.filter(name => name !== genre.id);
            } else {
                // Jeśli gatunek nie był wcześniej zaznaczony, dodaje jego nazwę do tablicy,
                // ponieważ użytkownik zaznaczył checkbox dla tego gatunku.
                return [...prevSelectedGenreNames, genre.id];
            }
        });
    };

    const toggleGenresMenu = () => {
        setIsGenresMenuOpen(!isGenresMenuOpen);
    };

    const fetchMovies = async (currentPage) => {
        const pageValue = typeof currentPage === 'number' ? currentPage : 1;
        setError('');

        const params = new URLSearchParams({
            language: languages.find(lang => lang.english_name === language)?.iso_639_1,
            page: pageValue,
            sortBy,
            includeAdult: includeAdult,
            includeVideo: includeVideo,
            primaryReleaseYear: primaryReleaseYear,
            withGenres: selectedGenres.join(',')
        });

        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/tmdb/movies/discover?${params.toString()}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch movies');
            }

            const data = await response.json();
            setMovies(data.results); // Teraz dane filmów są w `data.movies`
            setMaxPages(data.total_pages); // Aktualizacja maksymalnej liczby stron
            setError('');
            setIsLoading(false);
        } catch (err) {
            setError(err.message);
        }
    };

    const validatePrimaryReleaseYear = (value) => {
        return /^\d{4}$/.test(value);
    };

    // Funkcja obsługująca wyszukiwanie
    const handleSearch = async () => {
        setPage(1); // Resetuj numer strony na 1 przy nowym wyszukiwaniu
        if (primaryReleaseYear && !validatePrimaryReleaseYear(primaryReleaseYear)) {
            setError("Please enter a valid year (YYYY)");
            return false;
        }
        await fetchMovies(1); // Wykonaj zapytanie z nowymi kryteriami, zaczynając od strony 1
    };
    const handlePreviousPage = () => {
        const newPage = Math.max(1, page - 1);
        setPage(newPage);
        fetchMovies(newPage); // Przekazanie nowej wartości strony
    };

    const handleNextPage = () => {
        const newPage = Math.min(maxPages, page + 1);
        setPage(newPage);
        fetchMovies(newPage); // Przekazanie nowej wartości strony
    };


    return (
        <div className="discover-movies-container">
            <div className="discover-movies-form">
                {error && <div className="error">{error}</div>}
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="form-layout">
                        <div className="form-group">
                            <label htmlFor="sortBy">Sort by:</label>
                            <select id="sortBy" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                                <option value="popularity.desc">Popularity: descending</option>
                                <option value="popularity.asc">Popularity: ascending</option>
                                <option value="revenue.asc">Income: ascending</option>
                                <option value="revenue.desc">Income: descending</option>
                                <option value="primary_release_date.asc">Release date: oldest first</option>
                                <option value="primary_release_date.desc">Release date: newest first</option>
                                <option value="vote_average.asc">Rating: ascending</option>
                                <option value="vote_average.desc">Rating: descending</option>
                                <option value="vote_count.asc">Number of votes: ascending</option>
                                <option value="vote_count.desc">Number of votes: descending</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="language">Language:</label>
                            <select id="language" value={language} onChange={e => setLanguage(e.target.value)}>
                                {languages.map(lang => (
                                    <option key={lang.iso_639_1} value={lang.english_name}>{lang.english_name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="primaryReleaseYear">Release year:</label>
                            <input type="number" min="1" id="primaryReleaseYear" value={primaryReleaseYear}
                                   onChange={e => setPrimaryReleaseYear(e.target.value)}/>
                        </div>

                        <div className="form-group">
                            <label>
                                Include adult movies
                                <input type="checkbox" checked={includeAdult}
                                       onChange={() => setIncludeAdult(!includeAdult)}/>
                            </label>
                        </div>

                        <div className="form-group">
                            <label>
                                Include videos
                                <input type="checkbox" checked={includeVideo}
                                       onChange={() => setIncludeVideo(!includeVideo)}/>
                            </label>
                        </div>

                        <div className="form-group genre-select">
                            <button type="button" onClick={toggleGenresMenu}>
                                {isGenresMenuOpen ? 'Hide genres' : 'Select genres'}
                            </button>
                        </div>

                        {isGenresMenuOpen && (
                            <div className="genre-dropdown">
                                {genres.map(genre => (
                                    <div key={genre.id} className="genre-item">
                                        <input
                                            type="checkbox"
                                            id={`genre-${genre.id}`}
                                            name="genre"
                                            value={genre.id}
                                            checked={selectedGenres.includes(genre.id)}
                                            onChange={() => handleGenreChange(genre.id)}
                                        />
                                        <label htmlFor={`genre-${genre.id}`}>{genre.name}</label>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <button className="button" type="submit" onClick={handleSearch}>Search for movies</button>
                </form>
            </div>
            {isLoading && <div> <Loader /> </div>}
            {movies.length !== 0 && !isLoading && (
            <div className="discover-results-container">
                <div className="page-title">
                    <h1>Search Results</h1>
                </div>
                <div className="movies-container">
                    {movies.map(movie => (
                        <div key={movie.id} className="movie-item">
                            <Link to={`/movies/${movie.id}`}>
                                <img
                                    src={movie.poster_path ? `${baseURL}${movie.poster_path}` : require('../No_image_poster.png')}
                                    alt={`Poster of ${movie.title}`}
                                />
                            </Link>
                            <Link to={`/movies/${movie.id}`}>
                                <p>{movie.title} ({movie.release_date ? movie.release_date.slice(0, 4) : 'No date'})</p>
                            </Link>
                        </div>
                    ))}
                </div>

                <div className="pagination-buttons">
                    <button className="button" type="button" onClick={handlePreviousPage}
                            disabled={page === 1}>&#x2190;
                    </button>
                    <button className="button" type="button" onClick={handleNextPage}
                            disabled={page >= maxPages}>&#x2192;
                    </button>
                </div>
            </div>
            )}
        </div>
    );
};

export default withAuth(DiscoverMoviesForm);
