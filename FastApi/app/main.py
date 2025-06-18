from fastapi import FastAPI
from app.database import engine, Base
from app.teacher.router import router as router_teachers
from app.discipline.router import router as router_disciplines
from app.activity.router import router as router_activities
from app.office.router import router as router_offices
from app.libs.router import router as router_directory
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import async_session

#Base.metadata.create_all(engine)
app = FastAPI(title="University API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Разрешённый источник — твой фронтенд
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#@app.get("/")
#def home_page():
#    return {"message": "Здрасте!"}


app.include_router(router_teachers, prefix="/teachers", tags=["Teachers"])
app.include_router(router_disciplines, prefix="/disciplines", tags=["Disciplines"])
app.include_router(router_activities, prefix="/activities", tags=["Activities"])
app.include_router(router_offices, prefix="/offices", tags=["Offices"])
app.include_router(router_directory, prefix="/directory", tags=["Directory"])
