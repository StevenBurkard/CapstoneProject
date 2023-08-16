import React from "react";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import BetChartTracker from "../../components/BetChartTracker/BetChartTracker";

const HomePage = () => {
  // The "user" value from this Hook contains the decoded logged in user information (username, first name, id)
  // The "token" value is the JWT token that you will send in the header of any request requiring authentication
  //TODO: Add an AddCars Page to add a car for a logged in user's garage
  const [user, token] = useAuth();
  const [bets, setBets] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [timeFrame, setTimeFrame] = useState('day');

  useEffect(() => {
    const fetchBets = async () => {
      try {
        let response = await axios.get("http://127.0.0.1:5000/api/user_bets", {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        setBets(response.data);
      } catch (error) {
        console.log(error.response.data);
      }
    };
    fetchBets();
  }, [token]);

  useEffect(() => {
    const calculateTotalAmount = () => {
      let total = 0;
      // Loop through each bet the user has, and update total based on win or loss
      bets.forEach(bet => {
        if (bet.did_user_win) {
          total += bet.unit_amount;
        } else {
          total -= bet.unit_amount;
        }
      });
      setTotalAmount(total);
    };
    calculateTotalAmount();
  }, [bets]);

  const handleTimeFrameChange = (newTimeFrame) => {
    setTimeFrame(newTimeFrame);
  };

  return (
    <div className="container">
      <h1>{user.first_name} {user.last_name}'s Profile</h1>
      <h3>Username: {user.username}</h3>
      <h3>Total Amount: {totalAmount > 0 ? `+${totalAmount}` : totalAmount} units</h3>
      <div className="chartTracker">
        <button onClick={() => handleTimeFrameChange("day")}>Day</button>
        <button onClick={() => handleTimeFrameChange("week")}>Week</button>
        <button onClick={() => handleTimeFrameChange("month")}>Month</button>
        <button onClick={() => handleTimeFrameChange("year")}>Year</button>
        <button onClick={() => handleTimeFrameChange("all-time")}>All-time</button>
      </div>
      <div className="containerTwo">
        <BetChartTracker bets={bets} timeFrame={timeFrame} />
      </div>
    </div>
  );
};

export default HomePage;
