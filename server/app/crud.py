
import json
from sqlalchemy.orm import Session
from . import models, schemas

def get_rooms(db: Session):
    rooms = db.query(models.Room).all()
    for r in rooms:
        r.facilities = json.loads(r.facilities)
    return rooms

def get_room(db: Session, room_id: int):
    room = db.query(models.Room).filter(models.Room.id == room_id).first()
    if room:
        room.facilities = json.loads(room.facilities)
    return room

def create_room(db: Session, room: schemas.RoomCreate):
    db_room = models.Room(
        name=room.name,
        description=room.description,
        facilities=json.dumps(room.facilities),
        created=room.created,
        updated=room.updated,
        imageUrl=room.imageUrl
    )
    db.add(db_room)
    db.commit()
    db.refresh(db_room)
    db_room.facilities = json.loads(db_room.facilities)
    return db_room

def update_room(db: Session, room_id: int, room_data: schemas.RoomCreate):
    db_room = db.query(models.Room).filter(models.Room.id == room_id).first()
    for key, value in room_data.dict().items():
        if key == "facilities":
            setattr(db_room, key, json.dumps(value))
        else:
            setattr(db_room, key, value)
    db.commit()
    db.refresh(db_room)
    return db_room

def delete_room(db: Session, room_id: int):
    db_room = db.query(models.Room).filter(models.Room.id == room_id).first()
    db.delete(db_room)
    db.commit()
