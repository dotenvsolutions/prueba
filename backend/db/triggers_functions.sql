--EJECUTAR AL INCIO ANTES DE CREAR A LOS USUARIOS
CREATE OR REPLACE FUNCTION create_roles_usuarios()
RETURNS VOID 
LANGUAGE plpgsql AS $$
BEGIN
	INSERT INTO "Rol" ("RolName") VALUES ('ADMINISTRADOR');
  INSERT INTO "Rol" ("RolName") VALUES ('EJECUTIVO');
  INSERT INTO "Rol" ("RolName") VALUES ('MANAGER');
  INSERT INTO "Rol" ("RolName") VALUES ('OPERADOR');
END;
$$;


DROP FUNCTION getAllUsers;
CREATE OR REPLACE FUNCTION getAllUsers()
RETURNS TABLE (
    idUsuario INT,
    Username VARCHAR,
    Mail VARCHAR,
    Status CHAR,
    idPersona INT,
    Nombres VARCHAR,
    Apellidos VARCHAR,
    Identificacion VARCHAR,
    FechaNacimiento TIMESTAMP,
    Movil VARCHAR,
    Fijo VARCHAR,
    direccion VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN 
	RETURN QUERY	
	SELECT u."idUsuario",u."Username",u."Mail",u."Status",p."idPersona",p."Nombres",p."Apellidos",
	p."Identificacion",
	p."FechaNacimiento",p."Movil",p."Fijo",p."direccion"
	FROM "Usuarios" as u 
	INNER JOIN "Persona" p ON u."idUsuario" = p."userId";
END;
$$;

