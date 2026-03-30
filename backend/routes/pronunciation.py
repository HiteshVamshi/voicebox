"""Pronunciation dictionary endpoints."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models
from ..database import get_db
from ..services import pronunciation

router = APIRouter()


@router.get("/pronunciation", response_model=list[models.PronunciationEntryResponse])
async def list_pronunciation_entries(db: Session = Depends(get_db)):
    return pronunciation.list_entries(db)


@router.post("/pronunciation", response_model=models.PronunciationEntryResponse)
async def create_pronunciation_entry(
    data: models.PronunciationEntryCreate,
    db: Session = Depends(get_db),
):
    return pronunciation.create_entry(data, db)


@router.put("/pronunciation/{entry_id}", response_model=models.PronunciationEntryResponse)
async def update_pronunciation_entry(
    entry_id: str,
    data: models.PronunciationEntryCreate,
    db: Session = Depends(get_db),
):
    entry = pronunciation.update_entry(entry_id, data, db)
    if not entry:
        raise HTTPException(status_code=404, detail="Pronunciation entry not found")
    return entry


@router.delete("/pronunciation/{entry_id}")
async def delete_pronunciation_entry(entry_id: str, db: Session = Depends(get_db)):
    success = pronunciation.delete_entry(entry_id, db)
    if not success:
        raise HTTPException(status_code=404, detail="Pronunciation entry not found")
    return {"success": True}
