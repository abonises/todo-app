import {Navigate, Route, Router, Routes} from "react-router-dom";
import Home from "./components/Home/index.jsx";
import Header from "./components/Header/index.jsx";
import Login from "./components/Login/index.jsx";
import Profile from "./components/Profile/index.jsx";
import PrivateRoute from "./components/PrivateRoute/index.jsx";

function App() {

  return (
    <div className='app'>
      <div className="site-container">
        <Header />
        <Routes>
          <Route element={ <PrivateRoute /> }>
            <Route path="/" element={ <Home /> } />
            <Route path="/profile" element={ <Profile /> } />
          </Route>
          <Route path="/login" element={<Login />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
