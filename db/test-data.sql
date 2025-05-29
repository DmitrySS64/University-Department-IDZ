-- 1. Вставка должностей
INSERT INTO "Post" ("Title") VALUES
('Доцент'),      -- Id_post = 1
('Профессор'),   -- Id_post = 2
('Ассистент');   -- Id_post = 3

-- 2. Вставка кабинетов
INSERT INTO "Office" ("Id_cabinet", "Capacity") VALUES
(101, 10),
(102, 20);

-- 3. Вставка дисциплин
INSERT INTO "Discipline" ("Name") VALUES
('Математика'),    -- Id_discipline = 1
('Информатика'),   -- Id_discipline = 2
('Физика');        -- Id_discipline = 3

-- 4. Вставка типов внеучебной деятельности
INSERT INTO "Type of additional activity" ("Name") VALUES
('Научная конференция'),   -- Id_type_activity = 1
('Олимпиада');             -- Id_type_activity = 2

-- 5. Вставка пользователей
INSERT INTO "User" ("Name", "Password", "Salt") VALUES
('ivanov', 'hash1', 'salt1'),
('petrov', 'hash2', 'salt2'),
('sidorov', 'hash3', 'salt3');

-- 6. Вставка преподавателей
INSERT INTO "Teacher" ("Name", "Surname", "Middle_name", "Type_of_bid", "Date_of_birth", "Id_cabinet", "Id_post") VALUES
('Иван', 'Иванов', 'Иванович', 50000, '1980-01-01', 101, 1), -- Id_teacher = 1
('Петр', 'Петров', 'Петрович', 48000, '1982-02-02', 101, 2), -- Id_teacher = 2 (коллега)
('Анна', 'Сидорова', 'Васильевна', 47000, '1985-03-03', 102, 3); -- Id_teacher = 3

-- 7. Вставка связей Дисциплина-Преподаватель (возможности преподавания)
INSERT INTO "Discipline_Teacher" ("Id_discipline", "Id_teacher") VALUES
(1, 1),  -- Иванов может вести Математику
(2, 1),  -- Иванов может вести Информатику
(3, 2),  -- Петров может вести Физику
(1, 3);  -- Сидорова может вести Математику

-- 8. Вставка семестров
-- (таблицы Semester в модели нет — пропущено)

-- 9. Вставка учебных планов
INSERT INTO "Curriculum" ("Id_discipline", "Id_teacher", "Year", "Number") VALUES
(1, 1, 2025, 1), -- Иванов ведет Математику в 1-м семестре 2025
(3, 2, 2025, 1); -- Петров ведет Физику в 1-м семестре 2025

-- 10. Вставка внеучебной деятельности
INSERT INTO "Additional activities" ("Name", "Description", "Id_type_activity") VALUES
('AI Conf', 'Конференция по ИИ', 1),  -- Id_additional_activities = 1
('Hackathon', 'Олимпиада программистов', 2); -- Id_additional_activities = 2

-- 11. Связь Преподаватель - Внеучебная деятельность
INSERT INTO "Teacher_Additional activities" ("Id_additional_activities", "Id_teacher") VALUES
(1, 1),  -- Иванов участвует
(2, 2);  -- Петров участвует
