import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute";
import Login from "./pages/Login";
import Posts from "./pages/Posts";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/" element={
          <ProtectedRoute><Posts/></ProtectedRoute>
        } />
        <Route path="/login" element={<Login/>} />
        <Route path="/" element={<ProtectedRoute><Posts/></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><Admin/></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
