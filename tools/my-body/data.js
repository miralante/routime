/* ============================================================
   Datos: Mi Cuerpo Me Avisa (emociones — interocepción: notar las
   señales del propio cuerpo y elegir qué hacer).
   Formato: DATA.es / DATA.en, cada uno con:
   { porRonda, niveles: [{ id, nombre, descripcion, estrellas,
     items: [{ text, options: string[3], correct: indice }] }] }
   'text' describe una señal del cuerpo; la opción correcta es
   siempre cuidar de esa señal (comer, beber, descansar, respirar,
   contarlo a una persona de confianza si hace falta) — nunca
   ignorarla ni aguantar.
   Progresión (regla 13, un solo cambio por nivel): nivel 1 usa
   señales físicas muy claras (hambre, sed, sueño, frío/calor);
   nivel 2 mantiene el mismo formato de 3 opciones y pasa a señales
   más sutiles, el puente cuerpo-emoción (nervios, tensión, nudo en
   la garganta antes de llorar), conectando con Calma y ¿Cómo me
   siento?.
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
        descripcion: 'Señales claras del cuerpo',
        estrellas: 1,
        items: [
          { text: 'Te suena la tripa y notas que tienes hambre.', options: ['Comer algo', 'Beber agua', 'Dormir un rato'], correct: 0 },
          { text: 'Notas la boca seca y tienes sed.', options: ['Beber agua', 'Comer algo', 'Ponerte el abrigo'], correct: 0 },
          { text: 'Se te cierran los ojos y bostezas mucho.', options: ['Descansar o dormir un rato', 'Seguir jugando sin parar', 'Beber agua'], correct: 0 },
          { text: 'Te duele la cabeza.', options: ['Decírselo a una persona de confianza', 'Seguir jugando sin decir nada', 'Gritar muy fuerte'], correct: 0 },
          { text: 'Notas el corazón muy acelerado después de correr mucho.', options: ['Parar un momento y descansar', 'Seguir corriendo más rápido', 'Aguantar la respiración'], correct: 0 },
          { text: 'Tienes ganas de ir al baño.', options: ['Ir al baño ahora', 'Esperar mucho rato', 'Decir que no pasa nada'], correct: 0 },
          { text: 'Notas que tienes mucho calor y estás sudando.', options: ['Beber agua y quitarte una prenda', 'Ponerte más ropa', 'Seguir corriendo al sol'], correct: 0 },
          { text: 'Notas que tienes frío y tiemblas un poco.', options: ['Ponerte una prenda de abrigo', 'Quitarte ropa', 'No decir nada a nadie'], correct: 0 },
          { text: 'Te pican los ojos después de mucho rato de pantalla.', options: ['Descansar la vista un rato lejos de la pantalla', 'Acercarte más a la pantalla', 'Frotarte los ojos muy fuerte'], correct: 0 },
          { text: 'Te duele una muela al comer.', options: ['Decírselo a una persona de confianza', 'Comer solo por el otro lado y no decir nada', 'Dejar de lavarte los dientes'], correct: 0 },
          { text: 'Notas la nariz tapada y estornudas mucho.', options: ['Sonarte con un pañuelo y decírselo a una persona de confianza', 'Aguantar sin sonarte', 'Estornudar sin taparte encima de otros'], correct: 0 },
          { text: 'Te has hecho una herida pequeña y te sale un poco de sangre.', options: ['Lavarla y pedir ayuda a una persona de confianza para curarla', 'No mirarla y seguir jugando', 'Tocarla con las manos sucias'], correct: 0 },
          { text: 'Notas la piel muy caliente después de estar al sol.', options: ['Ponerte a la sombra y beber agua', 'Quedarte más rato al sol', 'No decir nada aunque te escueza'], correct: 0 }
        ]
      },
      {
        id: 2,
        nombre: 'Nivel 2',
        descripcion: 'El cuerpo y las emociones',
        estrellas: 2,
        items: [
          { text: 'Notas que el estómago se te encoge antes de un examen.', options: ['Respirar despacio y decir cómo te sientes', 'Aguantarte sin decir nada', 'Salir corriendo de la clase'], correct: 0 },
          { text: 'Te tiemblan las manos y notas que estás muy nervioso.', options: ['Hacer una respiración tranquila, como en Calma', 'Apretar los puños muy fuerte', 'Ignorarlo y seguir sin parar'], correct: 0 },
          { text: 'Notas que se te tensan los hombros y aprietas los dientes.', options: ['Parar un momento y relajar el cuerpo', 'Seguir tenso todo el día', 'Golpear algo'], correct: 0 },
          { text: 'Te sientes muy cansado aunque no hayas hecho mucho ejercicio.', options: ['Descansar y decírselo a una persona de confianza si sigue pasando', 'Forzarte a seguir igual', 'No decir nada a nadie'], correct: 0 },
          { text: 'Notas un nudo en la garganta y ganas de llorar.', options: ['Decir cómo te sientes a alguien de confianza', 'Aguantarte las ganas de llorar', 'Reírte para disimular'], correct: 0 },
          { text: 'Te cuesta concentrarte y notas la cabeza espesa.', options: ['Parar un momento a descansar los ojos y la mente', 'Seguir igual sin descansar', 'Ponerte a gritar'], correct: 0 },
          { text: 'Notas mareo después de dar muchas vueltas jugando.', options: ['Sentarte tranquilo hasta que se te pase', 'Seguir dando vueltas más rápido', 'No decir nada a nadie'], correct: 0 },
          { text: 'Sientes un dolor fuerte que no se te pasa en un rato.', options: ['Decírselo enseguida a una persona de confianza', 'Esperar mucho tiempo sin decir nada', 'Tomar una medicina tú solo'], correct: 0 },
          { text: 'Notas calor en la cara y ganas de gritar cuando algo te enfada.', options: ['Alejarte un momento y respirar despacio', 'Gritar lo primero que se te ocurra', 'Empujar a quien tengas cerca'], correct: 0 },
          { text: 'Notas cosquillas en la tripa antes de algo que te hace ilusión.', options: ['Disfrutarlo: son nervios de alegría', 'Asustarte y quedarte en casa', 'Aguantar la respiración hasta que se pase'], correct: 0 },
          { text: 'Llevas un rato sentado y notas el cuerpo inquieto, sin parar de mover las piernas.', options: ['Levantarte un momento a estirar o caminar', 'Quedarte quieto a la fuerza', 'Dar patadas a la silla de delante'], correct: 0 },
          { text: 'Por la noche no puedes dormir porque no paras de pensar.', options: ['Respirar despacio y contárselo a alguien al día siguiente', 'Quedarte con el móvil hasta muy tarde', 'No contárselo nunca a nadie'], correct: 0 },
          { text: 'Notas que el ruido fuerte te molesta mucho y te pone nervioso.', options: ['Ir a un sitio más tranquilo o pedir bajar el volumen', 'Quedarte aunque lo pases mal', 'Gritar más fuerte que el ruido'], correct: 0 }
        ]
      },
      {
        id: 3,
        nombre: 'Nivel 3',
        descripcion: 'Las señales previas al bajón',
        estrellas: 3,
        items: [
          { text: 'Llevas mucho rato con la mirada fija y notas la vista cansada.', options: ['Parar, mirar lejos unos segundos y descansar los ojos', 'Seguir mirando lo mismo sin parar', 'Frotarte los ojos muy fuerte'], correct: 0 },
          { text: 'Aprietas la mandíbula sin darte cuenta.', options: ['Soltar la mandíbula, bostezar suave y respirar', 'Apretar más fuerte los dientes', 'No decir nada y aguantar'], correct: 0 },
          { text: 'Sientes el cuerpo rígido, como si te hubieras quedado "congelado".', options: ['Mover un poco los dedos y los pies y respirar despacio', 'Quedarte muy quieto sin respirar', 'Empujar algo con fuerza'], correct: 0 },
          { text: 'Notas la respiración muy corta, como si solo usaras el pecho.', options: ['Hacer una respiración lenta hasta la tripa, como en Calma', 'Respirar más rápido y por la boca', 'Aguantar el aire hasta que se pase'], correct: 0 },
          { text: 'Te pican las manos y necesitas moverlas todo el rato.', options: ['Levantarte y estirar las manos un momento', 'Quedarte sentado sin moverte', 'Golpear la mesa'], correct: 0 },
          { text: 'Notas el corazón muy rápido sin haber corrido.', options: ['Parar, respirar despacio y decir cómo te sientes', 'Seguir igual sin decir nada', 'Tomar una medicina tú solo'], correct: 0 },
          { text: 'Llevas un rato con una postura encorvada y notas el cuello rígido.', options: ['Enderezarte despacio y mover el cuello con cuidado', 'Seguir encorvado hasta que duela más', 'Girar el cuello de golpe'], correct: 0 },
          { text: 'Notas calor en la cara y las orejas antes de un momento difícil.', options: ['Alejarte un momento, beber agua y respirar', 'Esconderte bajo la manta sin decir nada', 'Gritar lo primero que se te ocurra'], correct: 0 },
          { text: 'Tienes la tripa revuelta antes de algo que te pone nervioso.', options: ['Respirar despacio y contárselo a alguien de confianza', 'Comer mucho para "que se pase"', 'Aguantar sin decir nada'], correct: 0 },
          { text: 'Te sientes muy irritable por todo y cualquier cosa te molesta.', options: ['Parar un momento, respirar y decir que necesitas un descanso', 'Gritar a quien tengas al lado', 'Esconderte y no hablar con nadie en todo el día'], correct: 0 },
          { text: 'Te cuesta entender lo que te dicen porque la cabeza va muy rápido.', options: ['Pedir que te lo repitan más despacio y respirar', 'Decir que sí sin entender', 'Irte sin decir nada'], correct: 0 },
          { text: 'Tienes los hombros muy altos, casi tocando las orejas.', options: ['Bajar los hombros despacio y soltar el aire', 'Subirlos más todavía', 'No darte cuenta y seguir tenso'], correct: 0 }
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
        descripcion: 'Clear body signals',
        estrellas: 1,
        items: [
          { text: 'Your tummy rumbles and you feel hungry.', options: ['Eat something', 'Drink water', 'Sleep for a while'], correct: 0 },
          { text: 'Your mouth feels dry and you feel thirsty.', options: ['Drink water', 'Eat something', 'Put on your coat'], correct: 0 },
          { text: 'Your eyes are closing and you keep yawning.', options: ['Rest or sleep for a while', 'Keep playing without stopping', 'Drink water'], correct: 0 },
          { text: 'You have a headache.', options: ['Tell a trusted person', 'Keep playing without saying anything', 'Shout very loudly'], correct: 0 },
          { text: 'Your heart is racing after running a lot.', options: ['Stop for a moment and rest', 'Keep running faster', 'Hold your breath'], correct: 0 },
          { text: 'You need to go to the toilet.', options: ['Go to the toilet now', 'Wait a long time', 'Say it is nothing'], correct: 0 },
          { text: 'You feel very hot and you are sweating.', options: ['Drink water and take off a layer', 'Put on more clothes', 'Keep running in the sun'], correct: 0 },
          { text: 'You feel cold and shiver a little.', options: ['Put on a warm layer', 'Take off clothes', 'Say nothing to anyone'], correct: 0 },
          { text: 'Your eyes itch after a long time looking at a screen.', options: ['Rest your eyes away from the screen for a while', 'Move closer to the screen', 'Rub your eyes very hard'], correct: 0 },
          { text: 'A tooth hurts when you eat.', options: ['Tell a trusted person', 'Chew on the other side and say nothing', 'Stop brushing your teeth'], correct: 0 },
          { text: 'Your nose is blocked and you keep sneezing.', options: ['Blow your nose with a tissue and tell a trusted person', 'Hold it in without blowing your nose', 'Sneeze on other people without covering'], correct: 0 },
          { text: 'You have a small cut and it bleeds a little.', options: ['Wash it and ask a trusted person to help treat it', 'Ignore it and keep playing', 'Touch it with dirty hands'], correct: 0 },
          { text: 'Your skin feels very hot after being in the sun.', options: ['Move to the shade and drink water', 'Stay in the sun longer', 'Say nothing even if it stings'], correct: 0 }
        ]
      },
      {
        id: 2,
        nombre: 'Level 2',
        descripcion: 'Your body and emotions',
        estrellas: 2,
        items: [
          { text: 'Your stomach tightens before a test.', options: ['Breathe slowly and say how you feel', 'Hold it in and say nothing', 'Run out of the classroom'], correct: 0 },
          { text: 'Your hands shake and you feel very nervous.', options: ['Do a calm breath, like in Calma', 'Clench your fists very hard', 'Ignore it and keep going'], correct: 0 },
          { text: 'Your shoulders tense up and you clench your teeth.', options: ['Stop for a moment and relax your body', 'Stay tense all day', 'Hit something'], correct: 0 },
          { text: 'You feel very tired even though you have not exercised much.', options: ['Rest and tell a trusted person if it keeps happening', 'Force yourself to keep going', 'Say nothing to anyone'], correct: 0 },
          { text: 'You feel a lump in your throat and want to cry.', options: ['Tell someone you trust how you feel', 'Hold back your tears', 'Laugh to hide it'], correct: 0 },
          { text: "It's hard to concentrate and your head feels foggy.", options: ['Stop for a moment to rest your eyes and mind', 'Keep going without resting', 'Start shouting'], correct: 0 },
          { text: 'You feel dizzy after spinning around a lot while playing.', options: ['Sit down calmly until it passes', 'Keep spinning faster', 'Say nothing to anyone'], correct: 0 },
          { text: 'You feel a strong pain that does not go away for a while.', options: ['Tell a trusted person right away', 'Wait a long time without saying anything', 'Take medicine by yourself'], correct: 0 },
          { text: 'Your face feels hot and you want to shout when something makes you angry.', options: ['Step away for a moment and breathe slowly', 'Shout the first thing that comes to mind', 'Push whoever is nearby'], correct: 0 },
          { text: 'You feel butterflies in your tummy before something exciting.', options: ['Enjoy it: those are happy nerves', 'Get scared and stay home', 'Hold your breath until it passes'], correct: 0 },
          { text: 'You have been sitting a while and your body feels restless, legs moving non-stop.', options: ['Get up for a moment to stretch or walk', 'Force yourself to stay still', 'Kick the chair in front of you'], correct: 0 },
          { text: 'At night you cannot sleep because your mind will not stop.', options: ['Breathe slowly and tell someone the next day', 'Stay on your phone until very late', 'Never tell anyone'], correct: 0 },
          { text: 'Loud noise bothers you a lot and makes you nervous.', options: ['Go somewhere quieter or ask to lower the volume', 'Stay even though you feel bad', 'Shout louder than the noise'], correct: 0 }
        ]
      },
      {
        id: 3,
        nombre: 'Level 3',
        descripcion: 'Early-warning signals before a crash',
        estrellas: 3,
        items: [
          { text: 'You have been staring for a long time and your eyes feel tired.', options: ['Stop, look far away for a few seconds and rest your eyes', 'Keep staring without stopping', 'Rub your eyes very hard'], correct: 0 },
          { text: 'You clench your jaw without noticing.', options: ['Let your jaw go, yawn softly and breathe', 'Clench your teeth harder', 'Say nothing and hold it in'], correct: 0 },
          { text: 'Your body feels stiff, as if you had frozen in place.', options: ['Move your fingers and toes a little and breathe slowly', 'Stay very still without breathing', 'Push something hard'], correct: 0 },
          { text: 'Your breathing is very short, as if you only used your chest.', options: ['Take a slow breath down to your tummy, like in Calm', 'Breathe faster through your mouth', 'Hold your breath until it passes'], correct: 0 },
          { text: 'Your hands feel restless and you need to move them all the time.', options: ['Get up and stretch your hands for a moment', 'Stay seated without moving', 'Hit the table'], correct: 0 },
          { text: 'Your heart beats very fast without having run.', options: ['Stop, breathe slowly and say how you feel', 'Carry on without saying anything', 'Take medicine by yourself'], correct: 0 },
          { text: 'You have been slouched for a while and your neck feels stiff.', options: ['Sit up slowly and move your neck carefully', 'Stay slouched until it hurts more', 'Twist your neck suddenly'], correct: 0 },
          { text: 'Your face and ears feel hot before a difficult moment.', options: ['Step away for a moment, drink water and breathe', 'Hide under a blanket without telling anyone', 'Shout the first thing that comes to mind'], correct: 0 },
          { text: 'Your tummy feels upset before something that makes you nervous.', options: ['Breathe slowly and tell someone you trust', 'Eat a lot to "make it go away"', 'Hold it in without telling anyone'], correct: 0 },
          { text: 'You feel very irritable and anything bothers you.', options: ['Pause for a moment, breathe and say you need a break', 'Shout at whoever is nearby', 'Hide and not talk to anyone all day'], correct: 0 },
          { text: 'It is hard to understand what people say because your head is going too fast.', options: ['Ask them to repeat it slowly and breathe', 'Say yes without understanding', 'Leave without saying anything'], correct: 0 },
          { text: 'Your shoulders are very high, almost touching your ears.', options: ['Lower your shoulders slowly and let the air out', 'Raise them even higher', 'Do not notice and stay tense'], correct: 0 }
        ]
      }
    ]
  }
};
