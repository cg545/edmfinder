import { useState, useEffect } from "react";
import axios from "axios";
import "../style/displayevents.css";
import Modal from 'react-bootstrap/Modal';
import Comments from "./Comments.jsx";

function DisplayEvents({ startDate, endDate, location, userDetails }) {

  const [theData, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();


  var apiUrl = "https://edmtrain.com/api/events?startDate=" + startDate + "&endDate=" + endDate + "&festivalInd=false&client=16b2dd0e-c2f2-4880-bb1a-71143aa8f8cc";
  useEffect(() => {
    axios.get(apiUrl)
      .then((response) => {
        setData(response.data.data);
        if (location != "NONE") {
          setFilteredData(theData.filter(edmEvent => edmEvent.venue.state == location));
        }
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });

  }, [location]);

  console.log(filteredData);
  if (!filteredData[0]) {
    var nothingToShow = true;
  } else {
    var nothingToShow = false;
  }

  //comment modal
  const [commentId, setCommentId] = useState("");
  console.log(commentId);
  function handleCloseComment() {
    setCommentId("");
  }

  return (

    < div className="feed" >
      <Modal size="lg" show={commentId == "" ? false : true} onHide={handleCloseComment}>
        <Modal.Header closeButton>
          <Modal.Title>Comments</Modal.Title>
        </Modal.Header>
        <Modal.Body><Comments eventId={commentId} /></Modal.Body>
      </Modal>

      {location == "NONE" || !location ?
        <div className="nothingShown">
          <center>
            <img className="reglogo" src="/squarelogo.png" />
            <h4>Select a state to see information about events.</h4>
          </center>
        </div>
        :
        (nothingToShow) ?
          <div className="nothingShown">
            <center>
              <img className="reglogo" src="/squarelogo.png" />
              <h4>There are currently no events matching this criteria.</h4>
            </center>
          </div>
          :
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th className="tc1" scope="col">Date</th>
                <th className="tc2" scope="col">Artist</th>
                <th className="tc1" scope="col">Location</th>
                <th className="tc1" scope="col">Tickets</th>
                <th className="tc1" scope="col">Comments</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map(edmEvent => (
                <>
                  <tr>
                    <td>{edmEvent.date}</td>
                    <th scope="row">// {edmEvent.artistList.map(theArtist => (<><span className="colorArtist">{theArtist.name}</span> // </>))}</th>
                    <td>{edmEvent.venue.location}</td>
                    <td><center><a href={edmEvent.link} target="_blank"><img className="edmtlogo" src="edmtrainlogo.png" /></a></center></td>
                    <td><center><img onClick={() => { setCommentId(edmEvent.id) }} className="edmtlogo" src="comment.png" /></center></td>
                  </tr>
                </>
              ))}

            </tbody >
          </table>
      }
    </div >
  );
}

export default DisplayEvents;