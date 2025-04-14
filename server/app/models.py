
from sqlalchemy import Column, Integer, String, Date
from .database import Base

class Room(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    facilities = Column(String)
    created = Column(String)
    updated = Column(String)
    imageUrl = Column(String)
