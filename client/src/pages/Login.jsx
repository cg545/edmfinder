import { useState } from "react";
import { setToken } from "../comps/Auth/Auth.js";
import axios from "axios";

import "../style/login.css";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default function Login({ storeLoginDetails, closeModal }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");

  const login = () => {
    /**
     * If username and password are empty, do nothing.
     */
    if ((email == "") & (password == "")) {
      return;
      /**
       * Otherwise, post username and password.
       */
    } else {
      axios.post("http://localhost:8080/api/login", {
        email: email,
        password: password,
      }
      )
        /**
         * If there's a response, set the token as the response and navigate to the main URL.
         */
        .then(function (response) {
          if (response.data.token) {
            setToken(response.data.token);
            storeLoginDetails([{ username: response.data.username, email: response.data.email }]);
            { closeModal() }
          }
          if (response.data == "Invalid password.") {
            setLoginMessage("Invalid username or password.");
          }
        })
        /**
         * If there's an error, console log the error.
         */
        .catch(function (error) {
          console.log(error, "error");
        });
    }
  };

  return (
    <>

      <div className="loginBox">
        <center>
          <img className="reglogo" src="/squarelogo.png" />
          <div className="loginMessage">{loginMessage}</div>
        </center>
        <br />
        <Form>
          <Form.Control placeholder="Email" type="email" onChange={(e) => setEmail(e.target.value)} required />
          <br />
          <Form.Control placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} required />
          <br />
          <Button variant="primary" type="button" onClick={login}>
            Login
          </Button>
        </Form>

      </div>
    </>
  );
}