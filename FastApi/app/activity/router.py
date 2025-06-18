from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, or_, asc, desc
from sqlalchemy.orm import Session
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import async_session
from app.activity.schemas import AdditionalActivitiesCreate, AdditionalActivitiesUpdate, AdditionalActivitiesOut
import app.activity.crud as crud
from app.models import AdditionalActivities

router = APIRouter()


async def get_session() -> AsyncSession:
    async with async_session() as session:
        yield session


@router.post("/", response_model=AdditionalActivitiesOut)
def create_additional_activity(model: AdditionalActivitiesCreate, db: AsyncSession = Depends(get_session)):
    return crud.create(db, model)


@router.get("/", response_model=List[AdditionalActivitiesOut])
async def read_additional_activities(
        offset: int = 0,
        limit: int = Query(default=10, lte=100),
        search: Optional[str] = None,
        sort_by: Optional[str] = None,
        sort_direction: str = Query(default="asc", pattern="^(asc|desc)$"),
        db: AsyncSession = Depends(get_session)
):
    query = select(AdditionalActivities)
    if search:
        search_term = f"%{search}%"
        query = query.where(
            or_(
                AdditionalActivities.Name.ilike(search_term),
                AdditionalActivities.Description.ilike(search_term),
            )
        )
    # Сортировка
    if sort_by:
        # Защита от SQL-инъекций: явно разрешенные поля
        sort_field_map = {
            "Name": AdditionalActivities.Name,
            "Type": AdditionalActivities.Id_type_activity,
        }
        sort_column = sort_field_map.get(sort_by)
        if sort_column is not None:
            query = query.order_by(asc(sort_column) if sort_direction == "asc" else desc(sort_column))

    query = query.offset(offset).limit(limit)

    result = await db.execute(query)
    return result.scalars().all()


@router.get("/{activity_id}", response_model=AdditionalActivitiesOut)
async def read_additional_activity(activity_id: int, db: AsyncSession = Depends(get_session)):
    query = (
        select(AdditionalActivities)
            .where(AdditionalActivities.Id_additional_activities == activity_id)
    )
    result = await db.execute(query)

    db_activity = result.scalar_one_or_none()
    if not db_activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    return db_activity


@router.put("/{activity_id}", response_model=AdditionalActivitiesOut)
def update_additional_activity(activity_id: int, activity: AdditionalActivitiesUpdate, db: AsyncSession = Depends(get_session)):
    db_activity = crud.update(db, activity_id, activity)
    if not db_activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    return db_activity


@router.delete("/{activity_id}", response_model=AdditionalActivitiesOut)
def delete_additional_activity(activity_id: int, db: AsyncSession = Depends(get_session)):
    db_activity = crud.delete(db, activity_id)
    if not db_activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    return db_activity
