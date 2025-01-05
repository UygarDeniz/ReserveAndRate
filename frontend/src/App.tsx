import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Home from './pages/Home';
import Header from './components/Header';
import UserProvider from './contexts/userContext';
import Restaurants from './pages/Restaurants';
import RestaurantDetail from './pages/RestaurantDetail';
import Footer from './components/Footer';
import Profile from './pages/Profile';
function App() {
  return (
    <Router>
      <UserProvider>
        <Header />
        <Routes>
          <Route index element={<Home />} />
          <Route path='/restaurants' element={<Restaurants />} />
          <Route path='/restaurants/:id' element={<RestaurantDetail />} />
          <Route path='/profile' element={<Profile />} />
        </Routes>
        <Footer />
      </UserProvider>
    </Router>
  );
}

export default App;
