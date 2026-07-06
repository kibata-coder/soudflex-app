from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from moviebox_api.v1 import MovieAuto, Search
import asyncio

app = FastAPI(title="Soudflex Cloud API", description="Serverless wrapper for Moviebox API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Soudflex Cloud API is running on Vercel"}

@app.get("/api/search")
async def search(q: str):
    try:
        searcher = Search()
        # The exact search syntax for moviebox-api:
        # According to docs, `moviebox-api` provides a Search class.
        # We wrap it in a basic try-catch for now since we can't test it locally.
        results = searcher.run(q)
        return {"query": q, "results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/stream/movie")
async def stream_movie(title: str):
    try:
        auto = MovieAuto()
        # MovieAuto().run() returns movie_file and subtitle_file.
        # Since this is serverless, we DO NOT want it to download the file to the Vercel server.
        # We need the streaming links. 
        # For the sake of the API bridge, let's assume MovieAuto() has a way to just extract links 
        # or we mock it temporarily until we find the extraction method in moviebox_api.
        
        # movie_file, subtitle_file = await auto.run(title)
        return {
            "title": title,
            "movie_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", # Placeholder
            "subtitle_url": None
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
