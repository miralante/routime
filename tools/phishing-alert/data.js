/* ============================================================
   Datos: Alerta Phishing (autonomía — seguridad digital).
   Correos, mensajes y situaciones simuladas para practicar
   cómo detectar phishing, enlaces sospechosos y archivos
   adjuntos peligrosos.
   Formato: DATA.es / DATA.en, cada uno con escenarios.
   app.js usa DATA[App.i18n.locale()] || DATA.es.
   Tono: Lectura Fácil, sin asustar. El error nunca se castiga.
   ============================================================ */
var DATA = {

  es: {
    escenarios: [
      {
        id: 'phishing',
        titulo: 'Phishing: correos falsos',
        picto: '📧',
        variantes: [
          {
            contacto: 'soporte@banco-seguro.net',
            tipo: 'correo',
            steps: [
              { tipo: 'msg', text: 'Asunto: Su cuenta ha sido bloqueada. Urgente.' },
              { tipo: 'msg', text: 'Estimado cliente, hemos detectado actividad sospechosa en su cuenta. Para evitar el bloqueo definitivo, haga clic en el siguiente enlace e introduzca sus datos: https://banco-seguro.net/acceso' },
              { tipo: 'eleccion', options: [
                { text: 'No hago clic. Llamo a mi banco con el número oficial.', segura: true,
                  avisoSeguro: 'Los bancos nunca piden datos por enlace en un correo. El número oficial está en la tarjeta o en la web oficial.' },
                { text: 'Hago clic porque parece urgente.',
                  segura: false,
                  pista: '¿De verdad: la urgencia es una trampa para que actúes sin pensar?',
                  aviso: 'La urgencia es una trampa. Los bancos no envían enlaces así. Busca el número oficial y llama.' },
                { text: 'Como es mi banco, introduzco mis datos.',
                  segura: false,
                  pista: '¿De verdad: si el correo fuera de tu banco, te pedirían la contraseña por enlace?',
                  aviso: 'Un banco verdadero nunca pide contraseñas por enlace en un correo. Es phishing.' }
              ] },
              { tipo: 'msg', text: 'Su banco necesita verificar su identidad. Escriba su número de tarjeta y PIN.' },
              { tipo: 'eleccion', options: [
                { text: 'Cuelgo y busco el teléfono oficial en la web del banco.', segura: true,
                  avisoSeguro: 'Correcto. Nadie debe pediros datos así, ni siquiera por teléfono si no habéis llamado vosotros antes.' },
                { text: 'Como ya estoy dentro, pongo los datos.',
                  segura: false,
                  pista: '¿De verdad: si ya es phishing, poner más datos solo da más información a los ladrones?',
                  aviso: 'Es phishing. Poner más datos entrega más información a los ladrones.' }
              ] },
              { tipo: 'accion', text: '🚫 Eliminar correo y bloquear remitente',
                confirmacion: 'Has eliminado el correo falso. ¡Bien hecho! No has dado ningún dato.' }
            ],
            regla: 'Tu banco nunca te pide datos por enlace en un correo. Ante la duda, llama tú primero al número oficial.'
          },
          {
            contacto: 'amazon@compras-seguras.org',
            tipo: 'correo',
            steps: [
              { tipo: 'msg', text: 'Asunto: ¡Ha habido un problema con su pedido #8472918!' },
              { tipo: 'msg', text: 'Hola, hemos detectado un cargo fraudulento en su tarjeta. Para cancelarlo y recuperar su dinero, haga clic aquí: bit.ly/3xK9mPq' },
              { tipo: 'eleccion', options: [
                { text: 'No hago clic. Entro en Amazon directamente desde la app.', segura: true,
                  avisoSeguro: 'Los enlaces largos o acortados de correos pueden llevar a cualquier sitio. Entra siempre desde la app o escribe la dirección tú.' },
                { text: 'Hago clic para ver si es verdad.',
                  segura: false,
                  pista: '¿De verdad: bit.ly es una dirección oficial de Amazon?',
                  aviso: 'Un enlace acortado puede llevar a cualquier sitio. Amazon no envía enlaces así.' },
                { text: 'Como es urgente, pongo mis datos rápido.',
                  segura: false,
                  pista: '¿De verdad: la urgencia es para que no pienses. Amazon no envía enlaces así?',
                  aviso: 'La urgencia es una trampa. Amazon comunica los problemas desde su app o web oficial.' }
              ] },
              { tipo: 'msg', text: 'Haga clic para confirmar su identidad y evitar el cargo de 450 €.' },
              { tipo: 'eleccion', options: [
                { text: 'Esto es mentira. Entro en Amazon desde la app para verificar.', segura: true,
                  avisoSeguro: 'Los ladrones copian el estilo de Amazon para engañar. La app oficial es el camino seguro.' },
                { text: '450 euros es mucho. Voy a verificar los datos.',
                  segura: false,
                  pista: '¿De verdad: el miedo al dinero es otra trampa. Entra en Amazon desde la app?',
                  aviso: 'El miedo al dinero es otra trampa. No entres por el enlace; usa la app.' }
              ] },
              { tipo: 'accion', text: '🚫 Eliminar correo y denunciar como phishing',
                confirmacion: 'Has eliminado el correo falso. ¡La app de Amazon te habría confirmado que no había ningún problema!' }
            ],
            regla: 'Amazon y otras tiendas comunican problemas solo desde su app o web. Nunca desde enlaces de correos.'
          },
          {
            contacto: 'info@dhl-entregas.com',
            tipo: 'correo',
            steps: [
              { tipo: 'msg', text: 'Asunto: Su paquete no ha podido ser entregado.' },
              { tipo: 'msg', text: 'Hola, no hemos podido entregar su paquete. Para reprogramar la entrega, haga clic aquí y pague 2,99 € de gastos: dhl-redir.com/paquete' },
              { tipo: 'eleccion', options: [
                { text: 'No pago nada. Llamo a DHL o voy al punto de recogida oficial.', segura: true,
                  avisoSeguro: 'DHL no cobra gastos por reenganchar un envío por enlace. Si hay un paquete real, puedes gestionarlo en un punto oficial.' },
                { text: 'Son solo 2,99 euros. Pago para recibir el paquete antes.',
                  segura: false,
                  pista: '¿De verdad: 2,99 euros es una cantidad pequeña para robarte los datos de la tarjeta?',
                  aviso: 'Cantidades pequeñas sirven para que no dudes. Los datos de la tarjeta son el objetivo.' },
                { text: 'Como tengo un paquete en camino, pago rápido.',
                  segura: false,
                  pista: '¿De verdad: aunque tuvieras un paquete, DHL no cobra así. Es una trampa?',
                  aviso: 'DHL no cobra así. Aunque tuvieras un paquete, el enlace es falso.' }
              ] },
              { tipo: 'msg', text: 'Introduzca los datos de su tarjeta para confirmar el pago de 2,99 €.' },
              { tipo: 'eleccion', options: [
                { text: 'Esto es phishing. Borro el correo sin responder.', segura: true,
                  avisoSeguro: 'Si tienes un paquete real, DHL te deja reprogramar sin pagar por un enlace. Este correo es falso.' },
                { text: 'Pago con PayPal porque es más seguro.',
                  segura: false,
                  pista: '¿De verdad: PayPal también necesita tus datos. El problema es el enlace, no el método?',
                  aviso: 'El problema es el enlace, no el método de pago. Todo esto es una trampa.' }
              ] },
              { tipo: 'accion', text: '🚫 Eliminar correo y verificar desde la web oficial',
                confirmacion: 'Has eliminado el correo falso. Si tenías un paquete, puedes verificar desde dhl.com.' }
            ],
            regla: 'Las empresas de mensajería no cobran por reprogramar entregas por enlaces de correos. Gestiona siempre desde la web oficial o la app.'
          },
          {
            contacto: 'helpdesk@microsoft-365.online',
            tipo: 'correo',
            steps: [
              { tipo: 'msg', text: 'Asunto: Su suscripción a Microsoft 365 caduca hoy.' },
              { tipo: 'msg', text: 'Su suscripción expira en 24 horas. Si no renueva, perderá acceso a Outlook, OneDrive y Teams. Renueve aquí: microsoft-365.online/renew' },
              { tipo: 'eleccion', options: [
                { text: 'No renuevo por un enlace de correo. Voy a la configuración de mi cuenta.', segura: true,
                  avisoSeguro: 'Microsoft comunica las renovaciones desde la configuración de tu cuenta, no por enlaces en correos.' },
                { text: 'Voy a renovar rápido para no perder Outlook.',
                  segura: false,
                  pista: '¿De verdad: perder Outlook por no renovar en 24 horas es una excusa para que pulses rápido?',
                  aviso: 'Microsoft no corta el servicio en 24 horas sin aviso. Es una trampa de phishing.' },
                { text: 'Pago la renovación desde el enlace.',
                  segura: false,
                  pista: '¿De verdad: microsoft-365.online no es la dirección oficial de Microsoft?',
                  aviso: 'microsoft-365.online no es una dirección de Microsoft. Es phishing.' }
              ] },
              { tipo: 'msg', text: 'Haga clic para mantener su suscripción activa y evitar la pérdida de datos.' },
              { tipo: 'eleccion', options: [
                { text: 'Esto es phishing. Entro en microsoft.com desde el navegador.', segura: true,
                  avisoSeguro: 'microsoft.com es la dirección oficial. Entra siempre desde ahí, no desde enlaces de correos.' },
                { text: 'Como tengo datos guardados, voy a renovar.',
                  segura: false,
                  pista: '¿De verdad: la amenaza de perder datos es para que pulses sin pensar. Entra desde la web oficial?',
                  aviso: 'La amenaza de perder datos es para asustarte. Entra desde la dirección oficial.' }
              ] },
              { tipo: 'accion', text: '🚫 Eliminar correo y renovar desde microsoft.com',
                confirmacion: 'Has eliminado el correo falso. Tu suscripción real sigue activa mientras la gestiones desde microsoft.com.' }
            ],
            regla: 'Microsoft, Google y otras empresas nunca te piden renovar desde un enlace de correo. Entra siempre desde la dirección oficial.'
          }
        ]
      },
      {
        id: 'enlaces',
        titulo: 'Enlaces sospechosos',
        picto: '🔗',
        variantes: [
          {
            contacto: 'Desconocido',
            tipo: 'mensaje',
            steps: [
              { tipo: 'msg', text: 'Mensaje de un número desconocido: "¿Mira si sales en esta foto?" + enlace: bit.ly/photo-album-2024' },
              { tipo: 'eleccion', options: [
                { text: 'No hago clic en enlaces de desconocidos. Se lo cuento a una persona de confianza.', segura: true,
                  avisoSeguro: 'Los enlaces de personas desconocidas pueden ser peligrosos. No hagas clic y coméntalo con alguien de confianza.' },
                { text: 'Hago clic para ver si hay una foto mía.',
                  segura: false,
                  pista: '¿De verdad: un enlace de un desconocido puede tener virus o robar tus datos? ¡No hagas clic!',
                  aviso: 'Un enlace que envía un desconocido puede ser una trampa. No hagas clic y cuéntaselo a alguien de confianza.' },
                { text: 'Como dice que salgo yo, lo abro.',
                  segura: false,
                  pista: '¿De verdad: que mencionen a alguien que conoces hace seguro el enlace? Es un engaño habitual. No hagas clic.',
                  aviso: 'Probablemente es un engaño. No hagas clic en enlaces de desconocidos. Consúltalo con alguien de confianza.' }
              ] },
              { tipo: 'msg', text: 'Ábrelo y verás la foto. ¡Mira ya!' },
              { tipo: 'eleccion', options: [
                { text: 'No lo abro. Se lo cuento a mi familia o a alguien de confianza.', segura: true,
                  avisoSeguro: 'No abrirlo es lo correcto. Los enlaces de desconocidos pueden tener virus o llevar a webs falsas.' },
                { text: 'Lo abro y lo cierro enseguida.',
                  segura: false,
                  pista: '¿De verdad: abrir el enlace puede infectar tu dispositivo en ese mismo instante? ¡Nunca lo abras!',
                  aviso: 'Al abrir el enlace, tu dispositivo puede infectarse en ese momento. Borra este mensaje.' }
              ] },
              { tipo: 'accion', text: '🚫 No abrir el enlace y avisar a alguien de confianza',
                confirmacion: 'No has abierto el enlace. ¡Muy bien! No hagas clic en enlaces de desconocidos.' }
            ],
            regla: 'Los enlaces de desconocidos son peligrosos. No hagas clic y consúltalo con alguien de confianza.'
          },
          {
            contacto: 'Desconocido',
            tipo: 'mensaje',
            steps: [
              { tipo: 'msg', text: 'De un número desconocido: "Tienes un paquete sin recoger." + enlace: tinyurl.com/paq-pending' },
              { tipo: 'eleccion', options: [
                { text: 'No hago clic en enlaces desconocidos. Miro en la web de la empresa de paquetería.', segura: true,
                  avisoSeguro: 'Las empresas de paquetería no te envían enlaces desde números desconocidos. Consulta el envío en su web o en su app.' },
                { text: 'Lo abro para ver si de verdad hay un paquete.',
                  segura: false,
                  pista: '¿De verdad: una empresa de paquetería envía enlaces por SMS? Piénsalo antes de hacer clic.',
                  aviso: 'Las empresas de paquetería no envían enlaces así. Es una trampa para que hagas clic.' },
                { text: 'Solo es mirar un paquete. Lo abro.',
                  segura: false,
                  pista: '¿De verdad: un clic puede llevarte a un virus o a una página falsa? Nunca hagas clic en enlaces de desconocidos.',
                  aviso: 'Este tipo de enlace suele llevar a un virus o a robar información. ¡No hagas clic!' }
              ] },
              { tipo: 'msg', text: '¡Solo quedan 24 horas para recoger tu paquete! Haz clic aquí: tinyurl.com/paq-pending' },
              { tipo: 'eleccion', options: [
                { text: 'Esto me presiona para actuar. Seguro que es un estafador. Se lo cuento a alguien de confianza.', segura: true,
                  avisoSeguro: 'Meter prisa es un truco habitual de los estafadores. Las empresas de paquetería no presionan así.' },
                { text: '¡Solo queda un día! ¡Hago clic ya!',
                  segura: false,
                  pista: '¿De verdad: la prisa es para que no pienses? Respira y piensa antes de actuar.',
                  aviso: 'La prisa es una trampa para que actúes sin pensar. ¡No hagas clic!' }
              ] },
              { tipo: 'accion', text: '🚫 No hacer clic y mirar el envío en la web oficial',
                confirmacion: 'No has hecho clic en el enlace. Mirar el envío en la web oficial de la empresa es lo correcto.' }
            ],
            regla: 'Las empresas de paquetería no envían enlaces por SMS de desconocidos. Consulta siempre el envío en su web o en su app.'
          },
          {
            contacto: 'Amigo en WeChat',
            tipo: 'mensaje',
            steps: [
              { tipo: 'msg', text: 'Mensaje de un amigo: "¡Es mi nueva tienda, haz clic para votarme!" + enlace: goo.gl/vote2024' },
              { tipo: 'eleccion', options: [
                { text: 'Primero pregunto a mi amigo si es verdad.', segura: true,
                  avisoSeguro: 'Incluso los enlaces de un amigo pueden venir de un estafador que ha robado su cuenta. Confírmalo primero.' },
                { text: 'El enlace de un amigo seguro que no tiene problema. Lo abro directamente.',
                  segura: false,
                  pista: '¿De verdad: un amigo podría tener la cuenta robada? No bajes la guardia por ser de un amigo.',
                  aviso: 'Los estafadores roban cuentas. Incluso los enlaces de amigos hay que confirmarlos primero.' },
                { text: 'Votar por un amigo es poca cosa. Lo abro y voto.',
                  segura: false,
                  pista: '¿De verdad: una web de votaciones puede recoger tus datos o tener un virus? Hay que comprobar que es real.',
                  aviso: 'Las webs de votación pueden recoger datos personales o tener virus. Confírmalo primero con tu amigo.' }
              ] },
              { tipo: 'msg', text: '¡Ábrelo ya! ¡Hoy es el último día!' },
              { tipo: 'eleccion', options: [
                { text: 'Llamo a mi amigo para confirmar que es verdad.', segura: true,
                  avisoSeguro: 'Llamar para confirmar es el método más seguro. Si tu amigo dice que no lo envió, no hagas clic.' },
                { text: 'Mi amigo me presiona, así que lo abro y voto ya.',
                  segura: false,
                  pista: '¿De verdad: la prisa de tu amigo es para que no pienses? Espera y confirma antes de decidir.',
                  aviso: 'Presionarte para actuar es una trampa habitual. Confírmalo primero.' }
              ] },
              { tipo: 'accion', text: '🚫 No hacer clic y llamar primero para confirmar',
                confirmacion: 'Has confirmado primero si tu amigo envió este mensaje. ¡Buena idea!' }
            ],
            regla: 'Incluso los enlaces de amigos hay que verificarlos. Llamar o escribir para confirmar es lo más seguro.'
          }
        ]
      },
      {
        id: 'adjuntos',
        titulo: 'Archivos adjuntos peligrosos',
        picto: '📎',
        variantes: [
          {
            contacto: 'Remitente desconocido',
            tipo: 'correo',
            steps: [
              { tipo: 'msg', text: 'De: invoice-pdf@company-billing.net' },
              { tipo: 'msg', text: 'Asunto: Tiene una factura pendiente de pago. Adjunto: invoice_March_2024.pdf.exe' },
              { tipo: 'eleccion', options: [
                { text: 'No lo abro. Un pdf con .exe es un virus. Lo borro y lo denuncio.', segura: true,
                  avisoSeguro: 'invoice.pdf.exe es un archivo de virus típico. Las facturas reales nunca son .exe.' },
                { text: 'Parece una factura. La abro para ver.',
                  segura: false,
                  pista: '¿De verdad: un archivo que acaba en .exe es un PDF? No es un documento, es un programa. ¡Nunca lo abras!',
                  aviso: 'El nombre invoice.pdf.exe indica que es un programa, no un documento. ¡No lo abras!' },
                { text: 'Con cuidado no pasa nada. La abro.',
                  segura: false,
                  pista: '¿De verdad: abrir un .exe puede instalar un programa malicioso sin que lo notes? ¡Nunca lo abras!',
                  aviso: 'Un archivo .exe puede instalar un virus sin que lo notes. Nunca abras archivos .exe de correos.' }
              ] },
              { tipo: 'msg', text: 'Su equipo ha sido escaneado. Haga clic aquí para descargar un antivirus.' },
              { tipo: 'eleccion', options: [
                { text: 'Es un truco nuevo de los estafadores. Desconéctate de internet y pide ayuda a alguien de confianza.', segura: true,
                  avisoSeguro: 'Los estafadores seguirán intentando engañarte. Desconectarse y pedir ayuda es lo correcto.' },
                { text: 'Sigo las instrucciones y descargo el antivirus.',
                  segura: false,
                  pista: '¿De verdad: el "antivirus" que te piden descargar es en realidad más virus? ¡No te fíes!',
                  aviso: 'El software que te piden descargar es en realidad más virus. ¡No lo descargues!' }
              ] },
              { tipo: 'accion', text: '🚫 Borrar el correo y ejecutar un análisis de seguridad del equipo',
                confirmacion: 'No has abierto el adjunto. ¡Borrar el correo y analizar el equipo es lo correcto!' }
            ],
            regla: 'Los archivos .exe y otros ejecutables de un correo son virus. No los abras; bórralos directamente.'
          },
          {
            contacto: 'info@celebrity-news-daily.com',
            tipo: 'correo',
            steps: [
              { tipo: 'msg', text: 'Asunto: ¡Exclusiva! ¡Se filtran fotos privadas de un famoso! Haga clic para ver: celebrity-photos.zip' },
              { tipo: 'eleccion', options: [
                { text: 'No hago clic. Este tipo de correos son trampas para descargar virus. Lo borro.', segura: true,
                  avisoSeguro: 'Las fotos de famosos como gancho son una forma habitual de propagar virus. No hagas clic ni descargues ningún adjunto.' },
                { text: 'Fotos de un famoso. Lo abro a ver.',
                  segura: false,
                  pista: '¿De verdad: el gancho es la forma habitual de los estafadores de propagar virus? ¡No dejes que la curiosidad te gane!',
                  aviso: 'El gancho de fotos de famosos es una forma habitual de propagar virus. La curiosidad se usa en tu contra.' },
                { text: 'Un archivo comprimido no pasa nada. Lo descomprimo.',
                  segura: false,
                  pista: '¿De verdad: un archivo .zip puede contener un virus? El virus se ejecuta al descomprimirlo.',
                  aviso: 'Un .zip puede contener virus. Nunca abras archivos comprimidos de correos de desconocidos.' }
              ] },
              { tipo: 'msg', text: '¡Míralo ya! ¡Descarga por tiempo limitado! ¡Fotos privadas de famosos!' },
              { tipo: 'eleccion', options: [
                { text: 'Esto usa mi curiosidad para engañarme. No lo abro de ninguna manera.', segura: true,
                  avisoSeguro: 'Los títulos tentadores son la forma en que los estafadores hacen perder el juicio. Borrar el correo es lo más seguro.' },
                { text: 'La descarga por tiempo limitado es tentadora, pero la abro a ver.',
                  segura: false,
                  pista: '¿De verdad: el "tiempo limitado" es para que actúes sin pensar? Es una táctica psicológica de los estafadores.',
                  aviso: 'El tiempo limitado es una táctica psicológica para que pierdas el juicio. ¡No caigas!' }
              ] },
              { tipo: 'accion', text: '🚫 Borrar el correo, sin responder',
                confirmacion: 'No has abierto el adjunto. ¡Muy bien! La curiosidad se puede usar en tu contra. Mantente alerta.' }
            ],
            regla: 'Los adjuntos con contenido tentador en correos de desconocidos suelen ser virus. No dejes que la curiosidad te gane. Mantente alerta.'
          },
          {
            contacto: 'hr@company-payroll.net',
            tipo: 'correo',
            steps: [
              { tipo: 'msg', text: 'Asunto: Detalle de su nómina - Adjunto: salary-March-2024.xlsx.exe' },
              { tipo: 'eleccion', options: [
                { text: 'No lo abro. Las empresas no envían nóminas en archivos .exe. Lo consulto con RR. HH.', segura: true,
                  avisoSeguro: 'Los departamentos financieros nunca envían archivos .exe. Las nóminas suelen ser PDF o documentos en papel.' },
                { text: 'Es una nómina, no pasa nada. La abro.',
                  segura: false,
                  pista: '¿De verdad: una nómina en formato .exe es normal? Las nóminas normales nunca son archivos ejecutables.',
                  aviso: 'Una nómina nunca es un .exe. Es un disfraz típico de virus.' },
                { text: 'Viene del correo de la empresa, así que no pasa nada.',
                  segura: false,
                  pista: '¿De verdad: un correo de la empresa siempre es de la empresa? Los estafadores pueden falsear el remitente. No bajes la guardia.',
                  aviso: 'Los estafadores pueden falsificar direcciones de correo. Aunque parezca de la empresa, mantente alerta.' }
              ] },
              { tipo: 'msg', text: 'Por favor, revise su nómina cuanto antes. Si tiene dudas, contacte con el departamento de RR. HH.' },
              { tipo: 'eleccion', options: [
                { text: 'Voy en persona a RR. HH. a preguntar si enviaron este correo.', segura: true,
                  avisoSeguro: 'Ir en persona a RR. HH. es lo más seguro. No uses los datos de contacto del correo.' },
                { text: 'Respondo al correo para preguntar.',
                  segura: false,
                  pista: '¿De verdad: la dirección de respuesta también puede estar controlada por estafadores? Ve en persona a la oficina de RR. HH.',
                  aviso: 'La dirección de respuesta también puede estar controlada por estafadores. Ve en persona a confirmarlo.' }
              ] },
              { tipo: 'accion', text: '🚫 No abrir el adjunto e ir a RR. HH. a confirmarlo',
                confirmacion: 'Cuando preguntaste en RR. HH., dijeron que nunca enviaron este correo. ¡Menos mal!' }
            ],
            regla: 'Los documentos de la empresa nunca se envían en formato .exe. Ir en persona al departamento correspondiente es lo más seguro.'
          }
        ]
      },
      {
        id: 'contrasenas',
        titulo: 'Protección de contraseñas',
        picto: '🔐',
        variantes: [
          {
            contacto: 'Desconocido',
            tipo: 'mensaje',
            steps: [
              { tipo: 'msg', text: 'Mensaje de texto recibido: "Su cuenta de Netflix ha sido suspendida. Haga clic en el enlace para reactivarla: netflix.com.verify-login.com"' },
              { tipo: 'eleccion', options: [
                { text: 'No introduzco contraseñas en un enlace. Miro el estado de mi cuenta en la app de Netflix.', segura: true,
                  avisoSeguro: 'Netflix no te pide volver a iniciar sesión por SMS. Abre la app o la web oficial de Netflix para comprobarlo.' },
                { text: 'Hago clic ya para reactivarla, o no podré ver series.',
                  segura: false,
                  pista: '¿De verdad: la prisa es un truco de los estafadores para que actúes rápido? Entra siempre desde la app o la web oficial.',
                  aviso: 'La prisa es un truco habitual de los estafadores. Entra en Netflix desde la app oficial.' },
                { text: 'Escribo mi correo y contraseña de Netflix en el enlace.',
                  segura: false,
                  pista: '¿De verdad: este enlace es la web oficial de Netflix? ¡Le estarías dando tu contraseña a estafadores!',
                  aviso: 'netflix.com.verify-login.com no es la web de Netflix. ¡Le estarías dando los datos de tu cuenta a estafadores!' }
              ] },
              { tipo: 'msg', text: 'Introduzca su correo y contraseña para reactivar la cuenta.' },
              { tipo: 'eleccion', options: [
                { text: 'No introduzco contraseñas en webs no oficiales. Abro la app de Netflix para comprobarlo.', segura: true,
                  avisoSeguro: 'Entra siempre desde la app o la web oficial. Los estafadores pueden crear una web falsa que parezca Netflix.' },
                { text: 'Pruebo a escribir mi correo y una contraseña de un solo uso.',
                  segura: false,
                  pista: '¿De verdad: una contraseña temporal es segura en una web no oficial? Los estafadores pueden usarla para entrar en tu cuenta real.',
                  aviso: 'Una contraseña de un solo uso también es una contraseña. No escribas ninguna en webs no oficiales.' }
              ] },
              { tipo: 'accion', text: '🚫 No escribir la contraseña y abrir la app de Netflix para comprobarlo',
                confirmacion: 'Lo has comprobado en la app de Netflix y tu cuenta está bien. ¡Ese SMS era una estafa!' }
            ],
            regla: 'Entra siempre en tus cuentas desde la app o la web oficial. No inicies sesión desde enlaces de SMS o correos.'
          },
          {
            contacto: 'Desconocido',
            tipo: 'mensaje',
            steps: [
              { tipo: 'msg', text: 'Correo recibido: "Su Apple ID ha sido bloqueado. Haga clic en el enlace para verificar su identidad: appleid-security.net/verify"' },
              { tipo: 'eleccion', options: [
                { text: 'No introduzco la contraseña de mi Apple ID en un enlace de correo. Lo compruebo en la web oficial de Apple.', segura: true,
                  avisoSeguro: 'Apple no te pide verificar la contraseña por correo. Compruébalo en la web de Apple o en los ajustes de tu Apple ID en el móvil.' },
                { text: 'Que mi Apple ID esté bloqueado es grave. Hago clic ya para verificarlo.',
                  segura: false,
                  pista: '¿De verdad: los estafadores usan el miedo para que actúes rápido? Apple nunca pide verificar la contraseña por correo.',
                  aviso: 'Los estafadores usan el miedo. Apple nunca pide contraseñas por correo.' },
                { text: 'Escribo mi Apple ID y contraseña para verificarlo.',
                  segura: false,
                  pista: '¿De verdad: appleid-security.net es una web de Apple? ¡Le estarías dando tu Apple ID a estafadores!',
                  aviso: 'Este enlace es falso. La web de Apple es apple.com. Nunca escribas tu Apple ID en webs que no sean de Apple.' }
              ] },
              { tipo: 'msg', text: 'Su Apple ID será desactivado de forma permanente. Haga clic para verificarlo ahora.' },
              { tipo: 'eleccion', options: [
                { text: 'No hago clic. Miro el estado de mi Apple ID en los ajustes del móvil.', segura: true,
                  avisoSeguro: 'Mirar el Apple ID en los ajustes del móvil es la forma más segura de comprobar la cuenta. Los estafadores no pueden falsificarlo.' },
                { text: '¡Desactivarlo para siempre da mucho miedo! ¡Hago clic ya!',
                  segura: false,
                  pista: '¿De verdad: el miedo es para que pierdas el juicio? Respira y compruébalo en los ajustes.',
                  aviso: 'El miedo es el arma de los estafadores. Comprueba el estado de tu Apple ID en los ajustes del móvil.' }
              ] },
              { tipo: 'accion', text: '🚫 No hacer clic y comprobar el Apple ID en los ajustes del móvil',
                confirmacion: 'Has comprobado los ajustes del móvil y tu Apple ID está bien. ¡Ese correo era phishing!' }
            ],
            regla: 'Apple, Google y Microsoft nunca te piden contraseñas por correo. Compruébalo en su app o web oficial.'
          }
        ]
      }
    ],
    normas: [
      { picto: '📧', text: 'Los bancos y empresas nunca piden datos por enlace en un correo.' },
      { picto: '🔗', text: 'No hagas clic en enlaces de correos o mensajes de desconocidos.' },
      { picto: '📎', text: 'No abras archivos adjuntos de correos de desconocidos, sobre todo si son .exe, .zip o .scr.' },
      { picto: '🔐', text: 'Las contraseñas se escriben solo en la web oficial, nunca en enlaces de correos.' },
      { picto: '📱', text: 'Si alguien te pide datos personales por chat, es motivo para desconfiar.' },
      { picto: '⏰', text: 'La urgencia es una herramienta de los ladrones para que actúes sin pensar.' },
      { picto: '✅', text: 'Ante la duda, pregunta a una persona de confianza antes de hacer clic.' }
    ]
  },

  en: {
    escenarios: [
      {
        id: 'phishing',
        titulo: 'Phishing: fake emails',
        picto: '📧',
        variantes: [
          {
            contacto: 'support@yourbank-secure.net',
            tipo: 'correo',
            steps: [
              { tipo: 'msg', text: 'Subject: Your account has been blocked. Urgent.' },
              { tipo: 'msg', text: 'Dear customer, we detected suspicious activity on your account. To avoid permanent blocking, click the link and enter your details: https://yourbank-secure.net/access' },
              { tipo: 'eleccion', options: [
                { text: 'I do not click. I call my bank using the official number.', segura: true,
                  avisoSeguro: 'Banks never ask for details via a link in an email. The official number is on your card or the official website.' },
                { text: 'I click because it looks urgent.',
                  segura: false,
                  pista: 'Urgency is a trap to make you act without thinking. Banks never send links like this.',
                  aviso: 'Urgency is a trap. Banks do not send links like this. Find the official number and call.' },
                { text: 'It is my bank, so I will enter my details.',
                  segura: false,
                  pista: 'Would your real bank ask for your password via an email link?',
                  aviso: 'A real bank never asks for passwords via an email link. This is phishing.' }
              ] },
              { tipo: 'msg', text: 'Your bank needs to verify your identity. Enter your card number and PIN.' },
              { tipo: 'eleccion', options: [
                { text: 'I hang up and look for the official phone number on the bank website.', segura: true,
                  avisoSeguro: 'No one should ask for your data this way, not even by phone if you did not call first.' },
                { text: 'Since I am already here, I will enter the details.',
                  segura: false,
                  pista: 'If it is already phishing, entering more data only gives thieves more information.',
                  aviso: 'It is phishing. Entering more data gives thieves more information.' }
              ] },
              { tipo: 'accion', text: '🚫 Delete email and block sender',
                confirmacion: 'You deleted the fake email. Well done! You did not give any data.' }
            ],
            regla: 'Your bank never asks for data via a link in an email. When in doubt, call the official number yourself.'
          },
          {
            contacto: 'amazon@secure-shopping.org',
            tipo: 'correo',
            steps: [
              { tipo: 'msg', text: 'Subject: There was a problem with your order #8472918!' },
              { tipo: 'msg', text: 'Hello, we detected a fraudulent charge on your card. To cancel it and get your money back, click here: bit.ly/3xK9mPq' },
              { tipo: 'eleccion', options: [
                { text: 'I do not click. I open Amazon directly from the app.', segura: true,
                  avisoSeguro: 'Shortened links in emails can lead anywhere. Always open the app or type the address yourself.' },
                { text: 'I click to see if it is real.',
                  segura: false,
                  pista: 'Is bit.ly really an official Amazon address?',
                  aviso: 'A shortened link can lead anywhere. Amazon does not send links like this.' },
                { text: 'Since it is urgent, I will enter my data quickly.',
                  segura: false,
                  pista: 'Fear of money loss is another trap. Amazon communicates problems only from its app or website.',
                  aviso: 'Fear of money loss is another trap. Amazon only contacts you from its app or website.' }
              ] },
              { tipo: 'msg', text: 'Click to confirm your identity and avoid the 450 € charge.' },
              { tipo: 'eleccion', options: [
                { text: 'This is fake. I open the Amazon app to check.', segura: true,
                  avisoSeguro: 'Thieves copy Amazon style to trick you. The official app is the safe way.' },
                { text: '450 euros is a lot. I will verify the data.',
                  segura: false,
                  pista: 'Fear of money is a trap. Enter Amazon from the app?',
                  aviso: 'The fear of money is a trap. Do not enter through the link; use the app.' }
              ] },
              { tipo: 'accion', text: '🚫 Delete email and report as phishing',
                confirmacion: 'You deleted the fake email. The Amazon app would have confirmed there was no problem!' }
            ],
            regla: 'Amazon and other shops communicate problems only from their app or website. Never from links in emails.'
          },
          {
            contacto: 'info@dhl-delivery.com',
            tipo: 'correo',
            steps: [
              { tipo: 'msg', text: 'Subject: Your package could not be delivered.' },
              { tipo: 'msg', text: 'Hello, we could not deliver your package. To reschedule delivery, click here and pay 2.99 € fee: dhl-redir.com/package' },
              { tipo: 'eleccion', options: [
                { text: 'I do not pay anything. I call DHL or go to an official pickup point.', segura: true,
                  avisoSeguro: 'DHL does not charge fees to reschedule a delivery via an email link. If there is a real package, you can manage it at an official point.' },
                { text: 'It is only 2.99 euros. I pay to get the package sooner.',
                  segura: false,
                  pista: 'Is 2.99 euros a small amount to steal your card details?',
                  aviso: 'Small amounts make you hesitate less. Your card details are the target.' },
                { text: 'Since I have a package on the way, I pay quickly.',
                  segura: false,
                  pista: 'Would DHL really charge like this? It is a trap.',
                  aviso: 'DHL does not charge like this. Even if you had a package, the link is fake.' }
              ] },
              { tipo: 'msg', text: 'Enter your card details to confirm the 2.99 € payment.' },
              { tipo: 'eleccion', options: [
                { text: 'This is phishing. I delete the email without replying.', segura: true,
                  avisoSeguro: 'If you had a real package, DHL lets you reschedule without paying via a link. This email is fake.' },
                { text: 'I pay with PayPal because it is safer.',
                  segura: false,
                  pista: 'The problem is the link, not the payment method. Everything here is a trap.',
                  aviso: 'The problem is the link, not the payment method. This is all a trap.' }
              ] },
              { tipo: 'accion', text: '🚫 Delete email and verify from the official website',
                confirmacion: 'You deleted the fake email. If you had a package, you can verify from dhl.com.' }
            ],
            regla: 'Delivery companies do not charge to reschedule deliveries via email links. Always manage from the official website or app.'
          },
          {
            contacto: 'helpdesk@microsoft-365.online',
            tipo: 'correo',
            steps: [
              { tipo: 'msg', text: 'Subject: Your Microsoft 365 subscription expires today.' },
              { tipo: 'msg', text: 'Your subscription expires in 24 hours. If you do not renew, you will lose access to Outlook, OneDrive and Teams. Renew here: microsoft-365.online/renew' },
              { tipo: 'eleccion', options: [
                { text: 'I do not renew via an email link. I go to my account settings.', segura: true,
                  avisoSeguro: 'Microsoft communicates renewals from your account settings, not via links in emails.' },
                { text: 'I will renew quickly so I do not lose Outlook.',
                  segura: false,
                  pista: 'Would Microsoft really cut off your access in 24 hours without warning? It is a phishing trap.',
                  aviso: 'Microsoft does not cut off service in 24 hours without warning. It is a phishing trap.' },
                { text: 'I pay the renewal from the link.',
                  segura: false,
                  pista: 'Is microsoft-365.online really a Microsoft address?',
                  aviso: 'microsoft-365.online is not a Microsoft address. It is phishing.' }
              ] },
              { tipo: 'msg', text: 'Click to keep your subscription active and avoid data loss.' },
              { tipo: 'eleccion', options: [
                { text: 'This is phishing. I enter microsoft.com directly in the browser.', segura: true,
                  avisoSeguro: 'microsoft.com is the official address. Always enter from there, not from email links.' },
                { text: 'Since I have data saved, I will renew.',
                  segura: false,
                  pista: 'The threat of losing data is to make you click without thinking. Enter from the official website.',
                  aviso: 'The threat of losing data is to scare you. Enter from the official address.' }
              ] },
              { tipo: 'accion', text: '🚫 Delete email and renew from microsoft.com',
                confirmacion: 'You deleted the fake email. Your real subscription stays active while you manage it from microsoft.com.' }
            ],
            regla: 'Microsoft, Google and other companies never ask you to renew via an email link. Always enter from the official address.'
          }
        ]
      },
      {
        id: 'enlaces',
        titulo: 'Suspicious links',
        picto: '🔗',
        variantes: [
          {
            contacto: 'Unknown',
            tipo: 'mensaje',
            steps: [
              { tipo: 'msg', text: 'Message from unknown number: "See if this photo has you in it?" + link: bit.ly/photo-album-2024' },
              { tipo: 'eleccion', options: [
                { text: 'I do not click unknown links. I tell a trusted person about this message.', segura: true,
                  avisoSeguro: 'Links from unknown people are likely dangerous. Do not click. Talk to someone you trust.' },
                { text: 'I click to see if there is a photo of me.',
                  segura: false,
                  pista: 'Links from strangers can contain viruses or steal personal information. Do not click!',
                  aviso: 'A stranger sending you a link is a trap. Do not click. Tell a trusted person.' },
                { text: 'Since it says it has me in it, I will click.',
                  segura: false,
                  pista: 'Tricking you into clicking is a common scam. Even if it mentions someone you know, do not click unknown links.',
                  aviso: 'This is likely a trick. Do not click unknown links. Talk to someone you trust.' }
              ] },
              { tipo: 'msg', text: 'Open this link to see the photo. Come look now!' },
              { tipo: 'eleccion', options: [
                { text: 'I do not open it. I tell a trusted person.', segura: true,
                  avisoSeguro: 'Not opening it is correct. Links from strangers can contain viruses or lead to fake websites.' },
                { text: 'I will open it and close it right away.',
                  segura: false,
                  pista: 'Opening a link can infect your device the moment you click. Never open it!',
                  aviso: 'Opening the link can infect your device instantly. Delete this message.' }
              ] },
              { tipo: 'accion', text: '🚫 Do not open the link, tell a trusted person',
                confirmacion: 'You did not open the link. Well done! Do not click links from strangers.' }
            ],
            regla: 'Links from strangers are dangerous. Do not click. Talk to someone you trust.'
          },
          {
            contacto: 'Unknown',
            tipo: 'mensaje',
            steps: [
              { tipo: 'msg', text: 'From unknown number: "You have an unclaimed package." + link: tinyurl.com/paq-pending' },
              { tipo: 'eleccion', options: [
                { text: 'I do not click unknown links. I check on the delivery company website.', segura: true,
                  avisoSeguro: 'Delivery companies do not send links via unknown numbers. Check the official website or app for tracking.' },
                { text: 'I click to see if there really is a package.',
                  segura: false,
                  pista: 'Delivery companies do not send links via text message. Think before you click.',
                  aviso: 'Delivery companies do not send links this way. This is a click-bait trap.' },
                { text: 'It is just checking a package, I will click.',
                  segura: false,
                  pista: 'Clicking can lead to viruses or fake pages. Never click links from strangers.',
                  aviso: 'Such links usually lead to viruses or data theft. Do not click!' }
              ] },
              { tipo: 'msg', text: 'Only 24 hours left to claim your package! Click here: tinyurl.com/paq-pending' },
              { tipo: 'eleccion', options: [
                { text: 'This is pushing me to act. It must be a scam. I tell a trusted person.', segura: true,
                  avisoSeguro: 'Creating urgency is a common scam tactic. Delivery companies do not pressure you like this.' },
                { text: 'Only one day left! I will click quickly!',
                  segura: false,
                  pista: 'Urgency is a trick to make you act without thinking. Take a breath and think first.',
                  aviso: 'Urgency is a trick to make you act without thinking. Do not click!' }
              ] },
              { tipo: 'accion', text: '🚫 Do not click, check tracking on the official website',
                confirmacion: 'You did not click the link. Checking tracking on the official website is the right move.' }
            ],
            regla: 'Delivery companies do not send links via unknown texts. Always check on the official website or app.'
          },
          {
            contacto: 'WeChat Friend',
            tipo: 'mensaje',
            steps: [
              { tipo: 'msg', text: 'Friend sends: "This is my new shop, click to vote for me!" + link: goo.gl/vote2024' },
              { tipo: 'eleccion', options: [
                { text: 'I first ask my friend if it is real.', segura: true,
                  avisoSeguro: 'Scammers can hack your friends accounts. Even links from friends need verification.' },
                { text: 'A friend sent it, it must be safe, I will click.',
                  segura: false,
                  pista: 'Scammers can hack friends accounts. Do not let your guard down just because a friend sent it.',
                  aviso: 'Scammers can take over friends accounts. Even friend links need verification.' },
                { text: 'Helping a friend vote is no big deal, I will click.',
                  segura: false,
                  pista: 'Voting websites can collect personal information or contain viruses. Verify first.',
                  aviso: 'Voting websites can collect information or contain viruses. Confirm with your friend first.' }
              ] },
              { tipo: 'msg', text: 'Click fast! Today is the last day!' },
              { tipo: 'eleccion', options: [
                { text: 'I call my friend to confirm it is really them.', segura: true,
                  avisoSeguro: 'Calling to confirm is the safest method. If your friend did not send it, do not click.' },
                { text: 'My friend is pushing me, I will click to vote.',
                  segura: false,
                  pista: 'Pushing you to act is a common trick. Wait and confirm before deciding.',
                  aviso: 'Pushing you to act is a common trick. Confirm first.' }
              ] },
              { tipo: 'accion', text: '🚫 Do not click, call to confirm first',
                confirmacion: 'You confirmed with your friend before clicking. Good move!' }
            ],
            regla: 'Even links from friends need verification. Calling or messaging to confirm is the safest approach.'
          }
        ]
      },
      {
        id: 'adjuntos',
        titulo: 'Dangerous attachments',
        picto: '📎',
        variantes: [
          {
            contacto: 'Unknown Sender',
            tipo: 'correo',
            steps: [
              { tipo: 'msg', text: 'From: invoice-pdf@company-billing.net' },
              { tipo: 'msg', text: 'Subject: You have an invoice to pay. Attachment: invoice_March_2024.pdf.exe' },
              { tipo: 'eleccion', options: [
                { text: 'I do not open it. A pdf with .exe is a virus. I delete and report it.', segura: true,
                  avisoSeguro: 'invoice.pdf.exe is a typical virus file. Real invoices are never .exe files.' },
                { text: 'It looks like an invoice, I will open it.',
                  segura: false,
                  pista: 'A filename with .exe after .pdf is not a PDF, it is a program. Never open it!',
                  aviso: 'The filename invoice.pdf.exe means this is a program, not a document. Do not open it!' },
                { text: 'I will be careful, I will just take a look.',
                  segura: false,
                  pista: 'Opening an .exe file installs malware on your computer without you knowing. Never open email .exe files!',
                  aviso: '.exe files can install viruses without you knowing. Never open email .exe files.' }
              ] },
              { tipo: 'msg', text: 'Your computer has been scanned. Click here to download antivirus software.' },
              { tipo: 'eleccion', options: [
                { text: 'This is a new scammer trick. I disconnect from the internet and ask a trusted person.', segura: true,
                  avisoSeguro: 'Scammers will keep trying to trick you. Disconnecting and asking for help is the right move.' },
                { text: 'I download the antivirus as they say.',
                  segura: false,
                  pista: 'The "antivirus" they want you to download is actually more viruses. Do not trust it!',
                  aviso: 'The software they want you to download is actually more viruses. Do not download it!' }
              ] },
              { tipo: 'accion', text: '🚫 Delete email and run a computer security scan',
                confirmacion: 'You did not open the attachment. Deleting the email and running a security scan was the right move!' }
            ],
            regla: 'Email attachments that are .exe and other executable files are viruses. Do not open them. Delete directly.'
          },
          {
            contacto: 'info@celebrity-news-daily.com',
            tipo: 'correo',
            steps: [
              { tipo: 'msg', text: 'Subject: Exclusive! Celebrity private photos leaked! Click to view: celebrity-photos.zip' },
              { tipo: 'eleccion', options: [
                { text: 'I do not click. This type of email is a trap to download viruses. I delete it.', segura: true,
                  avisoSeguro: 'Celebrity photo bait is a common virus spread tactic. Do not click or download any attachments from strangers.' },
                { text: 'Celebrity photos, let me take a look.',
                  segura: false,
                  pista: 'Bait content is how scammers spread viruses. Do not let curiosity take over!',
                  aviso: 'Celebrity photo bait is a common virus tactic. Curiosity will be used against you.' },
                { text: 'It is a zip file, it should be fine, I will unzip it.',
                  segura: false,
                  pista: 'Zip files can contain virus programs. The virus runs when you unzip it.',
                  aviso: 'Zip files can contain viruses. Never open email zip attachments from strangers.' }
              ] },
              { tipo: 'msg', text: 'View now! Limited time download! Celebrity private photos!' },
              { tipo: 'eleccion', options: [
                { text: 'This is using my curiosity against me. I definitely do not open it.', segura: true,
                  avisoSeguro: 'Tempting titles are how scammers make people lose judgment. Deleting the email is the safest move.' },
                { text: 'Limited time download is tempting, but I will take a look.',
                  segura: false,
                  pista: '"Limited time" is to make you act fast without thinking. This is a scammer psychological tactic.',
                  aviso: 'Limited time is a psychological tactic to make you lose judgment. Do not be tempted!' }
              ] },
              { tipo: 'accion', text: '🚫 Delete email, do not reply',
                confirmacion: 'You did not open the attachment. Well done! Curiosity can be used against you. Stay vigilant.' }
            ],
            regla: 'Attachments with tempting content in emails from strangers are almost always viruses. Do not let curiosity take over. Stay vigilant.'
          },
          {
            contacto: 'hr@company-payroll.net',
            tipo: 'correo',
            steps: [
              { tipo: 'msg', text: 'Subject: Your payslip details - Attachment: salary-March-2024.xlsx.exe' },
              { tipo: 'eleccion', options: [
                { text: 'I do not open it. Companies do not send payslip files with .exe. I ask HR directly.', segura: true,
                  avisoSeguro: 'Company finance departments never send .exe files. Payslips are usually pdf or paper documents.' },
                { text: 'It is a payslip, it should be fine, I will open it.',
                  segura: false,
                  pista: 'A payslip file as .exe format is extremely suspicious. Normal payslips are never executable files.',
                  aviso: 'Payslips are never .exe files. This is a typical virus disguise.' },
                { text: 'It came from the company email, it should be fine.',
                  segura: false,
                  pista: 'Scammer emails can look like they are from the company. Do not lower your guard just because the sender email looks formal.',
                  aviso: 'Scammers can forge sender emails. Even if it looks like a company email, stay vigilant.' }
              ] },
              { tipo: 'msg', text: 'Please check your payslip as soon as possible. Contact HR if you have questions.' },
              { tipo: 'eleccion', options: [
                { text: 'I go to HR in person to ask if they really sent this.', segura: true,
                  avisoSeguro: 'Going to HR in person is the safest method. Do not use the contact info in the email.' },
                { text: 'I reply to the email to ask.',
                  segura: false,
                  pista: 'The reply email might also be controlled by scammers. Go to HR office in person.',
                  aviso: 'The reply-to address might also be controlled by scammers. Go in person to confirm.' }
              ] },
              { tipo: 'accion', text: '🚫 Do not open attachment, go to HR office to confirm',
                confirmacion: 'When you asked HR, they said they never sent this email. That was close!' }
            ],
            regla: 'Company files are never sent in .exe format. Going to the relevant department in person is the safest approach.'
          }
        ]
      },
      {
        id: 'contrasenas',
        titulo: 'Password protection',
        picto: '🔐',
        variantes: [
          {
            contacto: 'Unknown',
            tipo: 'mensaje',
            steps: [
              { tipo: 'msg', text: 'Text message received: "Your Netflix account has been suspended. Click to reactivate: netflix.com.verify-login.com"' },
              { tipo: 'eleccion', options: [
                { text: 'I do not enter passwords in a link. I open the Netflix app to check account status.', segura: true,
                  avisoSeguro: 'Netflix does not ask you to re-login via text messages. Open the Netflix app or official website to check.' },
                { text: 'I will click quickly to reactivate it, or I cannot watch shows.',
                  segura: false,
                  pista: 'Urgency is a scammer trick to make you act fast. Always log in from the official app or website.',
                  aviso: 'Urgency is a common scammer trick. Log in to Netflix from the official app.' },
                { text: 'I enter my Netflix email and password in the link.',
                  segura: false,
                  pista: 'This link is not the official Netflix website. You are giving your password to scammers!',
                  aviso: "netflix.com.verify-login.com is not Netflix's website. You are giving your account info to scammers!" }
              ] },
              { tipo: 'msg', text: 'Please enter your email and password to reactivate your account.' },
              { tipo: 'eleccion', options: [
                { text: 'I do not enter passwords on non-official websites. I open the Netflix app.', segura: true,
                  avisoSeguro: 'Always log in from the official app or website. Scammers can create a fake website that looks like Netflix.' },
                { text: 'I enter my email and a one-time password.',
                  segura: false,
                  pista: 'Even one-time passwords should not be entered on non-official websites. Scammers can use it to access your real account.',
                  aviso: 'One-time passwords are still passwords. Do not enter any passwords on non-official websites.' }
              ] },
              { tipo: 'accion', text: '🚫 Do not enter password, open Netflix app to check',
                confirmacion: 'You checked in the Netflix app and your account was fine. That text was a scam!' }
            ],
            regla: 'Always log in to accounts from the official app or website. Do not log in via links in texts or emails.'
          },
          {
            contacto: 'Unknown',
            tipo: 'mensaje',
            steps: [
              { tipo: 'msg', text: 'Email received: "Your Apple ID has been locked. Click to verify your identity: appleid-security.net/verify"' },
              { tipo: 'eleccion', options: [
                { text: 'I do not enter my Apple ID password in an email link. I check on the Apple website.', segura: true,
                  avisoSeguro: 'Apple does not ask you to verify passwords via email. Check on the Apple website or in your phone settings.' },
                { text: 'Apple ID being locked is serious, I will click to verify right away.',
                  segura: false,
                  pista: 'Scammers use fear to make you act fast. Apple never asks for password verification via email.',
                  aviso: 'Scammers use fear to manipulate. Apple never asks for password verification via email.' },
                { text: 'I enter my Apple ID and password to verify.',
                  segura: false,
                  pista: 'appleid-security.net is not an Apple website. You are giving your Apple ID to scammers!',
                  aviso: "This link is fake. Apple's website is apple.com. Never enter your Apple ID on a non-Apple website." }
              ] },
              { tipo: 'msg', text: 'Your Apple ID will be permanently deactivated. Click to verify immediately.' },
              { tipo: 'eleccion', options: [
                { text: 'I do not click. I check my Apple ID status in phone settings.', segura: true,
                  avisoSeguro: 'Checking Apple ID status in phone settings is the safest way. Scammers cannot forge it.' },
                { text: 'Permanent deactivation is scary, I will click now!',
                  segura: false,
                  pista: 'Fear makes you lose judgment. Scammers use exactly this psychology. Take a breath and check your settings.',
                  aviso: 'Fear is a scammer weapon. Check your Apple ID status in phone settings.' }
              ] },
              { tipo: 'accion', text: '🚫 Do not click, check Apple ID in phone settings',
                confirmacion: 'You checked your phone settings and your Apple ID was normal. That email was a phishing email!' }
            ],
            regla: 'Apple, Google, Microsoft never ask you to enter passwords via email. Check from the official app or website.'
          }
        ]
      }
    ],
    normas: [
      { picto: '📧', text: 'Banks and companies never ask for details via a link in an email.' },
      { picto: '🔗', text: 'Do not click links in emails or messages from strangers.' },
      { picto: '📎', text: 'Do not open attachments from unknown senders, especially .exe, .zip or .scr files.' },
      { picto: '🔐', text: 'Passwords are typed only on the official website, never in email links.' },
      { picto: '📱', text: 'If someone asks for personal details via chat, it is a reason to be suspicious.' },
      { picto: '⏰', text: 'Urgency is a tool scammers use to make you act without thinking.' },
      { picto: '✅', text: 'When in doubt, ask a trusted person before clicking.' }
    ]
  }
};
