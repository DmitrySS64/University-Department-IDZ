/*
Created: 16/06/2025
Modified: 16/06/2025
Model: SQLite model
Database: SQLite 3.7
*/

-- Create tables section -------------------------------------------------

-- Table Teacher

CREATE TABLE Teacher
(
  Id_teacher INTEGER NOT NULL,
  Name TEXT NOT NULL,
  Surname TEXT NOT NULL,
  Middle_name TEXT,
  Type_of_bid NUMERIC NOT NULL,
  Date_of_birth TEXT NOT NULL,
  Id_cabinet INTEGER NOT NULL,
  Id_post INTEGER,
  CONSTRAINT Unique_Identifier1 PRIMARY KEY (Id_teacher),
  CONSTRAINT Workplace
    FOREIGN KEY (Id_cabinet)
    REFERENCES Office (Id_cabinet),
  CONSTRAINT Position
    FOREIGN KEY (Id_post)
    REFERENCES Post (Id_post)
)
;

CREATE INDEX IX_Workplace
  ON Teacher (Id_cabinet)
;

CREATE INDEX IX_Position
  ON Teacher (Id_post)
;

-- Table Office

CREATE TABLE Office
(
  Id_cabinet INTEGER NOT NULL,
  Capacity INTEGER,
  CONSTRAINT Unique_Identifier2 PRIMARY KEY (Id_cabinet)
)
;

-- Table Discipline

CREATE TABLE Discipline
(
  Id_discipline INTEGER NOT NULL,
  Name TEXT NOT NULL,
  Description TEXT,
  CONSTRAINT Unique_Identifier3 PRIMARY KEY (Id_discipline),
  CONSTRAINT Unique_Name_Discipline UNIQUE (Name)
)
;

-- Table Additional_activities

CREATE TABLE Additional_activities
(
  Id_additional_activities INTEGER NOT NULL,
  Name TEXT NOT NULL,
  Description TEXT,
  Id_type_activity INTEGER,
  CONSTRAINT Unique_Identifier4 PRIMARY KEY (Id_additional_activities),
  CONSTRAINT Unique_Name_AdditionalActivities UNIQUE (Name),
  CONSTRAINT Type_of_activity
    FOREIGN KEY (Id_type_activity)
    REFERENCES Type_of_additional_activity (Id_type_activity)
)
;

CREATE INDEX IX_Type_of_activity
  ON Additional_activities (Id_type_activity)
;

-- Table Type_of_additional_activity

CREATE TABLE Type_of_additional_activity
(
  Id_type_activity INTEGER NOT NULL,
  Name TEXT NOT NULL,
  CONSTRAINT Unique_Identifier5 PRIMARY KEY (Id_type_activity),
  CONSTRAINT Unique_Name_TypeActivity UNIQUE (Name)
)
;

-- Table Post

CREATE TABLE Post
(
  Id_post INTEGER NOT NULL,
  Title TEXT NOT NULL,
  CONSTRAINT Unique_Identifier6 PRIMARY KEY (Id_post),
  CONSTRAINT Unique_Title_Post UNIQUE (Title)
)
;

-- Table User

CREATE TABLE User
(
  Name TEXT NOT NULL,
  Password TEXT NOT NULL,
  Salt TEXT NOT NULL,
  CONSTRAINT Unique_Identifier7 PRIMARY KEY (Name)
)
;

-- Table Curriculum

CREATE TABLE Curriculum
(
  Id_discipline INTEGER NOT NULL,
  Id_teacher INTEGER NOT NULL,
  Year INTEGER NOT NULL,
  Number INTEGER NOT NULL,
  CONSTRAINT Unique_Identifier8 PRIMARY KEY (Id_discipline,Id_teacher,Year,Number),
  CONSTRAINT Discipline_in_the_curriculum
    FOREIGN KEY (Id_discipline, Id_teacher)
    REFERENCES Discipline_Teacher (Id_discipline, Id_teacher)
)
;

-- Table Teacher_Additional_activities

CREATE TABLE Teacher_Additional_activities
(
  Id_additional_activities INTEGER NOT NULL,
  Id_teacher INTEGER NOT NULL
)
;

-- Table Discipline_Teacher

CREATE TABLE Discipline_Teacher
(
  Id_discipline INTEGER NOT NULL,
  Id_teacher INTEGER NOT NULL,
  CONSTRAINT PK_Discipline_Teacher PRIMARY KEY (Id_discipline, Id_teacher)
)
;

