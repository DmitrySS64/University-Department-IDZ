from pydantic import BaseModel
from typing import Optional


class AdditionalActivitiesBase(BaseModel):
    Name: str
    Description: Optional[str] = None
    Id_type_activity: Optional[int] = None


class AdditionalActivitiesCreate(AdditionalActivitiesBase):
    pass


class AdditionalActivitiesUpdate(AdditionalActivitiesBase):
    Name: Optional[str]
    Description: Optional[str]
    Id_type_activity: Optional[int]


class AdditionalActivitiesOut(AdditionalActivitiesBase):
    Id_additional_activities: int

    class Config:
        orm_mode = True
