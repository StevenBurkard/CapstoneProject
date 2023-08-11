from flask import jsonify
from flask_restful import Resource
import cfbd
from cfbd.rest import ApiException

class TestResource(Resource):
    def get(self):
        # Test resource connected to endpoint '/api/test_resource'
        configuration = cfbd.Configuration()
        configuration.api_key['Authorization'] = 'RtZc2irnPx84o8vvyPpYJjWIYDhbV3QDCEu6aqNxyJU89ndNYv5jy0A3q8HDkVon'
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
        configuration.api_key['Authorization'] = 'RtZc2irnPx84o8vvyPpYJjWIYDhbV3QDCEu6aqNxyJU89ndNYv5jy0A3q8HDkVon'
        configuration.api_key_prefix['Authorization'] = 'Bearer'

        api_instance = cfbd.GamesApi(cfbd.ApiClient(configuration))
        year = 2023
        week = 1
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
    def get(self):
        configuration = cfbd.Configuration()
        configuration.api_key['Authorization'] = 'RtZc2irnPx84o8vvyPpYJjWIYDhbV3QDCEu6aqNxyJU89ndNYv5jy0A3q8HDkVon'
        configuration.api_key_prefix['Authorization'] = 'Bearer'

        api_instance = cfbd.BettingApi(cfbd.ApiClient(configuration))
        year = 2023
        week = 1

        try:
            response = api_instance.get_lines(year=year, week=week)
            serialized_data = []
            for game in response:
                game_data = {
                    "game_id": game.id,
                    "home_team": game.home_team,
                    "away_team": game.away_team,
                    "bet_lines": []
                }

                for line in game.lines:
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
    def get(self):
        configuration = cfbd.Configuration()
        configuration.api_key['Authorization'] = 'RtZc2irnPx84o8vvyPpYJjWIYDhbV3QDCEu6aqNxyJU89ndNYv5jy0A3q8HDkVon'
        configuration.api_key_prefix['Authorization'] = 'Bearer'

        api_instance = cfbd.StatsApi(cfbd.ApiClient(configuration))
        
        team = "wisconsin"
        year = 2022
        

        try:
            response = api_instance.get_team_season_stats(team=team, year=year)
            serialized_data = [stat.to_dict() for stat in response]

            return jsonify(serialized_data)
        except ApiException as e:
            print("Exception when calling BettingApi->get_roster: %s\n" % e)

class RosterResource(Resource):
    def get(self):
        configuration = cfbd.Configuration()
        configuration.api_key['Authorization'] = 'RtZc2irnPx84o8vvyPpYJjWIYDhbV3QDCEu6aqNxyJU89ndNYv5jy0A3q8HDkVon'
        configuration.api_key_prefix['Authorization'] = 'Bearer'

        api_instance = cfbd.TeamsApi(cfbd.ApiClient(configuration))

        team = "wisconsin"
        year = 2023

        try:
            response = api_instance.get_roster(team=team, year=year)
            serialized_data = [player.to_dict() for player in response]

            return jsonify(serialized_data)
        except ApiException as e:
            print("Exception when calling BettingApi->get_roster: %s\n" % e)