import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Home from './pages/Home';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import UserProvider from './contexts/userContext';
import ProtectedComponent from './components/ProtectedComponent';
import Restaurants from './pages/Restaurants';
import RestaurantDetail from './pages/RestaurantDetail';
function App() {
  return (
    <Router>
      <UserProvider>
        <Header />
        <Routes>
          <Route index element={<Home />} />
          <Route path='/restaurants' element={<Restaurants />} />
          <Route path='/restaurants/:id' element={<RestaurantDetail />} />
          <Route path='/protected' element={<ProtectedRoute />}>
            <Route  path="" element={<ProtectedComponent />} />
          </Route>
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;
