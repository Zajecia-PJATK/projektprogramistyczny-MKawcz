import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import UserProfile from './components/UserProfile';
import PopularMovies from "./components/PopularMovies";
import MovieDetails from "./components/MovieDetails";
import MovieSearch from "./components/MovieSearch";
import NavigationBar from "./components/NavigationBar";
import CreatePlaylist from "./components/CreatePlaylist";
import PlaylistDetails from "./components/PlaylistDetails";
import UserWatchlist from "./components/UserWatchlist";

function App() {
  return (
      <Router>
          <NavigationBar />
          <Routes>
              <Route path="/login" element={<LoginForm />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/" element={<RegisterForm />} />
              <Route path="/movies/popular" element={<PopularMovies />} />
              <Route path="/movies/:movieId" element={<MovieDetails />} />
              <Route path="/search" element={<MovieSearch />} />
              <Route path="/create-playlist" element={<CreatePlaylist />} />
              <Route path="/playlists/:playlistId" element={<PlaylistDetails />} />
              <Route path="/watchlist" element={<UserWatchlist />} />
          </Routes>
      </Router>
  );
}

export default App;