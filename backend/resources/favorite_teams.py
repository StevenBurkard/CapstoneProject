from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restful import Resource
from database.models import db, FavoriteTeam
from database.schemas import favorite_team_schema, favorite_teams_schema

class AllFavoriteTeamResource(Resource):
    def get(self):
        favorite_teams = FavoriteTeam.query.all()
        return favorite_teams_schema.dump(favorite_teams), 200

class UserFavoriteTeamResource(Resource):
    #GET user's favorite teams
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        favorite_teams = FavoriteTeam.query.filter_by(user_id=user_id)
        return favorite_teams_schema.dump(favorite_teams), 200
    
    #User POSTS a new favorite team
    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        form_data = request.get_json()
        new_favorite_team = favorite_team_schema.load(form_data)
        new_favorite_team.user_id = user_id
        db.session.add(new_favorite_team)
        db.session.commit()
        return favorite_team_schema.dump(new_favorite_team), 201
    
    #User DELETES a favorite team
    @jwt_required()
    def delete(self):
        user_id = get_jwt_identity()
        form_data = request.get_json()
        school = form_data.get('school')
        favorite_team = FavoriteTeam.query.filter_by(user_id=user_id, school=school).first()
        if favorite_team:
            db.session.delete(favorite_team)
            db.session.commit()
            return 'team successfully unfavorited!', 204
        else:
            return 'Favorite Team not found', 404