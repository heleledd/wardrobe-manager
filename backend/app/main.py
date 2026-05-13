# uvicorn main:app --reload

from typing import Annotated
from pydantic import BaseModel
from fastapi import Depends, FastAPI, HTTPException, Query
from sqlmodel import Field, Session, SQLModel, create_engine, select
from contextlib import asynccontextmanager
from PIL import Image
from datetime import datetime, timezone
import io, base64


class WardrobeItem(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    image: bytes  # image file
    uploaded_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# database ---------------------------------------------------
sqlite_file_name = "wardrobe.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting up...")
    create_db_and_tables()  
    yield

app = FastAPI(lifespan=lifespan)


# helper functions ------------------------------------------------------------------

def compress_image(base64_str: str, max_size=(512, 512)) -> bytes:
    image_data = base64.b64decode(base64_str.split(",")[1])
    img = Image.open(io.BytesIO(image_data))
    img.thumbnail(max_size)
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=85)
    return buf.getvalue()

# API requests -----------------------------------------------------------------------

class ItemRequest(BaseModel):
    image: str   # base64
    name: str | None = None  # only required for new items

@app.post("/upload")
def add_new_item(request: ItemRequest, session: SessionDep):
    if not request.name:
        raise HTTPException(status_code=400, detail="Name is required for new items")
    compressed = compress_image(request.image)
    item = WardrobeItem(name=request.name, image=compressed)
    session.add(item)
    session.commit()
    session.refresh(item)
    return {
        "response": f"Added image to '{item.name}'",
        "id": item.id,
        "uploaded_at": item.uploaded_at.isoformat()
    }





