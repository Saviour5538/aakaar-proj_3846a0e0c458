import os
from datetime import datetime
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import ValidationError
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.routes.auth import router as auth_router
from backend.routes.documents import router as documents_router
from backend.routes.chat import router as chat_router
from database.config import Base, get_db, engine

# Initialize FastAPI app
app = FastAPI(
    title="GraphMind",
    description="AI-powered web application for document processing and conversational AI.",
    version="1.0.0",
)

# CORS middleware
origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/api")
app.include_router(documents_router, prefix="/api")
app.include_router(chat_router, prefix="/api")

# Exception handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )

@app.exception_handler(ValidationError)
async def validation_exception_handler(request: Request, exc: ValidationError):
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors()},
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected error occurred."},
    )

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}

# Lifespan context manager
@app.on_event("startup")
async def startup_event():
    # Initialize database
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database initialization failed: {str(e)}")

@app.on_event("shutdown")
async def shutdown_event():
    # Perform any necessary cleanup
    pass

# Auto-mounted AI router — ai/routes.py exposes /api/ai/* (it carries its own prefix)
from ai.routes import router as ai_router
app.include_router(ai_router)