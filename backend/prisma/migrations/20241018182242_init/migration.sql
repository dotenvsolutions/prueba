-- CreateTable
CREATE TABLE "Usuarios" (
    "idUsuario" SERIAL NOT NULL,
    "Username" VARCHAR(50) NOT NULL,
    "Password" VARCHAR(50) NOT NULL,
    "Mail" VARCHAR(120) NOT NULL,
    "SessionActive" CHAR(2) NULL,
    "Status" CHAR(2) NULL,

    CONSTRAINT "Usuarios_pkey" PRIMARY KEY ("idUsuario")
);

-- CreateTable
CREATE TABLE "Rol" (
    "idRol" SERIAL NOT NULL,
    "RolName" VARCHAR(50) NOT NULL,

    CONSTRAINT "Rol_pkey" PRIMARY KEY ("idRol")
);

-- CreateTable
CREATE TABLE "Rol_usuarios" (
    "userId" INTEGER NOT NULL,
    "rolId" INTEGER NOT NULL,

    CONSTRAINT "Rol_usuarios_pkey" PRIMARY KEY ("userId","rolId")
);

-- CreateTable
CREATE TABLE "Persona" (
    "idPersona" SERIAL NOT NULL,
    "Nombres" VARCHAR(80) NOT NULL,
    "Apellidos" VARCHAR(80),
    "Identificacion" VARCHAR(10) NOT NULL,
    "FechaNacimiento" TIMESTAMP(3),
    "Movil" VARCHAR(25),
    "Fijo" VARCHAR(25),
    "direccion" VARCHAR(200),
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Persona_pkey" PRIMARY KEY ("idPersona")
);

-- CreateTable
CREATE TABLE "Sessions" (
    "idSesion" SERIAL NOT NULL,
    "FechaIngreso" TIMESTAMP(3),
    "FechaCierre" TIMESTAMP(3),
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Sessions_pkey" PRIMARY KEY ("idSesion")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_Mail_key" ON "Usuarios"("Mail");

-- CreateIndex
CREATE UNIQUE INDEX "Persona_userId_key" ON "Persona"("userId");

-- AddForeignKey
ALTER TABLE "Rol_usuarios" ADD CONSTRAINT "Rol_usuarios_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Usuarios"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rol_usuarios" ADD CONSTRAINT "Rol_usuarios_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "Rol"("idRol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Persona" ADD CONSTRAINT "Persona_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Usuarios"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sessions" ADD CONSTRAINT "Sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Usuarios"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;
