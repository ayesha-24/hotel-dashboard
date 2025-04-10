from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine, SessionLocal
from app import models

client = TestClient(app)

Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def test_create_room():
    response = client.post("/rooms", json={
        "name": "Test Room",
        "description": "Test description",
        "facilities": 3,
        "created": "2025-04-10",
        "updated": None
    })
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test Room"
    assert data["facilities"] == 3

def test_get_rooms():
    response = client.get("/rooms")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_single_room():
    response = client.get("/rooms/1")
    assert response.status_code == 200
    assert response.json()["id"] == 1

def test_update_room():
    response = client.put("/rooms/1", json={
        "name": "Updated Room",
        "description": "Updated desc",
        "facilities": 5,
        "created": "2025-04-10",
        "updated": "2025-04-10"
    })
    assert response.status_code == 200
    assert response.json()["name"] == "Updated Room"

def test_delete_room():
    response = client.delete("/rooms/1")
    assert response.status_code == 200
    assert response.json() == {"detail": "Room deleted"}

def test_get_deleted_room():
    response = client.get("/rooms/1")
    assert response.status_code == 404
