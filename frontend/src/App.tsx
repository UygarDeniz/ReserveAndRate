import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Home from './Home';
import Header from './components/Header';
function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
