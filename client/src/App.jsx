import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useContext } from "react";
import { Context } from "./context/Context";

export default function App() {
  const {auth} = useContext(Context);

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={ auth? < Chat /> : <Login/> } />
      <Route path="/login" element={ auth? < Chat /> : <Login/> } />
      <Route path="/register" element={ auth? < Chat /> : <Register/> } />
      <Route path="*" element={<Navigate to="/" replace /> } />
    </Routes>
    </BrowserRouter>
  )
}