CREATE OR REPLACE FUNCTION log_session_user()
  RETURNS TRIGGER 
  LANGUAGE PLPGSQL
  AS
$$
BEGIN
  SELECT COUNT(*) FROM "Sessions" WHERE userId = NEW."idUsuario" AND "FechaIngreso" = NOW();
  IF NEW.price <> OLD.price THEN
  INSERT INTO product_price_changes(product_id,old_price,new_price,changed_on)
  VALUES(OLD.id,OLD.price,NEW.price,now());
  END IF;

RETURN NEW;
END;
$$