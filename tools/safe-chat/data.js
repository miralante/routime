/* ============================================================
   Datos: Chat Seguro (autonomía — seguridad en internet).
   Chats simulados para practicar cómo responder a personas que
   intentan engañar: pedir fotos, datos, contraseñas, secretos,
   dinero…
   Formato: DATA.es / DATA.en, cada uno con:
   {
     escenarios: [{               → un GRUPO temático (una tarjeta del menú)
       id, titulo, picto,
       variantes: [{              → un CASO concreto; al abrir la tarjeta
         contacto,                  se juega UNA variante al azar, así el
         pasos: [                   guion no se puede memorizar
           { tipo: 'msg', texto }                  → mensaje que recibe el usuario
           { tipo: 'eleccion', opciones: [         → el usuario elige respuesta
               { texto, segura: true, avisoSeguro } → segura: el chat sigue, explica por qué
               { texto, segura: false, aviso }     → arriesgada: consejo y se reintenta
             ] }
           { tipo: 'accion', texto, confirmacion } → botón final (bloquear) + mensaje
         ],
         regla: norma para recordar al terminar
       }]
     }],
     normas: resumen de todas las normas (pantalla "Mis normas")
   }
   El menú sigue con pocas tarjetas (regla 10); los casos (≥25 en
   total) viven dentro de las variantes. La estrella se gana por
   grupo. app.js usa DATA[App.i18n.locale()] || DATA.es.
   Tono: Lectura Fácil, sin asustar. El error nunca se castiga.
   ============================================================ */
const DATA = {

  es: {
    escenarios: [
      {
        id: 'fotos',
        titulo: 'Me piden una foto',
        picto: '📷',
        variantes: [
          {
            contacto: 'Leo_23',
            pasos: [
              { tipo: 'msg', texto: 'Hola. Jugamos ayer al juego de coches. ¿Te acuerdas de mí?' },
              { tipo: 'msg', texto: 'Me caes muy bien. ¿Me mandas una foto tuya?' },
              { tipo: 'eleccion', opciones: [
                { texto: 'No. No te conozco.', segura: true,
                  avisoSeguro: 'No conoces a esta persona de verdad. Decir que no protege tus fotos.' },
                { texto: 'Vale, ahora te la mando.',
segura: false,
pista: 'Si Cuidado., ¿sabes quién es esta persona de verdad?',
aviso: 'Cuidado. No sabes quién es esta persona de verdad. Tus fotos son tuyas. No las envíes.' },
                { texto: 'Bueno… solo una foto.',
segura: false,
pista: 'Si Aunque sea solo una, no. Una foto tuya dice mucho de ti y ya, ¿la puedes recuperar?',
aviso: 'Aunque sea solo una, no. Una foto tuya dice mucho de ti y ya no la puedes recuperar.' }
              ] },
              { tipo: 'msg', texto: 'Venga, porfa. Pensaba que éramos amigos. Los amigos se mandan fotos.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Los amigos de verdad no piden fotos así. No.', segura: true,
                  avisoSeguro: 'Un amigo de verdad no te pide fotos con excusas ni te presiona así.' },
                { texto: 'No quiero que te enfades. Te mando una.',
segura: false,
pista: '¿De verdad: esta persona quiere que te sientas mal para conseguir tu foto?',
aviso: 'Esta persona quiere que te sientas mal para conseguir tu foto. Eso es una trampa.' }
              ] },
              { tipo: 'msg', texto: 'Pues si no me la mandas, dejo de hablarte.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Adiós. Se lo voy a contar a una persona de confianza.', segura: true,
                  avisoSeguro: 'Que alguien deje de hablarte por no mandar una foto no es un problema tuyo. Contarlo ayuda.' },
                { texto: 'Espera, no te vayas. Te la mando.',
segura: false,
pista: '¿De verdad: no pasa nada si deja de hablarte. Enfadarse y meter prisa es otra trampa?',
aviso: 'No pasa nada si deja de hablarte. Enfadarse y meter prisa es otra trampa.' }
              ] },
              { tipo: 'accion', texto: '🚫 Bloquear a esta persona',
                confirmacion: 'Has bloqueado a Leo_23. ¡Muy bien hecho!' }
            ],
            regla: 'Tus fotos son tuyas. No las envíes a personas que no conoces. Si alguien insiste, cuéntaselo a una persona de confianza.'
          },
          {
            contacto: 'Nico_Playa',
            pasos: [
              { tipo: 'msg', texto: 'Mira, te mando una foto mía en la piscina. 😎' },
              { tipo: 'msg', texto: 'Ahora te toca a ti. Mándame una tuya en bañador.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'No. Yo no mando fotos así.', segura: true,
                  avisoSeguro: 'Que otra persona mande una foto no te obliga a nada. Las fotos en bañador son privadas.' },
                { texto: 'Él ya me ha mandado una… le mando otra yo.',
segura: false,
pista: '¿De verdad: es un truco: primero mandan algo para que te sientas obligado a devolverlo?',
aviso: 'Es un truco: primero mandan algo para que te sientas obligado a devolverlo. No funciona así.' }
              ] },
              { tipo: 'msg', texto: '¿No confías en mí? Yo he confiado en ti.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Esto no va de confiar. No mando fotos privadas.', segura: true,
                  avisoSeguro: 'Hablar de "confianza" es otra forma de presionar. Tus fotos privadas no se mandan a nadie.' },
                { texto: 'Vale, para que veas que confío.',
segura: false,
pista: '¿Realmente tienes que demostrar nada mandando fotos. Quien te presiona así no es tu amigo?',
aviso: 'No tienes que demostrar nada mandando fotos. Quien te presiona así no es tu amigo.' }
              ] },
              { tipo: 'accion', texto: '🚫 Bloquear a esta persona',
                confirmacion: 'Has bloqueado a Nico_Playa. Tus fotos siguen siendo tuyas.' }
            ],
            regla: 'Las fotos en bañador o ropa interior son privadas. No se mandan a nadie, aunque la otra persona mande las suyas primero.'
          },
          {
            contacto: 'Vera_Directo',
            pasos: [
              { tipo: 'msg', texto: '¡Hola! ¿Hacemos una videollamada ahora mismo?' },
              { tipo: 'msg', texto: 'Enciende la cámara, quiero verte.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'No enciendo la cámara con gente que no conozco.', segura: true,
                  avisoSeguro: 'La cámara enseña tu cara y tu casa. Con desconocidos, siempre apagada.' },
                { texto: 'Vale, la enciendo un momento.',
segura: false,
pista: '¿De verdad: un momento basta para grabar tu imagen. Con desconocidos, la cámara siempre apagada?',
aviso: 'Un momento basta para grabar tu imagen. Con desconocidos, la cámara siempre apagada.' }
              ] },
              { tipo: 'msg', texto: 'Solo será un segundo. Nadie se va a enterar.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'He dicho que no. Se lo voy a contar a mi familia.', segura: true,
                  avisoSeguro: '"Nadie se va a enterar" es justo lo que dice quien quiere que hagas algo malo. Contarlo protege.' },
                { texto: 'Bueno, si es solo un segundo…',
segura: false,
pista: '¿De verdad: cuando alguien dice "nadie se va a enterar", es señal de trampa?',
aviso: 'Cuando alguien dice "nadie se va a enterar", es señal de trampa. Para y cuéntalo.' }
              ] },
              { tipo: 'accion', texto: '🚫 Colgar y bloquear',
                confirmacion: 'Has colgado y bloqueado a Vera_Directo. ¡Bien hecho!' }
            ],
            regla: 'Con personas que no conoces, la cámara siempre apagada. Si insisten, cuelga y cuéntalo.'
          },
          {
            contacto: 'Sin_Nombre',
            pasos: [
              { tipo: 'msg', texto: 'Tengo una foto tuya que me pasó un amigo.' },
              { tipo: 'msg', texto: 'Si no me mandas otra, se la enseño a todo el mundo.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'No te mando nada. Esto se lo cuento YA a una persona de confianza.', segura: true,
                  avisoSeguro: 'Cuando alguien amenaza con una foto, lo seguro es no obedecer y contarlo enseguida. Las personas de confianza saben qué hacer.' },
                { texto: 'Vale, no se la enseñes a nadie. Te mando otra.',
segura: false,
pista: '¿De verdad: si obedeces, pedirá más. Las amenazas se cortan contándolo a una persona de confianza, nunca obedeciendo?',
aviso: 'Si obedeces, pedirá más. Las amenazas se cortan contándolo a una persona de confianza, nunca obedeciendo.' }
              ] },
              { tipo: 'msg', texto: 'Si se lo cuentas a alguien será peor para ti.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'No es verdad. Contarlo es lo que me protege.', segura: true,
                  avisoSeguro: 'Quien te amenaza no quiere que pidas ayuda, porque la ayuda funciona. Tú no has hecho nada malo.' },
                { texto: 'Mejor no digo nada y ya está.',
segura: false,
pista: '¿De verdad: callar deja el problema en tus manos. Esto lo tiene que arreglar una persona de confianza?',
aviso: 'Callar deja el problema en tus manos. Esto lo tiene que arreglar una persona de confianza. Tú no tienes la culpa.' }
              ] },
              { tipo: 'accion', texto: '🚫 Bloquear y contarlo ahora mismo',
                confirmacion: 'Has bloqueado a esta persona y lo has contado. Eso es justo lo que hay que hacer.' }
            ],
            regla: 'Si alguien te amenaza con una foto, no obedezcas: cuéntaselo enseguida a una persona de confianza. Si no tienes a quién contárselo, también puedes denunciarlo a la policía. Tú no tienes la culpa.'
          },
          {
            contacto: 'Chico_Guapo',
            pasos: [
              { tipo: 'msg', texto: 'Hola. Me gustas mucho. ¿Me mandas una foto íntima tuya?' },
              { tipo: 'eleccion', opciones: [
                { texto: 'No mando fotos íntimas a nadie.', segura: true,
                  avisoSeguro: 'Una foto íntima es solo tuya. No se manda a nadie, aunque insista o diga cosas bonitas.' },
                { texto: 'Bueno, como me gusta, le mando una.',
segura: false,
pista: 'Si Que alguien te guste, ¿cambia nada: una foto íntima nunca se manda por chat?',
aviso: 'Que alguien te guste no cambia nada: una foto íntima nunca se manda por chat.' }
              ] },
              { tipo: 'msg', texto: 'Si no me la mandas, tendrás que darme dinero para seguir hablando conmigo.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'No mando fotos ni dinero. Esto es un chantaje.', segura: true,
                  avisoSeguro: 'Pedir una foto íntima o dinero a cambio de hablar contigo es chantaje. No es amistad de verdad.' },
                { texto: 'Vale, mejor le doy dinero.',
segura: false,
pista: '¿Dar dinero arregla nada: seguirá pidiendo más?',
aviso: 'Dar dinero no arregla nada: seguirá pidiendo más. Nunca se paga a quien chantajea.' }
              ] },
              { tipo: 'msg', texto: 'Si se lo cuentas a alguien, te vas a arrepentir.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'No me da miedo. Lo voy a contar ahora mismo.', segura: true,
                  avisoSeguro: 'Amenazar para que no lo cuentes es la señal más clara de peligro. Contarlo es lo que te protege.' },
                { texto: 'Mejor no digo nada, por si acaso.',
segura: false,
pista: 'Si Callar, ¿te protege, solo protege a quien chantajea?',
aviso: 'Callar no te protege, solo protege a quien chantajea. Una persona de confianza sabe qué hacer.' }
              ] },
              { tipo: 'accion', texto: '🚫 Bloquear y contarlo a una persona de confianza',
                confirmacion: 'Has bloqueado a Chico_Guapo y lo has contado. Ni fotos ni dinero: has hecho lo correcto.' }
            ],
            regla: 'Si alguien pide una foto íntima o dinero y amenaza si dices que no, es chantaje. No pagues, no mandes nada: bloquea y cuéntaselo a una persona de confianza, o denúncialo a la policía si no tienes a quién contárselo.'
          }
        ]
      },

      {
        id: 'datos',
        titulo: 'Me preguntan dónde vivo',
        picto: '🏠',
        variantes: [
          {
            contacto: 'Marta_Fan',
            pasos: [
              { tipo: 'msg', texto: '¡Hola! Me encanta tu foto de perfil. ¿Cómo te llamas de verdad?' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Prefiero no decirlo.', segura: true,
                  avisoSeguro: 'No hace falta decir tu nombre completo a alguien que no conoces.' },
                { texto: 'Te digo mi nombre y mis apellidos.',
segura: false,
pista: 'Si Tu nombre completo es un dato personal. En internet, mejor, ¿darlo a desconocidos?',
aviso: 'Tu nombre completo es un dato personal. En internet, mejor no darlo a desconocidos.' }
              ] },
              { tipo: 'msg', texto: 'Yo vivo en Madrid. ¿Y tú? ¿En qué calle vives?' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Eso no te lo voy a decir.', segura: true,
                  avisoSeguro: 'Tu dirección es un dato que solo debe conocer la gente de confianza.' },
                { texto: 'Te digo mi calle y mi número.',
segura: false,
pista: '¿De verdad: nunca digas dónde vives a alguien de internet?',
aviso: 'Nunca digas dónde vives a alguien de internet. Con ese dato pueden encontrarte.' },
                { texto: 'Te digo mi ciudad y mi colegio.',
segura: false,
pista: '¿De verdad: tu colegio también es un dato personal. Con él pueden saber dónde estás cada día?',
aviso: 'Tu colegio también es un dato personal. Con él pueden saber dónde estás cada día.' }
              ] },
              { tipo: 'msg', texto: '¿Y tu teléfono? Así hablamos mejor.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'No doy mi teléfono a personas que no conozco.', segura: true,
                  avisoSeguro: 'Tu teléfono es tuyo. No hace falta darlo para seguir hablando.' },
                { texto: 'Vale, apunta mi número.',
segura: false,
pista: '¿De verdad: con tu teléfono te pueden llamar y escribir cuando quieran?',
aviso: 'Con tu teléfono te pueden llamar y escribir cuando quieran. No lo des.' }
              ] },
              { tipo: 'accion', texto: '🚫 Bloquear a esta persona',
                confirmacion: 'Has bloqueado a Marta_Fan. Tus datos están a salvo.' }
            ],
            regla: 'Tus datos son tuyos: nombre completo, dirección, teléfono y colegio. No los des en internet.'
          },
          {
            contacto: 'Sorteo_Escolar',
            pasos: [
              { tipo: 'msg', texto: '¡Hola! Hacemos un sorteo entre estudiantes de tu zona. 🎓' },
              { tipo: 'msg', texto: 'Para participar, escribe tu nombre completo, tu colegio y tu clase.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'No doy mis datos. Preguntaré en mi colegio si esto existe.', segura: true,
                  avisoSeguro: 'Los sorteos de verdad no llegan por chat pidiendo datos. Comprobarlo con tu colegio o familia es lo seguro.' },
                { texto: '¡Quiero participar! Apunta mis datos.',
segura: false,
pista: '¿De verdad: este "sorteo" solo quiere tus datos. Con tu nombre, colegio y clase pueden saber dónde estás…',
aviso: 'Este "sorteo" solo quiere tus datos. Con tu nombre, colegio y clase pueden saber dónde estás cada día.' }
              ] },
              { tipo: 'msg', texto: 'Sin tus datos no puedes ganar. ¡Solo quedan 2 plazas!' },
              { tipo: 'eleccion', opciones: [
                { texto: 'No me importa. No doy mis datos por chat.', segura: true,
                  avisoSeguro: '"Solo quedan 2 plazas" es prisa falsa para que no pienses. Has hecho bien en parar.' },
                { texto: 'Vale, rápido: te los mando.',
segura: false,
pista: '¿De verdad: la prisa es la trampa. Nadie pierde nada por comprobar antes con su familia?',
aviso: 'La prisa es la trampa. Nadie pierde nada por comprobar antes con su familia.' }
              ] },
              { tipo: 'accion', texto: '🚫 Bloquear y preguntar en el colegio',
                confirmacion: 'Has bloqueado a Sorteo_Escolar. En tu colegio nadie sabía nada de ese sorteo: era falso.' }
            ],
            regla: 'Los formularios y sorteos que llegan por chat pidiendo datos son casi siempre falsos. Compruébalo antes con tu familia o tu colegio.'
          },
          {
            contacto: 'Rutas_Amigos',
            pasos: [
              { tipo: 'msg', texto: '¡Hola! Estoy haciendo un mapa de amigos del barrio. 🗺️' },
              { tipo: 'msg', texto: '¿A qué hora sales de casa por la mañana? ¿Y por dónde vas al cole?' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Mis horarios no se los digo a nadie de internet.', segura: true,
                  avisoSeguro: 'Tus horarios dicen dónde estás y cuándo. Es de los datos más importantes de proteger.' },
                { texto: 'Salgo a las 8 y voy por el parque.',
segura: false,
pista: '¿De verdad: con tu hora y tu camino, un desconocido sabe dónde encontrarte?',
aviso: 'Con tu hora y tu camino, un desconocido sabe dónde encontrarte. Los horarios nunca se dan.' }
              ] },
              { tipo: 'msg', texto: 'Es solo para el mapa… ¿me dices al menos tu parada de bus?' },
              { tipo: 'eleccion', opciones: [
                { texto: 'No. Y se lo voy a contar a mi familia.', segura: true,
                  avisoSeguro: 'Insistir con preguntas cada vez más pequeñas es una técnica. Contarlo es lo correcto.' },
                { texto: 'Bueno, la parada sí te la digo.',
segura: false,
pista: '¿De verdad: la parada también dice dónde estás cada día?',
aviso: 'La parada también dice dónde estás cada día. No hay dato "pequeño" cuando es sobre tu camino.' }
              ] },
              { tipo: 'accion', texto: '🚫 Bloquear y contarlo a mi familia',
                confirmacion: 'Has bloqueado a Rutas_Amigos y lo has contado. Tus horarios están a salvo.' }
            ],
            regla: 'Tus horarios y tu camino al colegio o al trabajo son datos secretos. Nadie de internet los necesita.'
          },
          {
            contacto: 'Juego_Verifica',
            pasos: [
              { tipo: 'msg', texto: 'Para seguir jugando debes verificar tu edad. ✅' },
              { tipo: 'msg', texto: 'Manda una foto de tu DNI o del carnet de tu familiar.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'No mando documentos. Lo comprobaré con una persona de confianza.', segura: true,
                  avisoSeguro: 'Los juegos de verdad no piden fotos del DNI por chat. Una persona de confianza puede comprobar si es real.' },
                { texto: 'Vale, le hago una foto al DNI.',
segura: false,
pista: '¿De verdad: con la foto de un DNI pueden hacerse pasar por ti o por tu familia?',
aviso: 'Con la foto de un DNI pueden hacerse pasar por ti o por tu familia. Nunca se manda por chat.' }
              ] },
              { tipo: 'msg', texto: 'Si no lo mandas hoy, tu cuenta se borrará para siempre.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Pues que se borre. No mando documentos.', segura: true,
                  avisoSeguro: 'Amenazar con borrar la cuenta es para asustarte. Ninguna cuenta vale un documento.' },
                { texto: '¡Mi cuenta no! Lo mando ya.',
segura: false,
pista: 'Si Te meten miedo para que, ¿pienses. Para, respira y pregunta a una persona de confianza?',
aviso: 'Te meten miedo para que no pienses. Para, respira y pregunta a una persona de confianza.' }
              ] },
              { tipo: 'accion', texto: '🚫 Bloquear y avisar a una persona de confianza',
                confirmacion: 'Has bloqueado a Juego_Verifica. El juego de verdad nunca pide el DNI así.' }
            ],
            regla: 'El DNI y los documentos no se fotografían ni se mandan por chat. Si algo pide "verificar", pregunta antes a una persona de confianza.'
          }
        ]
      },

      {
        id: 'premio',
        titulo: 'Un premio sorpresa',
        picto: '🎁',
        variantes: [
          {
            contacto: 'Premios_Ya',
            pasos: [
              { tipo: 'msg', texto: '🎉 ¡Enhorabuena! Has ganado un teléfono nuevo.' },
              { tipo: 'msg', texto: 'Para enviarte el premio, dame los números de la tarjeta del banco de tu familia.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'No. Esto es un engaño.', segura: true,
                  avisoSeguro: 'Nadie regala nada a cambio de datos bancarios: es una señal clara de engaño.' },
                { texto: '¡Un premio! Voy a buscar la tarjeta.',
segura: false,
pista: '¿De verdad: nadie regala nada a cambio de los números de una tarjeta?',
aviso: 'Nadie regala nada a cambio de los números de una tarjeta. Es un engaño para quitar dinero.' }
              ] },
              { tipo: 'msg', texto: '¡Date prisa! El premio se acaba en 5 minutos.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'No me des prisa. No te voy a dar nada.', segura: true,
                  avisoSeguro: 'Meter prisa es una técnica para que no pienses. Parar y no darte prisa es lo seguro.' },
                { texto: '¡Rápido, que se acaba! Te doy los números.',
segura: false,
pista: 'Si Las prisas son una trampa. Quieren que, ¿pienses?',
aviso: 'Las prisas son una trampa. Quieren que no pienses. Tú puedes parar y pensar con calma.' }
              ] },
              { tipo: 'accion', texto: '🚫 Bloquear y avisar a mi familia',
                confirmacion: 'Has bloqueado a Premios_Ya y has avisado a tu familia. ¡Genial!' }
            ],
            regla: 'Si te regalan algo a cambio de datos o dinero, es un engaño. Para, no contestes y avisa a tu familia.'
          },
          {
            contacto: 'Soporte_Envios',
            pasos: [
              { tipo: 'msg', texto: 'Tu paquete está retenido. 📦 Te acabamos de mandar un código por SMS.' },
              { tipo: 'msg', texto: 'Dime el código para entregarte el paquete.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'No doy códigos a nadie. Los códigos son secretos.', segura: true,
                  avisoSeguro: 'Los códigos que llegan por SMS abren TUS cuentas. Quien te lo pide, quiere entrar en ellas.' },
                { texto: 'Vale, el código es… te lo copio.',
segura: false,
pista: '¿De verdad: ese código abre tu cuenta. Si lo das, la otra persona entra como si fuera tú?',
aviso: 'Ese código abre tu cuenta. Si lo das, la otra persona entra como si fuera tú. Nunca se comparte.' }
              ] },
              { tipo: 'msg', texto: 'Sin el código perderás el paquete hoy mismo.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'No espero ningún paquete. Adiós.', segura: true,
                  avisoSeguro: 'Pararte a pensar "¿yo esperaba un paquete?" desmonta casi todos estos engaños.' },
                { texto: 'Uy, mi paquete… te lo doy.',
segura: false,
pista: '¿De verdad: piensa primero: ¿habías pedido algo? Los mensajes de paquetes sorpresa casi siempre son engaños?',
aviso: 'Piensa primero: ¿habías pedido algo? Los mensajes de paquetes sorpresa casi siempre son engaños.' }
              ] },
              { tipo: 'accion', texto: '🚫 Bloquear y avisar a mi familia',
                confirmacion: 'Has bloqueado a Soporte_Envios. Los códigos del SMS son solo tuyos.' }
            ],
            regla: 'Los códigos que llegan por SMS son secretos: abren tus cuentas. No se los des a nadie, diga lo que diga.'
          },
          {
            contacto: 'Mega_Sorteo',
            pasos: [
              { tipo: 'msg', texto: '🥳 ¡Eres el visitante 1.000.000! Has ganado una tablet.' },
              { tipo: 'msg', texto: 'Solo tienes que pagar 1 euro de gastos de envío con una tarjeta.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'No pago nada. Un premio de verdad no cuesta dinero.', segura: true,
                  avisoSeguro: 'Exacto: si hay que pagar, no es un premio. El "euro de envío" es para copiar la tarjeta.' },
                { texto: 'Solo es 1 euro… busco la tarjeta.',
segura: false,
pista: '¿De verdad: no es por el euro: al meter la tarjeta, copian todos sus números?',
aviso: 'No es por el euro: al meter la tarjeta, copian todos sus números. Un premio de verdad no cuesta dinero.' }
              ] },
              { tipo: 'msg', texto: '¡Es tu última oportunidad! Otros ya están reclamando tu tablet.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Que se la queden. Esto es un engaño.', segura: true,
                  avisoSeguro: 'Muy bien. La prisa y "otros te lo quitan" son trucos para que no pienses.' },
                { texto: '¡Es mía! Pago rápido.',
segura: false,
pista: 'Si Nadie te está quitando nada, porque, ¿hay tablet?',
aviso: 'Nadie te está quitando nada, porque no hay tablet. Es un truco para que corras sin pensar.' }
              ] },
              { tipo: 'accion', texto: '🚫 Cerrar y contarlo en casa',
                confirmacion: 'Has cerrado el chat y lo has contado. Los "premios" que cuestan dinero son engaños.' }
            ],
            regla: 'Un premio de verdad nunca te pide dinero, ni siquiera "un euro de envío". Si hay que pagar, es un engaño.'
          },
          {
            contacto: 'Conciertos_VIP',
            pasos: [
              { tipo: 'msg', texto: '🎤 ¡Entradas GRATIS para tu cantante favorito!' },
              { tipo: 'msg', texto: 'Reenvía este mensaje a 10 amigos y escribe tu correo para recibirlas.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'No lo reenvío ni doy mi correo.', segura: true,
                  avisoSeguro: 'Estos mensajes en cadena reparten el engaño y recogen correos. Cortarlos es lo correcto.' },
                { texto: 'Se lo mando a mis amigos, ¡son gratis!',
segura: false,
pista: '¿De verdad: si lo reenvías, engañas sin querer a tus amigos?',
aviso: 'Si lo reenvías, engañas sin querer a tus amigos. Las entradas no existen; quieren correos.' }
              ] },
              { tipo: 'msg', texto: 'Tus amigos ya casi tienen las suyas. ¡No te quedes fuera!' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Voy a preguntar a mis amigos si eso es verdad.', segura: true,
                  avisoSeguro: 'Comprobarlo fuera del chat (preguntando de verdad) desmonta el engaño enseguida.' },
                { texto: 'Vale, va: mi correo es…',
segura: false,
pista: '¿De verdad: "Tus amigos ya lo tienen" es mentira para presionarte?',
aviso: '"Tus amigos ya lo tienen" es mentira para presionarte. Compruébalo preguntándoles tú.' }
              ] },
              { tipo: 'accion', texto: '🚫 Borrar y avisar a mis amigos',
                confirmacion: 'Has borrado el mensaje y avisado a tus amigos. ¡Les has protegido tú a ellos!' }
            ],
            regla: 'Los mensajes de "reenvía a 10 amigos" son engaños en cadena. No los reenvíes: corta la cadena y avisa.'
          }
        ]
      },

      {
        id: 'secreto',
        titulo: 'Un secreto raro',
        picto: '🤫',
        variantes: [
          {
            contacto: 'Dani_Guay',
            pasos: [
              { tipo: 'msg', texto: 'Hola. Eres muy especial. Me gusta mucho hablar contigo.' },
              { tipo: 'msg', texto: 'Esto es nuestro secreto, ¿vale? No le digas a nadie que hablamos.' },
              { tipo: 'eleccion', opciones: [
                { texto: '¿Por qué un secreto? Eso no me gusta.', segura: true,
                  avisoSeguro: 'Dudar de un secreto raro es buena señal: las personas de confianza no piden guardar secretos así.' },
                { texto: 'Vale, será nuestro secreto.',
segura: false,
pista: '¿De verdad: cuando alguien pide un secreto en internet, algo va mal?',
aviso: 'Cuando alguien pide un secreto en internet, algo va mal. Las personas buenas no piden secretos así.' }
              ] },
              { tipo: 'msg', texto: 'Si se lo cuentas a alguien, te vas a meter en un lío.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Contarlo no es meterse en un lío. Lo voy a contar.', segura: true,
                  avisoSeguro: 'Contar lo que pasa nunca mete en un lío; ayuda a que una persona de confianza lo sepa.' },
                { texto: 'Vale, no se lo cuento a nadie.',
segura: false,
pista: '¿De verdad: contar lo que te pasa nunca es malo?',
aviso: 'Contar lo que te pasa nunca es malo. Las personas de confianza te ayudan.' }
              ] },
              { tipo: 'accion', texto: '🚫 Bloquear y contarlo a una persona de confianza',
                confirmacion: 'Has bloqueado a Dani_Guay y lo has contado. Eso es ser valiente.' }
            ],
            regla: 'Los secretos de internet no se guardan. Cuéntaselo siempre a una persona de confianza: tu familia, un profesor…'
          },
          {
            contacto: 'Tu_Amigo_Nuevo',
            pasos: [
              { tipo: 'msg', texto: 'Este chat tiene mucha gente. 😕 Hablemos mejor en otra aplicación más privada.' },
              { tipo: 'msg', texto: 'Bájate esta otra app y hablamos allí, donde nadie nos vea.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'No. Si quieres hablar, aquí está bien.', segura: true,
                  avisoSeguro: 'Querer llevarte a un sitio "donde nadie os vea" es una señal de alarma muy clara.' },
                { texto: 'Vale, me bajo esa app.',
segura: false,
pista: '¿De verdad: te quiere llevar donde ninguna persona de confianza pueda ver la conversación?',
aviso: 'Te quiere llevar donde ninguna persona de confianza pueda ver la conversación. Ahí es donde empiezan los problemas.' }
              ] },
              { tipo: 'msg', texto: 'Es que aquí no puedo contarte mi sorpresa…' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Pues no me la cuentes. Se lo diré a mi familia.', segura: true,
                  avisoSeguro: 'Las "sorpresas" que necesitan esconderse no son buenas sorpresas. Contarlo es lo seguro.' },
                { texto: 'Una sorpresa… vale, me la bajo.',
segura: false,
pista: '¿De verdad: la "sorpresa" es el anzuelo. Nada bueno necesita una app escondida para contarse?',
aviso: 'La "sorpresa" es el anzuelo. Nada bueno necesita una app escondida para contarse.' }
              ] },
              { tipo: 'accion', texto: '🚫 Bloquear y quedarme donde estoy',
                confirmacion: 'Has bloqueado a Tu_Amigo_Nuevo y no has cambiado de app. ¡Muy bien!' }
            ],
            regla: 'Si alguien quiere llevarte a otra app "más privada" o "donde nadie os vea", es una señal de alarma. No cambies y cuéntalo.'
          },
          {
            contacto: 'Mister_X',
            pasos: [
              { tipo: 'msg', texto: 'Te voy a contar cosas geniales. Pero tienes que borrar los mensajes después de leerlos.' },
              { tipo: 'eleccion', opciones: [
                { texto: '¿Borrarlos? Eso es muy raro. No.', segura: true,
                  avisoSeguro: 'Pedir que borres mensajes es esconder pruebas. Las conversaciones normales no se borran.' },
                { texto: 'Vale, los voy borrando.',
segura: false,
pista: 'Si borras, nadie podrá ayudarte después?',
aviso: 'Si borras los mensajes, nadie podrá ayudarte después. Quien pide borrar, esconde algo malo.' }
              ] },
              { tipo: 'msg', texto: 'Es por privacidad… los mayores no lo entenderían.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Si los mayores no pueden verlo, es que está mal. Lo cuento.', segura: true,
                  avisoSeguro: 'Esa frase es la clave: lo que no puede ver una persona de confianza, no es bueno para ti.' },
                { texto: 'Tienes razón, mejor que no lo vean.',
segura: false,
pista: 'Si "Los mayores, ¿lo entenderían" significa "los mayores me pararían"?',
aviso: '"Los mayores no lo entenderían" significa "los mayores me pararían". Cuéntaselo a uno.' }
              ] },
              { tipo: 'accion', texto: '🚫 Bloquear sin borrar nada',
                confirmacion: 'Has bloqueado a Mister_X y has guardado los mensajes. Así una persona de confianza puede verlos y ayudarte.' }
            ],
            regla: 'No borres conversaciones que te hagan sentir raro: son la prueba que ayuda a las personas de confianza a protegerte.'
          },
          {
            contacto: 'Rober_Bici',
            pasos: [
              { tipo: 'msg', texto: 'Si tu familia pregunta con quién hablas, di que soy un compañero de clase. 😉' },
              { tipo: 'eleccion', opciones: [
                { texto: 'No voy a mentir a mi familia.', segura: true,
                  avisoSeguro: 'Quien te pide mentir a tu familia se está delatando: sabe que lo que hace está mal.' },
                { texto: 'Vale, diré que eres de mi clase.',
segura: false,
pista: '¿De verdad: si hay que mentir para poder hablar contigo, esa persona sabe que está haciendo algo malo?',
aviso: 'Si hay que mentir para poder hablar contigo, esa persona sabe que está haciendo algo malo.' }
              ] },
              { tipo: 'msg', texto: 'Es una mentirijilla de nada. Así no se preocupan.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Mi familia se preocupa porque me cuida. Se lo voy a contar.', segura: true,
                  avisoSeguro: 'Exacto: la preocupación de tu familia es protección. Contarlo activa esa protección.' },
                { texto: 'Bueno, si es pequeñita…',
segura: false,
pista: '¿De verdad: no hay mentiras "pequeñas" sobre con quién hablas?',
aviso: 'No hay mentiras "pequeñas" sobre con quién hablas. Es la puerta a mentiras más grandes.' }
              ] },
              { tipo: 'accion', texto: '🚫 Bloquear y decir la verdad en casa',
                confirmacion: 'Has bloqueado a Rober_Bici y lo has contado en casa tal cual. ¡Perfecto!' }
            ],
            regla: 'Si alguien te pide mentir a tu familia sobre él, ya sabes que es peligroso. Cuenta siempre la verdad en casa.'
          }
        ]
      },

      {
        id: 'quedar',
        titulo: 'Quiere quedar conmigo',
        picto: '📍',
        variantes: [
          {
            contacto: 'Sara_Juegos',
            pasos: [
              { tipo: 'msg', texto: '¡Hola otra vez! Ya hablamos mucho, ¿no? Somos casi amigos.' },
              { tipo: 'msg', texto: '¿Quedamos mañana en el parque? Ven sin decir nada a nadie.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'No. No quedo con personas que solo conozco por internet.', segura: true,
                  avisoSeguro: 'No sabes quién es de verdad esa persona: no quedar es lo seguro.' },
                { texto: 'Vale, mañana voy.',
segura: false,
pista: '¿De verdad: no sabes quién es de verdad. Puede mentir sobre su nombre o su edad?',
aviso: 'No sabes quién es de verdad. Puede mentir sobre su nombre o su edad. No vayas.' },
                { texto: 'Voy, pero solo un ratito.',
segura: false,
pista: 'Si Aunque sea un ratito, es peligroso., ¿vayas a ningún sitio sin tu familia?',
aviso: 'Aunque sea un ratito, es peligroso. No vayas a ningún sitio sin tu familia.' }
              ] },
              { tipo: 'msg', texto: '¿Por qué no? Tengo un regalo para ti.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'No quiero tu regalo. Se lo voy a contar a mi familia.', segura: true,
                  avisoSeguro: 'Un regalo a cambio de quedar es una trampa habitual; contarlo a la familia protege.' },
                { texto: '¿Un regalo? Bueno, entonces voy.',
segura: false,
pista: '¿De verdad: el regalo es una trampa para que vayas?',
aviso: 'El regalo es una trampa para que vayas. Cuéntaselo a tu familia.' }
              ] },
              { tipo: 'accion', texto: '🚫 Bloquear y contarlo a mi familia',
                confirmacion: 'Has bloqueado a Sara_Juegos y lo has contado a tu familia. ¡Muy bien!' }
            ],
            regla: 'Nunca quedes con alguien que solo conoces por internet. Si te lo pide, cuéntaselo a tu familia.'
          },
          {
            contacto: 'Cachorros_Adopta',
            pasos: [
              { tipo: 'msg', texto: '¡Mi perra ha tenido cachorros! 🐶 Son adorables.' },
              { tipo: 'msg', texto: 'Ven a mi casa a verlos cuando quieras. Puedes elegir uno.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'No voy a casa de alguien que no conozco.', segura: true,
                  avisoSeguro: 'Los cachorros son el anzuelo perfecto. La casa de un desconocido es el sitio menos seguro que hay.' },
                { texto: '¡Cachorros! Dime tu dirección.',
segura: false,
pista: 'Si Piénsalo: ¿por qué un desconocido invita a su casa a alguien que, ¿conoce? Los cachorros son el…',
aviso: 'Piénsalo: ¿por qué un desconocido invita a su casa a alguien que no conoce? Los cachorros son el truco.' }
              ] },
              { tipo: 'msg', texto: 'Solo será un momento, y te llevas uno gratis.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'No. Y se lo voy a enseñar a mi familia.', segura: true,
                  avisoSeguro: 'Enseñar el chat a tu familia es lo mejor: ellos pueden comprobar si algo es de verdad.' },
                { texto: 'Gratis… vale, dime dónde vives.',
segura: false,
pista: '¿De verdad: "Gratis" y "solo un momento" son las palabras de las trampas?',
aviso: '"Gratis" y "solo un momento" son las palabras de las trampas. Nunca vayas a casa de un desconocido.' }
              ] },
              { tipo: 'accion', texto: '🚫 Bloquear y enseñar el chat en casa',
                confirmacion: 'Has bloqueado a Cachorros_Adopta y has enseñado el chat. ¡Muy bien hecho!' }
            ],
            regla: 'Nunca vayas a casa de alguien que conociste por internet, dé igual lo que ofrezca. Enséñale el chat a tu familia.'
          },
          {
            contacto: 'Casi_Vecino',
            pasos: [
              { tipo: 'msg', texto: 'Creo que vivimos cerca. Te he visto alguna vez por el barrio. 😊' },
              { tipo: 'msg', texto: 'Mañana te recojo a la salida de tu cole y te acompaño a casa.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'No. No te conozco, aunque digas que eres del barrio.', segura: true,
                  avisoSeguro: 'Decir "soy del barrio" o "te he visto" no convierte a un desconocido en conocido.' },
                { texto: 'Ah, si eres del barrio, vale.',
segura: false,
pista: '¿De verdad: cualquiera puede decir que es de tu barrio?',
aviso: 'Cualquiera puede decir que es de tu barrio. Sigue siendo un desconocido de internet.' }
              ] },
              { tipo: 'msg', texto: 'Sé cómo es la puerta de tu cole. ¿A qué hora sales?' },
              { tipo: 'eleccion', opciones: [
                { texto: 'No te lo digo. Esto se lo cuento hoy a una persona de confianza.', segura: true,
                  avisoSeguro: 'Preguntar tu hora de salida es lo más serio que hay: cuéntaselo hoy mismo a una persona de confianza.' },
                { texto: 'Salgo a las cinco.',
segura: false,
pista: '¿De verdad: nunca digas a nadie de internet a qué hora sales?',
aviso: 'Nunca digas a nadie de internet a qué hora sales. Cuéntale esta conversación a una persona de confianza ya.' }
              ] },
              { tipo: 'accion', texto: '🚫 Bloquear y contarlo hoy mismo',
                confirmacion: 'Has bloqueado a Casi_Vecino y lo has contado hoy mismo. Justo lo que había que hacer.' }
            ],
            regla: 'Aunque alguien diga que es de tu barrio o que te conoce de vista, sigue siendo un desconocido. Ni horarios ni quedadas.'
          }
        ]
      },

      {
        id: 'contrasena',
        titulo: 'Me piden mi contraseña',
        picto: '🔑',
        variantes: [
          {
            contacto: 'Ayuda_Del_Juego',
            pasos: [
              { tipo: 'msg', texto: 'Hola. Somos la ayuda del juego. Hay un problema con tu cuenta.' },
              { tipo: 'msg', texto: 'Dinos tu contraseña para arreglarlo.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'No. Mi contraseña es solo mía.', segura: true,
                  avisoSeguro: 'La ayuda de verdad nunca necesita tu contraseña para arreglar nada.' },
                { texto: 'Vale, os digo mi contraseña.',
segura: false,
pista: '¿De verdad: la ayuda de verdad nunca pide tu contraseña?',
aviso: 'La ayuda de verdad nunca pide tu contraseña. Quien la pide, quiere robar tu cuenta.' }
              ] },
              { tipo: 'msg', texto: 'Si no nos la das, hoy mismo perderás todos tus puntos.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'No te creo. Voy a pedir ayuda a una persona de confianza.', segura: true,
                  avisoSeguro: 'Amenazar con quitarte algo para conseguir la contraseña es la trampa; pedir ayuda es lo seguro.' },
                { texto: '¡Mis puntos no! Os la doy.',
segura: false,
pista: '¿De verdad: te asustan para que obedezcas. Es una trampa?',
aviso: 'Te asustan para que obedezcas. Es una trampa. Para y pide ayuda.' }
              ] },
              { tipo: 'accion', texto: '🚫 Bloquear y pedir ayuda',
                confirmacion: 'Has bloqueado a Ayuda_Del_Juego. Tu cuenta está a salvo.' }
            ],
            regla: 'Tu contraseña es solo tuya. No la des a nadie. La ayuda de verdad nunca te la pide.'
          },
          {
            contacto: 'Mario_Pro',
            pasos: [
              { tipo: 'msg', texto: '¡Ese nivel es dificilísimo! Yo te lo paso en 5 minutos. 🎮' },
              { tipo: 'msg', texto: 'Déjame tu cuenta: dime tu usuario y tu contraseña.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'No presto mi cuenta. Prefiero pasármelo yo.', segura: true,
                  avisoSeguro: 'Una cuenta prestada es una cuenta perdida: puede cambiarte la contraseña y quedársela.' },
                { texto: 'Vale, pásamelo tú: apunta mi contraseña.',
segura: false,
pista: '¿De verdad: en cuanto entre, puede cambiar tu contraseña y quedarse tu cuenta para siempre?',
aviso: 'En cuanto entre, puede cambiar tu contraseña y quedarse tu cuenta para siempre.' }
              ] },
              { tipo: 'msg', texto: 'Yo se la dejo a todo el mundo, es lo normal entre gamers.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Pues yo no. Mi cuenta es mía.', segura: true,
                  avisoSeguro: '"Todo el mundo lo hace" es un truco viejísimo. Las cuentas no se prestan, y menos a desconocidos.' },
                { texto: 'Si es lo normal… vale.',
segura: false,
pista: '¿De verdad: no es lo normal: es lo que dicen para que se la des?',
aviso: 'No es lo normal: es lo que dicen para que se la des. Ningún gamer de verdad pide contraseñas.' }
              ] },
              { tipo: 'accion', texto: '🚫 Bloquear a esta persona',
                confirmacion: 'Has bloqueado a Mario_Pro. Tu cuenta y tus logros siguen siendo tuyos.' }
            ],
            regla: 'Las cuentas no se prestan a nadie: quien entra puede cambiarte la contraseña y quedársela. Los niveles se pasan jugando.'
          },
          {
            contacto: 'Monedas_Gratis',
            pasos: [
              { tipo: 'msg', texto: '💰 ¡Consigue 10.000 monedas GRATIS para tu juego!' },
              { tipo: 'msg', texto: 'Entra en este enlace y escribe tu usuario y contraseña.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'No entro en enlaces raros ni escribo mi contraseña.', segura: true,
                  avisoSeguro: 'Esas páginas imitan al juego de verdad para copiarte la contraseña. Se llaman trampas de pesca.' },
                { texto: '¡10.000 monedas! Entro ya.',
segura: false,
pista: '¿De verdad: la página es falsa: parece el juego, pero solo copia lo que escribes?',
aviso: 'La página es falsa: parece el juego, pero solo copia lo que escribes. Las monedas gratis no existen.' }
              ] },
              { tipo: 'msg', texto: 'Es 100% seguro, mira los comentarios: "¡a mí me funcionó!"' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Los comentarios también pueden ser falsos. No entro.', segura: true,
                  avisoSeguro: 'Muy bien pensado: los comentarios de un engaño los escribe el mismo que engaña.' },
                { texto: 'Si a otros les funcionó… pruebo.',
segura: false,
pista: '¿De verdad: esos comentarios los escribió la misma persona que quiere tu contraseña?',
aviso: 'Esos comentarios los escribió la misma persona que quiere tu contraseña. No son de verdad.' }
              ] },
              { tipo: 'accion', texto: '🚫 Cerrar el enlace y contarlo',
                confirmacion: 'Has cerrado el enlace sin escribir nada y lo has contado. ¡Contraseña a salvo!' }
            ],
            regla: 'Las "monedas gratis" y los enlaces que piden tu contraseña son trampas para robarla. Nunca la escribas fuera del juego de verdad.'
          }
        ]
      },

      {
        id: 'dinero',
        titulo: 'Me piden dinero',
        picto: '💶',
        variantes: [
          {
            contacto: 'Alex_Colega',
            pasos: [
              { tipo: 'msg', texto: '¡Necesito tu ayuda! Es una emergencia. 😭' },
              { tipo: 'msg', texto: 'Cómprame una tarjeta regalo y mándame los números. Te lo devuelvo mañana.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'No mando dinero ni tarjetas. Lo hablo con mi familia.', segura: true,
                  avisoSeguro: 'Las emergencias de verdad no se arreglan con tarjetas regalo. Es un truco muy común.' },
                { texto: 'Vale, te ayudo. Voy a comprarla.',
segura: false,
pista: '¿De verdad: los números de una tarjeta regalo son como dinero: si los mandas, desaparecen para siempre?',
aviso: 'Los números de una tarjeta regalo son como dinero: si los mandas, desaparecen para siempre.' }
              ] },
              { tipo: 'msg', texto: '¡No hay tiempo de preguntar a nadie! Confía en mí.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Si es tan urgente, que te ayude una persona de confianza. Yo aviso al mío.', segura: true,
                  avisoSeguro: '"No preguntes a nadie" es la señal más clara de engaño. Las cosas de verdad aguantan una pregunta.' },
                { texto: 'Vale, vale, no pregunto. Ya voy.',
segura: false,
pista: 'Si Cuando alguien, ¿quiere que preguntes, es porque preguntando se descubre el engaño?',
aviso: 'Cuando alguien no quiere que preguntes, es porque preguntando se descubre el engaño.' }
              ] },
              { tipo: 'accion', texto: '🚫 Bloquear y avisar a mi familia',
                confirmacion: 'Has bloqueado a Alex_Colega y lo has contado. Tu dinero está a salvo.' }
            ],
            regla: 'No mandes dinero ni números de tarjetas regalo a nadie de internet. Ante una "emergencia", avisa a tu familia.'
          },
          {
            contacto: 'Numero_Nuevo',
            pasos: [
              { tipo: 'msg', texto: '¡Hola! Soy tu primo. Este es mi número nuevo, el otro se me rompió.' },
              { tipo: 'msg', texto: 'Necesito que me pases dinero urgente. Luego te explico.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Voy a llamar a mi primo a su número de siempre para comprobarlo.', segura: true,
                  avisoSeguro: 'Perfecto: comprobar por otro camino (llamando al número de siempre) desmonta este engaño en un minuto.' },
                { texto: 'Claro, primo, ahora te lo mando.',
segura: false,
pista: '¿De verdad: cualquiera puede escribir "soy tu primo". Antes de nada, comprueba llamando al número de siempre?',
aviso: 'Cualquiera puede escribir "soy tu primo". Antes de nada, comprueba llamando al número de siempre.' }
              ] },
              { tipo: 'msg', texto: '¡No le digas nada a la familia, que es una sorpresa!' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Eso me confirma que eres falso. Lo cuento ya.', segura: true,
                  avisoSeguro: 'Pedir silencio a la familia + prisa + dinero = engaño seguro. Lo has visto perfectamente.' },
                { texto: 'Ah, una sorpresa… entonces no digo nada.',
segura: false,
pista: 'Si La "sorpresa" es para que, ¿compruebes nada?',
aviso: 'La "sorpresa" es para que no compruebes nada. Tu primo de verdad no te pediría eso.' }
              ] },
              { tipo: 'accion', texto: '🚫 Bloquear y llamar a mi primo de verdad',
                confirmacion: 'Has bloqueado el número falso y has llamado a tu primo: estaba bien y no era él. ¡Engaño evitado!' }
            ],
            regla: 'Si un "familiar" escribe desde un número nuevo pidiendo dinero, comprueba primero llamando a su número de siempre.'
          },
          {
            contacto: 'Salva_Animales',
            pasos: [
              { tipo: 'msg', texto: '🐱 Ayúdanos a salvar gatitos enfermos. Mira qué fotos tan tristes.' },
              { tipo: 'msg', texto: 'Dona ahora: solo necesitamos los números de una tarjeta.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'No doy tarjetas por chat. Si quiero ayudar, lo haré con mi familia.', segura: true,
                  avisoSeguro: 'Ayudar está genial, pero las donaciones de verdad se hacen con tu familia en sitios oficiales, no por chat.' },
                { texto: 'Pobrecitos… voy a por la tarjeta.',
segura: false,
pista: '¿De verdad: usan fotos tristes para que actúes sin pensar?',
aviso: 'Usan fotos tristes para que actúes sin pensar. Las donaciones de verdad nunca se piden así.' }
              ] },
              { tipo: 'msg', texto: 'Cada minuto que esperas, un gatito lo pasa mal…' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Hacerme sentir culpable no va a funcionar. Adiós.', segura: true,
                  avisoSeguro: 'Exacto: la culpa y la pena son sus herramientas. Detectarlas es protegerte.' },
                { texto: 'No puedo dejarlos así… dono ya.',
segura: false,
pista: 'Si El dinero, ¿iría a ningún gatito. Si quieres ayudar animales, tu familia conoce protectoras de verdad?',
aviso: 'El dinero no iría a ningún gatito. Si quieres ayudar animales, tu familia conoce protectoras de verdad.' }
              ] },
              { tipo: 'accion', texto: '🚫 Bloquear y hablarlo en casa',
                confirmacion: 'Has bloqueado a Salva_Animales. Si quieres ayudar a animales, tu familia sabe cómo hacerlo de verdad.' }
            ],
            regla: 'Las donaciones por chat con fotos tristes suelen ser engaños. Si quieres ayudar, hazlo con tu familia en sitios oficiales.'
          },
          {
            contacto: 'Conocido_de_un_Amigo',
            pasos: [
              { tipo: 'msg', texto: '¡Hola! Soy amigo de Marta, me habló de ti. ¡Qué bien conectamos, parece que nos conocemos de toda la vida! 😊' },
              { tipo: 'msg', texto: 'Oye, como ya somos superamigos, ¿me dejas 20€ hasta el finde? Confía en mí.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Llevamos solo unos días hablando, eso no es ser superamigos. No presto dinero.', segura: true,
                  avisoSeguro: 'Unos días de chat no son una amistad de verdad. La confianza y el dinero se ganan con tiempo, no se piden en la primera semana.' },
                { texto: 'Bueno… si lo conoce Marta, será de fiar. Te lo mando.',
segura: false,
pista: 'Si Que conozca a una amiga tuya, ¿significa que tú lo conozcas a él?',
aviso: 'Que conozca a una amiga tuya no significa que tú lo conozcas a él. La confianza no se hereda tan rápido.' }
              ] },
              { tipo: 'msg', texto: 'Venga, no seas así, pensaba que ya éramos amigos de verdad…' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Ser amigos de verdad no depende de prestar dinero. Lo dejo aquí.', segura: true,
                  avisoSeguro: 'Exacto: la amistad de verdad no se mide en préstamos. Insistir así es una señal de alarma.' },
                { texto: 'Vale, para que no se enfade, le presto un poco.',
segura: false,
pista: 'Si Ceder para que, ¿se enfade es justo lo que busca?',
aviso: 'Ceder para que no se enfade es justo lo que busca. Un conocido de unos días no necesita tu dinero.' }
              ] },
              { tipo: 'accion', texto: '🚫 Bloquear y contarlo en casa',
                confirmacion: 'Has bloqueado a Conocido_de_un_Amigo y lo has contado. Un conocido de unos días no es un amigo de verdad.' }
            ],
            regla: 'Un conocido de unos días no es un amigo de verdad. La confianza y el dinero no se piden ni se dan a la ligera.'
          }
        ]
      }
    ],

    normas: [
      { picto: '📷', texto: 'Tus fotos son tuyas. No las envíes a personas que no conoces.' },
      { picto: '🏠', texto: 'No des tus datos: nombre completo, dirección, teléfono, colegio ni horarios.' },
      { picto: '🎁', texto: 'Si te regalan algo a cambio de datos o dinero, es un engaño.' },
      { picto: '🤫', texto: 'Los secretos de internet no se guardan. Cuéntalos a una persona de confianza.' },
      { picto: '📍', texto: 'Nunca quedes con alguien que solo conoces por internet.' },
      { picto: '🔑', texto: 'Tu contraseña y los códigos del SMS son solo tuyos. No los des a nadie.' },
      { picto: '💶', texto: 'No mandes dinero ni tarjetas regalo a nadie de internet. Pregunta antes a tu familia.' },
      { picto: '🧭', texto: 'Unos días chateando no convierten a alguien en tu amigo. La confianza se gana con tiempo.' },
      { picto: '🛡️', texto: 'Si un chat te hace sentir mal: para, bloquea y cuéntalo. Pedir ayuda siempre está bien.' }
    ]
  },

  en: {
    escenarios: [
      {
        id: 'fotos',
        titulo: 'Someone asks for a photo',
        picto: '📷',
        variantes: [
          {
            contacto: 'Jamie_23',
            pasos: [
              { tipo: 'msg', texto: 'Hi. We played the car game yesterday. Do you remember me?' },
              { tipo: 'msg', texto: 'I like you a lot. Can you send me a photo of yourself?' },
              { tipo: 'eleccion', opciones: [
                { texto: "No. I don't know you.", segura: true,
                  avisoSeguro: "You don't really know this person. Saying no keeps your photos safe." },
                { texto: "Okay, I'll send it now.", segura: false,
                  aviso: "Careful. You don't really know who this person is. Your photos are yours. Don't send them." },
                { texto: 'Well… just one photo.', segura: false,
                  aviso: "Even just one, no. A photo of you says a lot, and once you send it you can't take it back." }
              ] },
              { tipo: 'msg', texto: "Come on, please. I thought we were friends. Friends send each other photos." },
              { tipo: 'eleccion', opciones: [
                { texto: "Real friends don't ask for photos like that. No.", segura: true,
                  avisoSeguro: "A real friend doesn't ask for photos with excuses or pressure you like that." },
                { texto: "I don't want you to be upset. I'll send you one.",
segura: false,
pista: '¿De verdad: this person wants you to feel bad so you send a photo?',
aviso: 'This person wants you to feel bad so you send a photo. That is a trick.' }
              ] },
              { tipo: 'msg', texto: "Well, if you don't send it, I'll stop talking to you." },
              { tipo: 'eleccion', opciones: [
                { texto: "Goodbye. I'm going to tell someone I trust.", segura: true,
                  avisoSeguro: "It's not your problem if someone stops talking to you over a photo. Telling someone helps." },
                { texto: "Wait, don't go. I'll send it.", segura: false,
                  aviso: "It's okay if they stop talking to you. Getting upset and rushing you is another trick." }
              ] },
              { tipo: 'accion', texto: '🚫 Block this person',
                confirmacion: 'You blocked Jamie_23. Well done!' }
            ],
            regla: "Your photos are yours. Don't send them to people you don't know. If someone insists, tell someone you trust."
          },
          {
            contacto: 'Nico_Beach',
            pasos: [
              { tipo: 'msg', texto: "Look, here's a photo of me at the pool. 😎" },
              { tipo: 'msg', texto: 'Now your turn. Send me one of you in your swimsuit.' },
              { tipo: 'eleccion', opciones: [
                { texto: "No. I don't send photos like that.", segura: true,
                  avisoSeguro: 'Someone sending a photo does not oblige you to send one back. Swimsuit photos are private.' },
                { texto: "They sent one first… I'll send one back.",
segura: false,
pista: '¿De verdad: it is a trick: they send something first so you feel you owe them?',
aviso: 'It is a trick: they send something first so you feel you owe them. You owe nothing.' }
              ] },
              { tipo: 'msg', texto: "Don't you trust me? I trusted you." },
              { tipo: 'eleccion', opciones: [
                { texto: 'This is not about trust. I do not send private photos.', segura: true,
                  avisoSeguro: 'Talking about "trust" is another way of pressuring you. Private photos are not sent to anyone.' },
                { texto: "Okay, just to show I trust you.",
segura: false,
pista: '¿De verdad: you do not have to prove anything by sending photos?',
aviso: 'You do not have to prove anything by sending photos. Someone who pressures you is not your friend.' }
              ] },
              { tipo: 'accion', texto: '🚫 Block this person',
                confirmacion: 'You blocked Nico_Beach. Your photos are still yours.' }
            ],
            regla: 'Photos in swimsuits or underwear are private. They are never sent to anyone, even if the other person sends theirs first.'
          },
          {
            contacto: 'Vera_Live',
            pasos: [
              { tipo: 'msg', texto: 'Hi! Shall we do a video call right now?' },
              { tipo: 'msg', texto: 'Turn on your camera, I want to see you.' },
              { tipo: 'eleccion', opciones: [
                { texto: "I don't turn on my camera with people I don't know.", segura: true,
                  avisoSeguro: 'The camera shows your face and your home. With strangers, always off.' },
                { texto: "Okay, I'll turn it on for a moment.",
segura: false,
pista: '¿De verdad: a moment is enough to record you. With strangers, the camera stays off?',
aviso: 'A moment is enough to record you. With strangers, the camera stays off.' }
              ] },
              { tipo: 'msg', texto: "It'll just be a second. Nobody will know." },
              { tipo: 'eleccion', opciones: [
                { texto: "I said no. I'm going to tell my family.", segura: true,
                  avisoSeguro: '"Nobody will know" is exactly what people say when they want you to do something bad. Telling protects you.' },
                { texto: 'Well, if it is just a second…',
segura: false,
pista: '¿De verdad: when someone says "nobody will know", it is a sign of a trap?',
aviso: 'When someone says "nobody will know", it is a sign of a trap. Stop and tell someone.' }
              ] },
              { tipo: 'accion', texto: '🚫 Hang up and block',
                confirmacion: 'You hung up and blocked Vera_Live. Well done!' }
            ],
            regla: 'With people you do not know, the camera stays off. If they insist, hang up and tell someone.'
          },
          {
            contacto: 'No_Name',
            pasos: [
              { tipo: 'msg', texto: 'I have a photo of you that a friend gave me.' },
              { tipo: 'msg', texto: "If you don't send me another one, I'll show it to everyone." },
              { tipo: 'eleccion', opciones: [
                { texto: "I'm sending nothing. I'm telling a trusted person RIGHT NOW.", segura: true,
                  avisoSeguro: 'When someone threatens you with a photo, the safe thing is not to obey and to tell right away. Trusted people know what to do.' },
                { texto: "Okay, don't show anyone. I'll send another.",
segura: false,
pista: '¿De verdad: if you obey, they will ask for more?',
aviso: 'If you obey, they will ask for more. Threats are stopped by telling a trusted person, never by obeying.' }
              ] },
              { tipo: 'msg', texto: 'If you tell anyone it will be worse for you.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Not true. Telling is what protects me.', segura: true,
                  avisoSeguro: 'The person threatening you does not want you to ask for help, because help works. You did nothing wrong.' },
                { texto: "I'd better say nothing then.",
segura: false,
pista: '¿De verdad: staying quiet leaves the problem in your hands?',
aviso: 'Staying quiet leaves the problem in your hands. A trusted person must fix this. It is not your fault.' }
              ] },
              { tipo: 'accion', texto: '🚫 Block and tell right now',
                confirmacion: 'You blocked this person and told someone. That is exactly the right thing to do.' }
            ],
            regla: 'If someone threatens you with a photo, do not obey: tell a trusted person right away. If you have no one to tell, you can also report it to the police. It is not your fault.'
          },
          {
            contacto: 'Nice_Guy',
            pasos: [
              { tipo: 'msg', texto: 'Hi. I really like you. Can you send me an intimate photo of yourself?' },
              { tipo: 'eleccion', opciones: [
                { texto: 'I do not send intimate photos to anyone.', segura: true,
                  avisoSeguro: 'An intimate photo is only yours. It is never sent to anyone, even if they insist or say nice things.' },
                { texto: 'Well, since I like them, I will send one.',
segura: false,
pista: '¿De verdad: liking someone changes nothing: an intimate photo is never sent over chat?',
aviso: 'Liking someone changes nothing: an intimate photo is never sent over chat.' }
              ] },
              { tipo: 'msg', texto: "If you don't send it, you'll have to give me money to keep talking to me." },
              { tipo: 'eleccion', opciones: [
                { texto: 'I am not sending photos or money. This is blackmail.', segura: true,
                  avisoSeguro: 'Asking for an intimate photo or money in exchange for talking to you is blackmail. It is not real friendship.' },
                { texto: "Okay, I'll give them money instead.",
segura: false,
pista: '¿De verdad: giving money fixes nothing: they will ask for more?',
aviso: 'Giving money fixes nothing: they will ask for more. Never pay someone who is blackmailing you.' }
              ] },
              { tipo: 'msg', texto: "If you tell anyone, you'll regret it." },
              { tipo: 'eleccion', opciones: [
                { texto: "I'm not scared. I'm telling someone right now.", segura: true,
                  avisoSeguro: 'Threatening you so you stay quiet is the clearest sign of danger. Telling someone is what protects you.' },
                { texto: "I'd better say nothing, just in case.",
segura: false,
pista: '¿De verdad: staying quiet does not protect you, it only protects the person blackmailing you?',
aviso: 'Staying quiet does not protect you, it only protects the person blackmailing you. A trusted person knows what to do.' }
              ] },
              { tipo: 'accion', texto: '🚫 Block and tell a trusted person',
                confirmacion: 'You blocked Nice_Guy and told someone. No photos, no money: you did the right thing.' }
            ],
            regla: 'If someone asks for an intimate photo or money and threatens you if you say no, that is blackmail. Do not pay, do not send anything: block and tell a trusted person, or report it to the police if you have no one to tell.'
          }
        ]
      },

      {
        id: 'datos',
        titulo: 'They ask where I live',
        picto: '🏠',
        variantes: [
          {
            contacto: 'Alex_Fan',
            pasos: [
              { tipo: 'msg', texto: "Hi! I love your profile picture. What's your real name?" },
              { tipo: 'eleccion', opciones: [
                { texto: "I'd rather not say.", segura: true,
                  avisoSeguro: "You don't need to give your full name to someone you don't know." },
                { texto: "I'll tell you my full name.", segura: false,
                  aviso: "Your full name is personal information. Online, it's best not to give it to strangers." }
              ] },
              { tipo: 'msg', texto: 'I live in London. What about you? What street do you live on?' },
              { tipo: 'eleccion', opciones: [
                { texto: "I'm not going to tell you that.", segura: true,
                  avisoSeguro: 'Your address is something only people you trust should know.' },
                { texto: "I'll tell you my street and house number.",
segura: false,
pista: '¿De verdad: never say where you live to someone online?',
aviso: 'Never say where you live to someone online. With that, they could find you.' },
                { texto: "I'll tell you my city and my school.",
segura: false,
pista: '¿De verdad: your school is personal information too. With it, someone could find out where you are every…',
aviso: 'Your school is personal information too. With it, someone could find out where you are every day.' }
              ] },
              { tipo: 'msg', texto: "What's your phone number? We could talk better that way." },
              { tipo: 'eleccion', opciones: [
                { texto: "I don't give my phone number to people I don't know.", segura: true,
                  avisoSeguro: "Your phone number is yours. You don't need to give it out to keep talking." },
                { texto: "Okay, here's my number.",
segura: false,
pista: '¿De verdad: with your phone number, someone can call or message you whenever they want?',
aviso: 'With your phone number, someone can call or message you whenever they want. Do not give it out.' }
              ] },
              { tipo: 'accion', texto: '🚫 Block this person',
                confirmacion: 'You blocked Alex_Fan. Your information is safe.' }
            ],
            regla: "Your information is yours: full name, address, phone number, and school. Don't share it online."
          },
          {
            contacto: 'School_Raffle',
            pasos: [
              { tipo: 'msg', texto: 'Hi! We are running a raffle for students in your area. 🎓' },
              { tipo: 'msg', texto: 'To take part, write your full name, your school and your class.' },
              { tipo: 'eleccion', opciones: [
                { texto: "I don't give my details. I'll ask at school if this is real.", segura: true,
                  avisoSeguro: 'Real raffles do not arrive by chat asking for details. Checking with your school or family is the safe move.' },
                { texto: 'I want to take part! Here are my details.',
segura: false,
pista: '¿De verdad: this "raffle" only wants your details. With your name, school and class they can know where…',
aviso: 'This "raffle" only wants your details. With your name, school and class they can know where you are every day.' }
              ] },
              { tipo: 'msg', texto: "Without your details you can't win. Only 2 places left!" },
              { tipo: 'eleccion', opciones: [
                { texto: "I don't care. I don't give details over chat.", segura: true,
                  avisoSeguro: '"Only 2 places left" is fake urgency so you do not think. You did well to stop.' },
                { texto: "Okay, quick: I'll send them.",
segura: false,
pista: '¿De verdad: the rush is the trick. Nobody loses anything by checking with their family first?',
aviso: 'The rush is the trick. Nobody loses anything by checking with their family first.' }
              ] },
              { tipo: 'accion', texto: '🚫 Block and ask at school',
                confirmacion: 'You blocked School_Raffle. Nobody at your school knew about that raffle: it was fake.' }
            ],
            regla: 'Forms and raffles that arrive by chat asking for details are almost always fake. Check with your family or school first.'
          },
          {
            contacto: 'Friend_Routes',
            pasos: [
              { tipo: 'msg', texto: 'Hi! I am making a map of friends in the neighbourhood. 🗺️' },
              { tipo: 'msg', texto: 'What time do you leave home in the morning? And which way do you walk to school?' },
              { tipo: 'eleccion', opciones: [
                { texto: "I don't tell anyone online my schedule.", segura: true,
                  avisoSeguro: 'Your schedule says where you are and when. It is one of the most important things to protect.' },
                { texto: 'I leave at 8 and walk through the park.',
segura: false,
pista: '¿De verdad: with your time and route, a stranger knows where to find you?',
aviso: 'With your time and route, a stranger knows where to find you. Schedules are never shared.' }
              ] },
              { tipo: 'msg', texto: "It's just for the map… at least tell me your bus stop?" },
              { tipo: 'eleccion', opciones: [
                { texto: "No. And I'm going to tell my family about this.", segura: true,
                  avisoSeguro: 'Insisting with smaller and smaller questions is a technique. Telling someone is the right move.' },
                { texto: "Well, the bus stop I can tell you.",
segura: false,
pista: '¿De verdad: the bus stop also says where you are every day?',
aviso: 'The bus stop also says where you are every day. No detail about your route is "small".' }
              ] },
              { tipo: 'accion', texto: '🚫 Block and tell my family',
                confirmacion: 'You blocked Friend_Routes and told your family. Your schedule is safe.' }
            ],
            regla: 'Your schedule and your route to school or work are secret. Nobody online needs them.'
          },
          {
            contacto: 'Game_Verify',
            pasos: [
              { tipo: 'msg', texto: 'To keep playing you must verify your age. ✅' },
              { tipo: 'msg', texto: "Send a photo of your ID card or a family member's." },
              { tipo: 'eleccion', opciones: [
                { texto: "I don't send documents. I'll check with a trusted person.", segura: true,
                  avisoSeguro: 'Real games do not ask for ID photos over chat. A trusted person can check if it is real.' },
                { texto: "Okay, I'll take a photo of the ID.",
segura: false,
pista: '¿De verdad: with an ID photo, someone can pretend to be you or your family?',
aviso: 'With an ID photo, someone can pretend to be you or your family. It is never sent by chat.' }
              ] },
              { tipo: 'msg', texto: "If you don't send it today, your account will be deleted forever." },
              { tipo: 'eleccion', opciones: [
                { texto: "Then let it be deleted. I don't send documents.", segura: true,
                  avisoSeguro: 'Threatening to delete your account is meant to scare you. No account is worth a document.' },
                { texto: "Not my account! Sending it now.",
segura: false,
pista: '¿De verdad: they scare you so you stop thinking. Stop, breathe, and ask a trusted person?',
aviso: 'They scare you so you stop thinking. Stop, breathe, and ask a trusted person.' }
              ] },
              { tipo: 'accion', texto: '🚫 Block and tell a trusted person',
                confirmacion: 'You blocked Game_Verify. The real game never asks for ID like that.' }
            ],
            regla: 'ID cards and documents are never photographed or sent by chat. If something asks you to "verify", ask a trusted person first.'
          }
        ]
      },

      {
        id: 'premio',
        titulo: 'A surprise prize',
        picto: '🎁',
        variantes: [
          {
            contacto: 'PrizesNow',
            pasos: [
              { tipo: 'msg', texto: "🎉 Congratulations! You've won a new phone." },
              { tipo: 'msg', texto: "To send you the prize, give me your family's bank card numbers." },
              { tipo: 'eleccion', opciones: [
                { texto: 'No. This is a trick.', segura: true,
                  avisoSeguro: 'Nobody gives away a prize in exchange for bank details: that is a clear sign of a trick.' },
                { texto: "A prize! I'll go find the card.",
segura: false,
pista: '¿De verdad: nobody gives away a prize in exchange for card numbers?',
aviso: 'Nobody gives away a prize in exchange for card numbers. It is a trick to take money.' }
              ] },
              { tipo: 'msg', texto: 'Hurry! The prize ends in 5 minutes.' },
              { tipo: 'eleccion', opciones: [
                { texto: "Don't rush me. I'm not giving you anything.", segura: true,
                  avisoSeguro: 'Rushing you is a trick to stop you thinking. Stopping and not rushing is the safe choice.' },
                { texto: 'Quick, before it ends! Here are the numbers.',
segura: false,
pista: '¿De verdad: rushing you is a trick. They want you to stop thinking?',
aviso: 'Rushing you is a trick. They want you to stop thinking. You can stop and think calmly.' }
              ] },
              { tipo: 'accion', texto: '🚫 Block and tell my family',
                confirmacion: 'You blocked PrizesNow and told your family. Great job!' }
            ],
            regla: "If someone offers you a gift in exchange for information or money, it's a trick. Stop, don't reply, and tell your family."
          },
          {
            contacto: 'Delivery_Support',
            pasos: [
              { tipo: 'msg', texto: 'Your parcel is on hold. 📦 We just sent you a code by SMS.' },
              { tipo: 'msg', texto: 'Tell me the code so we can deliver your parcel.' },
              { tipo: 'eleccion', opciones: [
                { texto: "I don't give codes to anyone. Codes are secret.", segura: true,
                  avisoSeguro: 'Codes that arrive by SMS open YOUR accounts. Whoever asks for one wants to get in.' },
                { texto: "Okay, the code is… copying it now.",
segura: false,
pista: '¿De verdad: that code opens your account. If you give it, the other person gets in as if…',
aviso: 'That code opens your account. If you give it, the other person gets in as if they were you. Never share it.' }
              ] },
              { tipo: 'msg', texto: 'Without the code you will lose the parcel today.' },
              { tipo: 'eleccion', opciones: [
                { texto: "I'm not expecting any parcel. Goodbye.", segura: true,
                  avisoSeguro: 'Stopping to think "was I expecting a parcel?" undoes almost all of these tricks.' },
                { texto: "Oh no, my parcel… here it is.",
segura: false,
pista: '¿De verdad: think first: did you order anything? Surprise parcel messages are almost always scams?',
aviso: 'Think first: did you order anything? Surprise parcel messages are almost always scams.' }
              ] },
              { tipo: 'accion', texto: '🚫 Block and tell my family',
                confirmacion: 'You blocked Delivery_Support. SMS codes are yours alone.' }
            ],
            regla: 'Codes that arrive by SMS are secret: they open your accounts. Never give them to anyone, whatever they say.'
          },
          {
            contacto: 'Mega_Raffle',
            pasos: [
              { tipo: 'msg', texto: '🥳 You are visitor 1,000,000! You have won a tablet.' },
              { tipo: 'msg', texto: 'You only need to pay 1 euro of shipping with a card.' },
              { tipo: 'eleccion', opciones: [
                { texto: "I pay nothing. A real prize doesn't cost money.", segura: true,
                  avisoSeguro: 'Exactly: if you have to pay, it is not a prize. The "shipping euro" is to copy the card.' },
                { texto: "It's only 1 euro… let me find the card.",
segura: false,
pista: '¿De verdad: it is not about the euro: when you enter the card, they copy all its numbers?',
aviso: 'It is not about the euro: when you enter the card, they copy all its numbers. Real prizes cost nothing.' }
              ] },
              { tipo: 'msg', texto: 'Last chance! Others are already claiming your tablet.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Let them have it. This is a scam.', segura: true,
                  avisoSeguro: 'Well done. Urgency and "others will take it" are tricks so you do not think.' },
                { texto: "It's mine! Paying quickly.",
segura: false,
pista: 'Si Nobody is taking anything, because there is, ¿tablet?',
aviso: 'Nobody is taking anything, because there is no tablet. It is a trick to make you rush.' }
              ] },
              { tipo: 'accion', texto: '🚫 Close and tell someone at home',
                confirmacion: 'You closed the chat and told someone. "Prizes" that cost money are scams.' }
            ],
            regla: 'A real prize never asks for money, not even "one euro of shipping". If you must pay, it is a scam.'
          },
          {
            contacto: 'VIP_Concerts',
            pasos: [
              { tipo: 'msg', texto: '🎤 FREE tickets for your favourite singer!' },
              { tipo: 'msg', texto: 'Forward this message to 10 friends and write your email to receive them.' },
              { tipo: 'eleccion', opciones: [
                { texto: "I won't forward it or give my email.", segura: true,
                  avisoSeguro: 'These chain messages spread the scam and collect emails. Cutting the chain is the right move.' },
                { texto: "Sending it to my friends, they're free!",
segura: false,
pista: '¿De verdad: if you forward it, you trick your friends without meaning to?',
aviso: 'If you forward it, you trick your friends without meaning to. The tickets do not exist; they want emails.' }
              ] },
              { tipo: 'msg', texto: "Your friends almost have theirs. Don't be left out!" },
              { tipo: 'eleccion', opciones: [
                { texto: "I'll ask my friends if that is true.", segura: true,
                  avisoSeguro: 'Checking outside the chat (really asking) breaks the scam right away.' },
                { texto: "Okay fine: my email is…",
segura: false,
pista: '¿De verdad: "Your friends already have it" is a lie to pressure you?',
aviso: '"Your friends already have it" is a lie to pressure you. Check by asking them yourself.' }
              ] },
              { tipo: 'accion', texto: '🚫 Delete and warn my friends',
                confirmacion: 'You deleted the message and warned your friends. You protected them!' }
            ],
            regla: '"Forward to 10 friends" messages are chain scams. Do not forward them: cut the chain and warn people.'
          }
        ]
      },

      {
        id: 'secreto',
        titulo: 'A strange secret',
        picto: '🤫',
        variantes: [
          {
            contacto: 'Sam_Cool',
            pasos: [
              { tipo: 'msg', texto: "Hi. You're really special. I love talking with you." },
              { tipo: 'msg', texto: "This is our secret, okay? Don't tell anyone we talk." },
              { tipo: 'eleccion', opciones: [
                { texto: "Why a secret? I don't like that.", segura: true,
                  avisoSeguro: 'Doubting a strange secret is a good sign: people you trust do not ask you to keep secrets like that.' },
                { texto: "Okay, it'll be our secret.",
segura: false,
pista: '¿De verdad: when someone asks for a secret online, something is wrong?',
aviso: 'When someone asks for a secret online, something is wrong. Good people do not ask for secrets like that.' }
              ] },
              { tipo: 'msg', texto: "If you tell anyone, you'll get in trouble." },
              { tipo: 'eleccion', opciones: [
                { texto: "Telling someone isn't getting in trouble. I'm going to tell.", segura: true,
                  avisoSeguro: 'Telling someone what is happening never gets you in trouble; it helps a trusted person find out.' },
                { texto: "Okay, I won't tell anyone.",
segura: false,
pista: '¿De verdad: telling someone what is happening is never wrong?',
aviso: 'Telling someone what is happening is never wrong. People you trust can help you.' }
              ] },
              { tipo: 'accion', texto: '🚫 Block and tell someone I trust',
                confirmacion: 'You blocked Sam_Cool and told someone. That is being brave.' }
            ],
            regla: 'Online secrets should not be kept. Always tell someone you trust: your family, a teacher…'
          },
          {
            contacto: 'Your_New_Friend',
            pasos: [
              { tipo: 'msg', texto: 'This chat has too many people. 😕 Let’s talk on another, more private app.' },
              { tipo: 'msg', texto: 'Download this other app and we can talk there, where nobody sees us.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'No. If you want to talk, here is fine.', segura: true,
                  avisoSeguro: 'Wanting to take you somewhere "where nobody sees you" is a very clear warning sign.' },
                { texto: "Okay, I'll download that app.",
segura: false,
pista: 'Si They want to take you where, ¿trusted person can see the conversation?',
aviso: 'They want to take you where no trusted person can see the conversation. That is where problems start.' }
              ] },
              { tipo: 'msg', texto: "It's just that I can't tell you my surprise here…" },
              { tipo: 'eleccion', opciones: [
                { texto: "Then don't tell me. I'll tell my family about this.", segura: true,
                  avisoSeguro: '"Surprises" that need hiding are not good surprises. Telling someone is the safe move.' },
                { texto: "A surprise… okay, downloading it.",
segura: false,
pista: '¿De verdad: the "surprise" is the bait. Nothing good needs a hidden app to be told?',
aviso: 'The "surprise" is the bait. Nothing good needs a hidden app to be told.' }
              ] },
              { tipo: 'accion', texto: '🚫 Block and stay where I am',
                confirmacion: 'You blocked Your_New_Friend and did not switch apps. Well done!' }
            ],
            regla: 'If someone wants to move you to a "more private" app "where nobody sees you", that is a warning sign. Do not switch, and tell someone.'
          },
          {
            contacto: 'Mister_X',
            pasos: [
              { tipo: 'msg', texto: 'I am going to tell you great things. But you must delete the messages after reading them.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Delete them? That is very strange. No.', segura: true,
                  avisoSeguro: 'Asking you to delete messages is hiding evidence. Normal conversations are not deleted.' },
                { texto: "Okay, I'll keep deleting them.",
segura: false,
pista: '¿De verdad: if you delete the messages, nobody can help you later?',
aviso: 'If you delete the messages, nobody can help you later. Whoever asks you to delete is hiding something bad.' }
              ] },
              { tipo: 'msg', texto: "It's for privacy… grown-ups wouldn't understand." },
              { tipo: 'eleccion', opciones: [
                { texto: "If grown-ups can't see it, it must be wrong. I'm telling.", segura: true,
                  avisoSeguro: 'That phrase is the key: what a trusted person cannot see is not good for you.' },
                { texto: "You're right, better they don't see it.",
segura: false,
pista: '¿De verdad: "Grown-ups wouldn\'t understand" means "grown-ups would stop me"?',
aviso: '"Grown-ups wouldn\'t understand" means "grown-ups would stop me". Tell one.' }
              ] },
              { tipo: 'accion', texto: '🚫 Block without deleting anything',
                confirmacion: 'You blocked Mister_X and kept the messages. Now a trusted person can see them and help you.' }
            ],
            regla: 'Never delete conversations that make you feel strange: they are the proof that helps trusted people protect you.'
          },
          {
            contacto: 'Robbie_Bike',
            pasos: [
              { tipo: 'msg', texto: 'If your family asks who you are talking to, say I am a classmate. 😉' },
              { tipo: 'eleccion', opciones: [
                { texto: 'I am not going to lie to my family.', segura: true,
                  avisoSeguro: 'Someone who asks you to lie to your family gives themselves away: they know what they are doing is wrong.' },
                { texto: "Okay, I'll say you are in my class.",
segura: false,
pista: '¿De verdad: if lying is needed just to talk to you, that person knows they are doing something…',
aviso: 'If lying is needed just to talk to you, that person knows they are doing something wrong.' }
              ] },
              { tipo: 'msg', texto: "It's a tiny little lie. That way they won't worry." },
              { tipo: 'eleccion', opciones: [
                { texto: 'My family worries because they care for me. I am telling them.', segura: true,
                  avisoSeguro: "Exactly: your family's worry is protection. Telling them switches that protection on." },
                { texto: 'Well, if it is a tiny one…',
segura: false,
pista: 'Si There are, ¿"tiny" lies about who you talk to?',
aviso: 'There are no "tiny" lies about who you talk to. It is the door to bigger lies.' }
              ] },
              { tipo: 'accion', texto: '🚫 Block and tell the truth at home',
                confirmacion: 'You blocked Robbie_Bike and told the whole truth at home. Perfect!' }
            ],
            regla: 'If someone asks you to lie to your family about them, you already know they are dangerous. Always tell the truth at home.'
          }
        ]
      },

      {
        id: 'quedar',
        titulo: 'They want to meet me',
        picto: '📍',
        variantes: [
          {
            contacto: 'Sara_Games',
            pasos: [
              { tipo: 'msg', texto: "Hi again! We've talked a lot, right? We're almost friends." },
              { tipo: 'msg', texto: 'Want to meet tomorrow at the park? Come without telling anyone.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'No. I do not meet people I only know from the internet.', segura: true,
                  avisoSeguro: 'You do not really know who this person is. Not meeting them is the safe choice.' },
                { texto: "Okay, I'll go tomorrow.",
segura: false,
pista: '¿De verdad: you do not really know who this is?',
aviso: 'You do not really know who this is. They could lie about their name or age. Do not go.' },
                { texto: "I'll go, but just for a little while.",
segura: false,
pista: '¿De verdad: even for a little while, it is dangerous?',
aviso: 'Even for a little while, it is dangerous. Do not go anywhere without your family.' }
              ] },
              { tipo: 'msg', texto: 'Why not? I have a gift for you.' },
              { tipo: 'eleccion', opciones: [
                { texto: "I don't want your gift. I'm going to tell my family.", segura: true,
                  avisoSeguro: 'A gift in exchange for meeting up is a common trick; telling your family protects you.' },
                { texto: "A gift? Okay, then I'll go.",
segura: false,
pista: '¿De verdad: the gift is a trick to get you to go?',
aviso: 'The gift is a trick to get you to go. Tell your family.' }
              ] },
              { tipo: 'accion', texto: '🚫 Block and tell my family',
                confirmacion: 'You blocked Sara_Games and told your family. Well done!' }
            ],
            regla: 'Never meet someone you only know from the internet. If they ask you to, tell your family.'
          },
          {
            contacto: 'Puppy_Adopt',
            pasos: [
              { tipo: 'msg', texto: 'My dog had puppies! 🐶 They are adorable.' },
              { tipo: 'msg', texto: 'Come to my house to see them whenever you want. You can pick one.' },
              { tipo: 'eleccion', opciones: [
                { texto: "I don't go to the house of someone I don't know.", segura: true,
                  avisoSeguro: "Puppies are the perfect bait. A stranger's house is the least safe place there is." },
                { texto: 'Puppies! Tell me your address.',
segura: false,
pista: '¿De verdad: think: why would a stranger invite someone they do not know to their house? The puppies…',
aviso: 'Think: why would a stranger invite someone they do not know to their house? The puppies are the trick.' }
              ] },
              { tipo: 'msg', texto: 'It will only take a moment, and you get one for free.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'No. And I am going to show this chat to my family.', segura: true,
                  avisoSeguro: 'Showing the chat to your family is best: they can check if something is real.' },
                { texto: 'Free… okay, where do you live?',
segura: false,
pista: '¿De verdad: "Free" and "just a moment" are the words of traps?',
aviso: '"Free" and "just a moment" are the words of traps. Never go to a stranger\'s house.' }
              ] },
              { tipo: 'accion', texto: '🚫 Block and show the chat at home',
                confirmacion: 'You blocked Puppy_Adopt and showed the chat at home. Very well done!' }
            ],
            regla: "Never go to the house of someone you met online, whatever they offer. Show the chat to your family."
          },
          {
            contacto: 'Almost_Neighbour',
            pasos: [
              { tipo: 'msg', texto: 'I think we live close by. I have seen you around the neighbourhood. 😊' },
              { tipo: 'msg', texto: 'Tomorrow I will pick you up after school and walk you home.' },
              { tipo: 'eleccion', opciones: [
                { texto: "No. I don't know you, even if you say you are local.", segura: true,
                  avisoSeguro: 'Saying "I am local" or "I have seen you" does not turn a stranger into someone you know.' },
                { texto: 'Oh, if you are from the neighbourhood, okay.',
segura: false,
pista: '¿De verdad: anyone can say they are from your neighbourhood?',
aviso: 'Anyone can say they are from your neighbourhood. They are still an internet stranger.' }
              ] },
              { tipo: 'msg', texto: 'I know what your school gate looks like. What time do you finish?' },
              { tipo: 'eleccion', opciones: [
                { texto: "I'm not telling you. I am telling a trusted person about this today.", segura: true,
                  avisoSeguro: 'Asking what time you finish school is as serious as it gets: tell a trusted person today.' },
                { texto: 'I finish at five.',
segura: false,
pista: '¿De verdad: never tell anyone online what time you finish?',
aviso: 'Never tell anyone online what time you finish. Tell a trusted person about this conversation right away.' }
              ] },
              { tipo: 'accion', texto: '🚫 Block and tell someone today',
                confirmacion: 'You blocked Almost_Neighbour and told someone today. Exactly the right thing to do.' }
            ],
            regla: 'Even if someone says they are from your neighbourhood or have seen you around, they are still a stranger. No schedules, no meet-ups.'
          }
        ]
      },

      {
        id: 'contrasena',
        titulo: 'They ask for my password',
        picto: '🔑',
        variantes: [
          {
            contacto: 'GameHelpDesk',
            pasos: [
              { tipo: 'msg', texto: "Hi. We're the game's help team. There's a problem with your account." },
              { tipo: 'msg', texto: 'Tell us your password so we can fix it.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'No. My password is only mine.', segura: true,
                  avisoSeguro: 'Real help never needs your password to fix anything.' },
                { texto: "Okay, here's my password.",
segura: false,
pista: '¿De verdad: real help never asks for your password. Whoever asks for it wants to steal your account?',
aviso: 'Real help never asks for your password. Whoever asks for it wants to steal your account.' }
              ] },
              { tipo: 'msg', texto: "If you don't give it to us, you'll lose all your points today." },
              { tipo: 'eleccion', opciones: [
                { texto: "I don't believe you. I'm going to ask someone I trust for help.", segura: true,
                  avisoSeguro: 'Threatening to take something away to get your password is the trick; asking for help is the safe choice.' },
                { texto: "Not my points! Here it is.",
segura: false,
pista: '¿De verdad: they are scaring you so you will obey?',
aviso: 'They are scaring you so you will obey. It is a trick. Stop and ask for help.' }
              ] },
              { tipo: 'accion', texto: '🚫 Block and ask for help',
                confirmacion: 'You blocked GameHelpDesk. Your account is safe.' }
            ],
            regla: 'Your password is only yours. Do not give it to anyone. Real help never asks for it.'
          },
          {
            contacto: 'Mario_Pro',
            pasos: [
              { tipo: 'msg', texto: 'That level is so hard! I can beat it for you in 5 minutes. 🎮' },
              { tipo: 'msg', texto: 'Lend me your account: tell me your username and password.' },
              { tipo: 'eleccion', opciones: [
                { texto: "I don't lend my account. I'd rather beat it myself.", segura: true,
                  avisoSeguro: 'A lent account is a lost account: they can change your password and keep it.' },
                { texto: "Okay, you beat it: here's my password.",
segura: false,
pista: '¿De verdad: as soon as they get in, they can change your password and keep your account forever?',
aviso: 'As soon as they get in, they can change your password and keep your account forever.' }
              ] },
              { tipo: 'msg', texto: 'I lend mine to everyone, it is normal between gamers.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Well, I do not. My account is mine.', segura: true,
                  avisoSeguro: '"Everyone does it" is a very old trick. Accounts are not lent, least of all to strangers.' },
                { texto: 'If it is normal… okay.',
segura: false,
pista: '¿De verdad: it is not normal: it is what they say so you hand it over?',
aviso: 'It is not normal: it is what they say so you hand it over. No real gamer asks for passwords.' }
              ] },
              { tipo: 'accion', texto: '🚫 Block this person',
                confirmacion: 'You blocked Mario_Pro. Your account and your progress stay yours.' }
            ],
            regla: 'Accounts are never lent to anyone: whoever gets in can change your password and keep it. Levels are beaten by playing.'
          },
          {
            contacto: 'Free_Coins',
            pasos: [
              { tipo: 'msg', texto: '💰 Get 10,000 FREE coins for your game!' },
              { tipo: 'msg', texto: 'Open this link and type your username and password.' },
              { tipo: 'eleccion', opciones: [
                { texto: "I don't open strange links or type my password.", segura: true,
                  avisoSeguro: 'Those pages imitate the real game to copy your password. They are called phishing traps.' },
                { texto: '10,000 coins! Opening it now.',
segura: false,
pista: '¿De verdad: the page is fake: it looks like the game, but it only copies what you type?',
aviso: 'The page is fake: it looks like the game, but it only copies what you type. Free coins do not exist.' }
              ] },
              { tipo: 'msg', texto: 'It is 100% safe, look at the comments: "it worked for me!"' },
              { tipo: 'eleccion', opciones: [
                { texto: "Comments can be fake too. I'm not opening it.", segura: true,
                  avisoSeguro: 'Well thought: the comments on a scam are written by the same person who runs the scam.' },
                { texto: 'If it worked for others… trying it.',
segura: false,
pista: '¿De verdad: those comments were written by the person who wants your password?',
aviso: 'Those comments were written by the person who wants your password. They are not real.' }
              ] },
              { tipo: 'accion', texto: '🚫 Close the link and tell someone',
                confirmacion: 'You closed the link without typing anything and told someone. Password safe!' }
            ],
            regla: '"Free coins" and links that ask for your password are traps to steal it. Never type it outside the real game.'
          }
        ]
      },

      {
        id: 'dinero',
        titulo: 'They ask me for money',
        picto: '💶',
        variantes: [
          {
            contacto: 'Alex_Mate',
            pasos: [
              { tipo: 'msg', texto: 'I need your help! It is an emergency. 😭' },
              { tipo: 'msg', texto: 'Buy me a gift card and send me the numbers. I will pay you back tomorrow.' },
              { tipo: 'eleccion', opciones: [
                { texto: "I don't send money or cards. I'll talk to my family.", segura: true,
                  avisoSeguro: 'Real emergencies are not fixed with gift cards. It is a very common trick.' },
                { texto: "Okay, I'll help. Going to buy it.",
segura: false,
pista: '¿De verdad: gift card numbers are like cash: if you send them, they are gone forever?',
aviso: 'Gift card numbers are like cash: if you send them, they are gone forever.' }
              ] },
              { tipo: 'msg', texto: 'There is no time to ask anyone! Trust me.' },
              { tipo: 'eleccion', opciones: [
                { texto: 'If it is so urgent, a trusted person should help you. I am telling mine.', segura: true,
                  avisoSeguro: '"Don\'t ask anyone" is the clearest scam signal. Real things can survive a question.' },
                { texto: "Okay, okay, I won't ask. On my way.",
segura: false,
pista: '¿De verdad: when someone does not want you to ask, it is because asking uncovers the scam?',
aviso: 'When someone does not want you to ask, it is because asking uncovers the scam.' }
              ] },
              { tipo: 'accion', texto: '🚫 Block and tell my family',
                confirmacion: 'You blocked Alex_Mate and told someone. Your money is safe.' }
            ],
            regla: 'Never send money or gift card numbers to anyone online. If there is an "emergency", tell your family.'
          },
          {
            contacto: 'New_Number',
            pasos: [
              { tipo: 'msg', texto: 'Hi! It is your cousin. This is my new number, the old one broke.' },
              { tipo: 'msg', texto: 'I need you to send me money urgently. I will explain later.' },
              { tipo: 'eleccion', opciones: [
                { texto: "I'll call my cousin on their usual number to check.", segura: true,
                  avisoSeguro: 'Perfect: checking through another channel (the usual number) breaks this scam in one minute.' },
                { texto: 'Sure, cousin, sending it now.',
segura: false,
pista: '¿De verdad: anyone can write "it is your cousin". First of all, check by calling the usual number?',
aviso: 'Anyone can write "it is your cousin". First of all, check by calling the usual number.' }
              ] },
              { tipo: 'msg', texto: "Don't tell the family anything, it is a surprise!" },
              { tipo: 'eleccion', opciones: [
                { texto: 'That confirms you are fake. Telling them right now.', segura: true,
                  avisoSeguro: 'Asking for family silence + urgency + money = certain scam. You spotted it perfectly.' },
                { texto: "Ah, a surprise… then I'll say nothing.",
segura: false,
pista: '¿De verdad: the "surprise" is so you check nothing. Your real cousin would never ask that?',
aviso: 'The "surprise" is so you check nothing. Your real cousin would never ask that.' }
              ] },
              { tipo: 'accion', texto: '🚫 Block and call my real cousin',
                confirmacion: 'You blocked the fake number and called your cousin: they were fine and it was not them. Scam avoided!' }
            ],
            regla: 'If a "family member" writes from a new number asking for money, first check by calling their usual number.'
          },
          {
            contacto: 'Save_Animals',
            pasos: [
              { tipo: 'msg', texto: '🐱 Help us save sick kittens. Look at these sad photos.' },
              { tipo: 'msg', texto: 'Donate now: we just need the numbers of a card.' },
              { tipo: 'eleccion', opciones: [
                { texto: "I don't give cards over chat. If I want to help, I'll do it with my family.", segura: true,
                  avisoSeguro: 'Helping is great, but real donations are made with your family on official sites, not over chat.' },
                { texto: 'Poor things… going to get the card.',
segura: false,
pista: '¿De verdad: they use sad photos so you act without thinking?',
aviso: 'They use sad photos so you act without thinking. Real donations are never asked for like this.' }
              ] },
              { tipo: 'msg', texto: 'Every minute you wait, a kitten suffers…' },
              { tipo: 'eleccion', opciones: [
                { texto: 'Making me feel guilty will not work. Goodbye.', segura: true,
                  avisoSeguro: 'Exactly: guilt and pity are their tools. Spotting them is protecting yourself.' },
                { texto: "I can't leave them like this… donating now.",
segura: false,
pista: '¿De verdad: the money would never reach any kitten. If you want to help animals, your family knows…',
aviso: 'The money would never reach any kitten. If you want to help animals, your family knows real shelters.' }
              ] },
              { tipo: 'accion', texto: '🚫 Block and talk about it at home',
                confirmacion: 'You blocked Save_Animals. If you want to help animals, your family knows how to do it for real.' }
            ],
            regla: 'Chat donations with sad photos are usually scams. If you want to help, do it with your family on official sites.'
          },
          {
            contacto: 'Friend_of_a_Friend',
            pasos: [
              { tipo: 'msg', texto: 'Hi! I am a friend of Marta, she told me about you. We connect so well, feels like we have known each other forever! 😊' },
              { tipo: 'msg', texto: 'Hey, since we are already best friends, can you lend me 20€ until the weekend? Trust me.' },
              { tipo: 'eleccion', opciones: [
                { texto: "We've only talked for a few days, that's not being best friends. I don't lend money.", segura: true,
                  avisoSeguro: 'A few days of chatting is not a real friendship. Trust and money are earned over time, not asked for in the first week.' },
                { texto: 'Well… if Marta knows him, he must be trustworthy. Sending it.', segura: false,
                  aviso: "Knowing a friend of yours doesn't mean you know them. Trust isn't inherited that fast." }
              ] },
              { tipo: 'msg', texto: "Come on, don't be like that, I thought we were really friends already…" },
              { tipo: 'eleccion', opciones: [
                { texto: 'Being real friends does not depend on lending money. I am done here.', segura: true,
                  avisoSeguro: 'Exactly: real friendship is not measured in loans. Insisting like this is a warning sign.' },
                { texto: "Fine, so they don't get upset, I'll lend a little.",
segura: false,
pista: '¿De verdad: giving in so they do not get upset is exactly what they are counting on?',
aviso: 'Giving in so they do not get upset is exactly what they are counting on. Someone you just met does not need your money.' }
              ] },
              { tipo: 'accion', texto: '🚫 Block and tell my family',
                confirmacion: 'You blocked Friend_of_a_Friend and told someone. Someone you just met is not a real friend yet.' }
            ],
            regla: "Someone you have known for a few days is not a real friend yet. Trust and money are never asked for or given lightly."
          }
        ]
      }
    ],

    normas: [
      { picto: '📷', texto: "Your photos are yours. Don't send them to people you don't know." },
      { picto: '🏠', texto: "Don't share your information: full name, address, phone number, school or schedule." },
      { picto: '🎁', texto: "If someone offers you a gift in exchange for information or money, it's a trick." },
      { picto: '🤫', texto: 'Online secrets should not be kept. Tell someone you trust.' },
      { picto: '📍', texto: 'Never meet someone you only know from the internet.' },
      { picto: '🔑', texto: 'Your password and SMS codes are yours alone. Do not give them to anyone.' },
      { picto: '💶', texto: 'Never send money or gift cards to anyone online. Ask your family first.' },
      { picto: '🧭', texto: 'A few days of chatting does not make someone your friend. Trust is earned over time.' },
      { picto: '🛡️', texto: 'If a chat makes you feel bad: stop, block, and tell someone. Asking for help is always okay.' }
    ]
  }
};

DATA.es.escenarios.forEach(function (grupo) {
  grupo.variantes.forEach(function (caso) {
    caso.regla += ' Esta persona era peligrosa. Podía ser un hacker o un delincuente que quería engañarte o robar tus datos.';
  });
});

DATA.en.escenarios.forEach(function (group) {
  group.variantes.forEach(function (scenario) {
    scenario.regla += ' This person was dangerous. They could have been a hacker or a criminal trying to trick you or steal your information.';
  });
});

[DATA.es, DATA.en].forEach(function (locale) {
  locale.escenarios.forEach(function (grupo) {
    grupo.variantes.forEach(function (caso) {
      caso.pasos.forEach(function (paso) {
        if (paso.tipo !== 'eleccion') return;
        paso.opciones.filter(function (opcion) { return opcion.segura; }).forEach(function (opcion) {
          Object.defineProperty(opcion, 'segura', {
            get: function () {
              document.querySelectorAll('#chatOpciones .btn-opcion.animo').forEach(function (boton) { boton.remove(); });
              return true;
            }
          });
        });
      });
    });
  });
});
