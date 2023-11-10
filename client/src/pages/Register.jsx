import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import "../style/register.css";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default function Register() {

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [locState, setLocState] = useState("");
  const [message, setMessage] = useState([]);
  const [goodMessage, setGoodMessage] = useState([]);

  const navigate = useNavigate();

  const noEmailMessage = "The email address you have entered is invalid or already in use.";
  const noUsernameMessage = "The username you have entered is invalid or already in use.";
  const badPasswordsMessage = "The passwords you have entered are invalid or do not match.";
  const noLocationMessage = "You must enter a valid location.";

  const register = () => {
    axios.post("http://localhost:8080/api/register", {
      email: email,
      username: username,
      password1: password1,
      password2: password2,
      locState: locState
    }
    )
      /**
       * If there's a positive response, navigate to login.
       */
      .then(function (response) {
        if (response.data.message == "You have succesfully registered your account!") {
          setMessage([]);
          setGoodMessage([response.data.message]);
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else if (response.data.message == "Error") {
          var problemList = [];
          if (response.data.noEmail == false) {
            problemList.push(noEmailMessage);
          }
          if (response.data.noUsername == false) {
            problemList.push(noUsernameMessage);
          }
          if (response.data.badPasswords == false) {
            problemList.push(badPasswordsMessage);
          }
          if (response.data.noLocationMessage == false) {
            problemList.push(noLocationMessage);
          }
          setMessage(problemList);
        }
      })
      /**
       * If there's an error, console log the error.
       */
      .catch(function (error) {
        console.log(error, "error");
      });
  }

  return (
    <>
      <div className="registerBox">
        <img className="reglogo" src="/squarelogo.png" />
        <p className="message">{message.map(item => <p>{item}</p>)}</p>
        <p className="goodMessage">{goodMessage}</p>
        <div className="registerForm">
          <Form>

            <Form.Group className="mb-3" controlId="Email">
              <Form.Control onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="Username">
              <Form.Control onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Username" required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="Password1">
              <Form.Control onChange={(e) => setPassword1(e.target.value)} type="password" placeholder="Password" required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="Password2">
              <Form.Control onChange={(e) => setPassword2(e.target.value)} type="password" placeholder="Confirm Password" required />
            </Form.Group>

            <Form.Select onChange={(e) => setLocState(e.target.value)} required>
              <option value="INVALID">Select a State...</option>
              <option value="Alabama">Alabama</option>
              <option value="Alaska">Alaska</option>
              <option value="Arizona">Arizona</option>
              <option value="Arkansas">Arkansas</option>
              <option value="California">California</option>
              <option value="Colorado">Colorado</option>
              <option value="Connecticut">Connecticut</option>
              <option value="Delaware">Delaware</option>
              <option value="District of Columbia">District of Columbia</option>
              <option value="Florida">Florida</option>
              <option value="Georgia">Georgia</option>
              <option value="Hawaii">Hawaii</option>
              <option value="Idaho">Idaho</option>
              <option value="Illinois">Illinois</option>
              <option value="Indiana">Indiana</option>
              <option value="Iowa">Iowa</option>
              <option value="Kansas">Kansas</option>
              <option value="Kentucky">Kentucky</option>
              <option value="Louisiana">Louisiana</option>
              <option value="Maine">Maine</option>
              <option value="Maryland">Maryland</option>
              <option value="Massachusetts">Massachusetts</option>
              <option value="Michigan">Michigan</option>
              <option value="Minnesota">Minnesota</option>
              <option value="Mississippi">Mississippi</option>
              <option value="Missouri">Missouri</option>
              <option value="Montana">Montana</option>
              <option value="Nebraska">Nebraska</option>
              <option value="Nevada">Nevada</option>
              <option value="New Hampshire">New Hampshire</option>
              <option value="New Jersey">New Jersey</option>
              <option value="New Mexico">New Mexico</option>
              <option value="New York">New York</option>
              <option value="North Carolina">North Carolina</option>
              <option value="North Dakota">North Dakota</option>
              <option value="Ohio">Ohio</option>
              <option value="Oklahoma">Oklahoma</option>
              <option value="Oregon">Oregon</option>
              <option value="Pennsylvania">Pennsylvania</option>
              <option value="Rhode Island">Rhode Island</option>
              <option value="South Carolina">South Carolina</option>
              <option value="South Dakota">South Dakota</option>
              <option value="Tennessee">Tennessee</option>
              <option value="Texas">Texas</option>
              <option value="Utah">Utah</option>
              <option value="Vermont">Vermont</option>
              <option value="Virginia">Virginia</option>
              <option value="Washington">Washington</option>
              <option value="West Virginia">West Virginia</option>
              <option value="Wisconsin">Wisconsin</option>
              <option value="Wyoming">Wyoming</option>
            </Form.Select>
            <br></br>
            <br></br>

            <Button variant="primary" type="button" onClick={register}>
              Sign Up
            </Button>
          </Form>
        </div>
      </div >
    </>
  );
}