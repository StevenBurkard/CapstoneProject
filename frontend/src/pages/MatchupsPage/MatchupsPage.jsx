import React, { useEffect, useState } from 'react';
import axios from 'axios';


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
            <h1>This Weeks Matchups</h1>
            {matchups.map((matchup) => (
                <div key={matchup.game_id}>
                    <div>
                        <p>Week: {matchup.week}</p>
                        <p>{matchup.away_team} vs. {matchup.home_team}</p>
                        <p>{matchup.venue}</p>
                        <p>Start Time: {matchup.start_date}</p>
                    </div>
                </div>
            ))}
        </div>
     );
}
 
export default MatchupsPage;