import { useParams } from "react-router-dom";
import "../style/userprofile.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

export default function UserProfile() {
  const params = useParams();

  const [userDetails, setUserDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    setIsLoading(true);
    axios.get("http://localhost:8080/api/getUser/" + params.user)
      .then((response) => {
        setUserDetails(response.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      })
  }, []);

  return (
    <>
      <div className="row">
        <div className="col-1">
          <img className="profilePicture" src={userDetails.profile_picture_url} />
          <br></br>
          <center>
            <p className="profileUsername">@{userDetails.username}</p>
          </center>
          <center>
            <p className="profileState"><b>Location: </b>{userDetails.state}</p>
          </center>
          <center>
            <p className="profileBio"><b>Biography: </b><br />{userDetails.bio}</p>
          </center>
        </div>
        <div className="col-2 threadCol">
          <Card>
            <Card.Header>Threads</Card.Header>
            <Card.Body>
              <Card.Text>
                With supporting text below as a natural lead-in to additional content.
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
        <div className="col-2 commentCol">
          <Card>
            <Card.Header>Comments</Card.Header>
            <Card.Body>
              <Card.Text>
                With supporting text below as a natural lead-in to additional content.
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      </div >
    </>
  );
}