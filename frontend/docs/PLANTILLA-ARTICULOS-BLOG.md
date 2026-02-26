# Plantilla para nuevos artículos del blog - AutoRemates

Copia esta estructura al crear un nuevo archivo en `content/blog/nombre-del-articulo.md`.

## Frontmatter obligatorio

```yaml
---
title: Título del artículo - Incluye keyword principal (H1)
description: Descripción 150-160 caracteres con palabras clave para SEO
date: 2026-02-01
image: https://images.unsplash.com/photo-xxxxx?q=80&w=800
author: AutoRemates Chile
---
```

## Estructura del contenido

- **NO incluyas # H1** en el markdown: el H1 se genera automáticamente desde el `title` del frontmatter
- **H2** (##) para cada sección principal
- **H3** (###) para subsecciones cuando haga falta
- Párrafos cortos, listas con viñetas
- Usa **negrita** en términos clave
- Incluye CTA al final (Inscríbete en AutoRemates, etc.)

## Ejemplo de estructura SEO

```markdown
Introducción de 2-3 oraciones (sin H1, se usa el title del frontmatter).

## Primera sección (H2 - visible y destacada)

Contenido con párrafos y listas:
- Punto 1
- Punto 2

## Segunda sección (H2)

### Subsección (H3 - opcional)

Más contenido...

## Conclusión (H2)

Cierra con llamado a la acción.
```
