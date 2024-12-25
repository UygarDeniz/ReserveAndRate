import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Home from './pages/Home';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import UserProvider from './contexts/userContext';
import ProtectedComponent from './components/ProtectedComponent';
import Restaurants from './pages/Restaurants';
function App() {
  return (
    <Router>
      <UserProvider>
        <Header />
        <Routes>
          <Route index element={<Home />} />
          <Route path='/restaurants' element={<Restaurants />} />
          <Route path='/protected' element={<ProtectedRoute />}>
            <Route  path="" element={<ProtectedComponent />} />
          </Route>
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;
