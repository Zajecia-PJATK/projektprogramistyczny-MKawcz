import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import MovieAddForm from "./MovieAddForm";
import {jwtDecode} from "jwt-decode";

const CustomMovies = () => {
    const [movies, setMovies] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const decodedToken = jwtDecode(token);
                    setIsAdmin(decodedToken.role.toString() === 'ROLE_ADMIN');

                    const response = await fetch('http://localhost:8080/api/tmdb/movies/custom', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Nie udało się pobrać filmów');
                    }

                    const data = await response.json();
                    setMovies(data);
                }
            } catch (err) {
                setError(err.message);
            }
        };

        fetchMovies();
    }, []);

    const handleDeleteMovie = async (movieId) => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await fetch(`http://localhost:8080/api/admin/movies/${movieId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Nie udało się usunąć filmu');
                }

                // Usuwanie filmu z listy na froncie
                setMovies(movies.filter(movie => movie.idMovie !== movieId));
            }
        } catch (err) {
            setError(err.message);
        }
    }

    const handleMovieAdded = (newMovie) => {
        setShowAddForm(false);
        setMovies([...movies, newMovie]);
    }

    if (error) {
        return <div>Błąd: {error}</div>;
    }

    return (
        <div>
            <h1>Filmy FilmFolio</h1>
            {isAdmin && (
                showAddForm ? (
                    <MovieAddForm onMovieAdded={handleMovieAdded}/>
                ) : (
                    <button onClick={() => setShowAddForm(true)}>Dodaj nowy film</button>
                )
            )}
            <ul>
                {movies.map(movie => (
                    <li key={movie.idMovie}>
                        <Link to={`/movies/custom/${movie.idMovie}`}>
                            <p>{movie.title} ({new Date(movie.release_date).getFullYear()})</p>
                        </Link>
                        {isAdmin && <button onClick={() => handleDeleteMovie(movie.idMovie)}>Usuń</button>}
                    </li>
                ))}
            </ul>
        </div>
    );
};
export default CustomMovies;