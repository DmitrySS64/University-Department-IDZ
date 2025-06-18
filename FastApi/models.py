from typing import List, Optional

from sqlalchemy import Column, ForeignKey, ForeignKeyConstraint, Index, Integer, Numeric, PrimaryKeyConstraint, Table, Text, UniqueConstraint
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
import decimal

class Base(DeclarativeBase):
    pass


class Discipline(Base):
    __tablename__ = 'Discipline'
    __table_args__ = (
        PrimaryKeyConstraint('Id_discipline', name='Unique_Identifier3'),
        UniqueConstraint('Name', name='Unique_Name_Discipline')
    )

    Id_discipline: Mapped[int] = mapped_column(Integer, primary_key=True)
    Name: Mapped[str] = mapped_column(Text)
    Description: Mapped[Optional[str]] = mapped_column(Text)


class DisciplineTeacher(Base):
    __tablename__ = 'Discipline_Teacher'
    __table_args__ = (
        PrimaryKeyConstraint('Id_discipline', 'Id_teacher', name='PK_Discipline_Teacher'),
    )

    Id_discipline: Mapped[int] = mapped_column(Integer, primary_key=True)
    Id_teacher: Mapped[int] = mapped_column(Integer, primary_key=True)

    Curriculum: Mapped[List['Curriculum']] = relationship('Curriculum', back_populates='Discipline_Teacher')


class Office(Base):
    __tablename__ = 'Office'
    __table_args__ = (
        PrimaryKeyConstraint('Id_cabinet', name='Unique_Identifier2'),
    )

    Id_cabinet: Mapped[int] = mapped_column(Integer, primary_key=True)
    Capacity: Mapped[Optional[int]] = mapped_column(Integer)

    Teacher: Mapped[List['Teacher']] = relationship('Teacher', back_populates='Office_')


class Post(Base):
    __tablename__ = 'Post'
    __table_args__ = (
        PrimaryKeyConstraint('Id_post', name='Unique_Identifier6'),
        UniqueConstraint('Title', name='Unique_Title_Post')
    )

    Id_post: Mapped[int] = mapped_column(Integer, primary_key=True)
    Title: Mapped[str] = mapped_column(Text)

    Teacher: Mapped[List['Teacher']] = relationship('Teacher', back_populates='Post_')


t_Teacher_Additional_activities = Table(
    'Teacher_Additional_activities', Base.metadata,
    Column('Id_additional_activities', Integer, nullable=False),
    Column('Id_teacher', Integer, nullable=False)
)


class TypeOfAdditionalActivity(Base):
    __tablename__ = 'Type_of_additional_activity'
    __table_args__ = (
        PrimaryKeyConstraint('Id_type_activity', name='Unique_Identifier5'),
        UniqueConstraint('Name', name='Unique_Name_TypeActivity')
    )

    Id_type_activity: Mapped[int] = mapped_column(Integer, primary_key=True)
    Name: Mapped[str] = mapped_column(Text)

    Additional_activities: Mapped[List['AdditionalActivities']] = relationship('AdditionalActivities', back_populates='Type_of_additional_activity')


class User(Base):
    __tablename__ = 'User'
    __table_args__ = (
        PrimaryKeyConstraint('Name', name='Unique_Identifier7'),
    )

    Name: Mapped[str] = mapped_column(Text, primary_key=True)
    Password: Mapped[str] = mapped_column(Text)
    Salt: Mapped[str] = mapped_column(Text)


class AdditionalActivities(Base):
    __tablename__ = 'Additional_activities'
    __table_args__ = (
        PrimaryKeyConstraint('Id_additional_activities', name='Unique_Identifier4'),
        UniqueConstraint('Name', name='Unique_Name_AdditionalActivities'),
        Index('IX_Type_of_activity', 'Id_type_activity')
    )

    Id_additional_activities: Mapped[int] = mapped_column(Integer, primary_key=True)
    Name: Mapped[str] = mapped_column(Text)
    Description: Mapped[Optional[str]] = mapped_column(Text)
    Id_type_activity: Mapped[Optional[int]] = mapped_column(ForeignKey('Type_of_additional_activity.Id_type_activity'))

    Type_of_additional_activity: Mapped[Optional['TypeOfAdditionalActivity']] = relationship('TypeOfAdditionalActivity', back_populates='Additional_activities')


class Curriculum(Base):
    __tablename__ = 'Curriculum'
    __table_args__ = (
        ForeignKeyConstraint(['Id_discipline', 'Id_teacher'], ['Discipline_Teacher.Id_discipline', 'Discipline_Teacher.Id_teacher']),
        PrimaryKeyConstraint('Id_discipline', 'Id_teacher', 'Year', 'Number', name='Unique_Identifier8')
    )

    Id_discipline: Mapped[int] = mapped_column(Integer, primary_key=True)
    Id_teacher: Mapped[int] = mapped_column(Integer, primary_key=True)
    Year: Mapped[int] = mapped_column(Integer, primary_key=True)
    Number: Mapped[int] = mapped_column(Integer, primary_key=True)

    Discipline_Teacher: Mapped['DisciplineTeacher'] = relationship('DisciplineTeacher', back_populates='Curriculum')


class Teacher(Base):
    __tablename__ = 'Teacher'
    __table_args__ = (
        PrimaryKeyConstraint('Id_teacher', name='Unique_Identifier1'),
        Index('IX_Position', 'Id_post'),
        Index('IX_Workplace', 'Id_cabinet')
    )

    Id_teacher: Mapped[int] = mapped_column(Integer, primary_key=True)
    Name: Mapped[str] = mapped_column(Text)
    Surname: Mapped[str] = mapped_column(Text)
    Type_of_bid: Mapped[decimal.Decimal] = mapped_column(Numeric)
    Date_of_birth: Mapped[str] = mapped_column(Text)
    Id_cabinet: Mapped[int] = mapped_column(ForeignKey('Office.Id_cabinet'))
    Middle_name: Mapped[Optional[str]] = mapped_column(Text)
    Id_post: Mapped[Optional[int]] = mapped_column(ForeignKey('Post.Id_post'))

    Office_: Mapped['Office'] = relationship('Office', back_populates='Teacher')
    Post_: Mapped[Optional['Post']] = relationship('Post', back_populates='Teacher')
