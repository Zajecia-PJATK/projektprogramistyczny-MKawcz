import React, { useEffect, useState } from 'react';
import {jwtDecode} from "jwt-decode";

const GenrePreferences = ({ updatePreferences }) => {
    const [genres, setGenres] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState(new Set());
    const [error, setError] = useState('');

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
                        throw new Error('Nie udało się pobrać preferencji');
                    }

                    const preferences = await response.json();
                    // Ustawienie zaznaczonych gatunków na podstawie pobranych preferencji
                    const genreIds = new Set(preferences.map(genre => genre.id));
                    setSelectedGenres(genreIds);
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
            alert('Musisz wybrać dokładnie 3 gatunki.');
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
                    throw new Error('Nie udało się zaktualizować preferencji');
                }

                updatePreferences(Array.from(selectedGenres));
                alert('Preferencje zostały zaktualizowane.');
            }
        } catch (err) {
            setError(err.message);
        }
    }

    if (error) {
        return <div>Błąd: {error}</div>;
    }

    return (
        <div>
            <h2>Wybierz swoje ulubione gatunki filmowe:</h2>
            {error && <p>{error}</p>}
            <form onSubmit={(e) => e.preventDefault()}>
                {genres.map(genre => (
                    <div key={genre.id}>
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
                <button type="button" onClick={handleSubmit}>Zapisz preferencje</button>
            </form>
        </div>
    );
};

export default GenrePreferences;