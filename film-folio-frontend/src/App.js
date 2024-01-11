import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import UserProfile from './components/UserProfile';
import PopularMovies from "./components/PopularMovies";
import MovieDetails from "./components/MovieDetails";
import MovieSearch from "./components/MovieSearch";
import NavigationBar from "./components/NavigationBar";

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
          </Routes>
      </Router>
  );
}

export default App;