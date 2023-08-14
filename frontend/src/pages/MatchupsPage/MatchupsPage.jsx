import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './MatchupsPage.css';

const MatchupsPage = () => {
    const [matchups, setMatchups] = useState([]);
    const [week, setWeek] = useState([]);

    useEffect(() => {
        getMatchups();
    }, []);

    const getMatchups = async () => {
        try {
            let response = await axios.get('http://127.0.0.1:5000/api/matchup_resource', {
                headers: {
                    Authorization: "Bearer wvraN694z^0173k^ua46zin2tp1nwklw938xlhao" 
                }
            });
                
            setMatchups(response.data);
        }catch (error){
            console.log('Error in getMatchups', error.message)
        }
    };

    return ( 
        <div className='container'>
            <h2>This Weeks Matchups(Away vs Home)</h2>
            {matchups.map((matchup) => (
                <Link to={`/game/${matchup.game_id}`} state={{"home_team": matchup.home_team, "away_team": matchup.away_team, "game_id": matchup.game_id}} key={matchup.game_id}>
                    <div>
                        <div className='matchup'>
                            <p>Week: {matchup.week}</p>
                            <p>{matchup.away_team} vs. {matchup.home_team}</p>
                            <p>{matchup.venue}</p>
                            <p>Start Time: {matchup.start_date}</p>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
     );
}
 
export default MatchupsPage;