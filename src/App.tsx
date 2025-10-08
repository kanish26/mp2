/* App shell: top-level layout, navigation, and routes.
 Routes: List (/), Gallery (/gallery), Details (/movie/:id) */

import { Link, NavLink, Route, Routes } from 'react-router-dom';
import LandingView from './views/LandingView';
import ListView from './views/ListView';
import GalleryView from './views/GalleryView';
import DetailsView from './views/DetailsView';
import { ListProvider } from './context/ListContext';
import './styles.css';

export default function App() {
  return (
    <ListProvider>
      <div className="app-shell">
        <header className="topbar">
          {/* Brand now links to landing "/" */}
          <Link to="/" className="brand">TMDB Movie Explorer</Link>
          <nav className="nav">
            <NavLink to="/list" className={({ isActive }) => (isActive ? 'active' : '')}>List</NavLink>
            <NavLink to="/gallery" className={({ isActive }) => (isActive ? 'active' : '')}>Gallery</NavLink>
          </nav>
        </header>

        <main className="container">
          <Routes>
            <Route path="/" element={<LandingView />} />
            <Route path="/list" element={<ListView />} />
            <Route path="/gallery" element={<GalleryView />} />
            <Route path="/movie/:id" element={<DetailsView />} />
          </Routes>
        </main>

        <footer className="footer">Built with CRA + TS + Router + Axios</footer>
      </div>
    </ListProvider>
  );
}