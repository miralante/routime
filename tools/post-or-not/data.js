/* ============================================================
   Datos: ¿Lo publico? (autonomía — peligros de las redes sociales).
   Formato: DATA.es / DATA.en, cada uno con:
   { porRonda, niveles: [{ id, nombre, descripcion, estrellas,
     items: [{ picto, situacion, opciones: string[3], correcta }] }] }
   Cada situación es una decisión de redes sociales (publicar algo,
   responder a un desconocido, aceptar un reto…); la opción correcta
   es siempre la más segura, nunca la más rápida o divertida.
   Progresión (regla 13, un solo cambio por nivel): nivel 1 usa
   casos claros de datos personales (dirección, colegio, contraseña,
   teléfono) donde la respuesta seguro es obvia; nivel 2 mantiene el
   mismo formato de 3 opciones y pasa a casos más sutiles (perfiles
   falsos, retos virales, bulos, estafas, ajustes de privacidad) que
   requieren fijarse un poco más.
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
        descripcion: 'Casos claros',
        estrellas: 1,
        items: [
          { picto: '🏠', situacion: 'Vas a publicar una foto en la puerta de tu casa. Se ve el número de la calle.', opciones: ['No publico el número de la calle', 'Publico la foto tal cual', 'Publico también el nombre de la calle'], correcta: 0 },
          { picto: '🏫', situacion: 'Vas a publicar una foto con el uniforme de tu colegio. Se ve el nombre del colegio.', opciones: ['Tapo el nombre del colegio o no la publico', 'Publico la foto tal cual', 'Escribo también el nombre del colegio'], correcta: 0 },
          { picto: '🔑', situacion: 'Una persona de internet te pide tu contraseña para "ayudarte con un juego".', opciones: ['No le doy mi contraseña', 'Le doy mi contraseña', 'Le doy mi contraseña solo esta vez'], correcta: 0 },
          { picto: '📍', situacion: 'Estás de vacaciones. Quieres publicar ahora mismo dónde estás en este momento.', opciones: ['Espero a volver a casa para publicarlo', 'Publico el sitio exacto ahora mismo', 'Publico el nombre del hotel'], correcta: 0 },
          { picto: '🙋', situacion: 'Alguien que no conoces de nada te pide quedar en persona.', opciones: ['Digo que no y se lo cuento a una persona de confianza', 'Quedo con esa persona', 'Quedo pero no se lo digo a nadie'], correcta: 0 },
          { picto: '☎️', situacion: 'Un desconocido de internet te pide tu número de teléfono para seguir hablando.', opciones: ['No le doy mi teléfono', 'Le doy mi teléfono', 'Le doy el teléfono de un familiar'], correcta: 0 },
          { picto: '📸', situacion: 'Quieres publicar una foto de un amigo. Todavía no se lo has preguntado.', opciones: ['Se lo pregunto antes de publicarla', 'La publico sin preguntar', 'La publico y luego se lo cuento'], correcta: 0 },
          { picto: '🎁', situacion: 'Un mensaje dice: "Has ganado un premio. Manda tus datos para recibirlo".', opciones: ['No mando mis datos, es un engaño', 'Mando mis datos rápido', 'Mando solo mi nombre'], correcta: 0 },
          { picto: '📹', situacion: 'Una persona que no conoces te pide hacer una videollamada.', opciones: ['No acepto y se lo cuento a una persona de confianza', 'Acepto la videollamada', 'Acepto pero apago la cámara'], correcta: 0 },
          { picto: '🔒', situacion: 'Tienes que decidir la contraseña de tu cuenta de un juego online.', opciones: ['La guardo solo para mí', 'Se la digo a todos mis amigos', 'La escribo en mi perfil público'], correcta: 0 },
          { picto: '🪪', situacion: 'Un formulario de un juego gratis te pide una foto de tu DNI.', opciones: ['No la mando y aviso a una persona de confianza', 'Mando la foto del DNI', 'Mando solo la parte de delante'], correcta: 0 },
          { picto: '🤳', situacion: 'Quieres publicar una foto tuya en bañador en la piscina.', opciones: ['No la publico: es demasiado privada', 'La publico, es verano', 'La mando solo a un desconocido que me la pide'], correcta: 0 },
          { picto: '🎂', situacion: 'Una web te pide tu fecha de nacimiento completa y tu dirección para "felicitarte".', opciones: ['No relleno esos datos', 'Los escribo todos', 'Escribo solo la dirección'], correcta: 0 },
          { picto: '💵', situacion: 'Te han regalado dinero o algo caro y quieres publicar una foto enseñándolo a todo el mundo.', opciones: ['No lo enseño a todo el mundo, solo a quien conozco de verdad', 'Publico la foto para que la vea todo el mundo', 'Publico la foto y digo cuánto cuesta'], correcta: 0 },
          { picto: '🚌', situacion: 'Vas a publicar una foto de tu carné de transporte con tu nombre completo bien visible.', opciones: ['Tapo mi nombre o no publico esa parte', 'Publico la foto tal cual', 'Publico también mi fecha de nacimiento'], correcta: 0 },
          { picto: '📧', situacion: 'Un mensaje pide que confirmes tu contraseña de correo pinchando en un enlace.', opciones: ['No pincho el enlace ni doy mi contraseña', 'Pincho el enlace para ver qué es', 'Doy la contraseña por si es verdad'], correcta: 0 },
          { picto: '🧑‍🤝‍🧑', situacion: 'Un desconocido de internet te pide el nombre de tus amigos y familiares.', opciones: ['No le doy esos nombres', 'Le doy los nombres que pide', 'Le doy solo el nombre de mi familia'], correcta: 0 },
          { picto: '🗓️', situacion: 'Quieres publicar que vas a estar fuera de casa toda la semana de vacaciones.', opciones: ['Espero a volver para publicarlo', 'Lo publico ahora para que todos lo sepan', 'Publico las fechas exactas'], correcta: 0 }
        ]
      },
      {
        id: 2,
        nombre: 'Nivel 2',
        descripcion: 'Hay que fijarse bien',
        estrellas: 2,
        items: [
          { picto: '🌊', situacion: 'Ves un reto viral muy popular. Parece peligroso para tu cuerpo.', opciones: ['No hago el reto y se lo cuento a una persona de confianza', 'Hago el reto porque lo hace mucha gente', 'Hago una parte del reto'], correcta: 0 },
          { picto: '📰', situacion: 'Te llega un mensaje que dice algo muy alarmante. Mucha gente lo está reenviando.', opciones: ['Lo compruebo con una persona de confianza antes de reenviarlo', 'Lo reenvío enseguida a todos mis contactos', 'Lo reenvío pero le añado "no sé si es verdad"'], correcta: 0 },
          { picto: '👤', situacion: 'Un perfil nuevo con pocas fotos dice tener tu edad y quiere ser tu amigo o amiga.', opciones: ['Pregunto a una persona de confianza antes de aceptar', 'Acepto porque parece simpático o simpática', 'Acepto y le cuento cosas de mi vida'], correcta: 0 },
          { picto: '💬', situacion: 'Ves un comentario muy cruel debajo de una foto tuya.', opciones: ['Se lo cuento a una persona de confianza', 'Respondo con otro comentario cruel', 'Borro la foto y no digo nada a nadie'], correcta: 0 },
          { picto: '⭐', situacion: 'Un mensaje dice: "Consigue seguidores gratis. Solo tienes que dar tu contraseña".', opciones: ['No doy mi contraseña, es un engaño', 'Doy mi contraseña para tener más seguidores', 'Doy mi contraseña solo un momento'], correcta: 0 },
          { picto: '💰', situacion: 'Un vídeo dice que vas a ganar dinero fácil si lo compartes con todos tus contactos.', opciones: ['No lo comparto y lo compruebo antes', 'Lo comparto con todos por si acaso', 'Lo comparto solo con mi familia'], correcta: 0 },
          { picto: '😟', situacion: 'Un amigo ha publicado una foto tuya sin preguntarte. No te gusta nada.', opciones: ['Se lo digo y le pido que la borre', 'No digo nada para no molestar', 'Publico una foto suya para vengarme'], correcta: 0 },
          { picto: '🔐', situacion: 'Estás configurando tu cuenta nueva. Puedes dejarla privada o pública para cualquiera.', opciones: ['La dejo privada y pregunto a una persona de confianza', 'La dejo pública para tener más amigos', 'La dejo pública solo por unos días'], correcta: 0 },
          { picto: '💳', situacion: 'Un amigo de internet te pide que le mandes dinero o un código de una tarjeta regalo.', opciones: ['No se lo mando y se lo cuento a una persona de confianza', 'Se lo mando porque dice que es urgente', 'Le mando solo una parte'], correcta: 0 },
          { picto: '📢', situacion: 'Ves que mucha gente comparte una noticia muy sorprendente. No dice de dónde sale.', opciones: ['La compruebo antes de compartirla', 'La comparto porque la comparte mucha gente', 'La comparto con el título tal cual'], correcta: 0 },
          { picto: '🕵️', situacion: 'Alguien de internet dice ser famoso y te pide que guardes el secreto de que habláis.', opciones: ['No guardo el secreto: se lo cuento a una persona de confianza', 'Guardo el secreto porque es famoso', 'Se lo cuento solo a un amigo'], correcta: 0 },
          { picto: '📲', situacion: 'Un mensaje te pide instalar una aplicación desde un enlace raro para "ganar premios".', opciones: ['No la instalo y pregunto a una persona de confianza', 'La instalo rápido antes de que se acabe', 'La instalo y luego la borro'], correcta: 0 },
          { picto: '😜', situacion: 'Tienes una foto muy graciosa de un compañero haciendo el tonto. Se ríe todo el mundo.', opciones: ['No la publico sin su permiso', 'La publico porque es graciosa', 'La mando a un grupo grande'], correcta: 0 },
          { picto: '🧾', situacion: 'Una tienda online que no conoces pide pagar solo por transferencia y tiene precios rarísimos de baratos.', opciones: ['No compro y lo consulto con una persona de confianza', 'Compro rápido que se acaba', 'Pago la mitad para probar'], correcta: 0 },
          { picto: '🎮', situacion: 'En un juego online, alguien te ofrece objetos gratis si le das acceso a tu cuenta.', opciones: ['No le doy acceso a mi cuenta', 'Le doy acceso para conseguir los objetos', 'Le doy acceso solo un momento'], correcta: 0 },
          { picto: '🧑‍💻', situacion: 'Un perfil que dice ser de una empresa te escribe que has sido "seleccionado/a" para un trabajo fácil y bien pagado.', opciones: ['Lo compruebo con una persona de confianza antes de responder', 'Respondo enseguida dando mis datos', 'Acepto porque suena muy bien'], correcta: 0 },
          { picto: '🖼️', situacion: 'Alguien te pide que le mandes una foto de tu documento de identidad para "verificar tu edad" en una web.', opciones: ['No la mando y pregunto a una persona de confianza si es de fiar', 'La mando para poder entrar', 'Mando solo una parte del documento'], correcta: 0 },
          { picto: '🔁', situacion: 'Ves que un perfil parecido al de un amigo te vuelve a pedir amistad, aunque ya erais amigos.', opciones: ['Lo compruebo con mi amigo antes de aceptar', 'Acepto porque ya éramos amigos', 'Acepto y le cuento las novedades'], correcta: 0 }
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
        descripcion: 'Clear cases',
        estrellas: 1,
        items: [
          { picto: '🏠', situacion: 'You are going to post a photo at your front door. Your house number is visible.', opciones: ['I do not post the house number', 'I post the photo as it is', 'I also post the street name'], correcta: 0 },
          { picto: '🏫', situacion: 'You are going to post a photo in your school uniform. The school name is visible.', opciones: ['I cover the school name or do not post it', 'I post the photo as it is', 'I also write the school name'], correcta: 0 },
          { picto: '🔑', situacion: 'Someone online asks for your password to "help you with a game".', opciones: ['I do not give my password', 'I give my password', 'I give my password just this once'], correcta: 0 },
          { picto: '📍', situacion: 'You are on holiday. You want to post right now exactly where you are.', opciones: ['I wait until I am home to post it', 'I post the exact place right now', 'I post the hotel name'], correcta: 0 },
          { picto: '🙋', situacion: 'Someone you do not know at all asks to meet you in person.', opciones: ['I say no and tell a trusted person', 'I meet that person', 'I meet them but tell no one'], correcta: 0 },
          { picto: '☎️', situacion: 'A stranger online asks for your phone number to keep talking.', opciones: ['I do not give my phone number', 'I give my phone number', "I give a family member's phone number"], correcta: 0 },
          { picto: '📸', situacion: 'You want to post a photo of a friend. You have not asked them yet.', opciones: ['I ask them before posting it', 'I post it without asking', 'I post it and tell them afterwards'], correcta: 0 },
          { picto: '🎁', situacion: 'A message says: "You have won a prize. Send your details to get it".', opciones: ['I do not send my details, it is a trick', 'I send my details quickly', 'I send just my name'], correcta: 0 },
          { picto: '📹', situacion: 'Someone you do not know asks you for a video call.', opciones: ['I do not accept and tell a trusted person', 'I accept the video call', 'I accept but turn off the camera'], correcta: 0 },
          { picto: '🔒', situacion: 'You need to choose a password for your online game account.', opciones: ['I keep it only for myself', 'I tell it to all my friends', 'I write it on my public profile'], correcta: 0 },
          { picto: '🪪', situacion: 'A free game form asks for a photo of your ID card.', opciones: ['I do not send it and tell a trusted person', 'I send the ID photo', 'I send just the front side'], correcta: 0 },
          { picto: '🤳', situacion: 'You want to post a photo of yourself in a swimsuit at the pool.', opciones: ['I do not post it: it is too private', 'I post it, it is summer', 'I send it only to a stranger who asks for it'], correcta: 0 },
          { picto: '🎂', situacion: 'A website asks for your full birth date and your address to "wish you happy birthday".', opciones: ['I do not fill in those details', 'I write them all', 'I write just the address'], correcta: 0 },
          { picto: '💵', situacion: 'You were given money or something expensive as a gift and want to post a photo showing it to everyone.', opciones: ['I do not show it to everyone, only people I really know', 'I post the photo so everyone can see it', 'I post the photo and say how much it costs'], correcta: 0 },
          { picto: '🚌', situacion: 'You are going to post a photo of your transport pass with your full name clearly visible.', opciones: ['I cover my name or do not post that part', 'I post the photo as it is', 'I also post my date of birth'], correcta: 0 },
          { picto: '📧', situacion: 'A message asks you to confirm your email password by clicking a link.', opciones: ['I do not click the link or give my password', 'I click the link to see what it is', 'I give the password in case it is real'], correcta: 0 },
          { picto: '🧑‍🤝‍🧑', situacion: 'A stranger online asks for the names of your friends and family.', opciones: ['I do not give those names', 'I give the names they ask for', "I give just my family's name"], correcta: 0 },
          { picto: '🗓️', situacion: 'You want to post that you will be away from home all week on holiday.', opciones: ['I wait until I am back to post it', 'I post it now so everyone knows', 'I post the exact dates'], correcta: 0 }
        ]
      },
      {
        id: 2,
        nombre: 'Level 2',
        descripcion: 'Look more closely',
        estrellas: 2,
        items: [
          { picto: '🌊', situacion: 'You see a very popular challenge online. It looks dangerous for your body.', opciones: ['I do not do it and tell a trusted person', 'I do it because many people do it', 'I do part of the challenge'], correcta: 0 },
          { picto: '📰', situacion: 'You get a message with something very alarming. Many people are forwarding it.', opciones: ['I check it with a trusted person before forwarding it', 'I forward it straight away to everyone', 'I forward it but add "not sure if true"'], correcta: 0 },
          { picto: '👤', situacion: 'A new profile with few photos says they are your age and wants to be your friend.', opciones: ['I ask a trusted person before accepting', 'I accept because they seem nice', 'I accept and tell them about my life'], correcta: 0 },
          { picto: '💬', situacion: 'You see a very cruel comment under a photo of you.', opciones: ['I tell a trusted person', 'I reply with another cruel comment', 'I delete the photo and tell no one'], correcta: 0 },
          { picto: '⭐', situacion: 'A message says: "Get free followers. Just give your password".', opciones: ['I do not give my password, it is a trick', 'I give my password to get more followers', 'I give my password just for a moment'], correcta: 0 },
          { picto: '💰', situacion: 'A video says you will earn easy money if you share it with all your contacts.', opciones: ['I do not share it and check it first', 'I share it with everyone just in case', 'I share it only with my family'], correcta: 0 },
          { picto: '😟', situacion: 'A friend has posted a photo of you without asking. You do not like it at all.', opciones: ['I tell them and ask them to delete it', 'I say nothing so I do not bother them', 'I post a photo of them to get back at them'], correcta: 0 },
          { picto: '🔐', situacion: 'You are setting up your new account. You can make it private or public for everyone.', opciones: ['I keep it private and ask a trusted person', 'I make it public to get more friends', 'I make it public for just a few days'], correcta: 0 },
          { picto: '💳', situacion: 'An online friend asks you to send money or a gift card code.', opciones: ['I do not send it and tell a trusted person', 'I send it because they say it is urgent', 'I send just part of it'], correcta: 0 },
          { picto: '📢', situacion: 'You see many people sharing a very surprising story. It does not say where it comes from.', opciones: ['I check it before sharing it', 'I share it because many people are sharing it', 'I share it with the title as it is'], correcta: 0 },
          { picto: '🕵️', situacion: 'Someone online says they are famous and asks you to keep your chats a secret.', opciones: ['I do not keep the secret: I tell a trusted person', 'I keep the secret because they are famous', 'I tell just one friend'], correcta: 0 },
          { picto: '📲', situacion: 'A message asks you to install an app from a strange link to "win prizes".', opciones: ['I do not install it and ask a trusted person', 'I install it quickly before it ends', 'I install it and delete it later'], correcta: 0 },
          { picto: '😜', situacion: 'You have a very funny photo of a classmate goofing around. Everyone laughs.', opciones: ['I do not post it without their permission', 'I post it because it is funny', 'I send it to a big group'], correcta: 0 },
          { picto: '🧾', situacion: 'An online shop you do not know only takes bank transfers and has strangely cheap prices.', opciones: ['I do not buy and check with a trusted person', 'I buy fast before it runs out', 'I pay half to try'], correcta: 0 },
          { picto: '🎮', situacion: 'In an online game, someone offers you free items if you give them access to your account.', opciones: ['I do not give access to my account', 'I give access to get the items', 'I give access just for a moment'], correcta: 0 },
          { picto: '🧑‍💻', situacion: 'A profile claiming to be a company messages you that you have been "selected" for an easy, well-paid job.', opciones: ['I check it with a trusted person before replying', 'I reply right away giving my details', 'I accept because it sounds great'], correcta: 0 },
          { picto: '🖼️', situacion: 'Someone asks you to send a photo of your ID document to "verify your age" on a website.', opciones: ['I do not send it and ask a trusted person if it is legitimate', 'I send it so I can enter', 'I send just part of the document'], correcta: 0 },
          { picto: '🔁', situacion: "You see a profile similar to a friend's send a new friend request, even though you were already friends.", opciones: ['I check with my friend before accepting', 'I accept because we were already friends', 'I accept and tell them the news'], correcta: 0 }
        ]
      }
    ]
  }
};
