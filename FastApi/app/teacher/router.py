from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.status import HTTP_409_CONFLICT, HTTP_404_NOT_FOUND

from app.database import async_session, engine, Base
from sqlalchemy import select, asc, desc, or_, insert, delete
from app.teacher.schemas import TeacherCreate, TeacherUpdate, TeacherOut
from app.discipline.schemas import DisciplineOut
import app.teacher.crud as crud
from typing import List, Optional
from app.models import Teacher, DisciplineTeacher, Discipline

router = APIRouter()


async def get_session() -> AsyncSession:
    async with async_session() as session:
        yield session


@router.post("/", response_model=TeacherOut)
async def create_teacher(teacher: TeacherCreate, db: AsyncSession = Depends(get_session)):
    return await crud.create_teacher(db, teacher)


@router.get("/", response_model=List[TeacherOut])
async def read_teachers(
        offset: int = 0,
        limit: int = Query(default=10, lte=100),
        search: Optional[str] = None,
        sort_by: Optional[str] = None,
        sort_direction: str = Query(default="asc", pattern="^(asc|desc)$"),
        db: AsyncSession = Depends(get_session)
):
    query = select(Teacher)
    if search:
        search_term = f"%{search}%"
        query = query.where(
            or_(
                Teacher.Surname.ilike(search_term),
                Teacher.Name.ilike(search_term),
                Teacher.Middle_name.ilike(search_term),
            )
        )
    # Сортировка
    if sort_by:
        # Защита от SQL-инъекций: явно разрешенные поля
        sort_field_map = {
            "Surname": Teacher.Surname,
            "Name": Teacher.Name,
            "Middle_name": Teacher.Middle_name,
            "Type_of_bid": Teacher.Type_of_bid,
            "Date_of_birth": Teacher.Date_of_birth,
        }
        sort_column = sort_field_map.get(sort_by)
        if sort_column is not None:
            query = query.order_by(asc(sort_column) if sort_direction == "asc" else desc(sort_column))

    query = query.offset(offset).limit(limit)

    result = await db.execute(query)
    return result.scalars().all()


@router.get("/{teacher_id}", response_model=TeacherOut)
async def read_teacher(teacher_id: int,
                 db: AsyncSession = Depends(get_session)):
    db_teacher = await crud.get_teacher(db, teacher_id)
    if not db_teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    return db_teacher


@router.put("/{teacher_id}", response_model=TeacherOut)
async def update_teacher(
        teacher_id: int,
        teacher: TeacherUpdate,
        db: AsyncSession = Depends(get_session)
):
    db_teacher = await crud.update_teacher(db, teacher_id, teacher)
    if not db_teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    return db_teacher


@router.delete("/{teacher_id}", response_model=TeacherOut)
async def delete_teacher(teacher_id: int,
                   db: AsyncSession = Depends(get_session)):
    db_teacher = await crud.delete_teacher(db, teacher_id)
    if not db_teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    return db_teacher


@router.get("/{teacher_id}/disciplines", response_model=List[DisciplineOut])
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


@router.post("/{teacher_id}/disciplines/{discipline_id}")
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


@router.delete("/{teacher_id}/disciplines/{discipline_id}")
async def remove_discipline_from_teacher(
    teacher_id: int,
    discipline_id: int,
    db: AsyncSession = Depends(get_session)
):
    # Проверка: существует ли такая связь
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
