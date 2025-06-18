from pydantic import BaseModel
from typing import Optional


class OfficeBase(BaseModel):
    Capacity: Optional[int] = None


class OfficeCreate(OfficeBase):
    pass


class OfficeUpdate(OfficeBase):
    Capacity: Optional[int]


class OfficeOut(OfficeBase):
    Id_cabinet: int

    class Config:
        orm_mode = True
