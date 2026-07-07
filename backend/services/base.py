from typing import Type, TypeVar, List, Optional
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status

T = TypeVar("T")  # Generic type for SQLAlchemy models

class BaseService:
    def __init__(self, model: Type[T]):
        self.model = model

    def create(self, db: Session, obj_in: dict) -> T:
        try:
            obj = self.model(**obj_in)
            db.add(obj)
            db.commit()
            db.refresh(obj)
            return obj
        except IntegrityError:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Integrity error occurred while creating the object.",
            )

    def read(self, db: Session, obj_id: str) -> Optional[T]:
        obj = db.query(self.model).filter(self.model.id == obj_id).first()
        if not obj:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"{self.model.__name__} with ID {obj_id} not found.",
            )
        return obj

    def update(self, db: Session, obj_id: str, obj_in: dict) -> T:
        obj = self.read(db, obj_id)
        for key, value in obj_in.items():
            setattr(obj, key, value)
        db.commit()
        db.refresh(obj)
        return obj

    def delete(self, db: Session, obj_id: str) -> None:
        obj = self.read(db, obj_id)
        db.delete(obj)
        db.commit()