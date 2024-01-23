import React, { useState, useEffect } from 'react';
import {Link} from "react-router-dom";

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
    const [error, setError] = useState('');
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
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const response = await fetch('http://localhost:8080/api/tmdb/genres', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Nie udało się pobrać gatunków');
                    }

                    const data = await response.json();
                    setGenres(data);
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchMovies = async (currentPage) => {
        const pageValue = typeof currentPage === 'number' ? currentPage : 1;

        const params = new URLSearchParams({
            language: languages.find(lang => lang.english_name === language)?.iso_639_1,
            page: pageValue,
            sortBy,
            includeAdult: includeAdult,
            includeVideo: includeVideo,
            primaryReleaseYear: primaryReleaseYear,
            withGenres: selectedGenres.join(',')
        });

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/tmdb/movies/discover?${params.toString()}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Nie udało się wyszukać filmów');
            }

            const data = await response.json();
            setMovies(data.results); // Teraz dane filmów są w `data.movies`
            setMaxPages(data.total_pages); // Aktualizacja maksymalnej liczby stron
            console.log(maxPages);
        } catch (err) {
            setError(err.message);
        }
    };

    // Funkcja obsługująca wyszukiwanie
    const handleSearch = async () => {
        setPage(1); // Resetuj numer strony na 1 przy nowym wyszukiwaniu
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


    if (error) {
        return <div>Błąd: {error}</div>;
    }

    return (
        <div>
            <form onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
            }}>
                <div>
                    <label htmlFor="sortBy">Sortuj według:</label>
                    <select
                        id="sortBy"
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value)}
                    >
                        <option value="popularity.desc">Popularność: malejąco</option>
                        <option value="popularity.asc">Popularność: rosnąco</option>
                        <option value="revenue.asc">Dochód: rosnąco</option>
                        <option value="revenue.desc">Dochód: malejąco</option>
                        <option value="primary_release_date.asc">Data wydania: od najstarszych</option>
                        <option value="primary_release_date.desc">Data wydania: od najnowszych</option>
                        <option value="vote_average.asc">Ocena: rosnąco</option>
                        <option value="vote_average.desc">Ocena: malejąco</option>
                        <option value="vote_count.asc">Liczba głosów: rosnąco</option>
                        <option value="vote_count.desc">Liczba głosów: malejąco</option>
                    </select>
                </div>
                <fieldset>
                    <legend>Wybierz gatunki:</legend>
                    {genres.map(genre => (
                        <div key={genre.id}>
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
                </fieldset>
                <div>
                    <label htmlFor="language">Język:</label>
                    <select id="language" value={language} onChange={e => setLanguage(e.target.value)}>
                        {languages.map(lang => (
                            <option key={lang.iso_639_1} value={lang.english_name}>{lang.english_name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="primaryReleaseYear">Rok wydania:</label>
                    <input
                        type="number"
                        id="primaryReleaseYear"
                        value={primaryReleaseYear}
                        onChange={e => setPrimaryReleaseYear(e.target.value)}
                    />
                </div>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={includeAdult}
                            onChange={() => setIncludeAdult(!includeAdult)}
                        />
                        Uwzględnij filmy dla pełnoletnich
                    </label>
                </div>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={includeVideo}
                            onChange={() => setIncludeVideo(!includeVideo)}
                        />
                        Zawiera video
                    </label>
                </div>
                <button type="submit">Wyszukaj filmy</button>
            </form>
            <h2>Wyniki wyszukiwania:</h2>
            {movies.map((movie) => (
                <div>
                    <div key={movie.id}>
                        <Link to={`/movies/${movie.id}`}>
                            <img width="150" height="200" src={`${baseURL}${movie.poster_path}`}
                                 alt={`Plakat filmu ${movie.title}`}/>
                        </Link>
                        <Link to={`/movies/${movie.id}`}>
                            <p>{movie.title} ({movie.release_date ? movie.release_date.slice(0, 4) : 'Brak daty'})</p>
                        </Link>
                    </div>

                </div>
            ))}
            {movies.length !== 0 &&
                <div>
                    <button type="button" onClick={handlePreviousPage} disabled={page === 1}>Poprzednia strona</button>
                    <button type="button" onClick={handleNextPage} disabled={page >= maxPages}>Następna strona</button>
                </div>
            }
        </div>
    );
};

export default DiscoverMoviesForm;
