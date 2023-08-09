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
            let response = await axios.get('https://api.collegefootballdata.com/lines?year=2023&week=1', {
                headers: {
                    Authorization: "Bearer RtZc2irnPx84o8vvyPpYJjWIYDhbV3QDCEu6aqNxyJU89ndNYv5jy0A3q8HDkVon" 
                }
            });
                
            setMatchups(response.data);
        }catch (error){
            console.log('Error in getMatchups', error.message)
        }
    };

    return ( 
        <div className='container'>
            <h1>Week 1 Matchups</h1>
            {matchups.map((matchup) => (
                <div key={matchup.id}>
                    <p>{matchup.homeTeam} vs. {matchup.awayTeam}</p>
                </div>
            ))}
        </div>
     );
}
 
export default MatchupsPage;