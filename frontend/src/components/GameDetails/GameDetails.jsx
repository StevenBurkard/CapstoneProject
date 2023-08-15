import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';

const GameDetails = () => {
    const location = useLocation();
    const gameId = location.state.game_id;
    const startDate = location.state.start_date;
    /*Checking to see if home and away team is being passed to GameDetails*/
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
                    <div>
                        <Link to={"/user_bets"} state={{"gameId": gameId, "startDate": startDate, "homeTeam": homeTeam, "awayTeam": awayTeam}} key={gameId}>
                        <button>Place Bet</button>
                        </Link>
                    </div>
                </div>
            )}
            <div>
                <h2>{awayTeam} Football Team</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Statistic</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {awayTeamStats.map((stat, index) => (
                            <tr key={index}>
                                <td>{stat.stat_name}</td>
                                <td>{stat.stat_value}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div>
                <h2>{awayTeam} Team Roster:</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Position</th>
                            <th>Home Town</th>
                            <th>Jersey Number</th>
                        </tr>
                    </thead>
                    <tbody>
                        {awayTeamRoster.map((player, index) => (
                            <tr key={index}>
                                <td>{player.first_name} {player.last_name}</td>
                                <td>{player.position}</td>
                                <td>{player.home_city}, {player.home_state}</td>
                                <td>{player.jersey}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div>
                <h2>{homeTeam} Football Team</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Statistic</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {homeTeamStats.map((stat, index) => (
                            <tr key={index}>
                                <td>{stat.stat_name}</td>
                                <td>{stat.stat_value}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div>
                <h2>{homeTeam} Team Roster:</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Position</th>
                            <th>Home Town</th>
                            <th>Jersey Number</th>
                        </tr>
                    </thead>
                    <tbody>
                        {homeTeamRoster.map((player, index) => (
                            <tr key={index}>
                                <td>{player.first_name} {player.last_name}</td>
                                <td>{player.position}</td>
                                <td>{player.home_city}, {player.home_state}</td>
                                <td>{player.jersey}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        

        

        </div>
     );
}
 
export default GameDetails;