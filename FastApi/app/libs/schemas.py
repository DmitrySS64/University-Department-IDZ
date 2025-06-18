from pydantic import BaseModel


class PostBase(BaseModel):
    Title: str


class PostOut(PostBase):
    Id_post: int

    class Config:
        orm_mode = True