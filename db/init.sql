/*
Created: 12.05.2025
Modified: 13.05.2025
Model: postgreSQL model
Database: PostgreSQL 12
*/

-- Create tables section -------------------------------------------------

-- Table Teacher

CREATE TABLE "Teacher"
(
  "Id_teacher" Smallint NOT NULL GENERATED ALWAYS AS IDENTITY
    (INCREMENT BY 1 MINVALUE 1 NO MAXVALUE START WITH 1 CACHE 1),
  "Name" Character varying(30) NOT NULL,
  "Surname" Character varying(30) NOT NULL,
  "Middle_name" Character varying(30),
  "Type_of_bid" Numeric(10,0) NOT NULL,
  "Date_of_birth" Date NOT NULL,
  "Id_cabinet" Smallint NOT NULL,
  "Id_post" Smallint
)
WITH (
  autovacuum_enabled=true)
;

CREATE INDEX "IX_Workplace" ON "Teacher" ("Id_cabinet")
;

CREATE INDEX "IX_Position" ON "Teacher" ("Id_post")
;

ALTER TABLE "Teacher" ADD CONSTRAINT "Unique_Identifier1" PRIMARY KEY ("Id_teacher")
;

-- Table Office

CREATE TABLE "Office"
(
  "Id_cabinet" Smallint NOT NULL,
  "Capacity" Smallint
)
WITH (
  autovacuum_enabled=true)
;

ALTER TABLE "Office" ADD CONSTRAINT "Unique_Identifier2" PRIMARY KEY ("Id_cabinet")
;

-- Table Discipline

CREATE TABLE "Discipline"
(
  "Id_discipline" Smallint NOT NULL GENERATED ALWAYS AS IDENTITY
    (INCREMENT BY 1 MINVALUE 1 NO MAXVALUE START WITH 1 CACHE 1),
  "Name" Character varying(200) NOT NULL
)
WITH (
  autovacuum_enabled=true)
;

ALTER TABLE "Discipline" ADD CONSTRAINT "Unique_Identifier3" PRIMARY KEY ("Id_discipline")
;

ALTER TABLE "Discipline" ADD CONSTRAINT "Unique_Name_Discipline" UNIQUE ("Name")
;

-- Table Additional activities

CREATE TABLE "Additional activities"
(
  "Id_additional_activities" Smallint NOT NULL GENERATED ALWAYS AS IDENTITY
    (INCREMENT BY 1 MINVALUE 1 NO MAXVALUE START WITH 1 CACHE 1),
  "Name" Character varying(200) NOT NULL,
  "Description" Character varying(1000) NOT NULL,
  "Id_type_activity" Smallint
)
WITH (
  autovacuum_enabled=true)
;

CREATE INDEX "IX_Type of activity" ON "Additional activities" ("Id_type_activity")
;

ALTER TABLE "Additional activities" ADD CONSTRAINT "Unique_Identifier4" PRIMARY KEY ("Id_additional_activities")
;

ALTER TABLE "Additional activities" ADD CONSTRAINT "Unique_Name_AdditionalActivities" UNIQUE ("Name")
;

-- Table Type of additional activity

CREATE TABLE "Type of additional activity"
(
  "Id_type_activity" Smallint NOT NULL GENERATED ALWAYS AS IDENTITY
    (INCREMENT BY 1 MINVALUE 1 NO MAXVALUE START WITH 1 CACHE 1),
  "Name" Character varying(100) NOT NULL
)
WITH (
  autovacuum_enabled=true)
;

ALTER TABLE "Type of additional activity" ADD CONSTRAINT "Unique_Identifier5" PRIMARY KEY ("Id_type_activity")
;

ALTER TABLE "Type of additional activity" ADD CONSTRAINT "Unique_Name_TypeActivity" UNIQUE ("Name")
;

-- Table Post

CREATE TABLE "Post"
(
  "Id_post" Smallint NOT NULL GENERATED ALWAYS AS IDENTITY
    (INCREMENT BY 1 MINVALUE 1 NO MAXVALUE START WITH 1 CACHE 1),
  "Title" Character varying(100) NOT NULL
)
WITH (
  autovacuum_enabled=true)
;

ALTER TABLE "Post" ADD CONSTRAINT "Unique_Identifier6" PRIMARY KEY ("Id_post")
;

ALTER TABLE "Post" ADD CONSTRAINT "Unique_Title_Post" UNIQUE ("Title")
;

-- Table User

CREATE TABLE "User"
(
  "Name" Character varying(50) NOT NULL,
  "Password" Character varying(100) NOT NULL,
  "Salt" Character varying(100) NOT NULL
)
WITH (
  autovacuum_enabled=true)
;

ALTER TABLE "User" ADD CONSTRAINT "Unique_Identifier7" PRIMARY KEY ("Name")
;

-- Table Curriculum

CREATE TABLE "Curriculum"
(
  "Id_discipline" Smallint NOT NULL,
  "Id_teacher" Smallint NOT NULL,
  "Year" Smallint NOT NULL,
  "Number" Smallint NOT NULL
)
WITH (
  autovacuum_enabled=true)
;

ALTER TABLE "Curriculum" ADD CONSTRAINT "Unique_Identifier8" PRIMARY KEY ("Id_discipline","Id_teacher","Year","Number")
;

-- Table Teacher_Additional activities

CREATE TABLE "Teacher_Additional activities"
(
  "Id_additional_activities" Smallint NOT NULL,
  "Id_teacher" Smallint NOT NULL
)
WITH (
  autovacuum_enabled=true)
;

-- Table Discipline_Teacher

CREATE TABLE "Discipline_Teacher"
(
  "Id_discipline" Smallint NOT NULL,
  "Id_teacher" Smallint NOT NULL
)
WITH (
  autovacuum_enabled=true)
;

ALTER TABLE "Discipline_Teacher" ADD CONSTRAINT "PK_Discipline_Teacher" PRIMARY KEY ("Id_discipline","Id_teacher")
;

-- Create foreign keys (relationships) section -------------------------------------------------

ALTER TABLE "Additional activities"
  ADD CONSTRAINT "Type of activity"
    FOREIGN KEY ("Id_type_activity")
    REFERENCES "Type of additional activity" ("Id_type_activity")
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
;

ALTER TABLE "Teacher"
  ADD CONSTRAINT "Workplace"
    FOREIGN KEY ("Id_cabinet")
    REFERENCES "Office" ("Id_cabinet")
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
;

ALTER TABLE "Teacher"
  ADD CONSTRAINT "Position"
    FOREIGN KEY ("Id_post")
    REFERENCES "Post" ("Id_post")
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
;

ALTER TABLE "Curriculum"
  ADD CONSTRAINT "Discipline_in_the_curriculum"
    FOREIGN KEY ("Id_discipline", "Id_teacher")
    REFERENCES "Discipline_Teacher" ("Id_discipline", "Id_teacher")
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
;

