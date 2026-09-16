/* ============================================================
   Datos: Ortografía en Colores (lenguaje — ortografía visual).
   La persona usuaria ve una oración completa y la escribe
   letra a letra. Al comparar su text con el correct, las
   letters que difieren se colorean para que pueda ver y
   corregir sus propios errores sin presión.
   Formato:
   DATA.es / DATA.en = [{ id, name, sentences: [ { picto,
     correct: 'ORACIÓN CORRECTA EN MAYÚSCULAS',
     hint?: 'pista opcional' } ] }]
   - correct está en MAYÚSCULAS y SIN ACENTOS ESCRITOS para que
     la coincidencia con la entrada de la persona sea carácter
     a carácter (los acentos no se muestran en mayúsculas
     siguiendo el criterio ortográfico español, pero se
     validan por App.tts al pulsar Escuchar). No se usan
     caracteres especiales como la 'ñ': la ñ castellana sí se
     mantiene tal cual (MAYÚSCULA: Ñ).
   - El text es corto (Lectura Fácil, §5 regla 1) y trabaja
     los errores de ortografía reales del idioma (ES: b/v,
     c/z/s, g/j, h muda, mayúsculas tras punto; EN: their/
     there/they're, silent letters, -ed/-ing, dobles).
   - Las frases se barajan cada ronda (App.utils.shuffle).
   'id' se mantiene igual en es/en para conservar el progreso
   al cambiar de idioma. app.js usa
   DATA[App.i18n.locale()] || DATA.es.
   ============================================================ */
var DATA = {
  es: [
    {
      id: 'level1',
      name: 'Nivel 1 · Mayúsculas y palabra',
      sentences: [
        { picto: '🧒', correct: 'EL NINO JUEGA EN EL PARQUE' },
        { picto: '🐶', correct: 'MI PERRO SE LLAMA LUNA' },
        { picto: '☀️', correct: 'HOY ES UN DIA MUY BONITO' },
        { picto: '🏠', correct: 'MI CASA ES GRANDE Y BLANCA' },
        { picto: '🐱', correct: 'EL GATO BEBE AGUA FRESCA' },
        { picto: '🍎', correct: 'YO COMO UNA MANZANA ROJA' }
      ]
    },
    {
      id: 'level2',
      name: 'Nivel 2 · Letras que se confunden',
      sentences: [
        { picto: '🌳', correct: 'EL ARBOL TIENE MUCHAS HOJAS' },
        { picto: '☕', correct: 'BEBE UNA TAZA DE CAFE CALIENTE' },
        { picto: '🚌', correct: 'EL AUTOBUS LLEGA A LAS OCHO' },
        { picto: '🦒', correct: 'LA JIRAFA ES MUY ALTA' },
        { picto: '🐘', correct: 'EL ELEFANTE GRIS CAMINA DESPACIO' },
        { picto: '🌙', correct: 'POR LA NOCHE CIELO ES OSCURO' }
      ]
    },
    {
      id: 'level3',
      name: 'Nivel 3 · H muda y reglas',
      sentences: [
        { picto: '🥚', correct: 'EL HUEVO ESTA EN LA NEVERA' },
        { picto: '🏨', correct: 'EL HOTEL ESTA CERCA DEL MAR' },
        { picto: '⏰', correct: 'YA ES HORA DE LEVANTARSE' },
        { picto: '🗼', correct: 'LA TORRE ES MUY ALTA Y ANCHA' },
        { picto: '🍞', correct: 'EL PAN ESTA RICO Y TIENE QUESO' },
        { picto: '📚', correct: 'EL LIBRO HABLA DE UNA HADA PEQUENA' }
      ]
    }
  ],
  en: [
    {
      id: 'level1',
      name: 'Level 1 · Capital letters and words',
      sentences: [
        { picto: '🧒', correct: 'THE KID PLAYS IN THE PARK' },
        { picto: '🐶', correct: 'MY DOG IS CALLED LUNA' },
        { picto: '☀️', correct: 'TODAY IS A VERY NICE DAY' },
        { picto: '🏠', correct: 'MY HOUSE IS BIG AND WHITE' },
        { picto: '🐱', correct: 'THE CAT DRINKS FRESH WATER' },
        { picto: '🍎', correct: 'I EAT A RED APPLE' }
      ]
    },
    {
      id: 'level2',
      name: 'Level 2 · Tricky letter pairs',
      sentences: [
        { picto: '🪁', correct: 'I FLY A KITE IN THE SKY' },
        { picto: '📞', correct: 'I CALL MY GRANDMA ON THE PHONE' },
        { picto: '🐘', correct: 'THE ELEPHANT EATS GREEN LEAVES' },
        { picto: '🏙️', correct: 'THE CITY IS FULL OF BRIGHT LIGHTS' },
        { picto: '🐍', correct: 'THE LONG SNAKE SLEEPS ALL DAY' },
        { picto: '🕯️', correct: 'WE LIGHT ONE CANDLE AT NIGHT' }
      ]
    },
    {
      id: 'level3',
      name: 'Level 3 · Silent letters and doubles',
      sentences: [
        { picto: '🔪', correct: 'I USE A KNIFE TO CUT THE BREAD' },
        { picto: '⏰', correct: 'ONE HOUR HAS SIXTY MINUTES' },
        { picto: '🐰', correct: 'THE WHITE RABBIT RUNS IN THE GARDEN' },
        { picto: '🪜', correct: 'I CLIMB THE LONG LADDER SLOWLY' },
        { picto: '🐝', correct: 'THE LITTLE BEE MAKES SWEET HONEY' },
        { picto: '☀️', correct: 'SUMMER IS WARM AND THE DAYS ARE LONG' }
      ]
    }
  ]
};
