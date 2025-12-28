-- Migración para agregar nuevos campos a la tabla peritajes
-- Campos de información vehicular adicional, revisión técnica, gases, SOAP, etc.
-- Ejecutar este script en la base de datos PostgreSQL

DO $$
BEGIN
    -- Información del propietario
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'peritajes' AND column_name = 'propietario_rut'
    ) THEN
        ALTER TABLE peritajes ADD COLUMN propietario_rut VARCHAR(255);
        RAISE NOTICE 'Columna propietario_rut agregada exitosamente';
    ELSE
        RAISE NOTICE 'La columna propietario_rut ya existe';
    END IF;

    -- Información vehicular adicional
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'peritajes' AND column_name = 'anio'
    ) THEN
        ALTER TABLE peritajes ADD COLUMN anio INTEGER;
        RAISE NOTICE 'Columna anio agregada exitosamente';
    ELSE
        RAISE NOTICE 'La columna anio ya existe';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'peritajes' AND column_name = 'procedencia'
    ) THEN
        ALTER TABLE peritajes ADD COLUMN procedencia VARCHAR(255);
        RAISE NOTICE 'Columna procedencia agregada exitosamente';
    ELSE
        RAISE NOTICE 'La columna procedencia ya existe';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'peritajes' AND column_name = 'fabricante'
    ) THEN
        ALTER TABLE peritajes ADD COLUMN fabricante VARCHAR(255);
        RAISE NOTICE 'Columna fabricante agregada exitosamente';
    ELSE
        RAISE NOTICE 'La columna fabricante ya existe';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'peritajes' AND column_name = 'tipo_sello'
    ) THEN
        ALTER TABLE peritajes ADD COLUMN tipo_sello VARCHAR(255);
        RAISE NOTICE 'Columna tipo_sello agregada exitosamente';
    ELSE
        RAISE NOTICE 'La columna tipo_sello ya existe';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'peritajes' AND column_name = 'combustible'
    ) THEN
        ALTER TABLE peritajes ADD COLUMN combustible VARCHAR(255);
        RAISE NOTICE 'Columna combustible agregada exitosamente';
    ELSE
        RAISE NOTICE 'La columna combustible ya existe';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'peritajes' AND column_name = 'kilometraje'
    ) THEN
        ALTER TABLE peritajes ADD COLUMN kilometraje INTEGER;
        RAISE NOTICE 'Columna kilometraje agregada exitosamente';
    ELSE
        RAISE NOTICE 'La columna kilometraje ya existe';
    END IF;

    -- Información de Revisión Técnica
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'peritajes' AND column_name = 'revision_tecnica_comuna'
    ) THEN
        ALTER TABLE peritajes ADD COLUMN revision_tecnica_comuna VARCHAR(255);
        RAISE NOTICE 'Columna revision_tecnica_comuna agregada exitosamente';
    ELSE
        RAISE NOTICE 'La columna revision_tecnica_comuna ya existe';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'peritajes' AND column_name = 'revision_tecnica_mes'
    ) THEN
        ALTER TABLE peritajes ADD COLUMN revision_tecnica_mes VARCHAR(255);
        RAISE NOTICE 'Columna revision_tecnica_mes agregada exitosamente';
    ELSE
        RAISE NOTICE 'La columna revision_tecnica_mes ya existe';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'peritajes' AND column_name = 'revision_tecnica_ultimo_control'
    ) THEN
        ALTER TABLE peritajes ADD COLUMN revision_tecnica_ultimo_control DATE;
        RAISE NOTICE 'Columna revision_tecnica_ultimo_control agregada exitosamente';
    ELSE
        RAISE NOTICE 'La columna revision_tecnica_ultimo_control ya existe';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'peritajes' AND column_name = 'revision_tecnica_estado'
    ) THEN
        ALTER TABLE peritajes ADD COLUMN revision_tecnica_estado VARCHAR(50);
        RAISE NOTICE 'Columna revision_tecnica_estado agregada exitosamente';
    ELSE
        RAISE NOTICE 'La columna revision_tecnica_estado ya existe';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'peritajes' AND column_name = 'revision_tecnica_fecha_vencimiento'
    ) THEN
        ALTER TABLE peritajes ADD COLUMN revision_tecnica_fecha_vencimiento DATE;
        RAISE NOTICE 'Columna revision_tecnica_fecha_vencimiento agregada exitosamente';
    ELSE
        RAISE NOTICE 'La columna revision_tecnica_fecha_vencimiento ya existe';
    END IF;

    -- Información de Gases
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'peritajes' AND column_name = 'gases_comuna'
    ) THEN
        ALTER TABLE peritajes ADD COLUMN gases_comuna VARCHAR(255);
        RAISE NOTICE 'Columna gases_comuna agregada exitosamente';
    ELSE
        RAISE NOTICE 'La columna gases_comuna ya existe';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'peritajes' AND column_name = 'gases_mes'
    ) THEN
        ALTER TABLE peritajes ADD COLUMN gases_mes VARCHAR(255);
        RAISE NOTICE 'Columna gases_mes agregada exitosamente';
    ELSE
        RAISE NOTICE 'La columna gases_mes ya existe';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'peritajes' AND column_name = 'gases_ultimo_control'
    ) THEN
        ALTER TABLE peritajes ADD COLUMN gases_ultimo_control DATE;
        RAISE NOTICE 'Columna gases_ultimo_control agregada exitosamente';
    ELSE
        RAISE NOTICE 'La columna gases_ultimo_control ya existe';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'peritajes' AND column_name = 'gases_estado'
    ) THEN
        ALTER TABLE peritajes ADD COLUMN gases_estado VARCHAR(50);
        RAISE NOTICE 'Columna gases_estado agregada exitosamente';
    ELSE
        RAISE NOTICE 'La columna gases_estado ya existe';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'peritajes' AND column_name = 'gases_fecha_vencimiento'
    ) THEN
        ALTER TABLE peritajes ADD COLUMN gases_fecha_vencimiento DATE;
        RAISE NOTICE 'Columna gases_fecha_vencimiento agregada exitosamente';
    ELSE
        RAISE NOTICE 'La columna gases_fecha_vencimiento ya existe';
    END IF;

    -- Permiso de Circulación
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'peritajes' AND column_name = 'permiso_circulacion_info'
    ) THEN
        ALTER TABLE peritajes ADD COLUMN permiso_circulacion_info TEXT;
        RAISE NOTICE 'Columna permiso_circulacion_info agregada exitosamente';
    ELSE
        RAISE NOTICE 'La columna permiso_circulacion_info ya existe';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'peritajes' AND column_name = 'permiso_circulacion_fecha_vencimiento'
    ) THEN
        ALTER TABLE peritajes ADD COLUMN permiso_circulacion_fecha_vencimiento DATE;
        RAISE NOTICE 'Columna permiso_circulacion_fecha_vencimiento agregada exitosamente';
    ELSE
        RAISE NOTICE 'La columna permiso_circulacion_fecha_vencimiento ya existe';
    END IF;

    -- SOAP (Seguro Obligatorio)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'peritajes' AND column_name = 'soap_estado'
    ) THEN
        ALTER TABLE peritajes ADD COLUMN soap_estado VARCHAR(50);
        RAISE NOTICE 'Columna soap_estado agregada exitosamente';
    ELSE
        RAISE NOTICE 'La columna soap_estado ya existe';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'peritajes' AND column_name = 'soap_compania'
    ) THEN
        ALTER TABLE peritajes ADD COLUMN soap_compania VARCHAR(255);
        RAISE NOTICE 'Columna soap_compania agregada exitosamente';
    ELSE
        RAISE NOTICE 'La columna soap_compania ya existe';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'peritajes' AND column_name = 'soap_fecha_inicio'
    ) THEN
        ALTER TABLE peritajes ADD COLUMN soap_fecha_inicio DATE;
        RAISE NOTICE 'Columna soap_fecha_inicio agregada exitosamente';
    ELSE
        RAISE NOTICE 'La columna soap_fecha_inicio ya existe';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'peritajes' AND column_name = 'soap_fecha_vencimiento'
    ) THEN
        ALTER TABLE peritajes ADD COLUMN soap_fecha_vencimiento DATE;
        RAISE NOTICE 'Columna soap_fecha_vencimiento agregada exitosamente';
    ELSE
        RAISE NOTICE 'La columna soap_fecha_vencimiento ya existe';
    END IF;

    -- Información de Transporte Público
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'peritajes' AND column_name = 'transporte_publico'
    ) THEN
        ALTER TABLE peritajes ADD COLUMN transporte_publico VARCHAR(10);
        RAISE NOTICE 'Columna transporte_publico agregada exitosamente';
    ELSE
        RAISE NOTICE 'La columna transporte_publico ya existe';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'peritajes' AND column_name = 'tipo_transporte_publico'
    ) THEN
        ALTER TABLE peritajes ADD COLUMN tipo_transporte_publico VARCHAR(255);
        RAISE NOTICE 'Columna tipo_transporte_publico agregada exitosamente';
    ELSE
        RAISE NOTICE 'La columna tipo_transporte_publico ya existe';
    END IF;

    -- Restricción Vehicular
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'peritajes' AND column_name = 'restriccion_vehicular_condicion'
    ) THEN
        ALTER TABLE peritajes ADD COLUMN restriccion_vehicular_condicion VARCHAR(10);
        RAISE NOTICE 'Columna restriccion_vehicular_condicion agregada exitosamente';
    ELSE
        RAISE NOTICE 'La columna restriccion_vehicular_condicion ya existe';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'peritajes' AND column_name = 'restriccion_vehicular_comunas_puente_alto_san_bernardo'
    ) THEN
        ALTER TABLE peritajes ADD COLUMN restriccion_vehicular_comunas_puente_alto_san_bernardo VARCHAR(255);
        RAISE NOTICE 'Columna restriccion_vehicular_comunas_puente_alto_san_bernardo agregada exitosamente';
    ELSE
        RAISE NOTICE 'La columna restriccion_vehicular_comunas_puente_alto_san_bernardo ya existe';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'peritajes' AND column_name = 'restriccion_vehicular_provincia_santiago'
    ) THEN
        ALTER TABLE peritajes ADD COLUMN restriccion_vehicular_provincia_santiago VARCHAR(255);
        RAISE NOTICE 'Columna restriccion_vehicular_provincia_santiago agregada exitosamente';
    ELSE
        RAISE NOTICE 'La columna restriccion_vehicular_provincia_santiago ya existe';
    END IF;

    -- Reportes y Multas
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'peritajes' AND column_name = 'reporte_robo'
    ) THEN
        ALTER TABLE peritajes ADD COLUMN reporte_robo TEXT;
        RAISE NOTICE 'Columna reporte_robo agregada exitosamente';
    ELSE
        RAISE NOTICE 'La columna reporte_robo ya existe';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'peritajes' AND column_name = 'reporte_remate'
    ) THEN
        ALTER TABLE peritajes ADD COLUMN reporte_remate TEXT;
        RAISE NOTICE 'Columna reporte_remate agregada exitosamente';
    ELSE
        RAISE NOTICE 'La columna reporte_remate ya existe';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'peritajes' AND column_name = 'multas'
    ) THEN
        ALTER TABLE peritajes ADD COLUMN multas TEXT;
        RAISE NOTICE 'Columna multas agregada exitosamente';
    ELSE
        RAISE NOTICE 'La columna multas ya existe';
    END IF;

END $$;

-- Verificar que las columnas se agregaron correctamente
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns 
-- WHERE table_name = 'peritajes' 
-- AND column_name IN (
--     'propietario_rut', 'anio', 'procedencia', 'fabricante', 'tipo_sello', 'combustible', 'kilometraje',
--     'revision_tecnica_comuna', 'revision_tecnica_mes', 'revision_tecnica_ultimo_control', 
--     'revision_tecnica_estado', 'revision_tecnica_fecha_vencimiento',
--     'gases_comuna', 'gases_mes', 'gases_ultimo_control', 'gases_estado', 'gases_fecha_vencimiento',
--     'permiso_circulacion_info', 'permiso_circulacion_fecha_vencimiento',
--     'soap_estado', 'soap_compania', 'soap_fecha_inicio', 'soap_fecha_vencimiento',
--     'transporte_publico', 'tipo_transporte_publico',
--     'restriccion_vehicular_condicion', 'restriccion_vehicular_comunas_puente_alto_san_bernardo',
--     'restriccion_vehicular_provincia_santiago',
--     'reporte_robo', 'reporte_remate', 'multas'
-- );

