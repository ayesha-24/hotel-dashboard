
import shutil
from fastapi import FastAPI, Depends, HTTPException, File, UploadFile
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from . import models, crud, schemas
from .database import engine, Base, SessionLocal
import os

Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = ["http://localhost:3000"]
UPLOAD_DIR = "app/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/images", StaticFiles(directory="app/uploads"), name="images")

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

@app.post("/upload-image/")
def upload_image(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"filename": file.filename, "url": f"/images/{file.filename}"}

@app.get("/images/{filename}")
def get_image(filename: str):
    file_path = os.path.join(UPLOAD_DIR, filename)
    return FileResponse(file_path)
