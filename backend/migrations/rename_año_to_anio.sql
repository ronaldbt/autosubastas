-- Migración para renombrar la columna 'año' a 'anio' en la tabla 'autos'
-- Ejecutar este script en la base de datos PostgreSQL

-- Paso 1: Si la columna 'anio' ya existe (creada por Sequelize), copiar datos de 'año' a 'anio'
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'autos' AND column_name = 'anio'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'autos' AND column_name = 'año'
    ) THEN
        -- Copiar datos de 'año' a 'anio' donde anio es NULL
        UPDATE autos 
        SET anio = "año" 
        WHERE anio IS NULL AND "año" IS NOT NULL;
        
        -- Hacer que anio sea NOT NULL después de copiar los datos
        ALTER TABLE autos ALTER COLUMN anio SET NOT NULL;
        
        -- Eliminar la columna 'año'
        ALTER TABLE autos DROP COLUMN "año";
    ELSIF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'autos' AND column_name = 'año'
    ) THEN
        -- Si solo existe 'año', renombrarla directamente
        ALTER TABLE autos RENAME COLUMN "año" TO anio;
    END IF;
END $$;

-- Verificar que el cambio se aplicó correctamente
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'autos' AND column_name IN ('año', 'anio');

