from app.models import Discipline
from app.discipline.schemas import DisciplineCreate, DisciplineUpdate
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select


async def get(db: AsyncSession, discipline_id: int):
    result = await db.execute(select(Discipline).where(Discipline.Id_discipline == discipline_id))
    return result.scalar_one_or_none()


async def get_all(db: AsyncSession, skip: int = 0, limit: int = 10):
    result = await db.execute(select(Discipline).offset(skip).limit(limit))
    return result.scalars().all()


async def create(db: AsyncSession, discipline: DisciplineCreate):
    db_discipline = Discipline(**discipline.dict())
    db.add(db_discipline)
    await db.commit()
    await db.refresh(db_discipline)
    return db_discipline


async def update(db: AsyncSession, discipline_id: int, discipline: DisciplineUpdate):
    db_discipline = await get(db, discipline_id)
    if not db_discipline:
        return None
    for key, value in discipline.dict(exclude_unset=True).items():
        setattr(db_discipline, key, value)
    #if db_discipline:
    #    db_discipline.Name = discipline.name
    #    db_discipline.Description = discipline.description
    await db.commit()
    await db.refresh(db_discipline)
    return db_discipline


async def delete(db: AsyncSession, discipline_id: int):
    db_discipline = await get(db, discipline_id)
    if not db_discipline:
        return None
    await db.delete(db_discipline)
    await db.commit()
    return db_discipline
