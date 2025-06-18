from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models import Office
from app.office.schemas import OfficeCreate, OfficeUpdate


async def get_office(db: AsyncSession, office_id: int):
    result = await db.execute(select(Office).where(Office.Id_cabinet == office_id))
    return result.scalar_one_or_none()


async def get_offices(db: AsyncSession, skip: int = 0, limit: int = 10):
    result = await db.execute(select(Office).offset(skip).limit(limit))
    return result.scalars().all()


async def create_office(db: AsyncSession, office: OfficeCreate):
    db_office = Office(**office.dict())
    db.add(db_office)
    await db.commit()
    await db.refresh(db_office)
    return db_office


async def update_office(db: AsyncSession, office_id: int, office: OfficeUpdate):
    db_office = await get_office(db, office_id)
    if not db_office:
        return None
    for key, value in office.dict(exclude_unset=True).items():
        setattr(db_office, key, value)
    await db.commit()
    await db.refresh(db_office)
    return db_office


async def delete_office(db: AsyncSession, office_id: int):
    db_office = await get_office(db, office_id)
    if not db_office:
        return None
    await db.delete(db_office)
    await db.commit()
    return db_office