/* ============================================================
   Datos: Señales (peligro, avisos, baño, etc.)
   Formato: DATA.es / DATA.en, cada uno con:
   { porRonda, niveles: [{ id, name, descripcion, estrellas,
     items: [{ senal, name, tipo, options: string[3], correcta }] }] }
   app.js usa DATA[App.i18n.locale()] || DATA.es.
   ============================================================ */
const DATA = {
  es: {
    porRonda: 8,
    niveles: [
      {
        id: 1,
        name: 'Nivel 1',
        descripcion: 'Señales de peligro y avisos',
        estrellas: 1,
        items: [
          { senal: '⚠️', name: 'Peligro', tipo: 'senal-peligro-picto', options: ['Cuidado, hay peligro', 'Pasa rápido', 'Zona segura'], correcta: 0 },
          { senal: '🚫', name: 'Prohibido', tipo: 'senal-prohibicion-picto', options: ['Se puede hacer', 'No está permitido', 'Obligatorio'], correcta: 1 },
          { senal: '🔥', name: 'Fuego', tipo: 'senal-peligro-picto', options: ['Puedes tocarlo', 'Cuidado con el fuego', 'Es seguro'], correcta: 1 },
          { senal: '⚡', name: 'Peligro de electrocución', tipo: 'senal-peligro-picto', options: ['Es seguro tocarlo', 'Riesgo de electrocución, no lo toques', 'Es un juguete'], correcta: 1 },
          { senal: '☣️', name: 'Radiactivo', tipo: 'senal-peligro-picto', options: ['Es seguro tocarlo', 'No te acerques', 'Puedes jugar'], correcta: 1 },
          { senal: '☠️', name: 'Veneno', tipo: 'senal-peligro-picto', options: ['Es comida', 'No tocar ni comer', 'Puedes probarlo'], correcta: 1 },
          { senal: '⚠️', name: 'Precaución', tipo: 'senal-peligro-picto', options: ['Pasa sin mirar', 'Ten cuidado', 'Es una zona de juego'], correcta: 1 },
          { senal: '🔴', name: 'Alto', tipo: 'senal-peligro-picto', options: ['Sigue adelante', 'Para y espera', 'Corre rápido'], correcta: 1 },
          { senal: '💀', name: 'Peligro de muerte', tipo: 'senal-peligro-picto', options: ['Zona segura', 'Extremadamente peligroso', 'Puedes entrar'], correcta: 1 },
          { senal: '🛑', name: 'Pare', tipo: 'senal-peligro-picto', options: ['Sigue andando', 'Detente completamente', 'Corre'], correcta: 1 },
          { senal: '🚧', name: 'Obras', tipo: 'senal-peligro-picto', options: ['Puedes pasar tranquilo', 'Aviso de obras, ten cuidado', 'Es una tienda'], correcta: 1 },
          { senal: '💦', name: 'Suelo mojado', tipo: 'senal-peligro-picto', options: ['El suelo está seco', 'Aviso: el suelo está mojado', 'Puedes correr'], correcta: 1 },
          { senal: '🧊', name: 'Hielo en el suelo', tipo: 'senal-peligro-picto', options: ['Cuidado, puede resbalar', 'Es seguro correr', 'Puedes patinar tranquilo'], correcta: 0 },
          { senal: '🌪️', name: 'Viento fuerte', tipo: 'senal-peligro-picto', options: ['Aviso de viento fuerte, ten cuidado', 'No pasa nada, sigue igual', 'Es un buen momento para volar cometas'], correcta: 0 },
          { senal: '🚱', name: 'Agua no potable', tipo: 'senal-prohibicion-picto', options: ['No se puede beber esta agua', 'Es agua para beber', 'Es agua con sabor'], correcta: 0 },
          { senal: '⚗️', name: 'Sustancia corrosiva', tipo: 'senal-peligro-picto', options: ['No tocar, puede quemar la piel', 'Se puede tocar sin problema', 'Es un producto de limpieza normal'], correcta: 0 }
        ]
      },
      {
        id: 2,
        name: 'Nivel 2',
        descripcion: 'Señales de baño y aseo',
        estrellas: 2,
        items: [
          { senal: '🚽', name: 'Baño / WC', tipo: 'senal-informacion-picto', options: ['Es una cocina', 'Para ir al baño', 'Es un dormitorio'], correcta: 1 },
          { senal: '🚹', name: 'Baño de hombres', tipo: 'senal-informacion-picto', options: ['Baño de mujeres', 'Baño para hombres', 'Es la salida'], correcta: 1 },
          { senal: '🚺', name: 'Baño de mujeres', tipo: 'senal-informacion-picto', options: ['Baño de hombres', 'Baño para mujeres', 'Es la entrada'], correcta: 1 },
          { senal: '🚿', name: 'Ducha', tipo: 'senal-informacion-picto', options: ['Para comer', 'Para ducharse', 'Para dormir'], correcta: 1 },
          { senal: '🛁', name: 'Bañera', tipo: 'senal-informacion-picto', options: ['Para jugar', 'Para bañarse', 'Para trabajar'], correcta: 1 },
          { senal: '🚰', name: 'Agua potable', tipo: 'senal-informacion-picto', options: ['No potable', 'Agua que puedes beber', 'Es de colores'], correcta: 1 },
          { senal: '🧴', name: 'Jabón', tipo: 'senal-obligacion-picto', options: ['Es comida', 'Para lavarse', 'Es perfume'], correcta: 1 },
          { senal: '🧻', name: 'Papel higiénico', tipo: 'senal-informacion-picto', options: ['Para secarse', 'Para jugar', 'Para comer'], correcta: 0 },
          { senal: '🚴', name: 'Vestuarios', tipo: 'senal-informacion-picto', options: ['Para ducharse y cambiarse', 'Para comer', 'Para estudiar'], correcta: 0 },
          { senal: '🧼', name: 'Lavabo', tipo: 'senal-informacion-picto', options: ['Para dormir', 'Para lavarse manos y cara', 'Para cocinar'], correcta: 1 },
          { senal: '💧', name: 'Agua', tipo: 'senal-informacion-picto', options: ['Es fuego', 'Es agua', 'Es tierra'], correcta: 1 },
          { senal: '🧹', name: 'Limpieza', tipo: 'senal-obligacion-picto', options: ['Zona sucia', 'Mantén la limpieza', 'Tira papeles'], correcta: 1 },
          { senal: '♿', name: 'Baño adaptado', tipo: 'senal-informacion-picto', options: ['Baño preparado para sillas de ruedas', 'Solo para el personal', 'Está cerrado siempre'], correcta: 0 },
          { senal: '🚼', name: 'Cambiador de bebés', tipo: 'senal-informacion-picto', options: ['Es para cambiar a los bebés', 'Es para lavar ropa', 'Es para guardar comida'], correcta: 0 },
          { senal: '🧽', name: 'Toallitas de papel', tipo: 'senal-informacion-picto', options: ['Para secarte las manos', 'Para limpiar el suelo', 'Para comer'], correcta: 0 },
          { senal: '🪒', name: 'Zona de aseo personal', tipo: 'senal-informacion-picto', options: ['Para asearte y arreglarte', 'Para dormir', 'Para hacer deporte'], correcta: 0 }
        ]
      },
      {
        id: 3,
        name: 'Nivel 3',
        descripcion: 'Señales de obligación y prohibición',
        estrellas: 2,
        items: [
          { senal: '⛔', name: 'Prohibido el paso', tipo: 'senal-prohibicion-picto', options: ['Puedes pasar', 'No puedes pasar', 'Entra rápido'], correcta: 1 },
          { senal: '🚭', name: 'Prohibido fumar', tipo: 'senal-prohibicion-picto', options: ['Puedes fumar', 'No fumar aquí', 'Fuma fuera'], correcta: 1 },
          { senal: '📵', name: 'Prohibido el móvil', tipo: 'senal-prohibicion-picto', options: ['Usa el móvil todo lo que quieras', 'No uses el móvil', 'Llama por teléfono'], correcta: 1 },
          { senal: '🐕', name: 'No perros', tipo: 'senal-prohibicion-picto', options: ['Puedes traer perros', 'No traer animales', 'Los perros entran'], correcta: 1 },
          { senal: '🚳', name: 'Prohibido bicicletas', tipo: 'senal-prohibicion-picto', options: ['Entra en bici', 'No entrar en bici', 'Deja la bici fuera'], correcta: 1 },
          { senal: '🈲', name: 'Prohibido', tipo: 'senal-prohibicion-picto', options: ['Está permitido', 'No está permitido', 'Es obligatorio'], correcta: 1 },
          { senal: '⭕', name: 'Circulación', tipo: 'senal-informacion-picto', options: ['Zona para correr', 'Zona de paso', 'Zona prohibida'], correcta: 1 },
          { senal: '🚸', name: 'Paso de peatones', tipo: 'senal-obligacion-picto', options: ['Para los coches', 'Cruza por aquí', 'Corre'], correcta: 1 },
          { senal: '⏱️', name: 'Tiempo limitado', tipo: 'senal-informacion-picto', options: ['Tiempo ilimitado', 'Tiempo máximo', 'No hay tiempo'], correcta: 1 },
          { senal: '🔒', name: 'Cerrado', tipo: 'senal-prohibicion-picto', options: ['Abierto', 'Cerrado, no entrar', 'Entra sin parar'], correcta: 1 },
          { senal: '🥽', name: 'Uso obligatorio de gafas de protección', tipo: 'senal-obligacion-picto', options: ['Hay que ponerse gafas de protección', 'Las gafas están prohibidas', 'Las gafas son decorativas'], correcta: 0 },
          { senal: '🧤', name: 'Uso obligatorio de guantes', tipo: 'senal-obligacion-picto', options: ['Hay que ponerse guantes', 'Los guantes están prohibidos', 'Los guantes son un regalo'], correcta: 0 },
          { senal: '🔇', name: 'Prohibido hacer ruido', tipo: 'senal-prohibicion-picto', options: ['Hay que estar en silencio', 'Se puede gritar', 'Hay que poner música alta'], correcta: 0 },
          { senal: '🚯', name: 'Prohibido tirar basura', tipo: 'senal-prohibicion-picto', options: ['No se puede tirar basura al suelo', 'Se puede tirar basura aquí', 'Es un contenedor de reciclaje'], correcta: 0 }
        ]
      },
      {
        id: 4,
        name: 'Nivel 4',
        descripcion: 'Señales de información y salidas',
        estrellas: 2,
        items: [
          { senal: '🚪', name: 'Salida', tipo: 'senal-salida-picto', options: ['Entrada', 'Salida, por aquí se sale', 'Es la cocina'], correcta: 1 },
          { senal: '🏃', name: 'Salida de emergencia', tipo: 'senal-salida-picto', options: ['Zona peligrosa', 'Por aquí se sale si hay emergencia', 'Es un baño'], correcta: 1 },
          { senal: '🔓', name: 'Abierto', tipo: 'senal-informacion-picto', options: ['Cerrado', 'Abierto, puedes entrar', 'Es privado'], correcta: 1 },
          { senal: '🅿️', name: 'Aparcamiento', tipo: 'senal-informacion-picto', options: ['Para jugar', 'Para aparcar coches', 'Para comer'], correcta: 1 },
          { senal: 'ℹ️', name: 'Información', tipo: 'senal-informacion-picto', options: ['Es peligroso', 'Aquí hay información', 'No mires'], correcta: 1 },
          { senal: '📍', name: 'Ubicación', tipo: 'senal-informacion-picto', options: ['Estás aquí', 'Es lejos', 'No mires el mapa'], correcta: 0 },
          { senal: '🗺️', name: 'Mapa', tipo: 'senal-informacion-picto', options: ['Para perderse', 'Para orientarte', 'Es decorativo'], correcta: 1 },
          { senal: '🛗', name: 'Ascensor', tipo: 'senal-informacion-picto', options: ['Por las escaleras', 'Para subir y bajar', 'Es la puerta'], correcta: 1 },
          { senal: '📶', name: 'WiFi', tipo: 'senal-informacion-picto', options: ['No hay conexión', 'Hay WiFi aquí', 'Es un teléfono'], correcta: 1 },
          { senal: '🔋', name: 'Cargador', tipo: 'senal-informacion-picto', options: ['Para jugar', 'Para cargar dispositivos', 'Es una pila'], correcta: 1 },
          { senal: '🛎️', name: 'Recepción', tipo: 'senal-informacion-picto', options: ['Aquí puedes pedir ayuda o información', 'Es la cocina', 'Es la salida de emergencia'], correcta: 0 },
          { senal: '🧳', name: 'Consigna de equipaje', tipo: 'senal-informacion-picto', options: ['Para guardar el equipaje', 'Para comer', 'Para dormir'], correcta: 0 },
          { senal: '🔃', name: 'Escaleras mecánicas', tipo: 'senal-informacion-picto', options: ['Para subir o bajar sin caminar', 'Son solo decorativas', 'Es una puerta'], correcta: 0 },
          { senal: '🪑', name: 'Zona de espera', tipo: 'senal-informacion-picto', options: ['Aquí puedes sentarte a esperar', 'Está prohibido sentarse', 'Es una zona de juegos'], correcta: 0 }
        ]
      },
      {
        id: 5,
        name: 'Nivel 5',
        descripcion: 'Señales de emergencia y primeros auxilios',
        estrellas: 3,
        items: [
          { senal: '🚑', name: 'Ambulancia / Socorro', tipo: 'senal-salida-picto', options: ['Para el coche', 'Emergencia médica', 'Es un taxi'], correcta: 1 },
          { senal: '🚒', name: 'Bomberos', tipo: 'senal-peligro-picto', options: ['Para la comida', 'Emergencia de fuego', 'Es la policía'], correcta: 1 },
          { senal: '🚓', name: 'Policía', tipo: 'senal-informacion-picto', options: ['Para jugar', 'Seguridad y orden', 'Es una ambulancia'], correcta: 1 },
          { senal: '🆘', name: 'Socorro', tipo: 'senal-peligro-picto', options: ['Todo bien', 'Necesito ayuda', 'No pasa nada'], correcta: 1 },
          { senal: '🆗', name: 'Vale / OK', tipo: 'senal-informacion-picto', options: ['No está bien', 'Está bien / correcto', 'Hay un problema'], correcta: 1 },
          { senal: '🩹', name: 'Tirita / Apósito', tipo: 'senal-informacion-picto', options: ['Para cortar', 'Para curar heridas', 'Para jugar'], correcta: 1 },
          { senal: '💊', name: 'Medicina', tipo: 'senal-informacion-picto', options: ['Es comida', 'Medicamentos', 'Es veneno'], correcta: 1 },
          { senal: '🩺', name: 'Estetoscopio', tipo: 'senal-informacion-picto', options: ['Para escuchar el corazón', 'Es un juguete', 'Para decorar'], correcta: 0 },
          { senal: '🏥', name: 'Hospital', tipo: 'senal-informacion-picto', options: ['Para comprar', 'Centro de salud', 'Es una tienda'], correcta: 1 },
          { senal: '🧯', name: 'Extintor', tipo: 'senal-peligro-picto', options: ['Para encender fuego', 'Para apagar fuego', 'Es decoración'], correcta: 1 },
          { senal: '🫀', name: 'Desfibrilador', tipo: 'senal-informacion-picto', options: ['Aparato para emergencias del corazón', 'Es una radio', 'Es un cargador de móvil'], correcta: 0 },
          { senal: '🧑‍🚒', name: 'Punto de encuentro en emergencia', tipo: 'senal-salida-picto', options: ['Lugar seguro donde reunirse si hay una emergencia', 'Es la cafetería', 'Es la sala de espera'], correcta: 0 },
          { senal: '🚨', name: 'Alarma de emergencia', tipo: 'senal-peligro-picto', options: ['Avisa de que hay que salir con cuidado', 'Es solo un ruido molesto', 'Avisa de que empieza una fiesta'], correcta: 0 },
          { senal: '🩼', name: 'Botiquín', tipo: 'senal-informacion-picto', options: ['Aquí hay material para curas básicas', 'Es una caja de juguetes', 'Es un armario de ropa'], correcta: 0 }
        ]
      },
      {
        id: 6,
        name: 'Nivel 6',
        descripcion: 'Señales de transporte público',
        estrellas: 3,
        items: [
          { senal: '🚌', name: 'Parada de autobús', tipo: 'senal-informacion-picto', options: ['Para esperar el autobús', 'Para aparcar', 'Es un taxi'], correcta: 0 },
          { senal: '🚇', name: 'Metro', tipo: 'senal-informacion-picto', options: ['Tren de superficie', 'Tren subterráneo', 'Autobús'], correcta: 1 },
          { senal: '🚆', name: 'Tren', tipo: 'senal-informacion-picto', options: ['Barco', 'Tren / Ferrocaril', 'Avión'], correcta: 1 },
          { senal: '✈️', name: 'Avión', tipo: 'senal-informacion-picto', options: ['Barco', 'Tren', 'Avión'], correcta: 2 },
          { senal: '🚢', name: 'Barco', tipo: 'senal-informacion-picto', options: ['Avión', 'Tren', 'Barco'], correcta: 2 },
          { senal: '🚕', name: 'Taxi', tipo: 'senal-informacion-picto', options: ['Autobús', 'Taxi', 'Coche privado'], correcta: 1 },
          { senal: '⛽', name: 'Gasolinera', tipo: 'senal-informacion-picto', options: ['Para comer', 'Para repostar combustible', 'Para dormir'], correcta: 1 },
          { senal: '🚗', name: 'Aparcamiento', tipo: 'senal-informacion-picto', options: ['Zona verde', 'Zona para aparcar', 'Zona de juegos'], correcta: 1 },
          { senal: '🛤️', name: 'Vías del tren', tipo: 'senal-peligro-picto', options: ['Zona segura', 'Peligro, vías de tren', 'Zona de paso'], correcta: 1 },
          { senal: '⚓', name: 'Puerto', tipo: 'senal-informacion-picto', options: ['Aeropuerto', 'Puerto marítimo', 'Estación de tren'], correcta: 1 },
          { senal: '🚊', name: 'Tranvía', tipo: 'senal-informacion-picto', options: ['Tren que circula por la ciudad', 'Es un autobús', 'Es un avión'], correcta: 0 },
          { senal: '🎫', name: 'Punto de venta de billetes', tipo: 'senal-informacion-picto', options: ['Aquí se compran los billetes', 'Aquí se factura equipaje', 'Aquí se espera al conductor'], correcta: 0 },
          { senal: '🛄', name: 'Recogida de equipaje', tipo: 'senal-informacion-picto', options: ['Aquí recoges tu maleta', 'Aquí compras comida', 'Aquí esperas el tren'], correcta: 0 },
          { senal: '🚏', name: 'Parada solicitada', tipo: 'senal-informacion-picto', options: ['El autobús va a parar en la próxima parada', 'El autobús no va a parar', 'El autobús ha terminado el recorrido'], correcta: 0 }
        ]
      },
      {
        id: 7,
        name: 'Nivel 7',
        descripcion: 'Siglas importantes',
        estrellas: 3,
        items: [
          { senal: 'WC', name: 'Baño', tipo: 'senal-siglas-picto', options: ['Es un restaurante', 'Baño / aseo público', 'Es una tienda'], correcta: 1 },
          { senal: 'DNI', name: 'Documento de identidad', tipo: 'senal-siglas-picto', options: ['El documento que dice quién eres', 'Un tipo de coche', 'Un billete de tren'], correcta: 0 },
          { senal: 'ITV', name: 'Revisión del coche', tipo: 'senal-siglas-picto', options: ['Un canal de televisión', 'Revisión obligatoria del coche', 'Un tipo de gasolina'], correcta: 1 },
          { senal: 'IVA', name: 'Impuesto', tipo: 'senal-siglas-picto', options: ['Impuesto que pagas al comprar', 'El nombre de una tienda', 'Un tipo de pan'], correcta: 0 },
          { senal: 'ONG', name: 'Organización solidaria', tipo: 'senal-siglas-picto', options: ['Una organización que ayuda sin ánimo de lucro', 'Un banco', 'Una marca de coches'], correcta: 0 },
          { senal: 'SOS', name: 'Pide ayuda', tipo: 'senal-siglas-picto', options: ['Todo va bien', 'Pide ayuda urgente', 'Es un saludo'], correcta: 1 },
          { senal: 'PVP', name: 'Precio', tipo: 'senal-siglas-picto', options: ['El precio que pagas por el producto', 'El nombre del producto', 'La fecha de caducidad'], correcta: 0 },
          { senal: 'CP', name: 'Código postal', tipo: 'senal-siglas-picto', options: ['El número de tu calle', 'El código para las cartas y paquetes', 'Tu número de teléfono'], correcta: 1 },
          { senal: 'UCI', name: 'Parte del hospital', tipo: 'senal-siglas-picto', options: ['Zona del hospital para casos muy graves', 'La entrada del hospital', 'La cafetería del hospital'], correcta: 0 },
          { senal: 'RRHH', name: 'Departamento de una empresa', tipo: 'senal-siglas-picto', options: ['El departamento que se ocupa de las personas trabajadoras', 'Un tipo de máquina', 'Un impuesto'], correcta: 0 },
          { senal: 'IBAN', name: 'Número de cuenta bancaria', tipo: 'senal-siglas-picto', options: ['El código de tu cuenta del banco', 'El código postal', 'El número de tu móvil'], correcta: 0 },
          { senal: 'IMC', name: 'Medida de salud', tipo: 'senal-siglas-picto', options: ['Una medida relacionada con el peso y la altura', 'Un documento de identidad', 'Un tipo de coche'], correcta: 0 },
          { senal: 'ONU', name: 'Organización internacional', tipo: 'senal-siglas-picto', options: ['Una organización de países que trabaja por la paz', 'Una tienda de ropa', 'Un tipo de coche'], correcta: 0 }
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
        descripcion: 'Danger signs and warnings',
        estrellas: 1,
        items: [
          { senal: '⚠️', name: 'Danger', tipo: 'senal-peligro-picto', options: ['Be careful, there is danger', 'Go fast', 'Safe zone'], correcta: 0 },
          { senal: '🚫', name: 'Prohibited', tipo: 'senal-prohibicion-picto', options: ['You can do it', 'Not allowed', 'Mandatory'], correcta: 1 },
          { senal: '🔥', name: 'Fire', tipo: 'senal-peligro-picto', options: ['You can touch it', 'Be careful with fire', 'It is safe'], correcta: 1 },
          { senal: '⚡', name: 'Electrocution hazard', tipo: 'senal-peligro-picto', options: ['It is safe to touch', 'Risk of electric shock, do not touch', 'It is a toy'], correcta: 1 },
          { senal: '☣️', name: 'Radioactive', tipo: 'senal-peligro-picto', options: ['Safe to touch', 'Do not get close', 'You can play'], correcta: 1 },
          { senal: '☠️', name: 'Poison', tipo: 'senal-peligro-picto', options: ['It is food', 'Do not touch or eat', 'You can try it'], correcta: 1 },
          { senal: '⚠️', name: 'Caution', tipo: 'senal-peligro-picto', options: ['Pass without looking', 'Be careful', 'It is a play area'], correcta: 1 },
          { senal: '🔴', name: 'Stop', tipo: 'senal-peligro-picto', options: ['Keep going', 'Stop and wait', 'Run fast'], correcta: 1 },
          { senal: '💀', name: 'Danger of death', tipo: 'senal-peligro-picto', options: ['Safe zone', 'Extremely dangerous', 'You can enter'], correcta: 1 },
          { senal: '🛑', name: 'Stop', tipo: 'senal-peligro-picto', options: ['Keep walking', 'Stop completely', 'Run'], correcta: 1 },
          { senal: '🚧', name: 'Roadworks', tipo: 'senal-peligro-picto', options: ['You can pass without worry', 'Roadworks warning, be careful', 'It is a shop'], correcta: 1 },
          { senal: '💦', name: 'Wet floor', tipo: 'senal-peligro-picto', options: ['The floor is dry', 'Warning: the floor is wet', 'You can run'], correcta: 1 },
          { senal: '🧊', name: 'Ice on the ground', tipo: 'senal-peligro-picto', options: ['Be careful, it may be slippery', 'It is safe to run', 'You can skate freely'], correcta: 0 },
          { senal: '🌪️', name: 'Strong wind', tipo: 'senal-peligro-picto', options: ['Strong wind warning, be careful', 'Nothing to worry about, carry on', 'It is a good time to fly kites'], correcta: 0 },
          { senal: '🚱', name: 'Non-drinking water', tipo: 'senal-prohibicion-picto', options: ['This water cannot be drunk', 'It is water for drinking', 'It is flavoured water'], correcta: 0 },
          { senal: '⚗️', name: 'Corrosive substance', tipo: 'senal-peligro-picto', options: ['Do not touch, it can burn skin', 'You can touch it safely', 'It is a normal cleaning product'], correcta: 0 }
        ]
      },
      {
        id: 2,
        name: 'Level 2',
        descripcion: 'Bathroom and hygiene signs',
        estrellas: 2,
        items: [
          { senal: '🚽', name: 'Toilet / WC', tipo: 'senal-informacion-picto', options: ['It is a kitchen', 'To go to the bathroom', 'It is a bedroom'], correcta: 1 },
          { senal: '🚹', name: 'Men’s restroom', tipo: 'senal-informacion-picto', options: ['Women’s restroom', 'Restroom for men', 'It is the exit'], correcta: 1 },
          { senal: '🚺', name: 'Women’s restroom', tipo: 'senal-informacion-picto', options: ['Men’s restroom', 'Restroom for women', 'It is the entrance'], correcta: 1 },
          { senal: '🚿', name: 'Shower', tipo: 'senal-informacion-picto', options: ['To eat', 'To shower', 'To sleep'], correcta: 1 },
          { senal: '🛁', name: 'Bathtub', tipo: 'senal-informacion-picto', options: ['To play', 'To take a bath', 'To work'], correcta: 1 },
          { senal: '🚰', name: 'Drinking water', tipo: 'senal-informacion-picto', options: ['Not drinkable', 'Water you can drink', 'It is colorful'], correcta: 1 },
          { senal: '🧴', name: 'Soap', tipo: 'senal-obligacion-picto', options: ['It is food', 'To wash', 'It is perfume'], correcta: 1 },
          { senal: '🧻', name: 'Toilet paper', tipo: 'senal-informacion-picto', options: ['To dry yourself', 'To play', 'To eat'], correcta: 0 },
          { senal: '🚴', name: 'Changing rooms', tipo: 'senal-informacion-picto', options: ['To shower and change', 'To eat', 'To study'], correcta: 0 },
          { senal: '🧼', name: 'Sink', tipo: 'senal-informacion-picto', options: ['To sleep', 'To wash hands and face', 'To cook'], correcta: 1 },
          { senal: '💧', name: 'Water', tipo: 'senal-informacion-picto', options: ['It is fire', 'It is water', 'It is earth'], correcta: 1 },
          { senal: '🧹', name: 'Cleaning', tipo: 'senal-obligacion-picto', options: ['Dirty area', 'Keep it clean', 'Throw trash'], correcta: 1 },
          { senal: '♿', name: 'Accessible bathroom', tipo: 'senal-informacion-picto', options: ['Bathroom prepared for wheelchairs', 'Staff only', 'It is always closed'], correcta: 0 },
          { senal: '🚼', name: 'Baby changing', tipo: 'senal-informacion-picto', options: ['It is for changing babies', 'It is for washing clothes', 'It is for storing food'], correcta: 0 },
          { senal: '🧽', name: 'Paper towels', tipo: 'senal-informacion-picto', options: ['To dry your hands', 'To clean the floor', 'To eat'], correcta: 0 },
          { senal: '🪒', name: 'Personal grooming area', tipo: 'senal-informacion-picto', options: ['To wash up and get ready', 'To sleep', 'To do sports'], correcta: 0 }
        ]
      },
      {
        id: 3,
        name: 'Level 3',
        descripcion: 'Obligation and prohibition signs',
        estrellas: 2,
        items: [
          { senal: '⛔', name: 'No entry', tipo: 'senal-prohibicion-picto', options: ['You can pass', 'You cannot pass', 'Enter quickly'], correcta: 1 },
          { senal: '🚭', name: 'No smoking', tipo: 'senal-prohibicion-picto', options: ['You can smoke', 'No smoking here', 'Smoke outside'], correcta: 1 },
          { senal: '📵', name: 'No mobile phones', tipo: 'senal-prohibicion-picto', options: ['Use your phone as much as you want', 'Do not use your phone', 'Make phone calls'], correcta: 1 },
          { senal: '🐕', name: 'No dogs', tipo: 'senal-prohibicion-picto', options: ['You can bring dogs', 'Do not bring animals', 'Dogs allowed'], correcta: 1 },
          { senal: '🚳', name: 'No bicycles', tipo: 'senal-prohibicion-picto', options: ['Enter on bike', 'Do not enter on bike', 'Leave bike outside'], correcta: 1 },
          { senal: '🈲', name: 'Prohibited', tipo: 'senal-prohibicion-picto', options: ['It is allowed', 'Not allowed', 'It is mandatory'], correcta: 1 },
          { senal: '⭕', name: 'Traffic circle', tipo: 'senal-informacion-picto', options: ['Running zone', 'Walking area', 'Prohibited zone'], correcta: 1 },
          { senal: '🚸', name: 'Pedestrian crossing', tipo: 'senal-obligacion-picto', options: ['For cars', 'Cross here', 'Run'], correcta: 1 },
          { senal: '⏱️', name: 'Time limit', tipo: 'senal-informacion-picto', options: ['Unlimited time', 'Maximum time', 'No time limit'], correcta: 1 },
          { senal: '🔒', name: 'Closed', tipo: 'senal-prohibicion-picto', options: ['Open', 'Closed, do not enter', 'Enter without stopping'], correcta: 1 },
          { senal: '🥽', name: 'Safety goggles required', tipo: 'senal-obligacion-picto', options: ['You must wear safety goggles', 'Goggles are forbidden', 'Goggles are decorative'], correcta: 0 },
          { senal: '🧤', name: 'Gloves required', tipo: 'senal-obligacion-picto', options: ['You must wear gloves', 'Gloves are forbidden', 'Gloves are a gift'], correcta: 0 },
          { senal: '🔇', name: 'No noise', tipo: 'senal-prohibicion-picto', options: ['You must stay quiet', 'You can shout', 'You must play loud music'], correcta: 0 },
          { senal: '🚯', name: 'No littering', tipo: 'senal-prohibicion-picto', options: ['You cannot throw litter on the ground', 'You can throw litter here', 'It is a recycling bin'], correcta: 0 }
        ]
      },
      {
        id: 4,
        name: 'Level 4',
        descripcion: 'Information and exit signs',
        estrellas: 2,
        items: [
          { senal: '🚪', name: 'Exit', tipo: 'senal-salida-picto', options: ['Entrance', 'Exit, this way out', 'It is the kitchen'], correcta: 1 },
          { senal: '🏃', name: 'Emergency exit', tipo: 'senal-salida-picto', options: ['Dangerous zone', 'Exit this way in case of emergency', 'It is a bathroom'], correcta: 1 },
          { senal: '🔓', name: 'Open', tipo: 'senal-informacion-picto', options: ['Closed', 'Open, you can enter', 'It is private'], correcta: 1 },
          { senal: '🅿️', name: 'Parking', tipo: 'senal-informacion-picto', options: ['To play', 'To park cars', 'To eat'], correcta: 1 },
          { senal: 'ℹ️', name: 'Information', tipo: 'senal-informacion-picto', options: ['It is dangerous', 'There is information here', 'Do not look'], correcta: 1 },
          { senal: '📍', name: 'Location', tipo: 'senal-informacion-picto', options: ['You are here', 'It is far', 'Do not look at the map'], correcta: 0 },
          { senal: '🗺️', name: 'Map', tipo: 'senal-informacion-picto', options: ['To get lost', 'To find your way', 'It is decorative'], correcta: 1 },
          { senal: '🛗', name: 'Elevator', tipo: 'senal-informacion-picto', options: ['Use the stairs', 'To go up and down', 'It is a door'], correcta: 1 },
          { senal: '📶', name: 'WiFi', tipo: 'senal-informacion-picto', options: ['No connection', 'There is WiFi here', 'It is a phone'], correcta: 1 },
          { senal: '🔋', name: 'Charger', tipo: 'senal-informacion-picto', options: ['To play', 'To charge devices', 'It is a battery'], correcta: 1 },
          { senal: '🛎️', name: 'Reception', tipo: 'senal-informacion-picto', options: ['You can ask for help or information here', 'It is the kitchen', 'It is the emergency exit'], correcta: 0 },
          { senal: '🧳', name: 'Luggage storage', tipo: 'senal-informacion-picto', options: ['To store your luggage', 'To eat', 'To sleep'], correcta: 0 },
          { senal: '🔃', name: 'Escalators', tipo: 'senal-informacion-picto', options: ['To go up or down without walking', 'They are only decorative', 'It is a door'], correcta: 0 },
          { senal: '🪑', name: 'Waiting area', tipo: 'senal-informacion-picto', options: ['You can sit and wait here', 'Sitting is forbidden', 'It is a play area'], correcta: 0 }
        ]
      },
      {
        id: 5,
        name: 'Level 5',
        descripcion: 'Emergency and first aid signs',
        estrellas: 3,
        items: [
          { senal: '🚑', name: 'Ambulance / Help', tipo: 'senal-salida-picto', options: ['For the car', 'Medical emergency', 'It is a taxi'], correcta: 1 },
          { senal: '🚒', name: 'Firefighters', tipo: 'senal-peligro-picto', options: ['For food', 'Fire emergency', 'It is the police'], correcta: 1 },
          { senal: '🚓', name: 'Police', tipo: 'senal-informacion-picto', options: ['To play', 'Safety and order', 'It is an ambulance'], correcta: 1 },
          { senal: '🆘', name: 'Help', tipo: 'senal-peligro-picto', options: ['Everything is fine', 'I need help', 'Nothing is wrong'], correcta: 1 },
          { senal: '🆗', name: 'OK / Good', tipo: 'senal-informacion-picto', options: ['Not okay', 'It is okay / correct', 'There is a problem'], correcta: 1 },
          { senal: '🩹', name: 'Bandage', tipo: 'senal-informacion-picto', options: ['To cut', 'To treat wounds', 'To play'], correcta: 1 },
          { senal: '💊', name: 'Medicine', tipo: 'senal-informacion-picto', options: ['It is food', 'Medications', 'It is poison'], correcta: 1 },
          { senal: '🩺', name: 'Stethoscope', tipo: 'senal-informacion-picto', options: ['To listen to the heart', 'It is a toy', 'To decorate'], correcta: 0 },
          { senal: '🏥', name: 'Hospital', tipo: 'senal-informacion-picto', options: ['To shop', 'Health center', 'It is a shop'], correcta: 1 },
          { senal: '🧯', name: 'Fire extinguisher', tipo: 'senal-peligro-picto', options: ['To start fire', 'To put out fire', 'It is decoration'], correcta: 1 },
          { senal: '🫀', name: 'Defibrillator', tipo: 'senal-informacion-picto', options: ['A device for heart emergencies', 'It is a radio', 'It is a phone charger'], correcta: 0 },
          { senal: '🧑‍🚒', name: 'Emergency meeting point', tipo: 'senal-salida-picto', options: ['A safe place to gather in an emergency', 'It is the cafeteria', 'It is the waiting room'], correcta: 0 },
          { senal: '🚨', name: 'Emergency alarm', tipo: 'senal-peligro-picto', options: ['It means you should leave carefully', 'It is just an annoying noise', 'It means a party is starting'], correcta: 0 },
          { senal: '🩼', name: 'First aid kit', tipo: 'senal-informacion-picto', options: ['Basic first aid supplies are kept here', 'It is a toy box', 'It is a clothes cabinet'], correcta: 0 }
        ]
      },
      {
        id: 6,
        name: 'Level 6',
        descripcion: 'Public transport signs',
        estrellas: 3,
        items: [
          { senal: '🚌', name: 'Bus stop', tipo: 'senal-informacion-picto', options: ['To wait for the bus', 'To park', 'It is a taxi'], correcta: 0 },
          { senal: '🚇', name: 'Metro / Subway', tipo: 'senal-informacion-picto', options: ['Surface train', 'Underground train', 'Bus'], correcta: 1 },
          { senal: '🚆', name: 'Train', tipo: 'senal-informacion-picto', options: ['Ship', 'Train / Railway', 'Plane'], correcta: 1 },
          { senal: '✈️', name: 'Airplane', tipo: 'senal-informacion-picto', options: ['Ship', 'Train', 'Airplane'], correcta: 2 },
          { senal: '🚢', name: 'Ship / Boat', tipo: 'senal-informacion-picto', options: ['Airport', 'Seaport', 'Train station'], correcta: 1 },
          { senal: '🚕', name: 'Taxi', tipo: 'senal-informacion-picto', options: ['Bus', 'Taxi', 'Private car'], correcta: 1 },
          { senal: '⛽', name: 'Gas station', tipo: 'senal-informacion-picto', options: ['To eat', 'To refuel', 'To sleep'], correcta: 1 },
          { senal: '🚗', name: 'Parking', tipo: 'senal-informacion-picto', options: ['Green zone', 'Parking area', 'Play zone'], correcta: 1 },
          { senal: '🛤️', name: 'Railway tracks', tipo: 'senal-peligro-picto', options: ['Safe zone', 'Danger, railway tracks', 'Walking area'], correcta: 1 },
          { senal: '⚓', name: 'Port', tipo: 'senal-informacion-picto', options: ['Airport', 'Seaport', 'Train station'], correcta: 1 },
          { senal: '🚊', name: 'Tram', tipo: 'senal-informacion-picto', options: ['A train that runs through the city', 'It is a bus', 'It is a plane'], correcta: 0 },
          { senal: '🎫', name: 'Ticket office', tipo: 'senal-informacion-picto', options: ['Tickets are bought here', 'Luggage is checked in here', 'You wait for the driver here'], correcta: 0 },
          { senal: '🛄', name: 'Baggage claim', tipo: 'senal-informacion-picto', options: ['You collect your suitcase here', 'You buy food here', 'You wait for the train here'], correcta: 0 },
          { senal: '🚏', name: 'Requested stop', tipo: 'senal-informacion-picto', options: ['The bus is going to stop at the next stop', 'The bus is not going to stop', 'The bus has finished its route'], correcta: 0 }
        ]
      },
      {
        id: 7,
        name: 'Level 7',
        descripcion: 'Important abbreviations',
        estrellas: 3,
        items: [
          { senal: 'WC', name: 'Restroom', tipo: 'senal-siglas-picto', options: ['It is a restaurant', 'Toilet / restroom', 'It is a shop'], correcta: 1 },
          { senal: 'ID', name: 'Identity document', tipo: 'senal-siglas-picto', options: ['The document that says who you are', 'A type of car', 'A train ticket'], correcta: 0 },
          { senal: 'ATM', name: 'Cash machine', tipo: 'senal-siglas-picto', options: ['A machine to get cash', 'A type of shop', 'A bus stop'], correcta: 0 },
          { senal: 'VIP', name: 'Very important person', tipo: 'senal-siglas-picto', options: ['A special area for important guests', 'A type of food', 'A parking fine'], correcta: 0 },
          { senal: 'SOS', name: 'Call for help', tipo: 'senal-siglas-picto', options: ['Everything is fine', 'Call for urgent help', 'It is a greeting'], correcta: 1 },
          { senal: 'FAQ', name: 'Common questions', tipo: 'senal-siglas-picto', options: ['Common questions and answers', 'A type of ticket', 'A closing time'], correcta: 0 },
          { senal: 'RIP', name: 'On a gravestone', tipo: 'senal-siglas-picto', options: ['Words seen on a gravestone', 'A type of sandwich', 'A road sign'], correcta: 0 },
          { senal: 'ASAP', name: 'As soon as possible', tipo: 'senal-siglas-picto', options: ['As soon as possible', 'Never again', 'Once a year'], correcta: 0 },
          { senal: 'ICU', name: 'Hospital area', tipo: 'senal-siglas-picto', options: ['Hospital area for very serious cases', 'The hospital entrance', 'The hospital cafeteria'], correcta: 0 },
          { senal: 'HR', name: 'Company department', tipo: 'senal-siglas-picto', options: ['The department that looks after employees', 'A type of machine', 'A tax'], correcta: 0 },
          { senal: 'IBAN', name: 'Bank account number', tipo: 'senal-siglas-picto', options: ['The code for your bank account', 'A postcode', 'Your phone number'], correcta: 0 },
          { senal: 'BMI', name: 'Health measurement', tipo: 'senal-siglas-picto', options: ['A measure related to weight and height', 'An ID document', 'A type of car'], correcta: 0 },
          { senal: 'UN', name: 'International organisation', tipo: 'senal-siglas-picto', options: ['An organisation of countries working for peace', 'A clothes shop', 'A type of car'], correcta: 0 }
        ]
      }
    ]
  }
};
