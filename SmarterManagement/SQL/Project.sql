USE [maffiox-pis-db]
GO

IF OBJECT_ID('SP_FindProject') IS NOT NULL
	DROP PROCEDURE SP_FindProject
GO
CREATE PROCEDURE SP_FindProject
	@name		VARCHAR(50)
AS BEGIN

	SELECT
		id,
		name,
		startDate
	FROM
		T_Project
	WHERE
		name like '%' + @name + '%'

END
GO
PRINT 'SP_FindProject'
GO

IF OBJECT_ID('SP_GetProject') IS NOT NULL
	DROP PROCEDURE SP_GetProject
GO
CREATE PROCEDURE SP_GetProject
	@id		INT
AS BEGIN

	SELECT
		id,
		name,
		startDate
	FROM
		T_Project
	WHERE
		id = @id

END
GO
PRINT 'SP_GetProject'
GO

IF OBJECT_ID('SP_AddProject') IS NOT NULL
	DROP PROCEDURE SP_AddProject
GO
CREATE PROCEDURE SP_AddProject
	@name		VARCHAR(50),
	@startDate	DATE
AS BEGIN

	INSERT INTO T_Project (
		name,
		startDate
	) VALUES (
		@name,
		@startDate
	)
	SELECT SCOPE_IDENTITY() AS id
		
END
GO
PRINT 'SP_AddProject'
GO

IF OBJECT_ID('SP_SetProject') IS NOT NULL
	DROP PROCEDURE SP_SetProject
GO
CREATE PROCEDURE SP_SetProject
	@id			INT,
	@name		VARCHAR(50),
	@startDate	DATE
AS BEGIN

	UPDATE T_Project SET
		name = @name,
		startDate = @startDate
	WHERE
		id = @id

END
GO
PRINT 'SP_SetProject'
GO

IF OBJECT_ID('SP_DeleteProject') IS NOT NULL
	DROP PROCEDURE SP_DeleteProject
GO
CREATE PROCEDURE SP_DeleteProject
	@id			INT
AS BEGIN

	DELETE FROM
		T_Project
	WHERE
		id = @id

END
GO
PRINT 'SP_DeleteProject'
GO

IF OBJECT_ID('SP_ExistProject') IS NOT NULL
	DROP PROCEDURE SP_ExistProject
GO
CREATE PROCEDURE SP_ExistProject
	@name			VARCHAR(50),
	@id				INT
AS BEGIN

	SELECT
		COUNT(id) AS exist
	FROM
		T_Project
	WHERE
		name = @name AND
		id <> @id

END
GO
PRINT 'SP_ExistProject'
GO