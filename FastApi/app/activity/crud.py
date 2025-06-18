from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models import AdditionalActivities
from app.activity.schemas import AdditionalActivitiesCreate, AdditionalActivitiesUpdate


async def get(db: AsyncSession, activity_id: int):
    result = await db.execute(select(AdditionalActivities).where(
        AdditionalActivities.Id_additional_activities == activity_id))
    return result.scalar_one_or_none()


async def get_all(db: AsyncSession, skip: int = 0, limit: int = 10):
    result = await db.execute(select(AdditionalActivities).offset(skip).limit(limit))
    return result.scalars().all()


async def create(db: AsyncSession, activity: AdditionalActivitiesCreate):
    db_activity = AdditionalActivities(**activity.dict())
    db.add(db_activity)
    await db.commit()
    await db.refresh(db_activity)
    return db_activity


async def update(db: AsyncSession, activity_id: int, activity: AdditionalActivitiesUpdate):
    db_activity = await get(db, activity_id)
    if not db_activity:
        return None
    for key, value in activity.dict(exclude_unset=True).items():
        setattr(db_activity, key, value)
    await db.commit()
    await db.refresh(db_activity)
    return db_activity


async def delete(db: AsyncSession, activity_id: int):
    db_activity = await get(db, activity_id)
    if not db_activity:
        return None
    await db.delete(db_activity)
    await db.commit()
    return db_activity
