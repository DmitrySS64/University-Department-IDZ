from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import async_session
from app.libs.schemas import PostOut
import app.discipline.crud as crud
from typing import List, Optional
from sqlalchemy import select, asc, desc, or_
from app.models import Post

router = APIRouter()


async def get_session() -> AsyncSession:
    async with async_session() as session:
        yield session

#@router.get("/", response_model=List[DisciplineOut])
#async def read_disciplines(skip: int = 0, limit: int = Query(default=10, lte=100), db: AsyncSession = Depends(get_session)):
#    return await crud.get_all(db, skip, limit)

@router.get("/post/", response_model=List[PostOut])
async def read_posts(
        db: AsyncSession = Depends(get_session)
):
    query = select(Post)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/post/{post_id}", response_model=PostOut)
async def read_post(post_id: int, db: AsyncSession = Depends(get_session)):
    result = await db.execute(select(Post).where(Post.Id_post == post_id)).scalar_one_or_none()
    if not result:
        raise HTTPException(status_code=404, detail="Post not found")
    return result
