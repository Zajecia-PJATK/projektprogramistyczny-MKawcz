import React, { useEffect, useState } from 'react';
import {jwtDecode} from "jwt-decode";
import "../styles/components/_genres.scss"
import withAuth from "./withAuth";
import Loader from "./Loader";
const GenrePreferences = ({ updatePreferences }) => {
    const [genres, setGenres] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState(new Set());
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

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

        const fetchPreferences = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const decodedToken = jwtDecode(token);
                    const idUser = decodedToken.userId;
                    const response = await fetch(`http://localhost:8080/api/users/profile/preferences?idUser=${idUser}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (!response.ok) {
                        throw new Error('Failed to fetch preferences');
                    }

                    const preferences = await response.json();
                    // Ustawienie zaznaczonych gatunków na podstawie pobranych preferencji
                    const genreIds = new Set(preferences.map(genre => genre.id));
                    setSelectedGenres(genreIds);
                    setError('');
                }
            } catch (err) {
                setError(err.message);
            }
        };

        fetchGenres();
        fetchPreferences();
    }, []);

    const handleGenreChange = (genreId) => {
        // Funkcja ta otrzymuje poprzedni stan jako argument i zwraca nowy stan.
        setSelectedGenres(prevSelectedGenres => {
            // Tworzymy nowy obiekt Set na podstawie poprzednio wybranych gatunków,
            // aby móc modyfikować zbiór bez wpływu na oryginalny stan.
            const updatedSelectedGenres = new Set(prevSelectedGenres);

            // Sprawdzamy, czy dany gatunek (genreId) jest już w zbiorze wybranych gatunków.
            if(updatedSelectedGenres.has(genreId)) {
                // Jeśli gatunek jest już wybrany, usuwamy go ze zbioru,
                // ponieważ użytkownik odznaczył ten gatunek.
                updatedSelectedGenres.delete(genreId);
            } else {
                // Jeśli gatunek nie był wcześniej wybrany, dodajemy go do zbioru,
                // ponieważ użytkownik zaznaczył ten gatunek.
                updatedSelectedGenres.add(genreId);
            }

            // Zwracamy zaktualizowany zbiór jako nowy stan selectedGenres.
            return updatedSelectedGenres;
        });
    };

    const handleSubmit = async () => {
        if (selectedGenres.size !== 3) {
            alert('You have to choose 3 genres');
            return; // Przerwij funkcję, jeśli nie wybrano dokładnie 3 gatunków
        }

        try {
            const token = localStorage.getItem('token');
            if (token) {
                const decodedToken = jwtDecode(token);
                const idUser = decodedToken.userId;
                // Przygotuj payload wysyłając tylko ID wybranych gatunków
                const genresPayload = Array.from(selectedGenres).map(id => ({id}));
                const response = await fetch(`http://localhost:8080/api/users/profile/preferences?idUser=${idUser}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(genresPayload),
                });

                if (!response.ok) {
                    throw new Error('Failed to update preferences');
                }

                updatePreferences(Array.from(selectedGenres));
                setError('');
                alert('Preferences updated successfully');
                window.location.reload();
            }
        } catch (err) {
            setError(err.message);
        }
    }

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div>
            <h2>Choose your favorite movie genres:</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={(e) => e.preventDefault()} className="genres-container">
                {genres.map(genre => (
                    <div key={genre.id} className="genre-item">
                        <input
                            type="checkbox"
                            id={`genre-${genre.id}`}
                            name="genre"
                            value={genre.id}
                            onChange={() => handleGenreChange(genre.id)}
                            checked={selectedGenres.has(genre.id)}
                            disabled={!selectedGenres.has(genre.id) && selectedGenres.size >= 3}
                        />
                        <label htmlFor={`genre-${genre.id}`}>{genre.name}</label>
                    </div>
                ))}
                <div className="form-button">
                    <button className="button" type="button" onClick={handleSubmit}>Save Your Preferences</button>
                </div>
            </form>
        </div>
    );

};

export default withAuth(GenrePreferences);