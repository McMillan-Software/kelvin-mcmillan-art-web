import './App.css'
import Header from "./components/Header/Header";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import About from './components/About/About';
import Footer from './components/Footer/Footer';
import Home from './components/Home/Home';
import Originals from './components/Originals/Originals';
import Original from './components/Original/Original';
import Portfolio from './components/Portfolio/Portfolio';
import Contact from './components/Contact/Contact';
import Admin from './components/Admin/Admin';
import Login from './components/Login/Login';
import { AuthProvider } from './AuthContext';

function App() {
  return (
    <div>
      <Router>
        <AuthProvider>
        <header>
          <Header />
        </header>
          <div className="page-content">
            <div className="content">
              <Routes>
                  <Route path="/Home" element={<Home/>}/>
                  <Route path="/Originals" element={<Originals/>}/>
                  <Route path="/Originals/:id" element={<Original/>}/>
                  <Route path="/Portfolio" element={<Portfolio/>}/>
                  <Route path="/About" element={<About/>}/>
                  <Route path="/Contact" element={<Contact/>}/>
                  <Route path="/Admin" element={<Admin/>}/>   
                  <Route path="/Login" element={<Login/>}/>
              </Routes>
            </div>
          </div>
        </AuthProvider>
      </Router>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default App;