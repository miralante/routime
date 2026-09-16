/* ============================================================
   Datos: Mis Rutinas — rutinas diarias paso a paso.
   Formato: DATA.es / DATA.en, cada uno un array:
   [{ id, name, picto, timeOfDay, steps: [{ text, picto }] }]
   - text: en Lectura Fácil (frase corta, una idea).
   - picto: emoji grande que representa el paso.
   - timeOfDay: agrupador del menú
     ('manana' | 'comida' | 'limpieza' | 'personal' | 'mascotas'
      | 'salida' | 'tarde' | 'noche').
   Para ampliar: añadir un objeto nuevo al array del idioma.
   El progreso se reinicia cada día de forma automática.
   app.js usa DATA[App.i18n.locale()] || DATA.es.
   ============================================================ */
var DATA = {
  es: [
    /* ---------- Por la mañana ---------- */
    {
      id: 'manana',
      name: 'Por la mañana',
      picto: '🌅',
      timeOfDay: 'manana',
      steps: [
        { text: 'Me levanto de la cama.', picto: '🛏️' },
        { text: 'Voy al baño.', picto: '🚽' },
        { text: 'Me lavo la cara.', picto: '🧼' },
        { text: 'Me visto.', picto: '👕' },
        { text: 'Desayuno.', picto: '🥛' },
        { text: 'Me lavo los dientes.', picto: '🪥' }
      ]
    },
    {
      id: 'hacer-cama',
      name: 'Hacer la cama',
      picto: '🛏️',
      timeOfDay: 'manana',
      steps: [
        { text: 'Quito la manta y la almohada.', picto: '🛌' },
        { text: 'Estiro la sábana.', picto: '🛏️' },
        { text: 'Pongo la manta.', picto: '🛌' },
        { text: 'Pongo la almohada.', picto: '🛏️' }
      ]
    },

    /* ---------- Cuidado personal ---------- */
    {
      id: 'ducha',
      name: 'Ducharme',
      picto: '🚿',
      timeOfDay: 'personal',
      steps: [
        { text: 'Me quito la ropa.', picto: '👕' },
        { text: 'Abro el grifo.', picto: '🚰' },
        { text: 'Me mojo el cuerpo.', picto: '💧' },
        { text: 'Me enjabono.', picto: '🧼' },
        { text: 'Me aclaro.', picto: '🚿' },
        { text: 'Me seco con la toalla.', picto: '🛁' }
      ]
    },
    {
      id: 'lavarse-dientes',
      name: 'Lavarme los dientes',
      picto: '🪥',
      timeOfDay: 'personal',
      steps: [
        { text: 'Cojo el cepillo.', picto: '🪥' },
        { text: 'Pongo pasta.', picto: '🪥' },
        { text: 'Me cepillo arriba.', picto: '🪥' },
        { text: 'Me cepillo abajo.', picto: '🪥' },
        { text: 'Enjuago la boca.', picto: '💧' }
      ]
    },
    {
      id: 'vestirse',
      name: 'Vestirme',
      picto: '👕',
      timeOfDay: 'personal',
      steps: [
        { text: 'Elijo la ropa.', picto: '👕' },
        { text: 'Me pongo la camiseta.', picto: '👕' },
        { text: 'Me pongo los pantalones.', picto: '👖' },
        { text: 'Me pongo los calcetines.', picto: '🧦' },
        { text: 'Me pongo los zapatos.', picto: '👟' }
      ]
    },
    {
      id: 'peinarse',
      name: 'Peinarme',
      picto: '💇',
      timeOfDay: 'personal',
      steps: [
        { text: 'Cojo el peine.', picto: '🪮' },
        { text: 'Me peino el pelo.', picto: '💇' },
        { text: 'Me miro al espejo.', picto: '🪞' }
      ]
    },

    /* ---------- Comidas ---------- */
    {
      id: 'comer',
      name: 'Antes de comer',
      picto: '🍽️',
      timeOfDay: 'comida',
      steps: [
        { text: 'Me lavo las manos.', picto: '🧼' },
        { text: 'Pongo la mesa.', picto: '🍽️' },
        { text: 'Me siento en la mesa.', picto: '🪑' },
        { text: 'Como despacio.', picto: '🥄' },
        { text: 'Recojo mi plato.', picto: '🍽️' }
      ]
    },
    {
      id: 'preparar-desayuno',
      name: 'Preparar el desayuno',
      picto: '🥣',
      timeOfDay: 'comida',
      steps: [
        { text: 'Saco un bol.', picto: '🥣' },
        { text: 'Echo los cereales.', picto: '🥣' },
        { text: 'Echo la leche.', picto: '🥛' },
        { text: 'Cojo una cuchara.', picto: '🥄' },
        { text: 'Me siento a desayunar.', picto: '🪑' }
      ]
    },
    {
      id: 'preparar-merienda',
      name: 'Preparar la merienda',
      picto: '🥪',
      timeOfDay: 'comida',
      steps: [
        { text: 'Saco pan.', picto: '🍞' },
        { text: 'Unto mantequilla.', picto: '🧈' },
        { text: 'Pongo el fiambre.', picto: '🥩' },
        { text: 'Corto por la mitad.', picto: '🔪' },
        { text: 'Lo pongo en un plato.', picto: '🍽️' }
      ]
    },
    {
      id: 'cocinar',
      name: 'Cocinar un plato',
      picto: '🍳',
      timeOfDay: 'comida',
      steps: [
        { text: 'Lavo los alimentos.', picto: '🚿' },
        { text: 'Los corto.', picto: '🔪' },
        { text: 'Caliento la sartén.', picto: '🍳' },
        { text: 'Los cocino.', picto: '🍳' },
        { text: 'Sirvo en el plato.', picto: '🍽️' }
      ]
    },

    /* ---------- Limpieza del hogar ---------- */
    {
      id: 'recoger-mesa',
      name: 'Recoger la mesa',
      picto: '🍽️',
      timeOfDay: 'limpieza',
      steps: [
        { text: 'Quito los platos.', picto: '🍽️' },
        { text: 'Tiro los restos.', picto: '🗑️' },
        { text: 'Limpio la mesa.', picto: '🧽' },
        { text: 'Friego los platos.', picto: '🧼' }
      ]
    },
    {
      id: 'barrer',
      name: 'Barrer el suelo',
      picto: '🧹',
      timeOfDay: 'limpieza',
      steps: [
        { text: 'Cojo la escoba.', picto: '🧹' },
        { text: 'Barro la habitación.', picto: '🧹' },
        { text: 'Junto la basura.', picto: '../../assets/img/pile-dust.svg' },
        { text: 'La echo al cubo.', picto: '🗑️' }
      ]
    },
    {
      id: 'fregar',
      name: 'Fregar el suelo',
      picto: '🪣',
      timeOfDay: 'limpieza',
      steps: [
        { text: 'Cojo el cubo.', picto: '🪣' },
        { text: 'Echo agua y producto.', picto: '🧴' },
        { text: 'Mojo la fregona.', picto: '🧹' },
        { text: 'Friego el suelo.', picto: '🧹' },
        { text: 'Dejo que se seque.', picto: '☀️' }
      ]
    },
    {
      id: 'limpiar-polvo',
      name: 'Limpiar el polvo',
      picto: '🪑',
      timeOfDay: 'limpieza',
      steps: [
        { text: 'Cojo un trapo.', picto: '🧽' },
        { text: 'Le echo producto.', picto: '🧴' },
        { text: 'Paso por los muebles.', picto: '🪑' },
        { text: 'Recojo el trapo.', picto: '🧺' }
      ]
    },
    {
      id: 'limpiar-bano',
      name: 'Limpiar el baño',
      picto: '🛁',
      timeOfDay: 'limpieza',
      steps: [
        { text: 'Echo producto en el váter.', picto: '🧴' },
        { text: 'Limpio el lavabo.', picto: '🚰' },
        { text: 'Limpio la bañera.', picto: '🛁' },
        { text: 'Friego el suelo.', picto: '🪣' }
      ]
    },
    {
      id: 'ordenar-habitacion',
      name: 'Ordenar mi habitación',
      picto: '🛏️',
      timeOfDay: 'limpieza',
      steps: [
        { text: 'Recojo la ropa del suelo.', picto: '👕' },
        { text: 'Recojo los juguetes.', picto: '🧸' },
        { text: 'Los pongo en su sitio.', picto: '📦' },
        { text: 'Hago la cama.', picto: '🛏️' }
      ]
    },
    {
      id: 'lavadora',
      name: 'Poner la lavadora',
      picto: '🌀',
      timeOfDay: 'limpieza',
      steps: [
        { text: 'Cojo la ropa sucia.', picto: '🧺' },
        { text: 'Echo detergente.', picto: '🧴' },
        { text: 'Enciendo la lavadora.', picto: '🌀' },
        { text: 'Tiendo la ropa.', picto: '☀️' }
      ]
    },
    {
      id: 'doblar-ropa',
      name: 'Doblar la ropa',
      picto: '👕',
      timeOfDay: 'limpieza',
      steps: [
        { text: 'Cojo la ropa seca.', picto: '🧺' },
        { text: 'Doblo las camisetas.', picto: '👕' },
        { text: 'Doblo los pantalones.', picto: '👖' },
        { text: 'Lo guardo en el armario.', picto: '🗄️' }
      ]
    },
    {
      id: 'sacar-basura',
      name: 'Sacar la basura',
      picto: '🚮',
      timeOfDay: 'limpieza',
      steps: [
        { text: 'Cierro la bolsa.', picto: '🪢' },
        { text: 'La llevo al contenedor.', picto: '🚮' },
        { text: 'Echo una bolsa nueva.', picto: '🗑️' }
      ]
    },
    {
      id: 'regar-plantas',
      name: 'Regar las plantas',
      picto: '🪴',
      timeOfDay: 'limpieza',
      steps: [
        { text: 'Cojo la regadera.', picto: '🚰' },
        { text: 'Echo agua en la planta.', picto: '💧' },
        { text: 'Compruebo la tierra.', picto: '🪴' }
      ]
    },

    /* ---------- Mascotas ---------- */
    {
      id: 'pasear-perro',
      name: 'Pasear al perro',
      picto: '🐶',
      timeOfDay: 'mascotas',
      steps: [
        { text: 'Pongo la correa.', picto: '🦮' },
        { text: 'Salgo a la calle.', picto: '🚪' },
        { text: 'Paseo con el perro.', picto: '🌳' },
        { text: 'Volvemos a casa.', picto: '🏠' }
      ]
    },
    {
      id: 'dar-comer-perro',
      name: 'Dar de comer al perro',
      picto: '🦴',
      timeOfDay: 'mascotas',
      steps: [
        { text: 'Cojo su plato.', picto: '🥣' },
        { text: 'Echo su comida.', picto: '🥄' },
        { text: 'Se lo doy.', picto: '🐶' },
        { text: 'Lavo el plato.', picto: '🧼' }
      ]
    },
    {
      id: 'dar-comer-gato',
      name: 'Dar de comer al gato',
      picto: '🐱',
      timeOfDay: 'mascotas',
      steps: [
        { text: 'Cojo su plato.', picto: '🥣' },
        { text: 'Abro la lata.', picto: '🥫' },
        { text: 'Sirvo la comida.', picto: '🥄' },
        { text: 'Lavo el plato.', picto: '🧼' }
      ]
    },
    {
      id: 'limpiar-arenero',
      name: 'Limpiar el arenero',
      picto: '🐈',
      timeOfDay: 'mascotas',
      steps: [
        { text: 'Cojo la pala.', picto: '🧹' },
        { text: 'Quito la arena sucia.', picto: '🪣' },
        { text: 'Echo arena limpia.', picto: '🧴' }
      ]
    },

    /* ---------- Salir de casa ---------- */
    {
      id: 'salir',
      name: 'Salir de casa',
      picto: '🚪',
      timeOfDay: 'salida',
      steps: [
        { text: 'Voy al baño.', picto: '🚽' },
        { text: 'Cojo mis llaves.', picto: '🔑' },
        { text: 'Cojo mi teléfono.', picto: '📱' },
        { text: 'Miro el tiempo. ¿Necesito abrigo?', picto: '🌦️' },
        { text: 'Cierro la puerta.', picto: '🚪' }
      ]
    },
    {
      id: 'mochila-cole',
      name: 'Preparar la mochila del cole',
      picto: '🎒',
      timeOfDay: 'salida',
      steps: [
        { text: 'Cojo la mochila.', picto: '🎒' },
        { text: 'Pongo los libros.', picto: '📚' },
        { text: 'Pongo el estuche.', picto: '✏️' },
        { text: 'Pongo el almuerzo.', picto: '🍎' }
      ]
    },

    /* ---------- Por la tarde ---------- */
    {
      id: 'merendar',
      name: 'La merienda',
      picto: '🥪',
      timeOfDay: 'tarde',
      steps: [
        { text: 'Me lavo las manos.', picto: '🧼' },
        { text: 'Me siento a la mesa.', picto: '🪑' },
        { text: 'Como la merienda.', picto: '🥪' },
        { text: 'Recojo.', picto: '🍽️' }
      ]
    },
    {
      id: 'deberes',
      name: 'Hacer los deberes',
      picto: '📚',
      timeOfDay: 'tarde',
      steps: [
        { text: 'Pongo la mesa para estudiar.', picto: '📚' },
        { text: 'Saco el cuaderno.', picto: '📓' },
        { text: 'Hago las tareas.', picto: '✏️' },
        { text: 'Guardo todo en la mochila.', picto: '🎒' }
      ]
    },

    /* ---------- Por la noche ---------- */
    {
      id: 'noche',
      name: 'Por la noche',
      picto: '🌙',
      timeOfDay: 'noche',
      steps: [
        { text: 'Ceno.', picto: '🍽️' },
        { text: 'Me pongo el pijama.', picto: '🩳' },
        { text: 'Me lavo los dientes.', picto: '🪥' },
        { text: 'Preparo la ropa de mañana.', picto: '👕' },
        { text: 'Me acuesto.', picto: '🛏️' }
      ]
    }
  ],

  en: [
    /* ---------- In the morning ---------- */
    {
      id: 'manana',
      name: 'In the morning',
      picto: '🌅',
      timeOfDay: 'manana',
      steps: [
        { text: 'I get out of bed.', picto: '🛏️' },
        { text: 'I go to the bathroom.', picto: '🚽' },
        { text: 'I wash my face.', picto: '🧼' },
        { text: 'I get dressed.', picto: '👕' },
        { text: 'I have breakfast.', picto: '🥛' },
        { text: 'I brush my teeth.', picto: '🪥' }
      ]
    },
    {
      id: 'hacer-cama',
      name: 'Make the bed',
      picto: '🛏️',
      timeOfDay: 'manana',
      steps: [
        { text: 'I pull back the blanket and pillow.', picto: '🛌' },
        { text: 'I straighten the sheet.', picto: '🛏️' },
        { text: 'I spread the blanket.', picto: '🛌' },
        { text: 'I put the pillow back.', picto: '🛏️' }
      ]
    },

    /* ---------- Personal care ---------- */
    {
      id: 'ducha',
      name: 'Take a shower',
      picto: '🚿',
      timeOfDay: 'personal',
      steps: [
        { text: 'I take my clothes off.', picto: '👕' },
        { text: 'I turn on the water.', picto: '🚰' },
        { text: 'I wet my body.', picto: '💧' },
        { text: 'I put soap on.', picto: '🧼' },
        { text: 'I rinse off.', picto: '🚿' },
        { text: 'I dry with a towel.', picto: '🛁' }
      ]
    },
    {
      id: 'lavarse-dientes',
      name: 'Brush my teeth',
      picto: '🪥',
      timeOfDay: 'personal',
      steps: [
        { text: 'I take the toothbrush.', picto: '🪥' },
        { text: 'I put toothpaste on.', picto: '🪥' },
        { text: 'I brush the top.', picto: '🪥' },
        { text: 'I brush the bottom.', picto: '🪥' },
        { text: 'I rinse my mouth.', picto: '💧' }
      ]
    },
    {
      id: 'vestirse',
      name: 'Get dressed',
      picto: '👕',
      timeOfDay: 'personal',
      steps: [
        { text: 'I pick my clothes.', picto: '👕' },
        { text: 'I put on my t-shirt.', picto: '👕' },
        { text: 'I put on my trousers.', picto: '👖' },
        { text: 'I put on my socks.', picto: '🧦' },
        { text: 'I put on my shoes.', picto: '👟' }
      ]
    },
    {
      id: 'peinarse',
      name: 'Comb my hair',
      picto: '💇',
      timeOfDay: 'personal',
      steps: [
        { text: 'I take the comb.', picto: '🪮' },
        { text: 'I comb my hair.', picto: '💇' },
        { text: 'I look in the mirror.', picto: '🪞' }
      ]
    },

    /* ---------- Meals ---------- */
    {
      id: 'comer',
      name: 'Before eating',
      picto: '🍽️',
      timeOfDay: 'comida',
      steps: [
        { text: 'I wash my hands.', picto: '🧼' },
        { text: 'I set the table.', picto: '🍽️' },
        { text: 'I sit at the table.', picto: '🪑' },
        { text: 'I eat slowly.', picto: '🥄' },
        { text: 'I clear my plate.', picto: '🍽️' }
      ]
    },
    {
      id: 'preparar-desayuno',
      name: 'Make breakfast',
      picto: '🥣',
      timeOfDay: 'comida',
      steps: [
        { text: 'I take a bowl.', picto: '🥣' },
        { text: 'I pour the cereal.', picto: '🥣' },
        { text: 'I pour the milk.', picto: '🥛' },
        { text: 'I take a spoon.', picto: '🥄' },
        { text: 'I sit down for breakfast.', picto: '🪑' }
      ]
    },
    {
      id: 'preparar-merienda',
      name: 'Make a snack',
      picto: '🥪',
      timeOfDay: 'comida',
      steps: [
        { text: 'I take bread.', picto: '🍞' },
        { text: 'I spread butter.', picto: '🧈' },
        { text: 'I add the filling.', picto: '🥩' },
        { text: 'I cut it in half.', picto: '🔪' },
        { text: 'I put it on a plate.', picto: '🍽️' }
      ]
    },
    {
      id: 'cocinar',
      name: 'Cook a dish',
      picto: '🍳',
      timeOfDay: 'comida',
      steps: [
        { text: 'I wash the food.', picto: '🚿' },
        { text: 'I cut it.', picto: '🔪' },
        { text: 'I heat the pan.', picto: '🍳' },
        { text: 'I cook it.', picto: '🍳' },
        { text: 'I serve it on a plate.', picto: '🍽️' }
      ]
    },

    /* ---------- Cleaning ---------- */
    {
      id: 'recoger-mesa',
      name: 'Clear the table',
      picto: '🍽️',
      timeOfDay: 'limpieza',
      steps: [
        { text: 'I take the plates away.', picto: '🍽️' },
        { text: 'I throw the leftovers.', picto: '🗑️' },
        { text: 'I wipe the table.', picto: '🧽' },
        { text: 'I wash the dishes.', picto: '🧼' }
      ]
    },
    {
      id: 'barrer',
      name: 'Sweep the floor',
      picto: '🧹',
      timeOfDay: 'limpieza',
      steps: [
        { text: 'I take the broom.', picto: '🧹' },
        { text: 'I sweep the room.', picto: '🧹' },
        { text: 'I gather the dust.', picto: '../../assets/img/pile-dust.svg' },
        { text: 'I throw it in the bin.', picto: '🗑️' }
      ]
    },
    {
      id: 'fregar',
      name: 'Mop the floor',
      picto: '🪣',
      timeOfDay: 'limpieza',
      steps: [
        { text: 'I take the bucket.', picto: '🪣' },
        { text: 'I add water and cleaner.', picto: '🧴' },
        { text: 'I wet the mop.', picto: '🧹' },
        { text: 'I mop the floor.', picto: '🧹' },
        { text: 'I let it dry.', picto: '☀️' }
      ]
    },
    {
      id: 'limpiar-polvo',
      name: 'Dust the furniture',
      picto: '🪑',
      timeOfDay: 'limpieza',
      steps: [
        { text: 'I take a cloth.', picto: '🧽' },
        { text: 'I add some cleaner.', picto: '🧴' },
        { text: 'I wipe the furniture.', picto: '🪑' },
        { text: 'I put the cloth away.', picto: '🧺' }
      ]
    },
    {
      id: 'limpiar-bano',
      name: 'Clean the bathroom',
      picto: '🛁',
      timeOfDay: 'limpieza',
      steps: [
        { text: 'I put cleaner in the toilet.', picto: '🧴' },
        { text: 'I clean the sink.', picto: '🚰' },
        { text: 'I clean the bathtub.', picto: '🛁' },
        { text: 'I mop the floor.', picto: '🪣' }
      ]
    },
    {
      id: 'ordenar-habitacion',
      name: 'Tidy my bedroom',
      picto: '🛏️',
      timeOfDay: 'limpieza',
      steps: [
        { text: 'I pick up the clothes.', picto: '👕' },
        { text: 'I pick up the toys.', picto: '🧸' },
        { text: 'I put them away.', picto: '📦' },
        { text: 'I make the bed.', picto: '🛏️' }
      ]
    },
    {
      id: 'lavadora',
      name: 'Do the laundry',
      picto: '🌀',
      timeOfDay: 'limpieza',
      steps: [
        { text: 'I take the dirty clothes.', picto: '🧺' },
        { text: 'I add detergent.', picto: '🧴' },
        { text: 'I turn on the washing machine.', picto: '🌀' },
        { text: 'I hang out the clothes.', picto: '☀️' }
      ]
    },
    {
      id: 'doblar-ropa',
      name: 'Fold the clothes',
      picto: '👕',
      timeOfDay: 'limpieza',
      steps: [
        { text: 'I take the dry clothes.', picto: '🧺' },
        { text: 'I fold the t-shirts.', picto: '👕' },
        { text: 'I fold the trousers.', picto: '👖' },
        { text: 'I put them in the wardrobe.', picto: '🗄️' }
      ]
    },
    {
      id: 'sacar-basura',
      name: 'Take out the trash',
      picto: '🚮',
      timeOfDay: 'limpieza',
      steps: [
        { text: 'I tie the bag.', picto: '🪢' },
        { text: 'I take it to the bin.', picto: '🚮' },
        { text: 'I put a new bag in.', picto: '🗑️' }
      ]
    },
    {
      id: 'regar-plantas',
      name: 'Water the plants',
      picto: '🪴',
      timeOfDay: 'limpieza',
      steps: [
        { text: 'I take the watering can.', picto: '🚰' },
        { text: 'I pour water on the plant.', picto: '💧' },
        { text: 'I check the soil.', picto: '🪴' }
      ]
    },

    /* ---------- Pets ---------- */
    {
      id: 'pasear-perro',
      name: 'Walk the dog',
      picto: '🐶',
      timeOfDay: 'mascotas',
      steps: [
        { text: 'I put on the leash.', picto: '🦮' },
        { text: 'I go outside.', picto: '🚪' },
        { text: 'I walk the dog.', picto: '🌳' },
        { text: 'We go back home.', picto: '🏠' }
      ]
    },
    {
      id: 'dar-comer-perro',
      name: 'Feed the dog',
      picto: '🦴',
      timeOfDay: 'mascotas',
      steps: [
        { text: 'I take its bowl.', picto: '🥣' },
        { text: 'I pour the food.', picto: '🥄' },
        { text: 'I give it to the dog.', picto: '🐶' },
        { text: 'I wash the bowl.', picto: '🧼' }
      ]
    },
    {
      id: 'dar-comer-gato',
      name: 'Feed the cat',
      picto: '🐱',
      timeOfDay: 'mascotas',
      steps: [
        { text: 'I take its bowl.', picto: '🥣' },
        { text: 'I open the can.', picto: '🥫' },
        { text: 'I serve the food.', picto: '🥄' },
        { text: 'I wash the bowl.', picto: '🧼' }
      ]
    },
    {
      id: 'limpiar-arenero',
      name: 'Clean the litter box',
      picto: '🐈',
      timeOfDay: 'mascotas',
      steps: [
        { text: 'I take the scoop.', picto: '🧹' },
        { text: 'I remove the dirty litter.', picto: '🪣' },
        { text: 'I add clean litter.', picto: '🧴' }
      ]
    },

    /* ---------- Leaving home ---------- */
    {
      id: 'salir',
      name: 'Leaving home',
      picto: '🚪',
      timeOfDay: 'salida',
      steps: [
        { text: 'I go to the bathroom.', picto: '🚽' },
        { text: 'I grab my keys.', picto: '🔑' },
        { text: 'I grab my phone.', picto: '📱' },
        { text: 'I check the weather. Do I need a coat?', picto: '🌦️' },
        { text: 'I close the door.', picto: '🚪' }
      ]
    },
    {
      id: 'mochila-cole',
      name: 'Pack the school bag',
      picto: '🎒',
      timeOfDay: 'salida',
      steps: [
        { text: 'I take the backpack.', picto: '🎒' },
        { text: 'I put the books in.', picto: '📚' },
        { text: 'I put the pencil case in.', picto: '✏️' },
        { text: 'I put the snack in.', picto: '🍎' }
      ]
    },

    /* ---------- In the afternoon ---------- */
    {
      id: 'merendar',
      name: 'Afternoon snack',
      picto: '🥪',
      timeOfDay: 'tarde',
      steps: [
        { text: 'I wash my hands.', picto: '🧼' },
        { text: 'I sit at the table.', picto: '🪑' },
        { text: 'I eat the snack.', picto: '🥪' },
        { text: 'I tidy up.', picto: '🍽️' }
      ]
    },
    {
      id: 'deberes',
      name: 'Do homework',
      picto: '📚',
      timeOfDay: 'tarde',
      steps: [
        { text: 'I set up a study space.', picto: '📚' },
        { text: 'I take out my notebook.', picto: '📓' },
        { text: 'I do my tasks.', picto: '✏️' },
        { text: 'I pack everything away.', picto: '🎒' }
      ]
    },

    /* ---------- At night ---------- */
    {
      id: 'noche',
      name: 'At night',
      picto: '🌙',
      timeOfDay: 'noche',
      steps: [
        { text: 'I have dinner.', picto: '🍽️' },
        { text: 'I put on my pajamas.', picto: '🩳' },
        { text: 'I brush my teeth.', picto: '🪥' },
        { text: "I get tomorrow's clothes ready.", picto: '👕' },
        { text: 'I go to bed.', picto: '🛏️' }
      ]
    }
  ]
};
