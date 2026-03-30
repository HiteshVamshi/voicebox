"""Pronunciation dictionary management and text preprocessing."""

from __future__ import annotations

import re
import uuid
from datetime import datetime

from sqlalchemy.orm import Session

from ..database import PronunciationEntry as DBPronunciationEntry
from ..models import PronunciationEntryCreate, PronunciationEntryResponse


def list_entries(db: Session) -> list[PronunciationEntryResponse]:
    entries = (
        db.query(DBPronunciationEntry)
        .order_by(DBPronunciationEntry.language.asc(), DBPronunciationEntry.phrase.asc())
        .all()
    )
    return [PronunciationEntryResponse.model_validate(entry) for entry in entries]


def create_entry(data: PronunciationEntryCreate, db: Session) -> PronunciationEntryResponse:
    entry = DBPronunciationEntry(
        id=str(uuid.uuid4()),
        phrase=data.phrase.strip(),
        pronunciation=data.pronunciation.strip(),
        language=(data.language or "").strip() or None,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return PronunciationEntryResponse.model_validate(entry)


def update_entry(entry_id: str, data: PronunciationEntryCreate, db: Session) -> PronunciationEntryResponse | None:
    entry = db.query(DBPronunciationEntry).filter_by(id=entry_id).first()
    if not entry:
        return None

    entry.phrase = data.phrase.strip()
    entry.pronunciation = data.pronunciation.strip()
    entry.language = (data.language or "").strip() or None
    entry.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(entry)
    return PronunciationEntryResponse.model_validate(entry)


def delete_entry(entry_id: str, db: Session) -> bool:
    entry = db.query(DBPronunciationEntry).filter_by(id=entry_id).first()
    if not entry:
        return False
    db.delete(entry)
    db.commit()
    return True


def apply_pronunciation_dictionary(text: str, language: str, db: Session) -> str:
    entries = db.query(DBPronunciationEntry).all()
    if not entries:
        return text

    processed = text
    applicable = [
        entry
        for entry in entries
        if entry.language in (None, "", language)
    ]
    applicable.sort(key=lambda entry: len(entry.phrase), reverse=True)

    for entry in applicable:
        phrase = entry.phrase.strip()
        replacement = entry.pronunciation.strip()
        if not phrase or not replacement:
            continue

        pattern = re.compile(rf"\b{re.escape(phrase)}\b", flags=re.IGNORECASE)
        processed = pattern.sub(replacement, processed)

    return processed
