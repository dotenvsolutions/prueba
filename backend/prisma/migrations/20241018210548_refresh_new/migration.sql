-- DropForeignKey
ALTER TABLE "Persona" DROP CONSTRAINT "Persona_userId_fkey";

-- DropForeignKey
ALTER TABLE "Rol_usuarios" DROP CONSTRAINT "Rol_usuarios_userId_fkey";

-- DropForeignKey
ALTER TABLE "Sessions" DROP CONSTRAINT "Sessions_userId_fkey";

-- AlterTable
ALTER TABLE "Usuarios" ALTER COLUMN "Password" SET DATA TYPE VARCHAR(150);

-- AddForeignKey
ALTER TABLE "Rol_usuarios" ADD CONSTRAINT "Rol_usuarios_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Usuarios"("idUsuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Persona" ADD CONSTRAINT "Persona_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Usuarios"("idUsuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sessions" ADD CONSTRAINT "Sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Usuarios"("idUsuario") ON DELETE CASCADE ON UPDATE CASCADE;
