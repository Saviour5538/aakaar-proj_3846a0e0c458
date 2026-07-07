from typing import Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from pydantic import BaseModel, Field

from database.models import Conversation
from database.config import get_db
from backend.services.auth import get_current_user, get_current_user_id

router = APIRouter(prefix="/conversations")

# Pydantic schemas
class ConversationBase(BaseModel):
    title: str = Field(..., example="New Conversation")

class ConversationCreate(ConversationBase):
    pass

class ConversationResponse(ConversationBase):
    id: Optional[str] = None
    user_id: Optional[str] = None
    created_at: Optional[datetime] = None
    class Config:
        from_attributes = True

# Route handlers
@router.post("/", response_model=ConversationResponse, operation_id="create_conversation")
async def create_conversation(
    conversation_data: ConversationCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_id),
):
    user_id = current_user
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized user"
        )

    new_conversation = Conversation(
        user_id=user_id,
        title=conversation_data.title,
    )
    db.add(new_conversation)
    db.commit()
    db.refresh(new_conversation)

    return new_conversation


@router.get("/", response_model=List[ConversationResponse], operation_id="list_conversations")
async def list_conversations(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_id),
):
    user_id = current_user
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized user"
        )

    conversations = db.query(Conversation).filter(Conversation.user_id == user_id).all()
    return conversations