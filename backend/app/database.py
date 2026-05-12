from sqlmodel import SQLModel, Field, Session, create_engine
from typing import Optional

DATABASE_URL = "sqlite:///./wardrobe.db"
engine = create_engine(DATABASE_URL)

class WardrobeItem(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    image_path: str  # path to the saved image file

def create_db():
    SQLModel.metadata.create_all(engine)