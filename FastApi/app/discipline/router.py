from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.status import HTTP_404_NOT_FOUND, HTTP_409_CONFLICT

from app.database import async_session
from app.discipline.schemas import DisciplineCreate, DisciplineUpdate, DisciplineOut
from app.teacher.schemas import TeacherOut
import app.discipline.crud as crud
from typing import List, Optional
from sqlalchemy import select, asc, desc, or_, insert, delete
from app.models import Discipline, DisciplineTeacher, Teacher

router = APIRouter()


async def get_session() -> AsyncSession:
    async with async_session() as session:
        yield session


@router.post("/", response_model=DisciplineOut)
async def create_discipline(model: DisciplineCreate, db: AsyncSession = Depends(get_session)):
    return await crud.create(db, model)


#@router.get("/", response_model=List[DisciplineOut])
#async def read_disciplines(skip: int = 0, limit: int = Query(default=10, lte=100), db: AsyncSession = Depends(get_session)):
#    return await crud.get_all(db, skip, limit)

@router.get("/", response_model=List[DisciplineOut])
async def read_disciplines(
        offset: int = 0,
        limit: int = Query(default=10, lte=100),
        search: Optional[str] = None,
        sort_by: Optional[str] = None,
        sort_direction: str = Query(default="asc", pattern="^(asc|desc)$"),
        include_teachers: bool = False,
        db: AsyncSession = Depends(get_session)
):
    query = select(Discipline)

    if include_teachers:
        query = query.options(selectinload(Discipline.Teachers))

    if search:
        search_term = f"%{search}%"
        query = query.where(
            or_(
                Discipline.Name.ilike(search_term),
                Discipline.Description.ilike(search_term),
            )
        )
    # Сортировка
    if sort_by:
        # Защита от SQL-инъекций: явно разрешенные поля
        sort_field_map = {
            "Name": Discipline.Name,
        }
        sort_column = sort_field_map.get(sort_by)
        if sort_column is not None:
            query = query.order_by(asc(sort_column) if sort_direction == "asc" else desc(sort_column))

    query = query.offset(offset).limit(limit)

    result = await db.execute(query)
    return result.scalars().all()


@router.get("/by-teacher/{teacher_id}", response_model=List[DisciplineOut])
async def read_disciplines_by_teacher(
    teacher_id: int,
    db: AsyncSession = Depends(get_session)
):
    query = (
        select(Discipline)
        .join(DisciplineTeacher, Discipline.Id_discipline == DisciplineTeacher.Id_discipline)
        .where(DisciplineTeacher.Id_teacher == teacher_id)
    )
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/{discipline_id}", response_model=DisciplineOut)
async def read_discipline(discipline_id: int, db: AsyncSession = Depends(get_session)):
    db_activity = await crud.get(db, discipline_id)
    if not db_activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    return db_activity


@router.put("/{discipline_id}", response_model=DisciplineOut)
async def update_discipline(discipline_id: int, activity: DisciplineUpdate, db: AsyncSession = Depends(get_session)):
    db_activity = await crud.update(db, discipline_id, activity)
    if not db_activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    return db_activity


@router.delete("/{discipline_id}", response_model=DisciplineOut)
async def delete_discipline(discipline_id: int, db: AsyncSession = Depends(get_session)):
    db_activity = await crud.delete(db, discipline_id)
    if not db_activity:
        raise HTTPException(status_code=404, detail="Discipline not found")
    return db_activity


@router.get("/{discipline_id}/teachers", response_model=List[TeacherOut])
async def get_teachers_for_discipline(discipline_id: int, db: AsyncSession = Depends(get_session)):
    query = (
        select(Teacher)
        .join(DisciplineTeacher, Teacher.Id_teacher == DisciplineTeacher.Id_teacher)
        .where(DisciplineTeacher.Id_discipline == discipline_id)
    )
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/{discipline_id}/teachers/{teacher_id}")
async def add_discipline_to_teacher(
    teacher_id: int,
    discipline_id: int,
    db: AsyncSession = Depends(get_session)
):
    # Проверка, что учитель существует
    teacher_exists = await db.scalar(select(Teacher).where(Teacher.Id_teacher == teacher_id))
    if not teacher_exists:
        raise HTTPException(status_code=HTTP_404_NOT_FOUND, detail="Teacher not found")

    # Проверка, что дисциплина существует
    discipline_exists = await db.scalar(select(Discipline).where(Discipline.Id_discipline == discipline_id))
    if not discipline_exists:
        raise HTTPException(status_code=HTTP_404_NOT_FOUND, detail="Discipline not found")

    # Проверка на дубликат
    existing = await db.execute(
        select(DisciplineTeacher)
        .where(
            DisciplineTeacher.Id_teacher == teacher_id,
            DisciplineTeacher.Id_discipline == discipline_id
        )
    )
    if existing.first():
        raise HTTPException(status_code=HTTP_409_CONFLICT, detail="Discipline already assigned to teacher")

    # Добавление записи
    stmt = insert(DisciplineTeacher).values(Id_teacher=teacher_id, Id_discipline=discipline_id)
    await db.execute(stmt)
    await db.commit()

    return {"message": "Discipline assigned to teacher successfully"}


@router.delete("/{discipline_id}/teachers/{teacher_id}")
async def remove_discipline_from_teacher(
    teacher_id: int,
    discipline_id: int,
    db: AsyncSession = Depends(get_session)
):
    stmt_check = select(DisciplineTeacher).where(
        DisciplineTeacher.Id_teacher == teacher_id,
        DisciplineTeacher.Id_discipline == discipline_id
    )
    result = await db.execute(stmt_check)
    relation = result.scalar_one_or_none()

    if not relation:
        raise HTTPException(status_code=404, detail="Связь между преподавателем и дисциплиной не найдена")

    # Удаление
    stmt_delete = delete(DisciplineTeacher).where(
        DisciplineTeacher.Id_teacher == teacher_id,
        DisciplineTeacher.Id_discipline == discipline_id
    )
    await db.execute(stmt_delete)
    await db.commit()

    return {"ok": "Discipline removed from teacher"}
