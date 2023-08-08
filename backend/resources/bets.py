from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restful import Resource
from database.models import db, Bet
from database.schemas import bet_schema, bets_schema

class UserBetResource(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        user_bets = Bet.query.filter_by(user_id=user_id)
        return bets_schema.dump(user_bets), 200

    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        form_data = request.get_json()
        new_bet = bet_schema.load(form_data)
        new_bet.user_id = user_id
        db.session.add(new_bet)
        db.session.commit()
        return bet_schema.dump(new_bet), 201