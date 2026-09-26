import './App.css'
import Header from "./components/Header/Header";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import { MotionConfig } from "framer-motion";
import About from './components/About/About';
import Footer from './components/Footer/Footer';
import Home from './components/Home/Home';
import Originals from './components/Originals/Originals';
import Original from './components/Original/Original';
import Portfolio from './components/Portfolio/Portfolio';
import Contact from './components/Contact/Contact';
import Admin from './components/Admin/Admin';
import Prints from './components/Prints/Prints';
import Login from './components/Login/Login';
import CreatePainting from './components/CreatePainting/CreatePaintingWizard';
import EditPainting from './components/EditPainting/EditPainting';
import GicleeAdmin from './components/GicleeAdmin/GicleeAdmin';
import { AuthProvider } from './AuthContext';


function App() {
  return (

    <MotionConfig reducedMotion="user">
      <div>
        <Router>
          <AuthProvider>
            <a href="#main" className="skip-link">Skip to content</a>
            <Header />
            <div className="page-content">
              <div className="content" id="main">
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/Originals" element={<Originals/>}/>
                    <Route path="/Originals/:id" element={<Original/>}/>
                    <Route path="/Portfolio" element={<Portfolio/>}/>
                    <Route path="/About" element={<About/>}/>
                    <Route path="/Contact" element={<Contact/>}/>
                    <Route path="/Admin" element={<Admin/>}/>
                    <Route path="/Prints" element={<Prints/>}/>
                    <Route path="/Login" element={<Login/>}/>
                    <Route path="/CreatePainting" element={<CreatePainting/>}/>
                    <Route path="/EditPainting/:id" element={<EditPainting/>}/>
                    <Route path="/GicleeAdmin" element={<GicleeAdmin/>}/>
                </Routes>
              </div>
            </div>
          </AuthProvider>
        </Router>
        <footer>
          <Footer />
        </footer>
      </div>
    </MotionConfig>
  );
}

export default App;
