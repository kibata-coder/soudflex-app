from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from moviebox_api.v1 import MovieAuto
import asyncio

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Moviebox API Wrapper is running"}

@app.get("/api/stream/movie")
async def stream_movie(title: str):
    """
    Get direct stream and subtitle links for a movie.
    """
    try:
        # We will need to review the exact python syntax for streaming via MovieBox API
        # The docs state moviebox v2 download-movie "Avatar" --stream-via mpv
        # Let's import the specific API for streaming URLs
        
        # Placeholder for exact implementation once we verify the moviebox-api object structure.
        return {
            "movie_url": "dummy_url",
            "subtitle_url": None
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
