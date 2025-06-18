from pydantic import BaseModel
from typing import Optional
from decimal import Decimal


class TeacherBase(BaseModel):
    Name: str
    Surname: str
    Middle_name: Optional[str]
    Date_of_birth: str
    Type_of_bid: Decimal
    Id_cabinet: int
    Id_post: Optional[int]


class TeacherCreate(TeacherBase):
    pass


class TeacherUpdate(BaseModel):
    Name: Optional[str]
    Surname: Optional[str]
    Middle_name: Optional[str]
    Date_of_birth: Optional[str]
    Type_of_bid: Optional[Decimal]
    Id_cabinet: Optional[int]
    Id_post: Optional[int]


class TeacherOut(TeacherBase):
    Id_teacher: int

    class Config:
        orm_mode = True  # 🔥 Обязательно!
