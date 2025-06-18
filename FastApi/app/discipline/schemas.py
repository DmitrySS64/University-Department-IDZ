from pydantic import BaseModel
from typing import Optional, List

from app.teacher.schemas import TeacherOut


class DisciplineBase(BaseModel):
    Name: str
    Description: Optional[str] = None


class DisciplineCreate(DisciplineBase):
    pass


class DisciplineUpdate(DisciplineBase):
    pass


class DisciplineOut(DisciplineBase):
    Id_discipline: int
    Teachers: Optional[List[TeacherOut]] = []
    class Config:
        orm_mode = True
