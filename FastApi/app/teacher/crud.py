from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models import Teacher, DisciplineTeacher
from app.teacher.schemas import TeacherCreate, TeacherUpdate


async def get_teacher(db: AsyncSession, teacher_id: int):
    result = await db.execute(select(Teacher).where(Teacher.Id_teacher == teacher_id))
    return result.scalar_one_or_none()


async def get_teachers(db: AsyncSession, skip: int = 0, limit: int = 10):
    result = await db.execute(select(Teacher).offset(skip).limit(limit))
    return result.scalars().all()


async def create_teacher(db: AsyncSession, teacher: TeacherCreate):
    #db_teacher = Teacher(
    #    Name=teacher.name,
    #    Surname=teacher.surname,
    #    Middle_name=teacher.middle_name,
    #    Type_of_bid=teacher.type_of_bid,
    #    Date_of_birth=teacher.date_of_birth,
    #    Id_cabinet=teacher.id_cabinet,
    #    Id_post=teacher.id_post,
    #)
    db_teacher = Teacher(**teacher.dict())
    db.add(db_teacher)
    await db.commit()
    await db.refresh(db_teacher)
    return db_teacher


async def update_teacher(db: AsyncSession,
                   teacher_id: int,
                   teacher: TeacherUpdate):
    db_teacher = await get_teacher(db, teacher_id)
    if not db_teacher:
        return None
    for key, value in teacher.dict(exclude_unset=True).items():
        setattr(db_teacher, key, value)
    await db.commit()
    await db.refresh(db_teacher)
    return db_teacher


async def delete_teacher(db: AsyncSession, teacher_id: int):
    db_teacher = await get_teacher(db, teacher_id)
    if not db_teacher:
        return None

    # Проверим наличие связанных дисциплин
    stmt = select(DisciplineTeacher).where(DisciplineTeacher.Id_teacher == teacher_id)
    result = await db.execute(stmt)
    disciplines = result.scalars().all()

    if disciplines:
        raise HTTPException(
            status_code=400,
            detail="Невозможно удалить преподавателя: есть связанные дисциплины"
        )

    await db.delete(db_teacher)
    await db.commit()
    return db_teacher
