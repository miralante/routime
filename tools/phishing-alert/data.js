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
              { tipo: 'msg', text: 'Estimado cliente, hemo detectado actividad sospechosa en su cuenta. Para evitar el bloqueo definitivo, haga clic en el siguiente enlace e introduzca sus datos: https://banco-seguro.net/acceso' },
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
                  pista: '¿De verdad: si ya es phishing, poner más datos solo da más información a los Ladrones?',
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
                  avisoSeguro: 'Los Ladrones copian el estilo de Amazon para engañar. La app oficial es el camino seguro.' },
                { text: '450 euros es mucho. Voy a verificar los datos.',
                  segura: false,
                  pista: '¿De verdad: el miedo al dinero es otra trampa. Entra en Amazon desde la app?',
                  aviso: 'El miedo al dinero es otra trampa. No entres por el enlace; usa la app.' }
              ] },
              { tipo: 'accion', text: '🚫 Eliminar correo y denunciar como phishing',
                confirmacion: 'Has eliminado el correo falso. ¡Laapp de Amazon te habría confirmado que no había ningún problema!' }
            ],
            regla: 'Amazon y otras tiendas comunican problemas solo desde su app o web. Nunca desde enlaces de correos.'
          },
          {
            contacto: 'info@dhl-entregas.com',
            tipo: 'correo',
            steps: [
              { tipo: 'msg', text: 'Asunto: Su paquete no ha podido ser entregado.' },
              { tipo: 'msg', text: 'Hola, no hemo podido entregar su paquete. Para reprogramar la entrega, haga clic aquí y pague 2,99 € de gastos: dhl-redir.com/paquete' },
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
                confirmacion: 'Has eliminado el correo falso. Tu suscripción real sigue activa mientras la gestines desde microsoft.com.' }
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
            contacto: '未知',
            tipo: 'mensaje',
            steps: [
              { tipo: 'msg', text: '陌生号码发来消息: "看看这张照片有你吗？" + 链接: bit.ly/photo-album-2024' },
              { tipo: 'eleccion', options: [
                { text: '不点击陌生链接。和信任的人说说这条消息。', segura: true,
                  avisoSeguro: '不认识的人发来的链接很可能有危险。不要点击，要和信任的人商量。' },
                { text: '点开看看有没有我的照片。',
                  segura: false,
                  pista: '陌生人的链接可能是病毒，或者窃取个人信息。不要点击！',
                  aviso: '陌生人发的链接可能是陷阱。不要点击，直接和信任的人说。' },
                { text: '既然有我的照片，我就点开看看。',
                  segura: false,
                  pista: '诱骗你点击是常见手段。即使说有你认识的人，也不要点击陌生链接。',
                  aviso: '这很可能是诱骗。不要点击陌生链接。和信任的人商量。' }
              ] },
              { tipo: 'msg', text: '点开就能看到照片了。快来看看！' },
              { tipo: 'eleccion', options: [
                { text: '我不打开。和家人或信任的人说这件事。', segura: true,
                  avisoSeguro: '不打开是对的。陌生人发的链接可能含有病毒，或者引导到假冒网站。' },
                { text: '点开看一下就关掉。',
                  segura: false,
                  pista: '打开链接的瞬间，你的设备可能已经被入侵。绝对不要打开！',
                  aviso: '打开链接的瞬间你的设备就可能被入侵了。立刻删除这条消息。' }
              ] },
              { tipo: 'accion', text: '🚫 不打开链接，告诉家人或信任的人',
                confirmacion: '你没有打开链接。好样的！陌生人发来的链接不要点击。' }
            ],
            regla: '陌生人发来的链接很危险。不要点击，要和信任的人商量。'
          },
          {
            contacto: '未知',
            tipo: 'mensaje',
            steps: [
              { tipo: 'msg', text: '来自陌生号码: "你有一张未领取的包裹。" + 链接: tinyurl.com/paq-pending' },
              { tipo: 'eleccion', options: [
                { text: '未知链接不点击。去快递公司官网查看。', segura: true,
                  avisoSeguro: '快递公司不会通过陌生号码发链接给你。去官网或应用查看物流信息。' },
                { text: '点开看看是不是真的有包裹。',
                  segura: false,
                  pista: '快递公司不会通过短信发链接。点击之前要三思。',
                  aviso: '快递公司不用这种方式发链接。这是诱骗点击的陷阱。' },
                { text: '反正只是查一下包裹，点开看看。',
                  segura: false,
                  pista: '点击链接可能导致病毒或虚假页面。永远不要点击陌生人发的链接。',
                  aviso: '这类链接通常会导致病毒或窃取信息。不要点击！' }
              ] },
              { tipo: 'msg', text: '只剩24小时来认领包裹了！点击这里：tinyurl.com/paq-pending' },
              { tipo: 'eleccion', options: [
                { text: '这是催促我行动。肯定是骗子。和信任的人说。', segura: true,
                  avisoSeguro: '紧急催促是骗子常用手段。快递公司不会这样催促你。' },
                { text: '只剩下一天了！赶紧点击！',
                  segura: false,
                  pista: '紧急感是让你失去判断力的手段。深呼吸，思考后再行动。',
                  aviso: '紧急感是让你快速行动不思考的陷阱。不要点击！' }
              ] },
              { tipo: 'accion', text: '🚫 不点击，去官网查物流',
                confirmacion: '你没有点击链接。去快递公司官网查物流是正确的做法。' }
            ],
            regla: '快递公司不会通过陌生短信发链接。永远去官网或应用查物流。'
          },
          {
            contacto: '微信好友',
            tipo: 'mensaje',
            steps: [
              { tipo: 'msg', text: '好友发来消息: "这是我新开的店，点击帮忙投票！" + 链接: goo.gl/vote2024' },
              { tipo: 'eleccion', options: [
                { text: '先问朋友是不是真的。', segura: true,
                  avisoSeguro: '即使是朋友发的链接，也可能是骗子盗用了他的账号。先确认一下。' },
                { text: '朋友发的链接肯定没问题，直接点开。',
                  segura: false,
                  pista: '骗子可以盗取朋友的账号。不要因为是朋友发的就放松警惕。',
                  aviso: '骗子的手段包括盗取账号。即使是朋友发的也要先确认。' },
                { text: '帮朋友投票是小事，点开投一下。',
                  segura: false,
                  pista: '投票网站可能收集个人信息，或者带有病毒。要先确认真实性。',
                  aviso: '投票网站可能收集个人信息或带有病毒。先和朋友确认。' }
              ] },
              { tipo: 'msg', text: '快点开！今天就结束了！' },
              { tipo: 'eleccion', options: [
                { text: '打电话给朋友确认是不是真的。', segura: true,
                  avisoSeguro: '打电话确认是最安全的方法。如果朋友说没发过，就不要点击。' },
                { text: '朋友都催了，赶紧点开投。',
                  segura: false,
                  pista: '催促你是为了让你不思考就行动。再等一下，确认后再决定。',
                  aviso: '催促你行动是常见陷阱。先确认真实性。' }
              ] },
              { tipo: 'accion', text: '🚫 不点击，先电话确认',
                confirmacion: '你先确认了朋友是否真的发了这条消息。好做法！' }
            ],
            regla: '即使是朋友发的链接，也要先确认真实性。打电话或发消息确认是最安全的做法。'
          }
        ]
      },
      {
        id: 'adjuntos',
        titulo: 'Archivos adjuntos peligrosos',
        picto: '📎',
        variantes: [
          {
            contacto: '未知发件人',
            tipo: 'correo',
            steps: [
              { tipo: 'msg', text: '发件人: invoice-pdf@company-billing.net' },
              { tipo: 'msg', text: '主题: 您有一张待支付发票。附件：invoice_March_2024.pdf.exe' },
              { tipo: 'eleccion', options: [
                { text: '不打开。带exe的pdf文件是病毒。删除并举报。', segura: true,
                  avisoSeguro: 'pdf.exe 是一个典型的病毒文件。真正的发票不会是exe格式。' },
                { text: '看起来像发票，打开看看。',
                  segura: false,
                  pista: '文件名带有exe后缀的文件不是PDF，而是程序。永远不要打开！',
                  aviso: '文件名invoice.pdf.exe表示这是一个程序，不是文档。不要打开！' },
                { text: '只要小心一点，打开应该没问题。',
                  segura: false,
                  pista: '打开exe文件会在你不知情的情况下在电脑上安装恶意程序。绝对不要打开！',
                  aviso: 'exe文件可以在你不知情的情况下安装病毒。永远不要打开邮件中的exe文件。' }
              ] },
              { tipo: 'msg', text: '您的电脑已被扫描。点击这里下载防病毒软件。' },
              { tipo: 'eleccion', options: [
                { text: '这是骗子的新花招。立刻断网，向信任的人求助。', segura: true,
                  avisoSeguro: '骗子会继续尝试欺骗你。断网并向信任的人求助是正确的做法。' },
                { text: '按照提示下载防病毒软件。',
                  segura: false,
                  pista: '骗子让你下载的"防病毒软件"实际上是更多的病毒。不要相信！',
                  aviso: '骗子让你下载的软件实际上是病毒。不要下载！' }
              ] },
              { tipo: 'accion', text: '🚫 删除邮件，运行电脑安全扫描',
                confirmacion: '你没有打开附件。删除邮件并运行安全扫描是正确的做法！' }
            ],
            regla: '邮件中的exe文件和其他可执行文件是病毒。不要打开，直接删除。'
          },
          {
            contacto: 'info@celebrity-news-daily.com',
            tipo: 'correo',
            steps: [
              { tipo: 'msg', text: '主题: 独家！名人私密照片泄露！点击查看：celebrity-photos.zip' },
              { tipo: 'eleccion', options: [
                { text: '不点击。这类邮件是诱骗你下载病毒的。删除。', segura: true,
                  avisoSeguro: '名人照片的诱饵是常见的病毒传播手段。不要点击或下载任何附件。' },
                { text: '名人的照片，点开看看。',
                  segura: false,
                  pista: '诱饵内容是骗子传播病毒的常用手段。不要被好奇心驱使！',
                  aviso: '名人照片诱饵是传播病毒的常见手段。好奇心会被利用。' },
                { text: '压缩文件应该没事，解压看看。',
                  segura: false,
                  pista: 'zip文件可以包含病毒程序。解压的同时病毒就会运行。',
                  aviso: 'zip文件可以包含病毒。永远不要打开陌生人邮件中的压缩附件。' }
              ] },
              { tipo: 'msg', text: '立即查看！限时下载！名人私密照片！' },
              { tipo: 'eleccion', options: [
                { text: '这是利用好奇心引诱我。绝对不打开。', segura: true,
                  avisoSeguro: '诱惑性标题是骗子让人失去判断力的手段。删除邮件是最安全的做法。' },
                { text: '限时下载很诱人，但还是点开看看。',
                  segura: false,
                  pista: '"限时"是为了让你快速行动不思考。这是骗子的心理战术。',
                  aviso: '限时是心理战术，让你失去判断力。不要被诱惑！' }
              ] },
              { tipo: 'accion', text: '🚫 删除邮件，不回复',
                confirmacion: '你没有打开附件。好样的！好奇心会被利用，保持警惕。' }
            ],
            regla: '邮件中诱惑性内容的附件几乎都是病毒。不要被好奇心驱使，保持警惕。'
          },
          {
            contacto: 'hr@company-payroll.net',
            tipo: 'correo',
            steps: [
              { tipo: 'msg', text: '主题: 您的工资单明细 - 附件：salary-March-2024.xlsx.exe' },
              { tipo: 'eleccion', options: [
                { text: '不打开。公司不会发带exe的工资单文件。向HR确认。', segura: true,
                  avisoSeguro: '公司财务部门不会发送exe格式的文件。工资单通常是pdf或纸质文件。' },
                { text: '是工资单，应该没问题，打开看看。',
                  segura: false,
                  pista: '工资单文件是exe格式是极其可疑的。正常工资单不会是可执行文件。',
                  aviso: '工资单不会是exe文件。这是典型的伪装病毒。' },
                { text: '公司邮箱发的，应该没问题吧。',
                  segura: false,
                  pista: '骗子的邮箱可以伪装成公司邮箱。不要因为发件人邮箱看起来正式就放松警惕。',
                  aviso: '骗子可以伪造邮箱地址。即使看起来是公司邮箱也要警惕。' }
              ] },
              { tipo: 'msg', text: '请尽快查收您的工资单。如有疑问请联系HR部门。' },
              { tipo: 'eleccion', options: [
                { text: '直接去HR问有没有发过这个邮件。', segura: true,
                  avisoSeguro: '亲自去HR确认是最安全的方法。不要通过邮件中的联系方式。' },
                { text: '按照邮箱地址回复问一下。',
                  segura: false,
                  pista: '回复邮件地址可能也是骗子控制的。亲自去HR办公室确认。',
                  aviso: '邮件回复地址可能也是骗子控制的。亲自去确认。' }
              ] },
              { tipo: 'accion', text: '🚫 不打开附件，去HR办公室确认',
                confirmacion: '你去HR确认后，他们说没有发过这个邮件。好险！' }
            ],
            regla: '公司文件不会通过exe格式发送。亲自去相关部门确认是最安全的做法。'
          }
        ]
      },
      {
        id: 'contrasenas',
        titulo: 'Protección de contraseñas',
        picto: '🔐',
        variantes: [
          {
            contacto: '未知',
            tipo: 'mensaje',
            steps: [
              { tipo: 'msg', text: '收到短信: "您的Netflix账户已被暂停。请点击链接重新激活：netflix.com.verify-login.com' },
              { tipo: 'eleccion', options: [
                { text: '不在链接里输入密码。去Netflix应用确认账户状态。', segura: true,
                  avisoSeguro: 'Netflix不会通过短信要求你重新登录。直接打开Netflix应用或官网确认。' },
                { text: '赶紧点击重新激活，不然看不了剧了。',
                  segura: false,
                  pista: '紧迫感是骗子让你快速行动的手段。永远从官方应用或网站登录。',
                  aviso: '紧迫感是骗子常用的手段。从官方应用登录Netflix。' },
                { text: '在链接里输入Netflix的邮箱和密码。',
                  segura: false,
                  pista: '这个链接不是Netflix官方网站。你在向骗子提供密码！',
                  aviso: 'netflix.com.verify-login.com不是Netflix的网站。你在向骗子提供账户信息！' }
              ] },
              { tipo: 'msg', text: '请输入您的邮箱和密码以重新激活账户。' },
              { tipo: 'eleccion', options: [
                { text: '不在非官方网站输入密码。打开Netflix应用确认。', segura: true,
                  avisoSeguro: '永远从官方应用或网站登录。骗子可以创建一个看起来像Netflix的假网站。' },
                { text: '输入邮箱和一次性密码试试。',
                  segura: false,
                  pista: '即使是临时密码也不要输入。骗子可以使用它来访问你的真实账户。',
                  aviso: '一次性密码也是密码。不要在任何非官方网站输入任何密码。' }
              ] },
              { tipo: 'accion', text: '🚫 不输入密码，打开Netflix应用确认',
                confirmacion: '你在Netflix应用中确认，账户一切正常。那条短信是诈骗！' }
            ],
            regla: '永远从官方应用或网站登录账户。不要通过短信或邮件中的链接登录。'
          },
          {
            contacto: '未知',
            tipo: 'mensaje',
            steps: [
              { tipo: 'msg', text: '收到邮件: "您的Apple ID已被锁定。请点击链接验证身份：appleid-security.net/verify' },
              { tipo: 'eleccion', options: [
                { text: '不在邮件链接里输入Apple ID密码。去苹果官网确认。', segura: true,
                  avisoSeguro: '苹果不会通过邮件要求你验证密码。去苹果官网或手机设置中的Apple ID确认。' },
                { text: 'Apple ID被锁定很严重，赶紧点击验证。',
                  segura: false,
                  pista: '骗子利用恐惧心理让你快速行动。苹果不会通过邮件要求验证密码。',
                  aviso: '骗子利用恐惧心理。苹果从不通过邮件要求输入密码。' },
                { text: '输入Apple ID和密码验证身份。',
                  segura: false,
                  pista: 'appleid-security.net不是苹果的网站。你在向骗子提供Apple ID！',
                  aviso: '这个链接是假的。苹果的网站是apple.com。永远不要在非苹果网站输入Apple ID。' }
              ] },
              { tipo: 'msg', text: '您的Apple ID将永久停用。点击立即验证。' },
              { tipo: 'eleccion', options: [
                { text: '不点击。去手机设置里查看Apple ID状态。', segura: true,
                  avisoSeguro: '手机设置里的Apple ID是确认账户状态的最安全方式。骗子无法伪造它。' },
                { text: '永久停用太可怕了，赶紧点击！',
                  segura: false,
                  pista: '恐惧让你失去判断力。骗子就是利用这种心理。深呼吸，去设置里确认。',
                  aviso: '恐惧是骗子的武器。去手机设置里确认Apple ID状态。' }
              ] },
              { tipo: 'accion', text: '🚫 不点击，去手机设置确认Apple ID',
                confirmacion: '你检查了手机设置，Apple ID状态正常。那封邮件是钓鱼邮件！' }
            ],
            regla: '苹果、谷歌、微软都不会通过邮件要求你输入密码。去官方应用或网站确认。'
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
      { picto: '⏰', text: 'La urgencia es una herramienta de los Ladrones para que actúes sin pensar.' },
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
              { tipo: 'msg', text: 'Text message received: "Your Netflix account has been suspended. Click to reactivate: netflix.com.verify-login.com' },
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
                  aviso: 'netflix.com.verify-login.com is not Netflixs website. You are giving your account info to scammers!' }
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
              { tipo: 'msg', text: 'Email received: "Your Apple ID has been locked. Click to verify your identity: appleid-security.net/verify' },
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
                  aviso: 'This link is fake. Apples website is apple.com. Never enter your Apple ID on a non-Apple website.' }
              ] },
              { tipo: 'msg', text: 'Your Apple ID will be permanently deactivated. Click to verify immediately.' },
              { tipo: 'eleccion', options: [
                { text: 'I do not click. I check my Apple ID status in phone settings.', segura: true,
                  avisoSeguro: 'Checking Apple ID status in phone settings is the safest way. Scammers cannot forge it.' },
                { text: 'Permanent deactivation is scary, I will click now!',
                  segura: false,
                  pista: 'Fear makes you lose judgment. Scammers use exactly this心理. Take a breath and check your settings.',
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
