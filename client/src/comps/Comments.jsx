import { useState, useEffect } from "react";
import axios from "axios";
import Card from 'react-bootstrap/Card';
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import "../style/comments.css";
import { fetchToken } from "../comps/Auth/Auth.js";

function Comments({ eventId = "1" }) {

  const [commentData, setCommentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [newComment, setNewComment] = useState();

  //writeNewComment
  function writeNewComment(e) {
    setNewComment(e.target.value);
  }

  //validating user & storing login details
  const [loginDetails, setLoginDetails] = useState({});
  function storeLoginInfo(details) {
    setLoginDetails(details);
  }


  var currentDate = new Date(new Date().getTime());
  var currentYear = currentDate.getFullYear();
  var currentMonth = ("0" + (currentDate.getMonth() + 1)).slice(-2);
  var currentDay = ("0" + currentDate.getDate()).slice(-2);

  //post new comment
  const [commentMessage, setCommentMessage] = useState("");
  function postNewComment() {
    console.log(loginDetails.username + " " + currentYear + "-" + currentMonth + "-" + currentDay + " " + newComment);
    if (!newComment || newComment.length > 300) {
      setCommentMessage("Comments must be between 0 and 300 characters.");
    } else {
      axios.post("http://localhost:8080/api/newComment/" + eventId,
        {
          poster: loginDetails.username,
          datePosted: currentYear + "-" + currentMonth + "-" + currentDay,
          body: newComment
        })
        .then((response) => {
          setCommentMessage("");
          setNewComment("");
          document.getElementById("typeCommentHere").value = "";
          setCommentData(response.data);
        })
        .finally(() => {
          var elem = document.querySelector('#commentWindow');
          elem.scrollTop = elem.scrollHeight;
        })
        .catch((err) => {
          setError(err);
        });
    }
  }

  useEffect(() => {
    //this fetches the user actively on the page TODO 
    if (fetchToken() && loginDetails.username === undefined) {
      axios.post("http://localhost:8080/api/affirmLogin", { token: fetchToken() })
        .then((response) => {
          if (response.data.username && response.data.email) {
            storeLoginInfo({ username: response.data.username, email: response.data.email });
          } else {
            storeLoginInfo({});
            localStorage.removeItem("edmfindertoken");
          }
        })
    }
    //this loads the comments
    axios.get("http://localhost:8080/api/loadComments/" + eventId)
      .then((response) => {
        setCommentData(response.data);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      {loading ?
        <>Loading</>
        :
        <>
          {commentData.length == 0 ?
            <div className="nothingShown">
              <center>
                <img className="reglogo" src="/squarelogo.png" />
                <br />
                <br />
                <h5>There are no comments yet for this event.</h5>
              </center>
              <br></br>
            </div>
            :
            <>
              <div id="commentWindow" className="commentWindow">
                {commentData.map(comment => (
                  <>
                    <div className="commentRow">
                      <div className="commentCol">
                        <img className="commentPhoto" src="/defaultphoto.png" />
                        <Link className="profileLink" to={`/user/${comment.poster}`}>@{comment.poster}</Link>
                        <span className="datePosted">{comment.datePosted}</span>
                      </div>
                      <Card className="commentCard">
                        <Card.Body>
                          <Card.Text>
                            {comment.body}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </div>
                    <br />
                  </>
                ))
                }
              </div>
              <hr></hr>
            </>
          }
          {loginDetails.username ?
            <>
              <center><h5 className="redText">{commentMessage}</h5></center>
              <Form.Group className="mb-3">
                <Form.Control onChange={writeNewComment} id="typeCommentHere" as="textarea" rows={4} className="postCommentBox" />
              </Form.Group>
              <Button type="button" onClick={() => postNewComment()} className="btn btn-primary float-end btn-md">Post Comment</Button>
            </>
            :
            <>
              <center>
                <br />
                <br />
                <hr />
                <h5>You must be logged in to post comments.</h5>
              </center>
            </>}

        </>
      }
    </>
  );
}

export default Comments;