# Backend

Segun las especificaciones de la prueba se debe ejecutar lo siguiente antes de iniciar:
crear el archivo .env y copiar el contenido del archivo env.demo
`npm i ` para instalar todas las librerias usadas
`npx prisma migrate dev --init` para que se creen las migraciones
`npm run dev` para iniciar el proyecto
el cual arranca con la siguiente ruta `http://localhost:5080/api/auth` 

## Migraciones

Una vez creadas las migraciones en una consola de query tool se puede ejecutar 
`--EJECUTAR AL INCIO ANTES DE CREAR A LOS USUARIOS
CREATE OR REPLACE FUNCTION create_roles_usuarios()
RETURNS VOID 
LANGUAGE plpgsql AS $$
BEGIN
	INSERT INTO "Rol" ("RolName") VALUES ('ADMINISTRADOR');
  INSERT INTO "Rol" ("RolName") VALUES ('EJECUTIVO');
  INSERT INTO "Rol" ("RolName") VALUES ('MANAGER');
  INSERT INTO "Rol" ("RolName") VALUES ('OPERADOR');
END;
$$;SELECT create_roles_usuarios();`
Esto generara los roles por defecto para su posterior uso tener presente que existe una funcion getAllUsers() que retorna todos los datos de los usuarios y su persona 
