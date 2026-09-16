/* ============================================================
   Datos: La Calle (autonomía — movilidad comunitaria y seguridad
   en la calle: cruzar, transporte, perderse).
   Formato: DATA.es / DATA.en, cada uno con:
   { porRonda, niveles: [{ id, name, descripcion, estrellas,
     items: [{ picto, situacion, options: string[3], correcta }] }] }
   Cada situación describe algo que pasa en la calle; la opción
   correcta es siempre la más segura, nunca la más rápida ni la que
   parece más cómoda.
   Progresión (regla 13, un solo cambio por nivel): nivel 1 usa
   situaciones muy claras (semáforo en rojo, un desconocido que pide
   que le acompañes); nivel 2 mantiene el mismo formato de 3 options
   y pasa a situaciones menos evidentes (semáforo parpadeando a
   mitad de cruce, alguien conocido de vista que ofrece llevarte).
   app.js usa DATA[App.i18n.locale()] || DATA.es.
   ============================================================ */
const DATA = {
  es: {
    porRonda: 8,
    niveles: [
      {
        id: 1,
        name: 'Nivel 1',
        descripcion: 'Situaciones claras',
        estrellas: 1,
        items: [
          { picto: '🚦', situacion: 'Vas a cruzar la calle y el semáforo de peatones está en rojo.', options: ['Esperar a que se ponga verde', 'Cruzar rápido si no viene ningún coche', 'Cruzar por la mitad de la calle'], correcta: 0 },
          { picto: '🚦', situacion: 'El semáforo de peatones está verde.', options: ['Cruzar mirando a los dos lados', 'Cruzar corriendo sin mirar', 'Quedarte esperando aunque esté verde'], correcta: 0 },
          { picto: '🚸', situacion: 'Vas a cruzar por una calle que no tiene semáforo.', options: ['Mirar a los dos lados y cruzar por el paso de peatones', 'Cruzar por donde estás sin mirar', 'Cruzar corriendo por el medio de la calle'], correcta: 0 },
          { picto: '🚌', situacion: 'Estás esperando el autobús en la parada.', options: ['Esperar detrás de la línea hasta que pare', 'Salir a la calzada para verlo llegar antes', 'Subir corriendo aunque el autobús no haya parado'], correcta: 0 },
          { picto: '🚏', situacion: 'No sabes si el autobús que viene es el tuyo.', options: ['Mirar el número o preguntar al conductor', 'Subir a cualquier autobús que llegue', 'Cruzar la calle para verlo mejor'], correcta: 0 },
          { picto: '🧍', situacion: 'Un desconocido en la calle te dice que le acompañes a algún sitio.', options: ['Decir que no y alejarte hacia gente conocida', 'Acompañarlo si parece simpático', 'Seguirlo en silencio'], correcta: 0 },
          { picto: '🗺️', situacion: 'Te das cuenta de que te has perdido por la calle.', options: ['Pararte donde estás y pedir ayuda a un policía o a una tienda', 'Seguir caminando deprisa a ver si lo encuentras', 'Meterte por una calle que no conoces para explorar'], correcta: 0 },
          { picto: '🪪', situacion: 'Un policía te pregunta quién eres porque te has perdido.', options: ['Enseñarle tu identificación o decir tu name y el teléfono de un familiar', 'No decir nada y alejarte', 'Decir un name falso'], correcta: 0 },
          { picto: '🎧', situacion: 'Vas a cruzar la calle y llevas auriculares con música.', options: ['Quitarte los auriculares y mirar antes de cruzar', 'Cruzar con la música alta', 'Mirar el móvil mientras cruzas'], correcta: 0 },
          { picto: '🚇', situacion: 'El metro llega y se abren las puertas.', options: ['Dejar salir a la gente y después entrar', 'Entrar empujando antes de que salgan', 'Poner el pie en la puerta para que no se cierre'], correcta: 0 },
          { picto: '🚶', situacion: 'La acera está llena de gente que viene de frente.', options: ['Caminar despacio por tu lado sin empujar', 'Empujar para pasar primero', 'Bajarte a la calzada para adelantar'], correcta: 0 },
          { picto: '🚲', situacion: 'En la acera hay un carril para bicicletas pintado en el suelo.', options: ['Caminar fuera del carril de las bicis', 'Caminar por el medio del carril bici', 'Pararte dentro del carril a mirar el móvil'], correcta: 0 },
          { picto: '🐕', situacion: 'Un perro que no conoces está atado en la puerta de una tienda.', options: ['Pasar de largo sin tocarlo', 'Acariciarlo aunque no lo conozcas', 'Darle comida de tu bolsillo'], correcta: 0 },
          { picto: '📱', situacion: 'Vas caminando por la calle mirando la pantalla del móvil en vez de mirar por dónde vas.', options: ['Guardar el móvil y mirar por dónde caminas', 'Seguir caminando mirando la pantalla', 'Caminar con el móvil bien visible en la mano'], correcta: 0 },
          { picto: '☕', situacion: 'Estás en una cafetería y vas al baño. Dejas el móvil solo encima de la mesa.', options: ['Llevarte el móvil contigo o dárselo a alguien de confianza', 'Dejarlo en la mesa, total vuelves enseguida', 'Pedirle a la persona de la mesa de al lado que lo vigile'], correcta: 0 },
          { picto: '🚗', situacion: 'Vas a bajar del coche en un aparcamiento. Hay coches circulando cerca.', options: ['Mirar antes de abrir la puerta y bajar por el lado seguro', 'Abrir la puerta rápido sin mirar', 'Bajar corriendo entre los coches'], correcta: 0 },
          { picto: '🛴', situacion: 'Vas en patinete por la acera llena de gente.', options: ['Bajar del patinete y caminar entre la gente', 'Seguir esquivando a toda velocidad', 'Tocar el timbre para que se aparten'], correcta: 0 },
          { picto: '🚉', situacion: 'Estás esperando el tren y hay una línea amarilla pintada en el suelo del andén.', options: ['Esperar detrás de la línea amarilla', 'Acercarte al borde para ver si llega', 'Sentarte con los pies colgando en el borde'], correcta: 0 },
          { picto: '🧥', situacion: 'Vas a cruzar de noche por una calle con poca luz.', options: ['Cruzar por la zona más iluminada y con cuidado', 'Cruzar por la parte más oscura porque es más corta', 'Cruzar corriendo sin mirar'], correcta: 0 }
        ]
      },
      {
        id: 2,
        name: 'Nivel 2',
        descripcion: 'Situaciones menos claras',
        estrellas: 2,
        items: [
          { picto: '🚦', situacion: 'El semáforo de peatones empieza a parpadear en verde mientras estás cruzando.', options: ['Terminar de cruzar sin correr hasta la otra acera', 'Volver corriendo hacia atrás', 'Quedarte parado en medio de la calle'], correcta: 0 },
          { picto: '🚗', situacion: 'Un coche está aparcado justo en el paso de peatones y no te deja ver bien.', options: ['Asomarte con cuidado antes de cruzar, mirando a los dos lados', 'Cruzar rápido sin mirar porque tienes prisa', 'Pasar por delante del coche sin mirar'], correcta: 0 },
          { picto: '🚏', situacion: 'El autobús que esperabas se ha adelantado y ya se ha ido.', options: ['Esperar tranquilo al siguiente o mirar el horario', 'Correr por la calle para intentar alcanzarlo', 'Cruzar la calzada para pararlo'], correcta: 0 },
          { picto: '🧑', situacion: 'Alguien que no conoces se ofrece a llevarte a casa en coche porque hace mal tiempo.', options: ['Decir que no, gracias, y esperar a alguien conocido', 'Subir porque hace mal tiempo', 'Subir si parece una persona amable'], correcta: 0 },
          { picto: '🏬', situacion: 'Te pierdes dentro de un centro comercial muy grande.', options: ['Ir al mostrador de información o a una tienda y pedir ayuda', 'Salir a la calle a buscar solo', 'Sentarte en el suelo a esperar sin decir nada a nadie'], correcta: 0 },
          { picto: '📱', situacion: 'Te has perdido y llevas el móvil contigo.', options: ['Llamar a un familiar o persona de confianza para decir dónde estás', 'Apagar el móvil para ahorrar batería', 'Escribir a desconocidos pidiendo que vengan a buscarte'], correcta: 0 },
          { picto: '🚧', situacion: 'La acera está cortada por obras.', options: ['Buscar otro camino o cruzar con mucho cuidado mirando el tráfico', 'Meterte en la zona de obras aunque esté vallada', 'Caminar por la calzada sin mirar los coches'], correcta: 0 },
          { picto: '🌙', situacion: 'Se te ha done de noche y todavía estás fuera de casa.', options: ['Avisar a una persona de confianza de dónde estás y volver por calles conocidas e iluminadas', 'Volver por un atajo desconocido y oscuro', 'Quedarte fuera sin avisar a nadie'], correcta: 0 },
          { picto: '🚌', situacion: 'Te has quedado dormido en el autobús y al despertar no sabes dónde estás.', options: ['Preguntar al conductor y bajarte en una parada segura', 'Bajarte corriendo en cualquier sitio', 'Quedarte callado sin pedir ayuda'], correcta: 0 },
          { picto: '🌧️', situacion: 'Llueve mucho y el suelo de la calle resbala.', options: ['Caminar despacio y con cuidado', 'Correr para llegar antes', 'Cruzar corriendo entre los coches'], correcta: 0 },
          { picto: '🧒', situacion: 'Ves a un niño pequeño solo y llorando en la calle.', options: ['Avisar a un policía o buscar ayuda en una tienda', 'Llevártelo tú a buscar a su familia', 'Seguir andando como si nada'], correcta: 0 },
          { picto: '📵', situacion: 'Te has perdido y tu móvil no tiene batería.', options: ['Entrar en una tienda y pedir que llamen a tu familia', 'Caminar sin rumbo hasta encontrar tu casa', 'Irte con un desconocido que dice conocer tu calle'], correcta: 0 },
          { picto: '🚕', situacion: 'Un vecino que apenas conoces insiste en llevarte en su coche.', options: ['Decir "no, gracias" y contárselo después a tu familia', 'Subir porque le has visto alguna vez', 'Subir para no parecer maleducado'], correcta: 0 },
          { picto: '🚌', situacion: 'El autobús va muy filled y el conductor te pide esperar al siguiente.', options: ['Esperar tranquilo/a al siguiente autobús', 'Insistir para subir a la fuerza', 'Enfadarte con el conductor'], correcta: 0 },
          { picto: '🧑‍🦯', situacion: 'Ves a una persona con dificultad para cruzar sola.', options: ['Preguntarle si necesita ayuda', 'Pasar de largo sin decir nada', 'Reírte de cómo camina'], correcta: 0 },
          { picto: '📵', situacion: 'Se te ha estropeado el móvil y necesitas avisar de que llegas tarde.', options: ['Pedir el teléfono a una persona de una tienda o similar para llamar a tu familia', 'No avisar a nadie y seguir andando', 'Pedirle el móvil a un desconocido cualquiera por la calle'], correcta: 0 },
          { picto: '🚦', situacion: 'El semáforo para coches está en verde pero no ves ningún coche parado en el cruce.', options: ['Esperar igualmente a que tu semáforo se ponga verde', 'Cruzar aunque tu semáforo esté en rojo', 'Cruzar corriendo por si acaso'], correcta: 0 }
        ]
      }
    ]
  },
  en: {
    porRonda: 8,
    niveles: [
      {
        id: 1,
        name: 'Level 1',
        descripcion: 'Clear situations',
        estrellas: 1,
        items: [
          { picto: '🚦', situacion: 'You are about to cross and the pedestrian light is red.', options: ['Wait until it turns green', 'Cross quickly if no car is coming', 'Cross from the middle of the street'], correcta: 0 },
          { picto: '🚦', situacion: 'The pedestrian light is green.', options: ['Cross looking both ways', 'Cross running without looking', 'Keep waiting even though it is green'], correcta: 0 },
          { picto: '🚸', situacion: 'You are going to cross a street with no traffic light.', options: ['Look both ways and cross at the pedestrian crossing', 'Cross from where you are without looking', 'Cross running through the middle of the street'], correcta: 0 },
          { picto: '🚌', situacion: 'You are waiting for the bus at the stop.', options: ['Wait behind the line until it stops', 'Step onto the road to see it coming sooner', 'Get on running even though the bus has not stopped'], correcta: 0 },
          { picto: '🚏', situacion: "You don't know if the bus coming is yours.", options: ['Check the number or ask the driver', 'Get on any bus that arrives', 'Cross the street to see it better'], correcta: 0 },
          { picto: '🧍', situacion: 'A stranger on the street asks you to go with them somewhere.', options: ['Say no and move towards people you know', 'Go with them if they seem nice', 'Follow them in silence'], correcta: 0 },
          { picto: '🗺️', situacion: 'You realize you are lost on the street.', options: ['Stop where you are and ask a police officer or a shop for help', 'Keep walking fast to try to find it', 'Go down an unknown street to explore'], correcta: 0 },
          { picto: '🪪', situacion: 'A police officer asks who you are because you are lost.', options: ["Show your ID or say your name and a family member's phone number", 'Say nothing and walk away', 'Give a false name'], correcta: 0 },
          { picto: '🎧', situacion: 'You are about to cross the street wearing headphones with music.', options: ['Take off the headphones and look before crossing', 'Cross with the music loud', 'Look at your phone while crossing'], correcta: 0 },
          { picto: '🚇', situacion: 'The metro arrives and the doors open.', options: ['Let people get off first and then get on', 'Push your way in before they get off', 'Put your foot in the door so it cannot close'], correcta: 0 },
          { picto: '🚶', situacion: 'The pavement is full of people walking towards you.', options: ['Walk slowly on your side without pushing', 'Push through to get past first', 'Step onto the road to overtake'], correcta: 0 },
          { picto: '🚲', situacion: 'There is a bike lane painted on the pavement.', options: ['Walk outside the bike lane', 'Walk in the middle of the bike lane', 'Stand in the lane looking at your phone'], correcta: 0 },
          { picto: '🐕', situacion: 'A dog you do not know is tied up outside a shop.', options: ['Walk past without touching it', 'Pet it even though you do not know it', 'Give it food from your pocket'], correcta: 0 },
          { picto: '📱', situacion: 'You are walking down the street looking at your phone screen instead of watching where you are going.', options: ['Put the phone away and watch where you are walking', 'Keep walking while staring at the screen', 'Walk holding the phone clearly visible in your hand'], correcta: 0 },
          { picto: '☕', situacion: 'You are at a cafe and go to the bathroom. You leave your phone alone on the table.', options: ['Take the phone with you or give it to someone you trust', 'Leave it on the table, you will be right back', 'Ask the person at the next table to watch it'], correcta: 0 },
          { picto: '🚗', situacion: 'You are getting out of the car in a car park. Cars are moving nearby.', options: ['Look before opening the door and get out on the safe side', 'Open the door quickly without looking', 'Get out running between the cars'], correcta: 0 },
          { picto: '🛴', situacion: 'You are riding a scooter on a pavement full of people.', options: ['Get off the scooter and walk among the people', 'Keep dodging people at full speed', 'Ring the bell so people move aside'], correcta: 0 },
          { picto: '🚉', situacion: 'You are waiting for the train and there is a yellow line painted on the platform floor.', options: ['Wait behind the yellow line', 'Get close to the edge to see if it is coming', 'Sit down with your feet hanging over the edge'], correcta: 0 },
          { picto: '🧥', situacion: 'You are about to cross at night on a poorly lit street.', options: ['Cross in the best-lit spot and carefully', 'Cross through the darkest part because it is shorter', 'Cross running without looking'], correcta: 0 }
        ]
      },
      {
        id: 2,
        name: 'Level 2',
        descripcion: 'Less clear situations',
        estrellas: 2,
        items: [
          { picto: '🚦', situacion: 'The pedestrian light starts flashing green while you are crossing.', options: ['Finish crossing without running to the other side', 'Run back the way you came', 'Stand still in the middle of the street'], correcta: 0 },
          { picto: '🚗', situacion: 'A car is parked right on the crossing and blocks your view.', options: ['Peek out carefully before crossing, looking both ways', 'Cross quickly without looking because you are in a hurry', "Walk past the car's front without looking"], correcta: 0 },
          { picto: '🚏', situacion: 'The bus you were waiting for left early.', options: ['Wait calmly for the next one or check the timetable', 'Run down the street to try to catch it', 'Cross the road to stop it'], correcta: 0 },
          { picto: '🧑', situacion: 'Someone you do not know offers to drive you home because the weather is bad.', options: ['Say no thank you, and wait for someone you know', 'Get in because of the weather', 'Get in if they seem like a nice person'], correcta: 0 },
          { picto: '🏬', situacion: 'You get lost inside a very big shopping centre.', options: ['Go to the information desk or a shop and ask for help', 'Go outside to search on your own', 'Sit on the floor and wait without telling anyone'], correcta: 0 },
          { picto: '📱', situacion: 'You are lost and have your phone with you.', options: ['Call a family member or someone you trust and say where you are', 'Turn off the phone to save battery', 'Message strangers asking them to come get you'], correcta: 0 },
          { picto: '🚧', situacion: 'The pavement is blocked by roadworks.', options: ['Find another way or cross very carefully watching the traffic', 'Go into the fenced-off work area anyway', 'Walk on the road without watching for cars'], correcta: 0 },
          { picto: '🌙', situacion: 'It has become dark and you are still out of the house.', options: ['Tell someone you trust where you are and go back through known, lit streets', 'Go back through an unknown, dark shortcut', 'Stay out without telling anyone'], correcta: 0 },
          { picto: '🚌', situacion: 'You fell asleep on the bus and wake up not knowing where you are.', options: ['Ask the driver and get off at a safe stop', 'Jump off anywhere in a hurry', 'Stay quiet without asking for help'], correcta: 0 },
          { picto: '🌧️', situacion: 'It is raining hard and the street is slippery.', options: ['Walk slowly and carefully', 'Run to get there sooner', 'Run across between the cars'], correcta: 0 },
          { picto: '🧒', situacion: 'You see a small child alone and crying on the street.', options: ['Tell a police officer or look for help in a shop', 'Take the child yourself to look for their family', 'Keep walking as if nothing happened'], correcta: 0 },
          { picto: '📵', situacion: 'You are lost and your phone has no battery.', options: ['Go into a shop and ask them to call your family', 'Wander around until you find your house', 'Leave with a stranger who says they know your street'], correcta: 0 },
          { picto: '🚕', situacion: 'A neighbour you barely know insists on driving you home.', options: ['Say "no, thank you" and tell your family afterwards', 'Get in because you have seen them before', 'Get in so you do not seem rude'], correcta: 0 },
          { picto: '🚌', situacion: 'The bus is very full and the driver asks you to wait for the next one.', options: ['Wait calmly for the next bus', 'Insist on getting on by force', 'Get angry with the driver'], correcta: 0 },
          { picto: '🧑‍🦯', situacion: 'You see someone having trouble crossing alone.', options: ['Ask if they need help', 'Walk past without saying anything', 'Laugh at how they walk'], correcta: 0 },
          { picto: '📵', situacion: 'Your phone has broken and you need to let someone know you will be late.', options: ['Ask someone at a shop to use their phone to call your family', 'Tell no one and keep walking', 'Ask a random stranger on the street for their phone'], correcta: 0 },
          { picto: '🚦', situacion: "The traffic light for cars is green but you don't see any car stopped at the crossing.", options: ['Wait anyway until your light turns green', 'Cross even though your light is red', 'Cross running just in case'], correcta: 0 }
        ]
      }
    ]
  }
};
