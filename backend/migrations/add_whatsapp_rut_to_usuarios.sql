-- Migración para agregar campos whatsapp y rut a la tabla usuarios
-- Ejecutar este script en la base de datos PostgreSQL

DO $$
BEGIN
    -- Agregar columna whatsapp si no existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'usuarios' AND column_name = 'whatsapp'
    ) THEN
        ALTER TABLE usuarios ADD COLUMN whatsapp VARCHAR(255);
        RAISE NOTICE 'Columna whatsapp agregada exitosamente';
    ELSE
        RAISE NOTICE 'La columna whatsapp ya existe';
    END IF;

    -- Agregar columna rut si no existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'usuarios' AND column_name = 'rut'
    ) THEN
        ALTER TABLE usuarios ADD COLUMN rut VARCHAR(255);
        RAISE NOTICE 'Columna rut agregada exitosamente';
    ELSE
        RAISE NOTICE 'La columna rut ya existe';
    END IF;
END $$;

-- Verificar que las columnas se agregaron correctamente
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns 
-- WHERE table_name = 'usuarios' AND column_name IN ('whatsapp', 'rut');

