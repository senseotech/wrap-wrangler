import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './Layout.jsx';
import Home from './pages/Home';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <Layout currentPageName="Home">
            <Home />
          </Layout>
        } />
        <Route path="/Settings" element={
          <Layout currentPageName="Settings">
            <Settings />
          </Layout>
        } />
        <Route path="*" element={
          <Layout currentPageName="Home">
            <Home />
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;
