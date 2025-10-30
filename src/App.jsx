import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import "./App.css";
import Home from "./pages/home/Home";
import routes from "./routes/routes";
import { Suspense } from "react";
import Login from "./pages/auth/Login";
import { ToastContainer } from "react-toastify";
import Loader from "./components/Loader";
import { SocketProvider } from "./utilities/SocketContext";
import { ToggleProvider } from "./utilities/ContextApi";
import "./i18n.js";
import NoPage from "./pages/error/NoPage.jsx";

function App() {

  return (
    <>
      <SocketProvider>
        <ToastContainer />
        <ChakraProvider>
          <ToggleProvider >
            <Router>
              <Routes>
                <Route exact path="/login" element={<Login />} />
                <Route exact path="/" element={<Home />} />
                <Route exact path="*" element={<NoPage />} />
                {routes.map((routes, index) => {
                  const { path, component: Component } = routes;
                  return (
                    <Route
                      key={index}
                      path={path}
                      element={
                        <Suspense fallback={<Loader />}>
                          <Component />
                        </Suspense>
                      }
                    />
                  );
                })}
              </Routes>
            </Router>
          </ToggleProvider>
        </ChakraProvider>
      </SocketProvider>
    </>
  );
}

export default App;
