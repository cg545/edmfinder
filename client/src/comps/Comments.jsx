import { useState, useEffect } from "react";
import axios from "axios";
import Card from 'react-bootstrap/Card';
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import "../style/comments.css";
function Comments({ eventId = "1" }) {

  console.log("RELOADING COMMENTS!!!!!!!!!!!!!!!!!!!!");
  console.log(eventId);

  const [commentData, setCommentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [newComment, setNewComment] = useState();

  //post new comment
  var currentDate = new Date(new Date().getTime());
  var currentYear = currentDate.getFullYear();
  var currentMonth = ("0" + (currentDate.getMonth() + 1)).slice(-2);
  var currentDay = ("0" + currentDate.getDate()).slice(-2);
  function postNewComment() {
    //console.log(userDetails.username + " " + currentYear + "-" + currentMonth + "-" + currentDay + " " + newComment);
    // axios.get("http://localhost:8080/api/newComment/" + eventId.eventId,
    //   {
    //     poster: "TODO",
    //     datePosted: currentYear + "-" + currentMonth + "-" + currentDay,
    //     body: newComment
    //   })
    //   .then((response) => {
    //     setCommentData(response.data);
    //   })
    //   .catch((err) => {
    //     setError(err);
    //   })
    //   .finally(() => {
    //     //setLoading(false);
    //   });
  }

  useEffect(() => {
    console.log("requesting");
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
              <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                <Form.Control onChange={() => setNewComment()} as="textarea" rows={4} className="postCommentBox" />
              </Form.Group>
              <Button type="button" onClick={() => postNewComment()} className="btn btn-primary float-end btn-md">Post Comment</Button>
            </div>
            :
            <>
              <div className="commentWindow">
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
              <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                <Form.Control onChange={setNewComment} as="textarea" rows={4} className="postCommentBox" />
              </Form.Group>
              <Button type="button" onClick={() => postNewComment()} className="btn btn-primary float-end btn-md">Post Comment</Button>
            </>
          }
        </>
      }
    </>
  );
}

export default Comments;