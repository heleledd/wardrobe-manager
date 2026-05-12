from sqlmodel import Session, select
from database import engine, WardrobeItem, create_db, save_image
from fastai.vision.all import load_learner, PILImage
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import io


# FastAPI Setup
class AddPhotoRequest():
    image: str                 
    name: str

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db()     # creates wardrobe.db on startup if it doesn't exist
    print("Backend is ready!")
    yield
    


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)


@app.post("/add/new")
async def add_new_item(request: AddPhotoRequest):
    image_path = save_image(request.image)
    item = WardrobeItem(name=request.name, image_path=image_path)
    with Session(engine) as session:
        session.add(item)
        session.commit()
    return {"response": f"Added '{request.name}' to wardrobe"}
    

@app.post("/add/existing")
async def add_photo(request: AddPhotoRequest):
    try:
        print(f"Incoming Picture of item: {request.name}")
        
        # run the AI image recognition model on it and return 

        # Return standard JSON containing the answer
        return {"response": "here are the top 3 items to choose from"}
    
        # later the user will confirm which one it actually was - and then the 

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"That failed rip: {str(e)}")
