// App.js
import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, createBrowserRouter, Outlet, RouterProvider, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Users from './pages/Users';
import Partners from './pages/Partners';
import Register from "./pages/Register";
import "./style.scss";
import { AuthContext } from './context/AuthContext';
import Konyveles from './pages/Konyveles';
import Afa from './pages/Afa';

function App() {

  const Layout = () => {
    return (<>
      <Navbar />
      <Outlet />
      <Footer />
    </>)
  }
  const { currentUser } = useContext(AuthContext);

  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/login" />
  };

  const AdminAuth = ({ children }) => {
    if (currentUser) {
      if (currentUser && currentUser.email === "admin@admin.com") {
        return children;
      } else {
        return <Navigate to="/" />;
      }
    }
  }


  console.log("xxxx", currentUser);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",

          element: <RequireAuth><Home /></RequireAuth>
        },
        {
          path: "/about",
          element: <About />
        },
        {
          path: "/contact",
          element: <Contact />
        },
        {
          path: "/users",
          element: <AdminAuth><Users /></AdminAuth>
        },
        {
          path: "/users/:id",
          element: <AdminAuth><Users /></AdminAuth>
        },
        {
          path: "/partners",
          element: <Partners />
        },
        {
          path: "/partners/:id",
          element: <Partners />
        },
        {
          path: "/konyveles",
          element: <Konyveles />
        },
        {
          path: "/afa_analitika",
          element: <Afa />
        }
      ]
    },
    {
      path: "/register",
      element: <AdminAuth><Register /></AdminAuth>,
    },
    {
      path: "/login",
      element: <Login />,
    }
  ])


  return (
    <div className="app">
      <div className="kontener">
        <RouterProvider router={router} />
      </div>
    </div>
  )
}

export default App;
