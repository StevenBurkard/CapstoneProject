import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import useAuth from "../../hooks/useAuth";
import moment from 'moment';
import './MatchupsPage.css';

const MatchupsPage = () => {
    const [user, token] = useAuth();
    const [matchups, setMatchups] = useState([]);
    const [favoriteTeams, setFavoriteTeams] = useState([]);
    const [week, setWeek] = useState([]);

    useEffect(() => {
        getMatchups();
        getUserFavoriteTeams();
    }, []);

    const getMatchups = async () => {
        try {
            let response = await axios.get('http://127.0.0.1:5000/api/matchup_resource');
                
            setMatchups(response.data);
        }catch (error){
            console.log('Error in getMatchups', error);
        }
    };

    
    const getUserFavoriteTeams = async () => {
        try {
            let response = await axios.get('http://127.0.0.1:5000/api/user_favorite_teams', {
                headers: {
                    Authorization: "Bearer " + token 
                }
            });
            setFavoriteTeams(response.data.map(fav => fav.school));
        } catch (error) {
            console.log('Error in getUserFavoriteTeams', error);
        }
    };

    const postUserFavorite = async (team) => {
        try {
            let response = await axios.post('http://127.0.0.1:5000/api/user_favorite_teams', { school: team },  {
                headers: {
                    Authorization: "Bearer " + token 
                }
            });
            if (response.status === 201) {
                
                setFavoriteTeams(prevState => [...prevState, team]);
            }
        } catch (error) {
            console.log('Error in postUserFavorite', error);
        }
    };
    
    const isFavorite = (team) => favoriteTeams.includes(team);

    const sortedMatchups = [...matchups].sort((a, b) => {
        if (isFavorite(a.away_team) || isFavorite(a.home_team)) return -1;
        if (isFavorite(b.away_team) || isFavorite(b.home_team)) return 1;
        return 0;
    });

    return ( 
        <div className='container'>
            <h2>This Weeks Matchups(Away vs Home)</h2>
            {sortedMatchups.map((matchup) => (
                <Link to={`/game/${matchup.game_id}`} state={{"home_team": matchup.home_team, "away_team": matchup.away_team, "game_id": matchup.game_id, "start_date": matchup.start_date}} key={matchup.game_id} style={{textDecoration: "none"}}>
                    <div>
                        <div className='matchup'>
                            <p>Week: {matchup.week}</p>
                            <p>
                                {matchup.away_team} 
                                {!isFavorite(matchup.away_team) && <button onClick={(e) => {e.preventDefault(); postUserFavorite(matchup.away_team)}}>Favorite</button>}
                                vs. 
                                {matchup.home_team}
                                {!isFavorite(matchup.home_team) && <button onClick={(e) => {e.preventDefault(); postUserFavorite(matchup.home_team)}}>Favorite</button>}
                            </p>
                            <p>{matchup.venue}</p>
                            <p>Start Time: {moment(matchup.start_date).format("YYYY-MM-DD")}</p>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
     );
}
 
export default MatchupsPage;