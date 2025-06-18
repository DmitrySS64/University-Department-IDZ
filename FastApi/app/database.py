#from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncAttrs
#from sqlalchemy import create_engine
#from sqlalchemy.ext.declarative import declarative_base
#from sqlalchemy.orm import DeclarativeBase, declared_attr
#from app.models import Base
#import os
#import pandas as pd
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "sqlite+aiosqlite:///./database.db"

engine = create_async_engine(DATABASE_URL, echo=True)
async_session = sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

Base = declarative_base()


#DB_HOST = '172.18.0.3'
#DB_PORT = '5432'
#DB_NAME = 'universityDB'
#DB_USER = 'admin'
#DB_PASSWORD = 'admin'
#
#DATABASE_URL = f'postgresql+asyncpg://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}'

#sqlite_file_name = "database.db"
#DATABASE_URL = f"sqlite:///./{sqlite_file_name}"
#DATABASE_URL = f"sqlite:///{sqlite_file_name}"

#engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
#SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
#connect_args = {"check_same_thread": False}
#engine = create_async_engine(DATABASE_URL)
#SessionLocal = async_sessionmaker(engine, expire_on_commit=False)

#Base.metadata.create_all(bind=engine)
#Base = declarative_base()

#pd.read_sql('select * from Teacher', engine)

#class Base(AsyncAttrs, DeclarativeBase):
#    __abstract__ = True
#
#    @declared_attr.directive
#    def __tablename__(cls) -> str:
#        return f"{cls.__name__.lower()}s"

#def get_db():
#    db = SessionLocal()
#    try:
#        yield db
#    finally:
#        db.close()