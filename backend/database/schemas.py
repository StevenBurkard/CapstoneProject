from flask_marshmallow import Marshmallow
from marshmallow import post_load, fields
from database.models import User, Car, FavoriteTeam, Bet

ma = Marshmallow()

# Auth Schemas
class RegisterSchema(ma.Schema):
    """
    Schema used for registration, includes password
    """
    id = fields.Integer(primary_key=True)
    username = fields.String(required=True)
    password = fields.String(required=True)
    first_name = fields.String(required=True)
    last_name = fields.String(required=True)
    email = fields.String(required=True)
    class Meta:
        fields = ("id", "username",  "password", "first_name", "last_name", "email")

    @post_load
    def create_user(self, data, **kwargs):
        return User(**data)
    
class UserSchema(ma.Schema):
    """
    Schema used for displaying users, does NOT include password
    """
    id = fields.Integer(primary_key=True)
    username = fields.String(required=True)
    first_name = fields.String(required=True)
    last_name = fields.String(required=True)
    email = fields.String(required=True)
    account_balance = fields.Float()
    class Meta:
        fields = ("id", "username", "first_name", "last_name", "email", "account_balance")

register_schema = RegisterSchema()
user_schema = UserSchema()
users_schema = UserSchema(many=True)


# Car Schemas
class CarSchema(ma.Schema):
    id = fields.Integer(primary_key=True)
    make = fields.String(required=True)
    model = fields.String(required=True)
    year = fields.Integer()
    user_id = fields.Integer()
    user = ma.Nested(UserSchema, many=False)
    class Meta:
        fields = ("id", "make", "model", "year", "user_id", "user")
    
    @post_load
    def create_car(self, data, **kwargs):
        return Car(**data)

car_schema = CarSchema()
cars_schema = CarSchema(many=True)


# TODO: Add your schemas below
class FavoriteTeamSchema(ma.Schema):
    id = fields.Integer(primary_key=True)
    user_id = fields.Integer(required=False)
    school = fields.String(required=True)
    user = ma.Nested(UserSchema, many=False)

    class Meta:
        fields = ("id", "user_id", "school", "user")
    
    @post_load
    def create_favorite_team(self, data, **kwargs):
        return FavoriteTeam(**data)

favorite_team_schema = FavoriteTeamSchema()
favorite_teams_schema = FavoriteTeamSchema(many=True)

class BetSchema(ma.Schema):
    id = fields.Integer(primary_key=True)
    user_id = fields.Integer(required=False)
    school = fields.String(required=True)
    unit_amount = fields.Float(required=True)
    did_user_win = fields.Boolean()
    user = ma.Nested(UserSchema, many=False)

    class Meta:
        fields = ("id", "user_id", "school", "unit_amount", "did_user_win", "user")
    
    @post_load
    def create_bet(self, data, **kwargs):
        return Bet(**data)
    
bet_schema = BetSchema()
bets_schema = BetSchema(many=True)