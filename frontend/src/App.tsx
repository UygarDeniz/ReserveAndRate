import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Home from './pages/Home';
import Header from './components/Header';
import UserProvider from './contexts/userContext';
import Restaurants from './pages/Restaurants';
import RestaurantDetail from './pages/RestaurantDetail';
import Footer from './components/Footer';
import UserInformation from './pages/UserInformation';
import AcceptInvitation from './pages/AcceptInvitation';
import RestaurantInformation from './pages/RestaurantInformation';
import CustomerProtected from './components/CustomerProtected';
import RestaurantProtected from './components/RestaurantProtected';
import RestaurantReservations from './pages/RestaurantReservations';
function App() {
  return (
    <Router>
      <UserProvider>
        <Header />
        <Routes>
          <Route index element={<Home />} />
          <Route path='/register/:token' element={<AcceptInvitation />} />
          <Route path='/restaurants' element={<Restaurants />} />
          <Route path='/restaurants/:id' element={<RestaurantDetail />} />

          <Route element={<CustomerProtected />}>
            <Route path='/profile' element={<UserInformation />} />
          </Route>
          <Route element={<RestaurantProtected />}>
            <Route
              path='/restaurant/profile'
              element={<RestaurantInformation />}
            />
            <Route
              path='/restaurant/profile/restaurant-reservations'
              element={<RestaurantReservations />}
            />
          </Route>
          <Route element={<div>Not Found</div>} />
        </Routes>
        <Footer />
      </UserProvider>
    </Router>
  );
}

export default App;
