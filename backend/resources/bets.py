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

class BetResource(Resource):
    @jwt_required()
    def put(self, bet_id):
        user_id = get_jwt_identity()
        bet = Bet.query.filter_by(id=bet_id, user_id=user_id).first()

        if bet is None:
            return {"message": "No bet was found"}, 404
        
        form_data = request.get_json()
        if 'did_user_win' in form_data:
            bet.did_user_win = form_data['did_user_win']
        
        if 'unit_amount' in form_data:
            bet.unit_amount = form_data['unit_amount']
        
        db.session.commit()
        return bet_schema.dump(bet), 200

    @jwt_required()
    def delete(self, bet_id):
        user_id = get_jwt_identity()
        bet = Bet.query.filter_by(id=bet_id, user_id=user_id).first()

        if bet is None:
            return {"message": "No bet was found"}, 404
        
        db.session.delete(bet)
        db.session.commit()
        return {"message": "Bet successfully deleted!"}, 204