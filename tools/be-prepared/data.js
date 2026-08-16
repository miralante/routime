/* ============================================================
   Datos: Antes de la Emergencia (autonomía — preparación en casa
   con la familia).
   Formato: DATA.es / DATA.en, cada uno con:
   { porRonda,
     saber: [{ picto, pregunta, opciones: string[3], correcta }],
     checklist: [{ id, picto, nombre, hecho }] }
   'saber' es un quiz de 8 rondas (sin niveles): cada pregunta
   es una cosa que se puede tener en casa ANTES de que pase algo
   (número 112 guardado, dirección escrita, detector de humo,
   pastillas fuera del alcance, llaves de luz/gas, etc.). La
   opción correcta es SIEMPRE la que se enseña en prevención;
   las otras son opciones muy comunes pero que no ayudan (o que
   son inseguras: por ejemplo, dejar las pastillas en una mesa
   baja).
   'checklist' es un mini-checklist tipo task-list: 8 cosas que
   marcar si ya están listas en casa. No hay aciertos/fallos:
   la actividad es de revisión familiar, no de examen. Al final
   se listan las marcadas y las que faltan, para hacerlo en casa
   con la familia.
   app.js usa DATA[App.i18n.locale()] || DATA.es.
   ============================================================ */
var DATA = {
  es: {
    porRonda: 8,
    saber: [
      { picto: '📞', pregunta: '¿Dónde tiene que estar escrito el número 112?', opciones: ['En un sitio visible junto al teléfono de casa y guardado en el móvil', 'Solo en la cabeza, no hace falta escribirlo', 'En un papel guardado en un cajón'], correcta: 0 },
      { picto: '🏠', pregunta: '¿Dónde tiene que estar tu dirección escrita?', opciones: ['En un papel visible junto al 112 y sabiéndola de memoria', 'Solo en la cabeza, no hace falta', 'En la agenda del trabajo de tu madre'], correcta: 0 },
      { picto: '🚪', pregunta: '¿Cómo se cierra la puerta de casa por dentro para que se pueda salir en una emergencia?', opciones: ['Con llave por dentro o sin llave, pero que se abra fácil desde dentro', 'Con llave echada y sin dejar la llave en la cerradura', 'Solo con el pestillo'], correcta: 0 },
      { picto: '🧯', pregunta: '¿Dónde tiene que estar el detector de humo?', opciones: ['En el techo de la cocina y del pasillo, con pilas que funcionen', 'En el suelo del salón', 'No hace falta tener detector'], correcta: 0 },
      { picto: '💊', pregunta: '¿Dónde deben estar las pastillas y los productos de limpieza?', opciones: ['En un armario alto o con cierre, fuera del alcance de niños pequeños', 'En una mesa baja para tenerlas a mano', 'En el suelo del baño'], correcta: 0 },
      { picto: '⚡', pregunta: '¿Sabes dónde está la llave de la luz de casa?', opciones: ['Sí, y sé dónde se apaga todo el interruptor general', 'No, pero la busca mi madre cuando hace falta', 'No hace falta saberlo'], correcta: 0 },
      { picto: '🔥', pregunta: '¿Sabes dónde se cierra la llave del gas?', opciones: ['Sí, y la he practicado con una persona de confianza', 'No, no sé dónde está', 'No hace falta, el gas se cierra solo'], correcta: 0 },
      { picto: '🌩️', pregunta: 'Si hay una tormenta muy fuerte, ¿qué haces con los aparatos enchufados?', opciones: ['Desenchufar lo importante y no tocar cables', 'Seguir usándolos normalmente', 'Abrir ventanas para que entre aire'], correcta: 0 }
    ],
    checklist: [
      { id: 't112', picto: '📞', nombre: 'Tengo el 112 guardado en el móvil y escrito junto al teléfono de casa', hecho: false },
      { id: 'dir', picto: '🏠', nombre: 'Sé mi dirección completa y la tengo escrita en un papel visible', hecho: false },
      { id: 'lla', picto: '🚪', nombre: 'La puerta de casa se puede abrir desde dentro sin llave cuando está cerrada', hecho: false },
      { id: 'det', picto: '🧯', nombre: 'Hay detector de humo con pilas que funcionan en la cocina o el pasillo', hecho: false },
      { id: 'pas', picto: '💊', nombre: 'Las pastillas y productos de limpieza están fuera del alcance de niños pequeños', hecho: false },
      { id: 'luz', picto: '⚡', nombre: 'Sé dónde está el interruptor general de la luz', hecho: false },
      { id: 'gas', picto: '🔥', nombre: 'Sé dónde se cierra la llave del gas (y lo he practicado con una persona de confianza)', hecho: false },
      { id: 'punto', picto: '🤝', nombre: 'Tengo con mi familia un punto de encuentro fuera de casa por si tenemos que salir', hecho: false }
    ]
  },
  en: {
    porRonda: 8,
    saber: [
      { picto: '📞', pregunta: 'Where should the number 112 be written down?', opciones: ['In a visible place next to the home phone and saved in the mobile', 'Only in your head, no need to write it down', 'On a piece of paper kept in a drawer'], correcta: 0 },
      { picto: '🏠', pregunta: 'Where should your home address be written down?', opciones: ['On a visible paper next to 112 and also known by heart', 'Only in your head, no need for that', 'In your mother\'s work diary'], correcta: 0 },
      { picto: '🚪', pregunta: 'How should the front door be locked from inside so you can get out in an emergency?', opciones: ['With a key from inside or without a key, but easy to open from inside', 'Locked with the key and without leaving the key in the lock', 'With the latch only'], correcta: 0 },
      { picto: '🧯', pregunta: 'Where should a smoke detector be placed?', opciones: ['On the kitchen ceiling and the hallway, with working batteries', 'On the living-room floor', 'You do not need a smoke detector'], correcta: 0 },
      { picto: '💊', pregunta: 'Where should pills and cleaning products be kept?', opciones: ['In a high or locked cupboard, out of reach of small children', 'On a low table so they are at hand', 'On the bathroom floor'], correcta: 0 },
      { picto: '⚡', pregunta: 'Do you know where the house lights switch is?', opciones: ['Yes, and I also know where the main breaker is', 'No, but my mother looks for it when needed', 'You do not need to know'], correcta: 0 },
      { picto: '🔥', pregunta: 'Do you know where the gas shut-off valve is?', opciones: ['Yes, and I have practiced it with a trusted person', 'No, I do not know where it is', 'You do not need to, the gas turns itself off'], correcta: 0 },
      { picto: '🌩️', pregunta: 'If there is a very strong storm, what do you do with plugged-in devices?', opciones: ['Unplug the important ones and do not touch cables', 'Keep using them as usual', 'Open the windows to let air in'], correcta: 0 }
    ],
    checklist: [
      { id: 't112', picto: '📞', nombre: 'I have 112 saved in my mobile and written next to the home phone', hecho: false },
      { id: 'dir', picto: '🏠', nombre: 'I know my full address and have it written on a visible paper', hecho: false },
      { id: 'lla', picto: '🚪', nombre: 'The front door can be opened from inside without a key when it is locked', hecho: false },
      { id: 'det', picto: '🧯', nombre: 'There is a smoke detector with working batteries in the kitchen or hallway', hecho: false },
      { id: 'pas', picto: '💊', nombre: 'Pills and cleaning products are out of reach of small children', hecho: false },
      { id: 'luz', picto: '⚡', nombre: 'I know where the main electricity switch is', hecho: false },
      { id: 'gas', picto: '🔥', nombre: 'I know where the gas shut-off valve is (and have practiced with a trusted person)', hecho: false },
      { id: 'punto', picto: '🤝', nombre: 'My family and I have a meeting point outside the house in case we have to leave', hecho: false }
    ]
  }
};
