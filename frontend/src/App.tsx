import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Home from './Home';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import UserProvider from './contexts/userContext';
import ProtectedComponent from './components/ProtectedComponent';
function App() {
  return (
    <Router>
      <UserProvider>
        <Header />
        <Routes>
          <Route index element={<Home />} />
          <Route path='/protected' element={<ProtectedRoute />}>
            <Route  path="" element={<ProtectedComponent />} />
          </Route>
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;
