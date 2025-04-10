
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import models, crud, schemas
from .database import engine, Base, SessionLocal

Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "API is running"}

@app.get("/rooms", response_model=list[schemas.Room])
def get_rooms(db: Session = Depends(get_db)):
    return crud.get_rooms(db)

@app.post("/rooms", response_model=schemas.Room)
def create_room(room: schemas.RoomCreate, db: Session = Depends(get_db)):
    return crud.create_room(db, room)

@app.get("/rooms/{room_id}", response_model=schemas.Room)
def get_room(room_id: int, db: Session = Depends(get_db)):
    room = crud.get_room(db, room_id)
    if room is None:
        raise HTTPException(status_code=404, detail="Room not found")
    return room

@app.put("/rooms/{room_id}", response_model=schemas.Room)
def update_room(room_id: int, updated_room: schemas.RoomCreate, db: Session = Depends(get_db)):
    room = crud.get_room(db, room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    return crud.update_room(db, room_id, updated_room)

@app.delete("/rooms/{room_id}")
def delete_room(room_id: int, db: Session = Depends(get_db)):
    room = crud.get_room(db, room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    crud.delete_room(db, room_id)
    return {"detail": "Room deleted"}
