# app/routes/contact.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas
from ..database import get_db
from ..security import require_admin_user

router = APIRouter(prefix="/api/contact", tags=["contact"])

# --- PUBLIC ROUTE ---
# Anyone can send a message through the contact form
@router.post("/", response_model=schemas.ContactSubmissionOut)
def submit_contact_form(submission: schemas.ContactSubmissionCreate, db: Session = Depends(get_db)):
    return crud.create_contact_submission(db=db, submission=submission)

# --- PROTECTED ADMIN ROUTE ---
# Only an admin can view the list of submitted messages
@router.get("/", response_model=List[schemas.ContactSubmissionOut], dependencies=[Depends(require_admin_user)])
def read_contact_submissions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    submissions = crud.get_contact_submissions(db, skip=skip, limit=limit)
    return submissions