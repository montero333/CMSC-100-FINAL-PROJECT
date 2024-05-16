import Home from './Home';
import Login from './Login';
import Register from './Register';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminHome from './Admin/AdminView';
import ManageAccount from './Admin/ManageAccount';
import ProductListing from './Admin/ProductListing';
import Welcome from './Welcome';


function App() {
  return (
    <div style={{ marginTop: '-3.5rem' }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/admin-home" element={<AdminHome />} />
          <Route path="/manage-accounts" element={<ManageAccount />} />
          <Route path="/product-listing" element={<ProductListing />} />

        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;
