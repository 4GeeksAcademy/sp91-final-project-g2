from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Users(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(500), nullable=False)
    player = db.Column(db.Boolean, nullable=False)
    host_id = db.Column(db.Integer, db.ForeignKey('hosts.id'))
    player_id = db.Column(db.Integer, db.ForeignKey('players.id'))
    phone = db.Column(db.String(15), unique=True, nullable=False)

    def __repr__(self):
        return '<User %r>' % self.email

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "player": self.player,
            "phone": self.phone
        }

class Hosts(db.Model):
    __tablename__ = 'hosts'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(), unique=True, nullable=False)
    address = db.Column(db.Text, nullable=False)
    court_type = db.Column(db.String(), nullable=False)
    tournament_id = db.Column(db.Integer, db.ForeignKey('tournaments.id'))

    def __repr__(self):
        return '<Host %r>' % self.name
    
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "address": self.address,
            "court_type": self.court_type,
            "tournament_id": self.tournament_id,
    }

class Players(db.Model):
    __tablename__ = 'players'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(), nullable=False)
    gender = db.Column(db.String(), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    side = db.Column(db.String(), nullable=False)
    hand = db.Column(db.String(), nullable=False)
    tournament_participant = db.relationship('Participants', back_populates='player_relationship')
    match_participant = db.relationship('Match_participants', back_populates='player_relationship')

    def __repr__(self):
        return '<Player %r>' % self.name
    
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "gender": self.gender,
            "age": self.age,
            "rating": self.rating,
            "age": self.age,
            "hand": self.hand,
            "tournament_participant": [player.serialize() for player in self.tournament_participant] if self.tournament_participant else None,
            "match_participant": [participant.serialize() for participant in self.match_participant] if self.match_participant else None
    }

class Tournaments(db.Model):
    __tablename__ = 'tournaments'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(), nullable=False)
    type = db.Column(db.String(), nullable=False)
    inscription_fee = db.Column(db.Integer, nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    schedule = db.Column(db.DateTime, nullable=False)
    award = db.Column(db.String(), nullable=False)
    tournament_winner = db.Column(db.String())
    hosts = db.relationship('Hosts', backref=('tournament'))
    tournament_match = db.relationship('Matches', backref=('tournament_match'))
    participants = db.relationship('Participants', back_populates='tournament_relationship')

    def __repr__(self):
        return '<Tournament %r>' % self.name
    
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "type": self.type,
            "inscription_fee": self.inscription_fee,
            "rating": self.rating,
            "schedule": self.schedule,
            "award": self.award,
            "tournament_winner": self.tournament_winner,
            "hosts": [host.serialize() for host in self.hosts] if self.hosts else None,
            "tournament_match" : [match.serialize() for match in self.tournament_match] if self.tournament_match else None,
            "participants" : [participant.serialize() for participant in self.participants] if self.participants else None
    }

class Matches(db.Model):
    __tablename__ = 'matches'
    id = db.Column(db.Integer, primary_key=True)
    tournament_id = db.Column(db.Integer, db.ForeignKey('tournaments.id'))
    set_1 = db.Column(db.String(), nullable=False)
    set_2= db.Column(db.String(), nullable=False)
    set_3 = db.Column(db.String(), nullable=False)
    resume = db.Column(db.Text)
    participants_match = db.relationship('Match_participants', back_populates='match_relationship')

    def __repr__(self):
        return '<Match %r>' % self.id
    
    def serialize(self):
        return {
            "id": self.id,
            "tournament_id": self.tournament_id,
            "set_1": self.set_1,
            "set_2": self.set_2,
            "set_3": self.set_3,
            "resume": self.resume,
            "participants_match": [participant.serialize() for participant in self.participants_match] if self.participants_match else None
    }

class Participants(db.Model):
    __tablename__ = 'participants'
    id = db.Column(db.Integer, primary_key=True)
    player_id = db.Column(db.Integer, db.ForeignKey('players.id'))
    player_relationship = db.relationship('Players', back_populates='tournament_participant')
    tournament_id = db.Column(db.Integer, db.ForeignKey('tournaments.id'))
    tournament_relationship = db.relationship('Tournaments', back_populates='participants')

    def __repr__(self):
         return '<Participants %r>' % self.id

    def serialize(self):
        return {
            "id": self.id,
            "player_id" : self.player_id,
            "tournament_id" : self.tournament_id
    }

class Match_participants(db.Model):
    __tablename__ = 'match_participants'
    id = db.Column(db.Integer, primary_key=True)
    player_id = db.Column(db.Integer, db.ForeignKey('players.id'))
    player_relationship = db.relationship('Players', back_populates='match_participant')
    match_id = db.Column(db.Integer, db.ForeignKey('matches.id'))
    match_relationship = db.relationship('Matches', back_populates='participants_match')
    position = db.Column(db.Boolean, nullable=False)
    team = db.Column(db.Boolean, nullable=False)
    winner = db.Column(db.Boolean, nullable=False)


    def __repr__(self):
         return '<Match_participants %r>' % self.id

    def serialize(self):
        return {
            "id": self.id,
            "player_id" : self.player_id,
            "match_id" : self.match_id,
            "position": self.position,
            "team" : self.team,
            "winner" : self.winner,
    }


