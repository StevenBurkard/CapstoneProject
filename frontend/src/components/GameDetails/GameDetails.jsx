import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


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
            let response = await axios.get(`http://3.17.79.83:8000/api/betLine_resource/${gameId}`);

            setBetLine(response.data);
        }catch (error){
            console.log('Error in getBetLine', error)
        }
    };
    const getAwayTeamStats = async () => {
        try {
            let response = await axios.get(`http://3.17.79.83:8000/api/team_stats/${awayTeam}`);

            setAwayTeamStats(response.data);
        }catch (error){
            console.log('Error in getAwayTeamStats', error)
        }
    };
    const getHomeTeamStats = async () => {
        try {
            let response = await axios.get(`http://3.17.79.83:8000/api/team_stats/${homeTeam}`);

            setHomeTeamStats(response.data);
        } catch (error) {
            console.log('Error in getHomeTeamStats', error)
        }
    };
    const getAwayTeamRoster = async () => {
        try {
            let response = await axios.get(`http://3.17.79.83:8000/api/roster/${awayTeam}`);

            setAwayTeamRoster(response.data);
        } catch (error) {
            console.log('Error in getAwayTeamRoster', error)
        }
    };
    const getHomeTeamRoster = async () => {
        try {
            let response = await axios.get(`http://3.17.79.83:8000/api/roster/${homeTeam}`);

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
                <TableContainer component={Paper}>
                    <Table sx={{ maxWidth: '90%' }}  aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell style={{fontWeight: 'bolder', fontSize: '1em'}}>Statistic</TableCell>
                                <TableCell align="right" style={{fontWeight: 'bolder', fontSize: '1em'}}>Value</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {awayTeamStats.map((stat, index) => (
                                <TableRow key={index}>
                                    <TableCell component="th" scope="row">
                                        {stat.stat_name}
                                    </TableCell>
                                    <TableCell align="right">{stat.stat_value}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

            <div>
            <h2>{awayTeam} Team Roster:</h2>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell style={{fontWeight: 'bolder', fontSize: '1em'}}>Name</TableCell>
                            <TableCell style={{fontWeight: 'bolder', fontSize: '1em'}}>Position</TableCell>
                            <TableCell style={{fontWeight: 'bolder', fontSize: '1em'}}>Home Town</TableCell>
                            <TableCell style={{fontWeight: 'bolder', fontSize: '1em'}}>Jersey Number</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {awayTeamRoster.map((player, index) => (
                            <TableRow key={index}>
                                <TableCell>{player.first_name} {player.last_name}</TableCell>
                                <TableCell>{player.position}</TableCell>
                                <TableCell>{player.home_city}, {player.home_state}</TableCell>
                                <TableCell>{player.jersey}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>

        <div>
            <h2>{homeTeam} Football Team</h2>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell style={{fontWeight: 'bolder', fontSize: '1em'}}>Statistic</TableCell>
                            <TableCell style={{fontWeight: 'bolder', fontSize: '1em'}}>Value</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {homeTeamStats.map((stat, index) => (
                            <TableRow key={index}>
                                <TableCell>{stat.stat_name}</TableCell>
                                <TableCell>{stat.stat_value}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>

        <div>
            <h2>{homeTeam} Team Roster:</h2>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell style={{fontWeight: 'bolder', fontSize: '1em'}}>Name</TableCell>
                            <TableCell style={{fontWeight: 'bolder', fontSize: '1em'}}>Position</TableCell>
                            <TableCell style={{fontWeight: 'bolder', fontSize: '1em'}}>Home Town</TableCell>
                            <TableCell style={{fontWeight: 'bolder', fontSize: '1em'}}>Jersey Number</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {homeTeamRoster.map((player, index) => (
                            <TableRow key={index}>
                                <TableCell>{player.first_name} {player.last_name}</TableCell>
                                <TableCell>{player.position}</TableCell>
                                <TableCell>{player.home_city}, {player.home_state}</TableCell>
                                <TableCell>{player.jersey}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    </div>

     );
}
 
export default GameDetails;

