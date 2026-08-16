/* ============================================================
   Datos: Situaciones (autonomía — ¿qué haces si...?).
   Formato: DATA.es / DATA.en, cada uno con:
   { porRonda, niveles: [{ id, nombre, descripcion, estrellas,
     items: [{ situacion, picto, opciones: string[3], correcta }] }] }
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
        descripcion: 'En casa',
        estrellas: 1,
        items: [
          { situacion: 'Se te ha caído la leche al suelo.', picto: '🥛', opciones: ['Lo limpio con un paño', 'Lo dejo así', 'Me enfado mucho'], correcta: 0 },
          { situacion: 'Tienes hambre.', picto: '😋', opciones: ['Como algo', 'Grito', 'Me voy a dormir'], correcta: 0 },
          { situacion: 'Tienes sed.', picto: '🥤', opciones: ['Bebo agua', 'Me enfado', 'Lloro'], correcta: 0 },
          { situacion: 'Se ha ensuciado tu camiseta.', picto: '👕', opciones: ['La pongo a lavar', 'La tiro', 'Me la dejo puesta sucia'], correcta: 0 },
          { situacion: 'Tienes sueño por la noche.', picto: '😴', opciones: ['Me voy a la cama', 'Sigo jugando', 'Grito'], correcta: 0 },
          { situacion: 'Se te ha roto un juguete.', picto: '🧸', opciones: ['Se lo digo a un adulto', 'Lo escondo', 'Rompo otro juguete'], correcta: 0 },
          { situacion: 'Hace frío fuera.', picto: '🥶', opciones: ['Me pongo un abrigo', 'Salgo en camiseta', 'No salgo nunca'], correcta: 0 },
          { situacion: 'Tienes las manos sucias antes de comer.', picto: '🤲', opciones: ['Me lavo las manos', 'Como con las manos sucias', 'Me las limpio en la ropa'], correcta: 0 },
          { situacion: 'Se ha acabado el papel higiénico.', picto: '🧻', opciones: ['Aviso a alguien de casa', 'No digo nada', 'Uso otra cosa'], correcta: 0 },
          { situacion: 'Tu habitación está desordenada.', picto: '🧸', opciones: ['La ordeno', 'La dejo así', 'Me enfado con mis cosas'], correcta: 0 },
          { situacion: 'Suena el despertador por la mañana.', picto: '⏰', opciones: ['Me levanto', 'Lo apago y sigo durmiendo todo el día', 'Lo tiro'], correcta: 0 },
          { situacion: 'Tienes que ir al baño.', picto: '🚽', opciones: ['Voy al baño', 'Aguanto mucho tiempo', 'Espero sin decir nada'], correcta: 0 },
          { situacion: 'Se ha hecho de noche y estás en casa.', picto: '🌙', opciones: ['Enciendo la luz', 'Me quedo a oscuras', 'Salgo a la calle'], correcta: 0 },
          { situacion: 'Tienes los zapatos desatados.', picto: '👟', opciones: ['Me los ato', 'Sigo caminando así', 'Los tiro'], correcta: 0 },
          { situacion: 'Es la hora de cenar.', picto: '🍽️', opciones: ['Voy a cenar', 'Sigo jugando y no ceno', 'Me enfado'], correcta: 0 },
          { situacion: 'Se ha caído tu vaso y se ha roto.', picto: '🥃', opciones: ['Lo recojo con cuidado y aviso a un adulto', 'Dejo los cristales en el suelo', 'Lo piso descalzo'], correcta: 0 },
          { situacion: 'Ves que la puerta de la calle está abierta.', picto: '🚪', opciones: ['Cierro la puerta', 'La dejo abierta', 'Salgo sin avisar'], correcta: 0 },
          { situacion: 'Tienes que ponerte el pijama antes de dormir.', picto: '🛌', opciones: ['Me pongo el pijama', 'Duermo vestido/a', 'No me cambio en toda la semana'], correcta: 0 },
          { situacion: 'Se ha acabado el jabón de manos.', picto: '🧼', opciones: ['Aviso a alguien de casa', 'No me lavo las manos', 'Uso el jabón de otra persona sin decir nada'], correcta: 0 },
          { situacion: 'Te has manchado la mesa al comer.', picto: '🍝', opciones: ['Limpio la mesa con una servilleta', 'Lo dejo manchado', 'Tapo la mancha con un plato'], correcta: 0 },
          { situacion: 'Suena el timbre de la puerta.', picto: '🔔', opciones: ['Aviso a un adulto de que ha sonado el timbre', 'Abro la puerta a quien sea', 'No hago caso al timbre'], correcta: 0 },
          { situacion: 'Se ha apagado la televisión de repente.', picto: '📺', opciones: ['Aviso a un adulto de casa', 'Le doy golpes a la tele', 'Me enfado y grito'], correcta: 0 },
          { situacion: 'Tienes que guardar la ropa limpia.', picto: '👚', opciones: ['Guardo la ropa en su sitio', 'La dejo tirada en el suelo', 'La escondo debajo de la cama'], correcta: 0 },
          { situacion: 'Te duele la tripa después de comer.', picto: '🤢', opciones: ['Se lo digo a un adulto', 'No digo nada y aguanto', 'Sigo comiendo más'], correcta: 0 },
          { situacion: 'Es hora de ducharte.', picto: '🚿', opciones: ['Me ducho', 'Sigo jugando y no me ducho', 'Me enfado porque toca ducha'], correcta: 0 }
        ]
      },
      {
        id: 2,
        nombre: 'Nivel 2',
        descripcion: 'Con otras personas',
        estrellas: 2,
        items: [
          { situacion: 'Un amigo te saluda.', picto: '👋', opciones: ['Le saludo también', 'No le miro', 'Me voy corriendo'], correcta: 0 },
          { situacion: 'Alguien te pide ayuda para llevar bolsas.', picto: '🛍️', opciones: ['Le ayudo', 'Me río de él', 'No le hago caso'], correcta: 0 },
          { situacion: 'Quieres jugar con otros niños.', picto: '⚽', opciones: ['Les pregunto si puedo jugar', 'Les quito el balón', 'Me voy sin decir nada'], correcta: 0 },
          { situacion: 'Un compañero está triste.', picto: '😢', opciones: ['Le pregunto qué le pasa', 'Me río de él', 'Le ignoro'], correcta: 0 },
          { situacion: 'Llegas tarde a una cita.', picto: '⏰', opciones: ['Aviso de que llegaré tarde', 'No digo nada', 'Falto sin avisar'], correcta: 0 },
          { situacion: 'Te han hecho un regalo.', picto: '🎁', opciones: ['Doy las gracias', 'No digo nada', 'Lo tiro'], correcta: 0 },
          { situacion: 'Alguien te interrumpe cuando hablas.', picto: '🗣️', opciones: ['Espero mi turno para hablar', 'Le grito', 'Me voy enfadado'], correcta: 0 },
          { situacion: 'Estás en la fila del autobús.', picto: '🚌', opciones: ['Espero mi turno', 'Me cuelo el primero', 'Empujo a los demás'], correcta: 0 },
          { situacion: 'Un amigo te presta un juguete.', picto: '🧸', opciones: ['Lo cuido y se lo devuelvo', 'Lo rompo', 'Me lo quedo para siempre'], correcta: 0 },
          { situacion: 'Quieres hablar y otra persona está hablando.', picto: '💬', opciones: ['Espero a que termine', 'La interrumpo', 'Grito más fuerte'], correcta: 0 },
          { situacion: 'Alguien te felicita por algo que has hecho.', picto: '👏', opciones: ['Sonrío y doy las gracias', 'No digo nada', 'Me pongo a llorar'], correcta: 0 },
          { situacion: 'Ves a alguien que se ha caído.', picto: '🤕', opciones: ['Le pregunto si está bien', 'Me río', 'Sigo caminando sin mirar'], correcta: 0 },
          { situacion: 'Estás en una tienda y quieres algo.', picto: '🏪', opciones: ['Se lo pido a un adulto', 'Lo cojo sin pagar', 'Grito hasta que me lo den'], correcta: 0 },
          { situacion: 'Un amigo no quiere compartir su merienda.', picto: '🍎', opciones: ['Lo respeto y no insisto', 'Se la quito', 'Me enfado mucho'], correcta: 0 },
          { situacion: 'Terminas de comer en casa de un amigo.', picto: '🍽️', opciones: ['Doy las gracias por la comida', 'Me voy sin decir nada', 'Dejo todo tirado'], correcta: 0 },
          { situacion: 'Un compañero te copia sin permiso en un examen.', picto: '📝', opciones: ['Le pido que no lo haga', 'Le dejo copiar todo', 'Le grito delante de todos'], correcta: 0 },
          { situacion: 'Estás en el comedor y se te cae la comida sin querer.', picto: '🍽️', opciones: ['Pido perdón y lo limpio', 'Me río y no digo nada', 'Le echo la culpa a otro'], correcta: 0 },
          { situacion: 'Alguien te pide prestado un lápiz.', picto: '✏️', opciones: ['Se lo dejo si puedo', 'Le digo que no sin motivo', 'Se lo tiro'], correcta: 0 },
          { situacion: 'Ves que dos amigos están discutiendo.', picto: '😡', opciones: ['Les ayudo a calmarse hablando', 'Me pongo a gritar también', 'Les animo a seguir discutiendo'], correcta: 0 },
          { situacion: 'Un adulto te está explicando algo importante.', picto: '🧑‍🏫', opciones: ['Le escucho con atención', 'Le interrumpo todo el rato', 'Me voy mientras habla'], correcta: 0 },
          { situacion: 'Llegas nuevo/a a un grupo de personas.', picto: '🙋', opciones: ['Me presento y saludo', 'Me quedo callado/a sin acercarme', 'Me voy sin decir nada'], correcta: 0 },
          { situacion: 'Alguien te da las gracias por ayudarle.', picto: '🙏', opciones: ["Sonrío y digo 'de nada'", 'No respondo', 'Me voy corriendo'], correcta: 0 },
          { situacion: 'Un amigo te cuenta un secreto.', picto: '🤫', opciones: ['Lo guardo y no lo cuento a otros', 'Se lo cuento a todo el mundo', 'Me burlo de él'], correcta: 0 },
          { situacion: 'Estás en un cumpleaños y reparten tarta.', picto: '🎂', opciones: ['Espero mi turno para que me den un trozo', 'Cojo el trozo más grande sin esperar', 'Me quejo si no me gusta el sabor'], correcta: 0 },
          { situacion: 'Ves que alguien deja caer algo sin darse cuenta.', picto: '🎒', opciones: ['Le aviso de que se le ha caído', 'No digo nada', 'Me quedo con lo que se le cayó'], correcta: 0 }
        ]
      },
      {
        id: 3,
        nombre: 'Nivel 3',
        descripcion: 'Cómo me siento',
        estrellas: 3,
        items: [
          { situacion: 'Te sientes muy enfadado.', picto: '😠', opciones: ['Respiro y me calmo', 'Grito y rompo cosas', 'Pego a alguien'], correcta: 0 },
          { situacion: 'Estás nervioso antes de un examen.', picto: '😰', opciones: ['Respiro despacio para calmarme', 'Dejo de estudiar del todo', 'Me enfado con todos'], correcta: 0 },
          { situacion: 'Alguien se burla de ti.', picto: '😞', opciones: ['Se lo cuento a una persona de confianza', 'Le pego', 'Me lo callo y sufro solo'], correcta: 0 },
          { situacion: 'Te sientes triste sin saber por qué.', picto: '😢', opciones: ['Hablo de cómo me siento', 'Me lo guardo todo', 'Grito a los demás'], correcta: 0 },
          { situacion: 'Has cometido un error.', picto: '😳', opciones: ['Pido perdón y lo arreglo', 'Echo la culpa a otro', 'Me enfado conmigo mismo'], correcta: 0 },
          { situacion: 'Tienes miedo de algo nuevo.', picto: '😨', opciones: ['Pido ayuda a alguien de confianza', 'Evito hacerlo siempre', 'Finjo que no tengo miedo'], correcta: 0 },
          { situacion: 'Estás muy emocionado y no puedes parar quieto.', picto: '🤩', opciones: ['Respiro y me tranquilizo poco a poco', 'Grito sin parar', 'Molesto a los demás'], correcta: 0 },
          { situacion: 'Un amigo está enfadado contigo.', picto: '😤', opciones: ['Le pregunto qué ha pasado', 'Me enfado también', 'Dejo de hablarle para siempre'], correcta: 0 },
          { situacion: 'Sientes envidia porque un amigo tiene algo que tú no.', picto: '😒', opciones: ['Me alegro por él y sigo a lo mío', 'Se lo quito', 'Le digo cosas feas'], correcta: 0 },
          { situacion: 'Te sientes solo.', picto: '🥺', opciones: ['Busco a alguien con quien hablar', 'Me escondo siempre', 'Me enfado con todos'], correcta: 0 },
          { situacion: 'Alguien te da una mala noticia.', picto: '😔', opciones: ['Hablo de lo que siento', 'Lo escondo todo dentro', 'Grito a quien me lo dice'], correcta: 0 },
          { situacion: 'Te sientes muy orgulloso de algo que has hecho.', picto: '🥰', opciones: ['Lo comparto con alguien', 'No se lo cuento a nadie', 'Presumo delante de todos sin parar'], correcta: 0 },
          { situacion: 'Estás frustrado porque algo no te sale bien.', picto: '😣', opciones: ['Descanso un momento y lo vuelvo a intentar', 'Lo rompo todo', 'Dejo de intentarlo para siempre'], correcta: 0 },
          { situacion: 'Ves que un amigo está llorando.', picto: '😭', opciones: ['Le pregunto si necesita ayuda', 'Me río', 'Le dejo solo sin más'], correcta: 0 },
          { situacion: 'Te sientes muy contento por algo bueno que ha pasado.', picto: '😄', opciones: ['Lo disfruto y lo comparto', 'Lo escondo', 'Me pongo triste igualmente'], correcta: 0 },
          { situacion: 'Te sientes aburrido/a y no sabes qué hacer.', picto: '🥱', opciones: ['Busco algo tranquilo que me guste hacer', 'Molesto a los demás', 'Me quejo sin parar'], correcta: 0 },
          { situacion: 'Sientes vergüenza porque te has equivocado delante de otros.', picto: '😳', opciones: ['Me digo que equivocarse es normal', 'Evito volver a intentarlo nunca más', 'Me enfado con quien me ha visto'], correcta: 0 },
          { situacion: 'Estás cansado/a después de un día largo.', picto: '😩', opciones: ['Descanso un rato', 'Sigo esforzándome sin parar', 'Me enfado con todos por estar cansado/a'], correcta: 0 },
          { situacion: 'Te sientes impaciente esperando tu turno.', picto: '⏳', opciones: ['Respiro y espero mi turno', 'Me cuelo delante de los demás', 'Grito para que me atiendan antes'], correcta: 0 },
          { situacion: 'Alguien te compara con otra persona y no te gusta.', picto: '😕', opciones: ['Digo cómo me hace sentir con calma', 'Me lo callo y me siento mal por dentro', 'Insulto a esa persona'], correcta: 0 },
          { situacion: 'Sientes curiosidad por algo nuevo pero también un poco de miedo.', picto: '🧐', opciones: ['Pruebo poco a poco con calma', 'Lo evito siempre por miedo', 'Me obligo a hacerlo de golpe sin pensar'], correcta: 0 },
          { situacion: 'Te sientes agobiado/a porque tienes muchas cosas que hacer.', picto: '😵', opciones: ['Hago una cosa cada vez, con calma', 'Dejo todo sin terminar', 'Me enfado y lo tiro todo'], correcta: 0 },
          { situacion: 'Alguien no cumple lo que te había prometido.', picto: '🤨', opciones: ['Le digo cómo me siento con calma', 'Dejo de confiar en todo el mundo para siempre', 'Le grito delante de otros'], correcta: 0 },
          { situacion: 'Te sientes agradecido/a por algo que alguien ha hecho por ti.', picto: '🥹', opciones: ['Le doy las gracias', 'No digo nada', 'Actúo como si no hubiera pasado nada'], correcta: 0 },
          { situacion: 'Sientes que necesitas un momento a solas.', picto: '🧘', opciones: ['Pido un momento tranquilo para mí', 'Me quedo aunque lo estoy pasando mal', 'Me enfado con quien está cerca'], correcta: 0 }
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
        descripcion: 'At home',
        estrellas: 1,
        items: [
          { situacion: 'You spilled milk on the floor.', picto: '🥛', opciones: ['I clean it up with a cloth', 'I leave it there', 'I get very angry'], correcta: 0 },
          { situacion: 'You are hungry.', picto: '😋', opciones: ['I eat something', 'I shout', 'I go to sleep'], correcta: 0 },
          { situacion: 'You are thirsty.', picto: '🥤', opciones: ['I drink water', 'I get angry', 'I cry'], correcta: 0 },
          { situacion: 'Your t-shirt got dirty.', picto: '👕', opciones: ['I put it in the wash', 'I throw it away', 'I keep wearing it dirty'], correcta: 0 },
          { situacion: 'You feel sleepy at night.', picto: '😴', opciones: ['I go to bed', 'I keep playing', 'I shout'], correcta: 0 },
          { situacion: 'One of your toys has broken.', picto: '🧸', opciones: ['I tell an adult', 'I hide it', 'I break another toy'], correcta: 0 },
          { situacion: 'It is cold outside.', picto: '🥶', opciones: ['I put on a coat', 'I go out in a t-shirt', 'I never go outside'], correcta: 0 },
          { situacion: 'Your hands are dirty before a meal.', picto: '🤲', opciones: ['I wash my hands', 'I eat with dirty hands', 'I wipe them on my clothes'], correcta: 0 },
          { situacion: 'The toilet paper has run out.', picto: '🧻', opciones: ['I tell someone at home', 'I say nothing', 'I use something else'], correcta: 0 },
          { situacion: 'Your room is messy.', picto: '🧸', opciones: ['I tidy it up', 'I leave it messy', 'I get angry at my things'], correcta: 0 },
          { situacion: 'The alarm clock rings in the morning.', picto: '⏰', opciones: ['I get up', 'I turn it off and sleep all day', 'I throw it away'], correcta: 0 },
          { situacion: 'You need to use the bathroom.', picto: '🚽', opciones: ['I go to the bathroom', 'I hold it in for a long time', 'I wait without saying anything'], correcta: 0 },
          { situacion: 'It has become night and you are at home.', picto: '🌙', opciones: ['I turn on the light', 'I stay in the dark', 'I go outside'], correcta: 0 },
          { situacion: 'Your shoelaces are untied.', picto: '👟', opciones: ['I tie them', 'I keep walking like that', 'I throw them away'], correcta: 0 },
          { situacion: 'It is time for dinner.', picto: '🍽️', opciones: ['I go and have dinner', 'I keep playing and skip dinner', 'I get angry'], correcta: 0 },
          { situacion: 'Your glass fell and broke.', picto: '🥃', opciones: ['I pick it up carefully and tell an adult', 'I leave the broken glass on the floor', 'I walk on it barefoot'], correcta: 0 },
          { situacion: 'You see the front door is open.', picto: '🚪', opciones: ['I close the door', 'I leave it open', 'I go outside without telling anyone'], correcta: 0 },
          { situacion: 'You need to put your pyjamas on before bed.', picto: '🛌', opciones: ['I put my pyjamas on', 'I sleep in my clothes', 'I do not change all week'], correcta: 0 },
          { situacion: 'The hand soap has run out.', picto: '🧼', opciones: ['I tell someone at home', 'I do not wash my hands', "I use someone else's soap without asking"], correcta: 0 },
          { situacion: 'You spilled food on the table while eating.', picto: '🍝', opciones: ['I say sorry and clean it up', 'I laugh and say nothing', 'I blame someone else'], correcta: 0 },
          { situacion: 'The doorbell rings.', picto: '🔔', opciones: ['I tell an adult the doorbell rang', 'I open the door to anyone', 'I ignore the doorbell'], correcta: 0 },
          { situacion: 'The TV suddenly turns off.', picto: '📺', opciones: ['I tell an adult at home', 'I hit the TV', 'I get angry and shout'], correcta: 0 },
          { situacion: 'You need to put away your clean clothes.', picto: '👚', opciones: ['I put my clothes away', 'I leave them on the floor', 'I hide them under the bed'], correcta: 0 },
          { situacion: 'Your stomach hurts after eating.', picto: '🤢', opciones: ['I tell an adult', 'I say nothing and put up with it', 'I keep eating more'], correcta: 0 },
          { situacion: 'It is shower time.', picto: '🚿', opciones: ['I take a shower', 'I keep playing and skip the shower', "I get angry because it's shower time"], correcta: 0 }
        ]
      },
      {
        id: 2,
        nombre: 'Level 2',
        descripcion: 'With other people',
        estrellas: 2,
        items: [
          { situacion: 'A friend waves hello to you.', picto: '👋', opciones: ['I wave back', 'I do not look at them', 'I run away'], correcta: 0 },
          { situacion: 'Someone asks you for help carrying bags.', picto: '🛍️', opciones: ['I help them', 'I laugh at them', 'I ignore them'], correcta: 0 },
          { situacion: 'You want to play with other kids.', picto: '⚽', opciones: ['I ask if I can join in', 'I take their ball away', 'I leave without saying anything'], correcta: 0 },
          { situacion: 'A classmate looks sad.', picto: '😢', opciones: ['I ask what is wrong', 'I laugh at them', 'I ignore them'], correcta: 0 },
          { situacion: 'You are running late for an appointment.', picto: '⏰', opciones: ['I let them know I will be late', 'I say nothing', 'I do not show up and do not tell anyone'], correcta: 0 },
          { situacion: 'Someone gives you a gift.', picto: '🎁', opciones: ['I say thank you', 'I say nothing', 'I throw it away'], correcta: 0 },
          { situacion: 'Someone interrupts you while you are talking.', picto: '🗣️', opciones: ['I wait for my turn to speak', 'I shout at them', 'I storm off angry'], correcta: 0 },
          { situacion: 'You are in line for the bus.', picto: '🚌', opciones: ['I wait my turn', 'I push to the front', 'I push other people'], correcta: 0 },
          { situacion: 'A friend lends you a toy.', picto: '🧸', opciones: ['I take care of it and give it back', 'I break it', 'I keep it forever'], correcta: 0 },
          { situacion: 'You want to speak, but someone else is talking.', picto: '💬', opciones: ['I wait until they finish', 'I interrupt them', 'I shout louder'], correcta: 0 },
          { situacion: 'Someone congratulates you for something you did.', picto: '👏', opciones: ['I smile and say thank you', 'I say nothing', 'I start crying'], correcta: 0 },
          { situacion: 'You see someone who has fallen down.', picto: '🤕', opciones: ['I ask if they are okay', 'I laugh', 'I keep walking without looking'], correcta: 0 },
          { situacion: 'You are in a shop and want something.', picto: '🏪', opciones: ['I ask an adult for it', 'I take it without paying', 'I shout until they give it to me'], correcta: 0 },
          { situacion: 'A friend does not want to share their snack.', picto: '🍎', opciones: ['I respect that and do not insist', 'I take it from them', 'I get very angry'], correcta: 0 },
          { situacion: "You finish eating at a friend's house.", picto: '🍽️', opciones: ['I say thank you for the meal', 'I leave without saying anything', 'I leave a mess behind'], correcta: 0 },
          { situacion: 'A classmate copies your answers without asking.', picto: '📝', opciones: ['I ask them to stop', 'I let them copy everything', 'I shout at them in front of everyone'], correcta: 0 },
          { situacion: 'You are at the table and accidentally drop your food.', picto: '🍽️', opciones: ['I say sorry and clean it up', 'I laugh and say nothing', 'I blame someone else'], correcta: 0 },
          { situacion: 'Someone asks to borrow your pencil.', picto: '✏️', opciones: ['I lend it if I can', 'I say no for no reason', 'I throw it at them'], correcta: 0 },
          { situacion: 'You see two friends arguing.', picto: '😡', opciones: ['I help them calm down by talking', 'I start shouting too', 'I encourage them to keep arguing'], correcta: 0 },
          { situacion: 'An adult is explaining something important.', picto: '🧑‍🏫', opciones: ['I listen carefully', 'I keep interrupting', 'I walk away while they talk'], correcta: 0 },
          { situacion: 'You join a new group of people.', picto: '🙋', opciones: ['I introduce myself and say hello', 'I stay quiet and do not approach', 'I leave without saying anything'], correcta: 0 },
          { situacion: 'Someone thanks you for helping them.', picto: '🙏', opciones: ["I smile and say 'you're welcome'", 'I do not answer', 'I run away'], correcta: 0 },
          { situacion: 'A friend tells you a secret.', picto: '🤫', opciones: ['I keep it and do not tell others', 'I tell everyone', 'I make fun of them'], correcta: 0 },
          { situacion: 'You are at a birthday party and cake is being handed out.', picto: '🎂', opciones: ['I wait my turn to get a slice', 'I take the biggest slice without waiting', 'I complain if I do not like the flavour'], correcta: 0 },
          { situacion: 'You see someone drop something without noticing.', picto: '🎒', opciones: ['I let them know they dropped it', 'I say nothing', 'I keep what they dropped'], correcta: 0 }
        ]
      },
      {
        id: 3,
        nombre: 'Level 3',
        descripcion: 'How I feel',
        estrellas: 3,
        items: [
          { situacion: 'You feel very angry.', picto: '😠', opciones: ['I breathe and calm down', 'I shout and break things', 'I hit someone'], correcta: 0 },
          { situacion: 'You feel nervous before a test.', picto: '😰', opciones: ['I breathe slowly to calm down', 'I stop studying completely', 'I get angry at everyone'], correcta: 0 },
          { situacion: 'Someone makes fun of you.', picto: '😞', opciones: ['I tell someone I trust', 'I hit them', 'I keep it to myself and suffer alone'], correcta: 0 },
          { situacion: 'You feel sad without knowing why.', picto: '😢', opciones: ['I talk about how I feel', 'I keep it all inside', 'I shout at other people'], correcta: 0 },
          { situacion: 'You have made a mistake.', picto: '😳', opciones: ['I say sorry and fix it', 'I blame someone else', 'I get angry at myself'], correcta: 0 },
          { situacion: 'You are afraid of something new.', picto: '😨', opciones: ['I ask someone I trust for help', 'I always avoid doing it', 'I pretend I am not afraid'], correcta: 0 },
          { situacion: 'You are very excited and cannot sit still.', picto: '🤩', opciones: ['I breathe and calm down little by little', 'I keep shouting', 'I bother other people'], correcta: 0 },
          { situacion: 'A friend is angry with you.', picto: '😤', opciones: ['I ask what happened', 'I get angry too', 'I stop talking to them forever'], correcta: 0 },
          { situacion: 'You feel jealous because a friend has something you do not.', picto: '😒', opciones: ['I am happy for them and carry on with my own things', 'I take it from them', 'I say unkind things to them'], correcta: 0 },
          { situacion: 'You feel lonely.', picto: '🥺', opciones: ['I look for someone to talk to', 'I always hide away', 'I get angry at everyone'], correcta: 0 },
          { situacion: 'Someone gives you bad news.', picto: '😔', opciones: ['I talk about how I feel', 'I keep it all bottled up', 'I shout at the person who told me'], correcta: 0 },
          { situacion: 'You feel very proud of something you did.', picto: '🥰', opciones: ['I share it with someone', 'I do not tell anyone', 'I keep bragging to everyone'], correcta: 0 },
          { situacion: 'You feel frustrated because something is not going well.', picto: '😣', opciones: ['I rest for a moment and try again', 'I break everything', 'I give up trying forever'], correcta: 0 },
          { situacion: 'You see a friend crying.', picto: '😭', opciones: ['I ask if they need help', 'I laugh', 'I just leave them alone'], correcta: 0 },
          { situacion: 'You feel very happy because something good happened.', picto: '😄', opciones: ['I enjoy it and share it', 'I hide it', 'I feel sad anyway'], correcta: 0 },
          { situacion: 'You feel bored and do not know what to do.', picto: '🥱', opciones: ['I look for something calm I enjoy', 'I bother other people', 'I keep complaining'], correcta: 0 },
          { situacion: 'You feel embarrassed because you made a mistake in front of others.', picto: '😳', opciones: ['I remind myself mistakes are normal', 'I avoid ever trying again', 'I get angry at whoever saw me'], correcta: 0 },
          { situacion: 'You feel tired after a long day.', picto: '😩', opciones: ['I rest for a while', 'I keep pushing myself without stopping', 'I get angry at everyone for being tired'], correcta: 0 },
          { situacion: 'You feel impatient waiting for your turn.', picto: '⏳', opciones: ['I breathe and wait my turn', 'I cut in front of others', 'I shout to be served first'], correcta: 0 },
          { situacion: 'Someone compares you to another person and you do not like it.', picto: '😕', opciones: ['I calmly say how it makes me feel', 'I keep it to myself and feel bad inside', 'I insult that person'], correcta: 0 },
          { situacion: 'You feel curious about something new but also a little scared.', picto: '🧐', opciones: ['I try it slowly and calmly', 'I always avoid it out of fear', 'I force myself to do it all at once without thinking'], correcta: 0 },
          { situacion: 'You feel overwhelmed because you have many things to do.', picto: '😵', opciones: ['I do one thing at a time, calmly', 'I leave everything unfinished', 'I get angry and throw everything away'], correcta: 0 },
          { situacion: 'Someone does not keep a promise they made to you.', picto: '🤨', opciones: ['I calmly tell them how I feel', 'I stop trusting everyone forever', 'I shout at them in front of others'], correcta: 0 },
          { situacion: 'You feel grateful for something someone did for you.', picto: '🥹', opciones: ['I say thank you', 'I say nothing', 'I act like nothing happened'], correcta: 0 },
          { situacion: 'You feel like you need a moment alone.', picto: '🧘', opciones: ['I ask for a quiet moment for myself', 'I stay even though I am struggling', 'I get angry at whoever is nearby'], correcta: 0 }
        ]
      }
    ]
  }
};
