import React, {  useState } from 'react';
import { useLocation } from 'react-router-dom';
import useAuth from "../../hooks/useAuth";
import axios from 'axios';

const BetForm = () => {
    const location = useLocation();
    const [user, token] = useAuth();
    
    const betDate = location.state.startDate;
    const homeTeam = location.state.homeTeam;
    const awayTeam = location.state.awayTeam;

    const [team, setTeam] = useState("");
    const [unitAmount, setUnitAmount] = useState(0);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newBet = {
                user_id: user.id,
                school: team,
                unit_amount: unitAmount,
                bet_date: betDate
            };
            let response = await axios.post('http://127.0.0.1:5000/api/user_bets', newBet, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            });
            console.log('Bet successfully submitted!', response.data);
            setMessage("Bet was successfully submitted!");
        } catch (error) {
            console.log('Error submitting bet', error);
            setMessage("Error submitting bet..");
        }
    }
console.log(homeTeam);
    return (
        <div className='container'>
            <h1>{awayTeam} vs {homeTeam}</h1>
            <h3>Place a Bet</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Team:</label>
                    <select value={team} onChange={e => setTeam(e.target.value)}>
                       <option value="" disabled>Pick a Team</option>
                       <option value={homeTeam}>{homeTeam}</option>
                       <option value={awayTeam}>{awayTeam}</option>
                    </select>
                </div>
                <div>
                    <label>Unit Amount:</label>
                    <input
                        type='number'
                        value={unitAmount}
                        onChange={e => setUnitAmount(Number(e.target.value))}
                    />
                </div>
                <button type='submit'>Place Bet</button>
            </form>
            <p>{message}</p>
        </div>
      );
}
 
export default BetForm;