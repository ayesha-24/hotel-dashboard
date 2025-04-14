
from typing import List, Optional
from pydantic import BaseModel

class RoomBase(BaseModel):
    name: str
    description: str
    facilities: List[str]
    created: str
    updated: str | None = None
    imageUrl: Optional[str] = None 

class RoomCreate(RoomBase):
    pass

class Room(RoomBase):
    id: int

    class Config:
        orm_mode = True
