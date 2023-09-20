from flask import jsonify
from flask_restful import Resource
import cfbd
from cfbd.rest import ApiException
from os import environ
from datetime import datetime, timedelta


def current_week(start_date):
    today = datetime.now()
    delta = today - start_date
    current_week = delta.days // 7 + 1

    if today.weekday() == 0:
        current_week += 1
    
    return current_week

class TestResource(Resource):
    def get(self):
        # Test resource connected to endpoint '/api/test_resource'
        configuration = cfbd.Configuration()
        configuration.api_key['Authorization'] = environ.get('CFD_API_KEY')
        configuration.api_key_prefix['Authorization'] = 'Bearer'

        api_instance = cfbd.TeamsApi(cfbd.ApiClient(configuration))
        conference = 'pac'
        try:
            response = api_instance.get_teams(conference=conference)
            serialized_data = [team.to_dict() for team in response]

            return jsonify(serialized_data)
        except ApiException as e:
            print("Exception when calling BettingApi->get_conference: %s\n" % e)
    
class MatchupResource(Resource):
    def get(self):
        configuration = cfbd.Configuration()
        configuration.api_key['Authorization'] = environ.get('CFD_API_KEY')
        configuration.api_key_prefix['Authorization'] = 'Bearer'

        api_instance = cfbd.GamesApi(cfbd.ApiClient(configuration))

        start_date = datetime(2023, 8, 26)
        year = 2023
        week = current_week(start_date)
        division = 'fbs'

        try:
            response = api_instance.get_games(year, week=week, division=division)
            serialized_data = [{
                "away_team": game.away_team,
                "home_team": game.home_team,
                "venue": game.venue,
                "start_date": game.start_date,
                "game_id": game.id,
                "week": game.week
            } for game in response]

            return jsonify(serialized_data)
        except ApiException as e:
            print("Exception when calling BettingApi->get_games: %s\n" % e)

class BetLineResource(Resource):
    def get(self, game_id):
        configuration = cfbd.Configuration()
        configuration.api_key['Authorization'] = environ.get('CFD_API_KEY')
        configuration.api_key_prefix['Authorization'] = 'Bearer'

        api_instance = cfbd.BettingApi(cfbd.ApiClient(configuration))

        start_date = datetime(2023, 8, 26)
        year = 2023
        week = current_week(start_date)

        try:
            response = api_instance.get_lines(year=year, week=week, game_id=game_id)
            serialized_data = []
            for game in response:
                game_data = {
                    "game_id": game.id,
                    "home_team": game.home_team,
                    "away_team": game.away_team,
                    "bet_lines": []
                }

                if hasattr(game, 'lines') and isinstance(game.lines, list):
                    for line in game.lines:
                        if all(hasattr(line, attr) for attr in ['provider', 'spread', 'over_under']):
                            game_data['bet_lines'].append({
                                "provider": line.provider,
                                "spread": line.spread,
                                "over_under": line.over_under
                            })

                serialized_data.append(game_data)
            return jsonify(serialized_data)
        except ApiException as e:
            print("Exception when calling BettingApi->get_lines: %s\n" % e)

class TeamStatResource(Resource):
    def get(self, school):
        configuration = cfbd.Configuration()
        configuration.api_key['Authorization'] = environ.get('CFD_API_KEY')
        configuration.api_key_prefix['Authorization'] = 'Bearer'

        api_instance = cfbd.StatsApi(cfbd.ApiClient(configuration))
        
        #team = "wisconsin"
        year = 2023
        

        try:
            response = api_instance.get_team_season_stats(team=school, year=year)
            serialized_data = [stat.to_dict() for stat in response]

            return jsonify(serialized_data)
        except ApiException as e:
            print("Exception when calling BettingApi->get_team_stats: %s\n" % e)

class RosterResource(Resource):
    def get(self, school):
        configuration = cfbd.Configuration()
        configuration.api_key['Authorization'] = environ.get('CFD_API_KEY')
        configuration.api_key_prefix['Authorization'] = 'Bearer'

        api_instance = cfbd.TeamsApi(cfbd.ApiClient(configuration))

       # team = "wisconsin"
        year = 2023

        try:
            response = api_instance.get_roster(team=school, year=year)
            serialized_data = [player.to_dict() for player in response]

            return jsonify(serialized_data)
        except ApiException as e:
            print("Exception when calling BettingApi->get_roster: %s\n" % e)