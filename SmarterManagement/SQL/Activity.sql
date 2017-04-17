USE [maffiox-pis-db]
GO

IF OBJECT_ID('SP_FindActivity') IS NOT NULL
	DROP PROCEDURE SP_FindActivity
GO
CREATE PROCEDURE SP_FindActivity
	@idProject		INT
AS BEGIN

	SELECT
		ac.id						AS acId,
		ac.idProject				AS aIdProject,
		ac.code						AS acCode,
		ac.wbsCode					AS acWbsCode,
		ac.description				AS acDescription,
		ac.tbs						AS acTbc,
		isnull(rk.id, 0)			AS rkId,
		isnull(rk.idProject, 0)		AS rkProject,
		isnull(rk.name, '')			AS rkName,
		isnull(rk.description, '')	AS rkDescription,
		isnull(rk.probability, 0.0)	AS rkProbability,
		isnull(rk.impact, 0.0)		AS rkImpact,
		isnull(rk.priority, 0.0)	AS rkpriority
	FROM
		T_Activity	AS ac
	LEFT JOIN
		T_Risk		AS rk	ON ac.idRisk = rk.id
	WHERE
		ac.idproject = @idProject
	ORDER BY
		ac.wbsCode

END
GO
PRINT 'SP_FindActivity'
GO

IF OBJECT_ID('SP_GetActivity') IS NOT NULL
	DROP PROCEDURE SP_GetActivity
GO
CREATE PROCEDURE SP_GetActivity
	@id		INT
AS BEGIN

	SELECT
		ac.id						AS acId,
		ac.idProject				AS aIdProject,
		ac.code						AS acCode,
		ac.wbsCode					AS acWbsCode,
		ac.tbs						AS acTbc,
		ac.description				AS acDescription,
		isnull(rk.id, 0)			AS rkId,
		isnull(rk.idProject, 0)		AS rkProject,
		isnull(rk.name, '')			AS rkName,
		isnull(rk.description, '')	AS rkDescription,
		isnull(rk.probability, 0.0)	AS rkProbability,
		isnull(rk.impact, 0.0)		AS rkImpact,
		isnull(rk.priority, 0.0)	AS rkpriority
	FROM
		T_Activity	AS ac
	LEFT JOIN
		T_Risk		AS rk	ON ac.idRisk = rk.id
	WHERE
		ac.id = @id

END
GO
PRINT 'SP_GetActivity'
GO

IF OBJECT_ID('SP_AddActivity') IS NOT NULL
	DROP PROCEDURE SP_AddActivity
GO
CREATE PROCEDURE SP_AddActivity
	@idProject			INT,
	@idRisk				INT,
	@code				VARCHAR(5),
	@wbsCode			VARCHAR(5),
	@tbs				VARCHAR(10),
	@description		VARCHAR(300)
AS BEGIN

	INSERT INTO T_Activity (
		idProject,
		idRisk,
		code,
		wbsCode,
		tbs,
		description
	) VALUES (
		@idProject,
		@idRisk,
		@code,
		@wbsCode,
		@tbs,
		@description
	)
	SELECT SCOPE_IDENTITY() AS id
		
END
GO
PRINT 'SP_AddActivity'
GO

IF OBJECT_ID('SP_SetActivity') IS NOT NULL
	DROP PROCEDURE SP_SetActivity
GO
CREATE PROCEDURE SP_SetActivity
	@id					INT,
	@idProject			INT,
	@idRisk				INT,
	@code				VARCHAR(5),
	@wbsCode			VARCHAR(5),
	@tbs				VARCHAR(10),
	@description		VARCHAR(300)
AS BEGIN

	UPDATE T_Activity SET
		idProject = @idProject,
		idRisk = @idRisk,
		code = @code,
		wbsCode = @wbsCode,
		tbs = @tbs,
		description = @description
	WHERE
		id = @id

END
GO
PRINT 'SP_SetActivity'
GO

IF OBJECT_ID('SP_DeleteActivity') IS NOT NULL
	DROP PROCEDURE SP_DeleteActivity
GO
CREATE PROCEDURE SP_DeleteActivity
	@id			INT
AS BEGIN

	DELETE FROM
		T_Activity
	WHERE
		id = @id

END
GO
PRINT 'SP_DeleteActivity'
GO

IF OBJECT_ID('SP_ExistActivity') IS NOT NULL
	DROP PROCEDURE SP_ExistActivity
GO
CREATE PROCEDURE SP_ExistActivity
	@code			VARCHAR(5),
	@id				INT
AS BEGIN

	SELECT
		COUNT(id) AS exist
	FROM
		T_Activity
	WHERE
		code = @code AND
		id <> @id

END
GO
PRINT 'SP_ExistActivity'
GO
