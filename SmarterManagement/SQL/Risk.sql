USE [maffiox-pis-db]
GO

IF OBJECT_ID('SP_FindRisk') IS NOT NULL
	DROP PROCEDURE SP_FindRisk
GO
CREATE PROCEDURE SP_FindRisk
	@id		INT
AS BEGIN

	SELECT
		id				AS rkId,
		name			AS rkName,
		description		AS rkDescription,
		probability		AS rkProbability,
		impact			AS rkImpact,
		priority		AS rkPriority,
		idProject		AS rkProject
	FROM
		T_Risk
	WHERE
		idProject = @id

END
GO
PRINT 'SP_FindRisk'
GO

IF OBJECT_ID('SP_GetRisk') IS NOT NULL
	DROP PROCEDURE SP_GetRisk
GO
CREATE PROCEDURE SP_GetRisk
	@id		INT
AS BEGIN

	
	SELECT
		id				AS rkId,
		name			AS rkName,
		description		AS rkDescription,
		probability		AS rkProbability,
		impact			AS rkImpact,
		priority		AS rkPriority,
		idProject		AS rkProject
	FROM
		T_Risk
	WHERE
		id = @id

END
GO
PRINT 'SP_GetRisk'
GO

IF OBJECT_ID('SP_AddRisk') IS NOT NULL
	DROP PROCEDURE SP_AddRisk
GO
CREATE PROCEDURE SP_AddRisk
	@name				VARCHAR(50),
	@description		VARCHAR(300),
	@probability		DECIMAL(3, 2),
	@impact				INT,
	@priority			DECIMAL(3, 2),
	@project			INT
AS BEGIN

	INSERT INTO T_Risk (
		name,
		description,
		probability,
		impact,
		priority,
		idProject
	) VALUES (
		@name,
		@description,
		@probability,
		@impact,
		@priority,
		@project
	)
	SELECT SCOPE_IDENTITY() AS id
		
END
GO
PRINT 'SP_AddRisk'
GO

IF OBJECT_ID('SP_SetRisk') IS NOT NULL
	DROP PROCEDURE SP_SetRisk
GO
CREATE PROCEDURE SP_SetRisk
	@id					INT,
	@name				VARCHAR(50),
	@description		VARCHAR(300),
	@probability		DECIMAL(3, 2),
	@impact				INT,
	@priority			DECIMAL(3, 2)
AS BEGIN

	UPDATE T_Risk SET
		name = @name,
		description = @description,
		probability = @probability,
		impact = @impact,
		priority = @priority
	WHERE
		id = @id

END
GO
PRINT 'SP_SetRisk'
GO

IF OBJECT_ID('SP_DeleteRisk') IS NOT NULL
	DROP PROCEDURE SP_DeleteRisk
GO
CREATE PROCEDURE SP_DeleteRisk
	@id			INT
AS BEGIN

	DELETE FROM
		T_Risk
	WHERE
		id = @id

END
GO
PRINT 'SP_DeleteRisk'
GO

IF OBJECT_ID('SP_ExistRisk') IS NOT NULL
	DROP PROCEDURE SP_ExistRisk
GO
CREATE PROCEDURE SP_ExistRisk
	@name			VARCHAR(50),
	@id				INT
AS BEGIN

	SELECT
		COUNT(id) AS exist
	FROM
		T_Risk
	WHERE
		name = @name AND
		id <> @id

END
GO
PRINT 'SP_ExistRisk'
GO