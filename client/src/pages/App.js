//import libraries
import { useState } from "react";
import { Routes, Route, BrowserRouter, Switch } from "react-router-dom";

import Navigation from "../comps/Navigation.jsx";
import Selection from "../comps/Selection.jsx";
import UserProfile from "../comps/UserProfile.jsx";
import DisplayEvents from "../comps/DisplayEvents.jsx";
import Settings from "../comps/Settings.jsx";
import Comments from "../comps/Comments.jsx";

function App() {
  var currentDate = new Date(new Date().getTime());
  var currentYear = currentDate.getFullYear();
  var currentMonth = ("0" + (currentDate.getMonth() + 1)).slice(-2);
  var currentDay = ("0" + currentDate.getDate()).slice(-2);

  var nextWeekDate = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);
  var nextWeekYear = nextWeekDate.getFullYear();
  var nextWeekMonth = ("0" + (nextWeekDate.getMonth() + 1)).slice(-2);
  var nextWeekDay = ("0" + nextWeekDate.getDate()).slice(-2);

  const [startDate, setStartDate] = useState(currentYear + "-" + currentMonth + "-" + currentDay);
  const [endDate, setEndDate] = useState(nextWeekYear + "-" + nextWeekMonth + "-" + nextWeekDay);
  const [location, setLocation] = useState();

  return (
    <Routes>
      <Route path="/" element={
        <>
          <Navigation />
          <Selection start={startDate} end={endDate} setStart={setStartDate} setEnd={setEndDate} setState={setLocation} />
          <DisplayEvents startDate={startDate} endDate={endDate} location={location} />
        </>
      } />
      <Route path="/user/:user" element={<><Navigation /><UserProfile /></>} />
      <Route path="/settings" element={<><Navigation /><Comments /><Settings /></>} />
    </Routes>
  );
}

export default App;
