# Banco de palabras — Diccionario

Base de datos de contenido con palabras complejas en español (`es.json`) e
inglés (`en.json`), cada una con un significado en Lectura Fácil y un ejemplo
de vida real. Pensado como fuente para actividades que enseñan el
significado de palabras difíciles (como `tools/dictionary`).

## Estado

Este banco es **contenido independiente, no conectado a ningún `app.js`
todavía**. La actividad `tools/dictionary` ya funciona hoy con su propio
`data.js` (120 palabras: 15 niveles × 8). Este archivo es una base mucho
más amplia (**440 palabras en español**, **450 en inglés**, **39
categorías** comunes a ambos bancos, con vocabulario adulto general y
vocabulario específico del mundo de la discapacidad intelectual) para
ampliar esa actividad u otras futuras, respetando la arquitectura de §2.3
de `tecnico.md` (cada actividad es autónoma y no importa de otras
carpetas): si se usa en una actividad, hay que copiar el subconjunto
elegido dentro de su propio `tools/<slug>/data.js`, no referenciar este
archivo desde `tools/`.

### Distribución por tier (a fecha de este README)

| Idioma | Tier 1 | Tier 2 | Tier 3 | Tier 4 | Total |
|---|---:|---:|---:|---:|---:|
| es | 35 | 143 | 187 | 75 | **440** |
| en | 35 | 145 | 195 | 75 | **450** |

Tier 1 = palabras más cotidianas, Tier 4 = vocabulario abstracto o
institucional. La actividad `tools/dictionary` trabaja siempre con Tier 3 y
4 en sus niveles 1–3 actuales; al subir a Tier 1 y 2 cubre vocabulario
funcional cotidiano.

## Origen del contenido

Las palabras se seleccionaron a partir de tres familias de fuentes:

1. **Vocabulario general adulto (C1/C2)**
   - Español: recursos DELE y ELE (ProfedeELE, Hablamos en Español) y
     familias léxicas del Diccionario de la lengua española (RAE).
   - Inglés: listas CEFR C1/C2 (esl-lounge, Espresso English, Cambridge
     word lists) y familias léxicas del Oxford English Dictionary y
     Cambridge Dictionary.

2. **Vocabulario vinculado a la discapacidad intelectual (Easy Read / Lectura Fácil)**
   - **Español**: Plena Inclusión España (estándar Lectura Fácil), ARASAAC
     (Portal Aragonés de Comunicación Aumentativa), FEAPS/Plena Inclusión,
     Down España, federaciones autonómicas (Asprona, FADEMGLA, etc.),
     Inclusion Europe (edición española de *Information for All*), y el
     Servicio de Información sobre Discapacidad (SID / INICO, Universidad
     de Salamanca) y el Ministerio de Derechos Sociales.
   - **Inglés**: Inclusion Europe (*Information for All*), Beyond Words /
     Books Beyond Words, CHANGE / Photosymbols, Makaton, Widgit / Widgit
     Health, People First (UK), Learning Disability England, Values into
     Action, SARTAC, Green Mountain Self-Advocates, CEC y TASH
     (currículo de autodeterminación), Special Olympics Healthy Athletes,
     AAIDD (guía terminológica), NHS England y gov.uk Easy-Read, CDC
     Easy-Read, y el corpus Easy-Read de la NDIS australiana.

3. **Definiciones y ejemplos**: **redacción propia en Lectura Fácil** para
   Routime, no copias de esas fuentes ni traducción literal entre
   idiomas (cada idioma tiene su propio vocabulario y dificultad — ver
   `doc/es/I18N.md` §3 / `doc/en/I18N.md` §3). Los términos
   jurídicamente cambiantes (p. ej. LPS/DOLS en Inglaterra, *tutela* /
   *curatela* en España) se evitan o se eligen en su forma estable.

## Categorías

Las 39 categorías se organizan en cuatro bloques temáticos. El bloque A
vocabulario general adulto (niveles altos CEFR C1/C2); los bloques B–D
responden a los campos donde las personas con discapacidad intelectual
suelen necesitar más apoyo: vida autónoma, salud, contexto social y mundo
digital. El banco `content/dictionary/` no se importa desde `tools/`;
cada actividad que lo use copia a su propio `data.js` los grupos que
quiera enseñar (ver "Siguiente paso").

### Bloque A — Vocabulario general adulto (CEFR C1/C2)

| # | ES | EN | Tier |
|---|---|---|---|
| 1 | día a día | everyday life | 1 |
| 2 | personalidad y emociones | personality and feelings | 2 |
| 3 | trabajo y sociedad | work and society | 3 |
| 4 | ciencia, ideas y mundo | science, ideas and the world | 4 |
| 5 | el cuerpo y la salud | body and health | 1 |
| 6 | el dinero y las compras | money and shopping | 2 |
| 7 | el tiempo y el calendario | time and calendar | 2 |
| 8 | los viajes y los lugares | travel and places | 2 |
| 9 | la tecnología y la comunicación | technology and communication | 3 |
| 10 | los derechos y la convivencia | rights and living together | 3 |
| 11 | pensar y aprender | thinking and learning | 4 |
| 12 | acciones del día a día (avanzado) | everyday actions (advanced) | 4 |

### Bloque B — Vida adulta autónoma y trámites cotidianos

| # | ES | EN | Tier |
|---|---|---|---|
| 13 | discapacidad y apoyos | disability and support | 2 |
| 14 | derechos y autodefensa | rights and self-advocacy | 3 |
| 15 | salud, citas y consentimiento | health, appointments and consent | 3 |
| 16 | servicios sociales y ayudas | social services and benefits | 3 |
| 17 | seguridad y emergencias | safety and emergencies | 2 |
| 18 | dinero y fraudes | money and scams | 3 |
| 19 | trabajo con apoyo | supported employment | 4 |
| 20 | emociones avanzadas y relaciones | advanced feelings and relationships | 4 |
| 21 | contratos y firmas | contracts and signing | 3 |
| 22 | herencias y testamentos | inheritance and wills | 4 |
| 23 | facturas y recibos del hogar | household bills and receipts | 2 |
| 24 | formas de pago y cuentas | ways to pay and accounts | 3 |
| 25 | ingresos y gastos del hogar | household income and expenses | 3 |
| 26 | vida independiente y hogar | independent living and home | 2 |
| 27 | transporte y ciudad | transport and city | 2 |
| 28 | alimentación y cocina | food and cooking | 2 |

### Bloque C — Salud ampliada y bienestar

| # | ES | EN | Tier |
|---|---|---|---|
| 29 | salud (especialidades y pruebas) | health (specialists and tests) | 3 |
| 30 | salud (pruebas y seguimientos) | health (tests and follow-ups) | 3 |
| 31 | farmacia y medicación | pharmacy and medication | 2 |
| 32 | salud mental y bienestar | mental health and wellbeing | 3 |

### Bloque D — Mundo digital, social y cultural

| # | ES | EN | Tier |
|---|---|---|---|
| 33 | educación y formación | education and training | 3 |
| 34 | clima y naturaleza | weather and nature | 2 |
| 35 | geografía y mundo | geography and the world | 3 |
| 36 | cultura, ocio y deporte | culture, leisure and sport | 3 |
| 37 | comunicación y gestos | communication and gestures | 2 |
| 38 | comunidad y tradiciones | community and traditions | 3 |
| 39 | derechos digitales y verificación | digital rights and verification | 3 |

### Cómo se usan los bloques

- **Bloque A**: vocabulario adulto general; base del nivel C1/C2 y del
  banco original.
- **Bloque B**: vida autónoma (apoyos, contratos, facturas, pagos,
  trámites y entorno cotidiano). Esta es la zona que más crece cuando se
  priorizan contextos de vida independiente.
- **Bloque C**: salud, especialidades, farmacia y salud mental. Pensado
  para itinerarios donde el objetivo terapéutico es el cuidado de la
  salud y la autonomía sanitaria.
- **Bloque D**: alfabetización digital, cultura, geografía y relaciones
  sociales. Pensado para itinerarios donde el objetivo es la participación
  comunitaria y la protección frente a riesgos digitales.

## Formato

```json
{
  "meta": { ... },
  "words": [
    { "word": "asequible", "definition": "...", "example": "...", "category": "...", "tier": 1 }
  ]
}
```

- `word`: la palabra.
- `definition`: significado en Lectura Fácil (frase corta, una idea).
- `example`: frase de ejemplo con un contexto real de vida adulta.
- `category`: tema (una de las 12 categorías listadas arriba).
- `tier`: nivel de dificultad orientativo, 1 (más fácil) a 4 (más difícil).

## Siguiente paso si se quiere usar

Para ampliar la actividad `tools/dictionary`, seguir la receta de §9 de
`tecnico.md`: copiar los grupos de 8 palabras elegidos al `DATA.es` / `DATA.en`
de `tools/dictionary/data.js` (añadiendo niveles `level4`, `level5`...),
manteniendo el mismo `id` en ambos idiomas, y verificar con
`node scripts/check.js`.
