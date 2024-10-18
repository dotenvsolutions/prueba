CREATE OR REPLACE FUNCTION log_session_user()
  RETURNS TRIGGER 
  LANGUAGE PLPGSQL
  AS
$$
BEGIN
  IF NOT EXISTS (
        SELECT 1
        FROM "Sessions"
        WHERE "userId" = NEW.idUsuario
    ) THEN
        -- Si no existe, crea una nueva sesión con la fecha actual
        INSERT INTO "Sessions" ("userId", "FechaInicio")
        VALUES (NEW.idUsuario, NOW());
    END IF;
    
    -- Retorna la fila que fue insertada/modificada en la tabla usuarios
    RETURN NEW;

RETURN NEW;
END;
$$

CREATE TRIGGER crear_sesion_trigger
AFTER INSERT ON "Usuarios"
FOR EACH ROW
EXECUTE FUNCTION crear_sesion_si_no_existe();