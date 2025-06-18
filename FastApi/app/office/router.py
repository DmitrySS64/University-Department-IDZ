from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from sqlalchemy import select, asc, desc, or_
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import async_session
from app.office.schemas import OfficeCreate, OfficeUpdate, OfficeOut
import app.office.crud as crud
from app.models import Office

router = APIRouter()


async def get_session() -> AsyncSession:
    async with async_session() as session:
        yield session


@router.post("/", response_model=OfficeOut)
async def create_office(model: OfficeCreate,  db: AsyncSession = Depends(get_session)):
    return await crud.create_office(db, model)


@router.get("/", response_model=List[OfficeOut])
async def read_offices(
        offset: int = 0,
        limit: int = Query(default=10, lte=100),
        search: Optional[str] = None,
        sort_by: Optional[str] = None,
        sort_direction: str = Query(default="asc", pattern="^(asc|desc)$"),
        db: AsyncSession = Depends(get_session)
):
    query = select(Office)
    if search:
        search_term = f"%{search}%"
        query = query.where(
            or_(
                Office.Id_cabinet.ilike(search_term),
                Office.Capacity.ilike(search_term),
            )
        )
    # Сортировка
    if sort_by:
        # Защита от SQL-инъекций: явно разрешенные поля
        sort_field_map = {
            "Id": Office.Id_cabinet,
            "Capacity": Office.Capacity,
        }
        sort_column = sort_field_map.get(sort_by)
        if sort_column is not None:
            query = query.order_by(asc(sort_column) if sort_direction == "asc" else desc(sort_column))

    query = query.offset(offset).limit(limit)

    result = await db.execute(query)
    return result.scalars().all()


@router.get("/{office_id}", response_model=OfficeOut)
async def read_office(office_id: int, db: AsyncSession = Depends(get_session)):
    db_activity = await crud.get_office(db, office_id)
    if not db_activity:
        raise HTTPException(status_code=404, detail="Office not found")
    return db_activity


@router.put("/{office_id}", response_model=OfficeOut)
async def update_office(office_id: int, activity: OfficeUpdate, db: AsyncSession = Depends(get_session)):
    db_activity = await crud.update_office(db, office_id, activity)
    if not db_activity:
        raise HTTPException(status_code=404, detail="Office not found")
    return db_activity


@router.delete("/{office_id}", response_model=OfficeOut)
async def delete_office(office_id: int, db: AsyncSession = Depends(get_session)):
    db_activity = await crud.delete_office(db, office_id)
    if not db_activity:
        raise HTTPException(status_code=404, detail="Office not found")
    return db_activity
