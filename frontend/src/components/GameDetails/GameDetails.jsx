import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const GameDetails = () => {
    const location = useLocation();
    const gameId = location.state.game_id;

    const homeTeam = location?.state?.home_team || "Home Team";
    const awayTeam = location?.state?.away_team || "Away Team";

    const [betLine, setBetLine] = useState([]);
    const [awayTeamStats, setAwayTeamStats] = useState([]);
    const [homeTeamStats, setHomeTeamStats] = useState([]);
    const [awayTeamRoster, setAwayTeamRoster] = useState([]);
    const [homeTeamRoster, setHomeTeamRoster] = useState([]);

    useEffect(() => {
        getBetLine();
        getAwayTeamStats();
        getHomeTeamStats();
        getAwayTeamRoster();
        getHomeTeamRoster();
    }, [gameId, awayTeam, homeTeam]);

    const getBetLine = async () => {
        try {
            let response = await axios.get(`http://127.0.0.1:5000/api/betLine_resource/${gameId}`);

            setBetLine(response.data);
        }catch (error){
            console.log('Error in getBetLine', error)
        }
    };
    const getAwayTeamStats = async () => {
        try {
            let response = await axios.get(`http://127.0.0.1:5000/api/team_stats/${awayTeam}`);

            setAwayTeamStats(response.data);
        }catch (error){
            console.log('Error in getAwayTeamStats', error)
        }
    };
    const getHomeTeamStats = async () => {
        try {
            let response = await axios.get(`http://127.0.0.1:5000/api/team_stats/${homeTeam}`);

            setHomeTeamStats(response.data);
        } catch (error) {
            console.log('Error in getHomeTeamStats', error)
        }
    };
    const getAwayTeamRoster = async () => {
        try {
            let response = await axios.get(`http://127.0.0.1:5000/api/roster/${awayTeam}`);

            setAwayTeamRoster(response.data);
        } catch (error) {
            console.log('Error in getAwayTeamRoster', error)
        }
    };
    const getHomeTeamRoster = async () => {
        try {
            let response = await axios.get(`http://127.0.0.1:5000/api/roster/${homeTeam}`);

            setHomeTeamRoster(response.data);
        } catch (error) {
            console.log('Error in getHomeTeamRoster', error)
        }
    };
    console.log(`Game ID: ${gameId}`);
    return ( 
        <div className='container'>
            <h1>{awayTeam} vs {homeTeam}</h1>

        
            {betLine.length > 0 && (
                <div>
                    <h3>Betting Lines:</h3>
                    {betLine[0].bet_lines.map((line, index) => (
                        <div key={index}>
                            <p>Provider: {line.provider}</p>
                            <p>Spread: {line.spread}</p>
                            <p>Over/Under: {line.over_under}</p>
                        </div>
                    ))}
                </div>
            )}
            <div>
                <h3>{awayTeam} Team Statistics:</h3>
                {awayTeamStats.map((stat, index) => (
                    <div key={index}>
                        <p>{stat.stat_name}: {stat.stat_value}</p>
                    </div>
                ))}
            </div>
            <div>
                <h3>{homeTeam} Team Statistics:</h3>
                {homeTeamStats.map((stat, index) => (
                    <div key={index}>
                        <p>{stat.stat_name}: {stat.stat_value}</p>
                    </div>
                ))}
            </div>
            <div>
                <h2>{awayTeam} Team Roster:</h2>
                {awayTeamRoster.map((player, index) => (
                    <div key={index}>
                        <h3>{player.first_name} {player.last_name}</h3>
                        <p>Postition: {player.position}</p>
                        <p>Jersey Number: {player.jersey}</p>
                        <p>Home Town: {player.home_city}, {player.home_state}</p>
                    </div>
                ))}
            </div>
            <div>
                <h2>{homeTeam} Team Roster:</h2>
                {homeTeamRoster.map((player, index) => (
                    <div key={index}>
                        <h3>{player.first_name} {player.last_name}:</h3>
                        <p>Postition: {player.position}</p>
                        <p>Jersey Number: {player.jersey}</p>
                        <p>Home Town: {player.home_city}, {player.home_state}</p>
                    </div>
                ))}
            </div>

        

        

        </div>
     );
}
 
export default GameDetails;