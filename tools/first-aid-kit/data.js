/* ============================================================
   Datos: Mi Botiquín (Mi día a día — autonomía: cuidarse en casa
   con lo que ya hay y saber cuándo pedir ayuda a una persona de confianza o
   derivar al médico).
   Formato: DATA.es / DATA.en, cada uno con:
   { porRonda, niveles: [{ id, nombre, descripcion, estrellas,
     items: [{ text, options: string[3], correct: indice }] }] }
   'text' describe una escena cotidiana; la opción correcta es
   siempre el autocuidado seguro (lavar, frío/calor, tirita,
   medicina que ya te han recetado) o, cuando la situación lo
   requiere, pedir ayuda a una persona de confianza / llamar al 112.
   Progresión (regla 13, un solo cambio por nivel): nivel 1 usa
   cuidados cotidianos donde la respuesta correcta es hacerlo uno
   mismo siguiendo lo aprendido; nivel 2 mantiene el mismo formato
   de 3 opciones y sube la variable "la situación es urgente" — la
   opción correcta pasa a ser pedir ayuda a una persona de confianza o al 112.
   Para ampliar: añadir items al array del nivel correspondiente.
   app.js usa DATA[App.i18n.locale()] || DATA.es.
   ============================================================ */
const DATA = {
  es: {
    porRonda: 8,
    niveles: [
      {
        id: 1,
        nombre: 'Nivel 1',
        descripcion: 'Cuidarme en casa',
        estrellas: 1,
        items: [
          { text: 'Te has hecho un arañazo pequeño en la rodilla y no sangra mucho.', options: ['Lavar la herida con agua y poner una tirita', 'Tocarla con las manos sucias', 'No hacer nada'], correct: 0 },
          { text: 'Te has dado un golpe leve y te duele un poco el brazo.', options: ['Ponerte un poco de frío en la zona un rato', 'Frotarte muy fuerte para "que se pase"', 'No decir nada aunque duela'], correct: 0 },
          { text: 'Tienes la tripa un poco revuelta después de comer mucho.', options: ['Beber agua despacio y descansar sentado', 'Salir a correr para que se pase', 'Tomarte una medicina tú solo'], correct: 0 },
          { text: 'Tienes tos seca y te pica la garganta.', options: ['Beber agua templada y descansar la voz', 'Gritar muy fuerte para "desatascar"', 'Comer mucho pan'], correct: 0 },
          { text: 'Te ha entrado una mota de polvo en el ojo y te escuece.', options: ['Lavar el ojo con agua limpia sin frotar', 'Frotarte el ojo con la mano sucia', 'Esperar sin hacer nada'], correct: 0 },
          { text: 'Te has quemado un dedo con la sartén y se ha puesto rojo.', options: ['Poner la mano bajo agua fría un rato', 'Echarte pasta de dientes encima', 'Seguir cocinando igual'], correct: 0 },
          { text: 'Tienes la nariz muy seca porque hace mucho frío.', options: ['Sonarte con un pañuelo y beber agua', 'Meter los dedos en la nariz', 'No sonarte nunca'], correct: 0 },
          { text: 'Te pica un mosquito en la pierna.', options: ['No rascarte fuerte y, si te pica mucho, lavar con agua fría', 'Rascarte hasta hacerte herida', 'Taparlo con un trapo sucio'], correct: 0 },
          { text: 'Tienes los labios secos y agrietados.', options: ['Ponerte un poco de cacao o vaselina en los labios', 'Morderte los labios para "humedecerlos"', 'No hacer nada y seguir mordiendo'], correct: 0 },
          { text: 'Te sientes mareado después de jugar mucho al sol.', options: ['Sentarte a la sombra y beber agua despacio', 'Seguir jugando al sol', 'Beber mucha agua de golpe'], correct: 0 },
          { text: 'Tienes un resfriado leve: mocos y estornudos.', options: ['Sonarte con pañuelos, beber agua y descansar', 'Salir a jugar al frío sin abrigarte', 'No beber nada en todo el día'], correct: 0 },
          { text: 'Te ha salido una ampolla pequeña en el pie por un zapato nuevo.', options: ['Lavarla, taparla con una tirita y descansar del zapato', 'Reventarla con las manos', 'Seguir con el zapato apretado'], correct: 0 }
        ]
      },
      {
        id: 2,
        nombre: 'Nivel 2',
        descripcion: 'Cuándo pedir ayuda',
        estrellas: 2,
        items: [
          { text: 'Te has cortado con un cuchillo y la sangre no para de salir.', options: ['Decírselo enseguida a una persona de confianza', 'Ponerte un trapo y no decir nada', 'Intentar coserlo tú mismo'], correct: 0 },
          { text: 'Te has caído fuerte y te duele mucho el brazo; no puedes moverlo.', options: ['Decírselo a una persona de confianza y no mover el brazo', 'Intentar moverlo muy fuerte para "que se quite"', 'Tomar una medicina tú solo'], correct: 0 },
          { text: 'Te ha picado algo en la mano y se te hincha mucho y se pone morada.', options: ['Decírselo a una persona de confianza cuanto antes', 'Apretar la zona muy fuerte', 'Esperar a que se quite solo'], correct: 0 },
          { text: 'Tienes fiebre muy alta, estás ardiendo y te duele todo el cuerpo.', options: ['Decírselo a una persona de confianza para que te lleve al médico', 'Taparte con cinco mantas para sudar', 'Tomarte una medicina tú solo'], correct: 0 },
          { text: 'Tu abuelo se ha caído al suelo y no se puede levantar.', options: ['Avisar a una persona de confianza y, si nadie está, llamar al 112', 'Intentar levantarlo tú solo a empujones', 'Esperar a que se levante solo'], correct: 0 },
          { text: 'Te has quemado mucho con aceite caliente y te ha salido una ampolla grande.', options: ['Decírselo a una persona de confianza y poner la quemadura bajo agua fría', 'Echarte pasta de dientes o aceite', 'Reventar la ampolla con las manos'], correct: 0 },
          { text: 'Te has metido algo en el ojo y, aunque lo lavas, no se quita y te sigue doliendo.', options: ['Decírselo a una persona de confianza para ir al médico', 'Seguir frotándote el ojo muy fuerte', 'Esperar varios días sin decir nada'], correct: 0 },
          { text: 'Te encuentras muy mal después de comer algo que estaba raro y te has puesto muy pálido.', options: ['Decírselo a una persona de confianza para que te lleve al médico', 'Acostarte sin decir nada', 'Comer más de lo mismo para "acostumbrarte"'], correct: 0 },
          { text: 'Tu hermano pequeño se ha tragado una pieza pequeña de un juguete.', options: ['Avisar a una persona de confianza cuanto antes', 'Decirle que beba mucha agua y ya está', 'Esperar sin decir nada'], correct: 0 },
          { text: 'Tienes un dolor fuerte en la tripa que va a más y no se te pasa.', options: ['Decírselo a una persona de confianza', 'Aguantar el dolor sin decir nada', 'Hacer abdominales para "que se pase"'], correct: 0 },
          { text: 'Tu padre tiene un dolor fuerte en el pecho y se lleva la mano al pecho.', options: ['Avisar a una persona de confianza y, si es grave, llamar al 112', 'Decirle que se tumbe y ya está', 'Esperar a ver si se le pasa solo'], correct: 0 },
          { text: 'Te has clavado un cristal pequeño en el pie y no puedes sacarlo.', options: ['Decírselo a una persona de confianza para que te ayude', 'Intentar sacarlo tú mismo con las manos', 'Seguir caminando con el cristal dentro'], correct: 0 }
        ]
      }
    ]
  },
  en: {
    porRonda: 8,
    niveles: [
      {
        id: 1,
        nombre: 'Level 1',
        descripcion: 'Looking after myself at home',
        estrellas: 1,
        items: [
          { text: 'You have a small scratch on your knee and it does not bleed much.', options: ['Wash the wound with water and put on a plaster', 'Touch it with dirty hands', 'Do nothing'], correct: 0 },
          { text: 'You have had a small bump and your arm hurts a little.', options: ['Put something cold on the spot for a while', 'Rub it very hard to "make it go away"', 'Say nothing even though it hurts'], correct: 0 },
          { text: 'Your tummy feels a bit upset after eating too much.', options: ['Drink water slowly and sit down to rest', 'Go out for a run to make it go away', 'Take a medicine by yourself'], correct: 0 },
          { text: 'You have a dry cough and your throat itches.', options: ['Drink warm water and rest your voice', 'Shout very loud to "clear it"', 'Eat a lot of bread'], correct: 0 },
          { text: 'You got a speck of dust in your eye and it stings.', options: ['Wash the eye with clean water without rubbing', 'Rub your eye with a dirty hand', 'Wait and do nothing'], correct: 0 },
          { text: 'You have burnt a finger on the pan and it has gone red.', options: ['Hold your hand under cold water for a while', 'Put toothpaste on it', 'Keep cooking as if nothing happened'], correct: 0 },
          { text: 'Your nose is very dry because it is very cold outside.', options: ['Blow your nose with a tissue and drink water', 'Put your fingers in your nose', 'Never blow your nose'], correct: 0 },
          { text: 'A mosquito bite is itching on your leg.', options: ['Do not scratch hard and, if it itches a lot, wash with cold water', 'Scratch until you break the skin', 'Cover it with a dirty cloth'], correct: 0 },
          { text: 'Your lips are dry and cracked.', options: ['Put a little bit of lip balm or vaseline on them', 'Bite your lips to "wet them"', 'Do nothing and keep biting them'], correct: 0 },
          { text: 'You feel dizzy after playing a lot in the sun.', options: ['Sit in the shade and drink water slowly', 'Keep playing in the sun', 'Drink a lot of water all at once'], correct: 0 },
          { text: 'You have a mild cold: a runny nose and sneezing.', options: ['Blow your nose with tissues, drink water and rest', 'Go out to play in the cold without a coat', 'Do not drink anything all day'], correct: 0 },
          { text: 'You have a small blister on your foot from new shoes.', options: ['Wash it, cover it with a plaster and rest from the shoes', 'Pop it with your hands', 'Keep wearing the tight shoes'], correct: 0 }
        ]
      },
      {
        id: 2,
        nombre: 'Level 2',
        descripcion: 'When to ask for help',
        estrellas: 2,
        items: [
          { text: 'You have cut yourself with a knife and the bleeding will not stop.', options: ['Tell a trusted person straight away', 'Put a cloth on it and say nothing', 'Try to stitch it yourself'], correct: 0 },
          { text: 'You have fallen badly, your arm hurts a lot and you cannot move it.', options: ['Tell a trusted person and do not move the arm', 'Try to move it very hard to "loosen it up"', 'Take a medicine by yourself'], correct: 0 },
          { text: 'Something has stung you on the hand and it is swelling a lot and turning purple.', options: ['Tell a trusted person as soon as possible', 'Press the area very hard', 'Wait for it to go away on its own'], correct: 0 },
          { text: 'You have a very high fever, you are burning and your whole body aches.', options: ['Tell a trusted person so they can take you to the doctor', 'Cover yourself with five blankets to sweat it out', 'Take a medicine by yourself'], correct: 0 },
          { text: 'Your grandfather has fallen on the floor and cannot get up.', options: ['Tell a trusted person and, if nobody is there, call 112', 'Try to lift him up by yourself', 'Wait for him to get up on his own'], correct: 0 },
          { text: 'You have burnt yourself badly with hot oil and a big blister has come up.', options: ['Tell a trusted person and put the burn under cold water', 'Put toothpaste or oil on it', 'Pop the blister with your hands'], correct: 0 },
          { text: 'You got something in your eye and, even after washing it, it is still there and hurting.', options: ['Tell a trusted person so you can go to the doctor', 'Keep rubbing your eye very hard', 'Wait several days without telling anyone'], correct: 0 },
          { text: 'You feel very ill after eating something that tasted off and you have gone very pale.', options: ['Tell a trusted person so they can take you to the doctor', 'Lie down without telling anyone', 'Eat more of the same to "get used to it"'], correct: 0 },
          { text: 'Your little brother has swallowed a small piece of a toy.', options: ['Tell a trusted person as soon as possible', 'Tell him to drink lots of water and that is it', 'Wait without telling anyone'], correct: 0 },
          { text: 'You have a strong tummy pain that is getting worse and will not go away.', options: ['Tell a trusted person', 'Hold the pain in without saying anything', 'Do sit-ups to "make it go away"'], correct: 0 },
          { text: 'Your father has a strong pain in his chest and is holding his chest with his hand.', options: ['Tell a trusted person and, if it is serious, call 112', 'Tell him to lie down and that is it', 'Wait and see if it goes away on its own'], correct: 0 },
          { text: 'You have a small piece of glass stuck in your foot and you cannot get it out.', options: ['Tell a trusted person so they can help you', 'Try to pull it out yourself with your hands', 'Keep walking with the glass inside'], correct: 0 }
        ]
      }
    ]
  }
};