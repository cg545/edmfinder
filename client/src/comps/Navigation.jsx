import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Modal from 'react-bootstrap/Modal';
import { useState, useEffect } from "react";
import { fetchToken } from "../comps/Auth/Auth.js";
import axios from "axios";
import { Link } from "react-router-dom";

import "../style/navigation.css";

import Register from "../pages/Register.jsx";
import Login from "../pages/Login.jsx";

function Navigation({ }) {

  const expand = false; //for sliding menu
  const [isLoading, setIsLoading] = useState(false);

  //login details
  const [loginDetails, setLoginDetails] = useState([]);

  function storeLoginInfo(details) {
    setLoginDetails(details);
  }

  const signOut = () => {
    localStorage.removeItem("edmfindertoken");
    storeLoginInfo([]);
  };

  //login modal
  const [showLogin, setShowLogin] = useState(false);
  function handleCloseLogin() {
    setShowLogin(false);
  }
  const handleShowLogin = () => setShowLogin(true);

  //register modal
  const [showRegister, setShowRegister] = useState(false);
  const handleCloseRegister = () => setShowRegister(false);
  const handleShowRegister = () => setShowRegister(true);

  useEffect(() => {
    if (fetchToken() && loginDetails[0] === undefined) {
      setIsLoading(true);
      axios.post("http://localhost:8080/api/affirmLogin", { token: fetchToken() })
        .then((response) => {
          if (response.data.username && response.data.email) {
            storeLoginInfo([{ username: response.data.username, email: response.data.email }]);
          } else {
            storeLoginInfo([]);
            localStorage.removeItem("socialtoken");
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsLoading(false);
        })
    }
  }, []);

  return (
    <>
      <Modal show={showLogin} onHide={handleCloseLogin}>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body><Login storeLoginDetails={storeLoginInfo} closeModal={handleCloseLogin} /></Modal.Body>
      </Modal>

      <Modal show={showRegister} onHide={handleCloseRegister}>
        <Modal.Header closeButton>
          <Modal.Title>Registration</Modal.Title>
        </Modal.Header>
        <Modal.Body><Register /></Modal.Body>
      </Modal>

      <Navbar key={expand} expand={expand} className="bg-light-subtle border mb-3">
        <Container fluid>
          <Navbar.Brand href="/"><img className="navlogo" src="/navlogo.png" /></Navbar.Brand>
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-${expand}`}
            aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                {fetchToken() && loginDetails[0] ?
                  <>Hello, <span className="username">{loginDetails[0].username}</span></>
                  :
                  <>{isLoading ? <>Loading...</> : <>Navigation</>}</>
                }

              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <Link className="sanitizeLink" to="/">Home</Link>
                {fetchToken() ?
                  <>

                    {loginDetails[0] ?
                      <Link className="sanitizeLink" to={`/user/${loginDetails[0].username}`}>My Account</Link>
                      :
                      <>Loading...</>
                    }
                    <Link className="sanitizeLink" to="/settings">Settings</Link>
                    <Link className="sanitizeLink" onClick={signOut}>Sign Out</Link>
                  </>
                  :
                  <Link className="sanitizeLink" ><a onClick={handleShowLogin}><span className="blueText">Login</span></a> or <a onClick={handleShowRegister}><span className="blueText">Register</span></a></Link>
                }
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
}

export default Navigation;