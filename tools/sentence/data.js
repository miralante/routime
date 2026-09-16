/* ============================================================
   Datos: La Frase (es) y The Sentence en inglés (en) — comprensión lectora.
   Formato: DATA[loc] = { porRonda, niveles: [{ id, name, descripcion,
     estrellas, items: [{ frase, pregunta, options: string[3], correcta }] }] }
   Para ampliar: añadir items al array del nivel/idioma correspondiente.
   app.js usa DATA[App.i18n.locale()].
   ============================================================ */
const DATA = {
  es: {
  porRonda: 8,
  niveles: [
    {
      id: 1,
      name: 'Nivel 1',
      descripcion: '¿Quién?',
      estrellas: 1,
      items: [
        { frase: 'María juega en el parque.', pregunta: '¿Quién juega en el parque?', options: ['María', 'Pedro', 'El perro'], correcta: 0 },
        { frase: 'El perro corre por el jardín.', pregunta: '¿Quién corre por el jardín?', options: ['El gato', 'El perro', 'El pájaro'], correcta: 1 },
        { frase: 'Pedro come una manzana.', pregunta: '¿Quién come una manzana?', options: ['Pedro', 'Ana', 'El abuelo'], correcta: 0 },
        { frase: 'La abuela cocina la cena.', pregunta: '¿Quién cocina la cena?', options: ['El abuelo', 'La abuela', 'La mamá'], correcta: 1 },
        { frase: 'Ana lee un libro.', pregunta: '¿Quién lee un libro?', options: ['Ana', 'Luis', 'La profesora'], correcta: 0 },
        { frase: 'El gato duerme en el sofá.', pregunta: '¿Quién duerme en el sofá?', options: ['El perro', 'El gato', 'El niño'], correcta: 1 },
        { frase: 'Luis pinta un dibujo.', pregunta: '¿Quién pinta un dibujo?', options: ['Luis', 'Marta', 'El papá'], correcta: 0 },
        { frase: 'La profesora escribe en la pizarra.', pregunta: '¿Quién escribe en la pizarra?', options: ['El alumno', 'La profesora', 'El director'], correcta: 1 },
        { frase: 'El niño monta en bicicleta.', pregunta: '¿Quién monta en bicicleta?', options: ['El niño', 'La niña', 'El padre'], correcta: 0 },
        { frase: 'Marta canta una canción.', pregunta: '¿Quién canta una canción?', options: ['Marta', 'Sofía', 'La cantante'], correcta: 0 },
        { frase: 'El papá conduce el coche.', pregunta: '¿Quién conduce el coche?', options: ['La mamá', 'El papá', 'El abuelo'], correcta: 1 },
        { frase: 'La niña salta a la comba.', pregunta: '¿Quién salta a la comba?', options: ['El niño', 'La niña', 'La profesora'], correcta: 1 },
        { frase: 'El bebé llora en la cuna.', pregunta: '¿Quién llora en la cuna?', options: ['El bebé', 'El niño', 'El perro'], correcta: 0 },
        { frase: 'Sofía riega las plantas.', pregunta: '¿Quién riega las plantas?', options: ['Sofía', 'Elena', 'La jardinera'], correcta: 0 },
        { frase: 'El abuelo lee el periódico.', pregunta: '¿Quién lee el periódico?', options: ['La abuela', 'El abuelo', 'El padre'], correcta: 1 },
        { frase: 'Carlos riega el jardín.', pregunta: '¿Quién riega el jardín?', options: ['Carlos', 'Diego', 'El vecino'], correcta: 0 },
        { frase: 'El pato nada en el estanque.', pregunta: '¿Quién nada en el estanque?', options: ['El pato', 'El cisne', 'El pez'], correcta: 0 },
        { frase: 'Laura hace los deberes en su cuarto.', pregunta: '¿Quién hace los deberes?', options: ['Laura', 'Clara', 'La hermana'], correcta: 0 },
        { frase: 'El cartero deja una carta en el buzón.', pregunta: '¿Quién deja la carta?', options: ['El vecino', 'El cartero', 'El profesor'], correcta: 1 }
      ]
    },
    {
      id: 2,
      name: 'Nivel 2',
      descripcion: '¿Qué? y ¿dónde?',
      estrellas: 2,
      items: [
        { frase: 'El perro duerme debajo de la mesa.', pregunta: '¿Dónde duerme el perro?', options: ['En la cama', 'Debajo de la mesa', 'En el jardín'], correcta: 1 },
        { frase: 'María compra pan en la panadería.', pregunta: '¿Qué compra María?', options: ['Pan', 'Leche', 'Fruta'], correcta: 0 },
        { frase: 'Los niños juegan en el patio del colegio.', pregunta: '¿Dónde juegan los niños?', options: ['En casa', 'En el parque', 'En el patio del colegio'], correcta: 2 },
        { frase: 'El gato bebe leche en la cocina.', pregunta: '¿Qué bebe el gato?', options: ['Agua', 'Leche', 'Zumo'], correcta: 1 },
        { frase: 'Pedro guarda sus juguetes en la caja.', pregunta: '¿Dónde guarda Pedro sus juguetes?', options: ['En la caja', 'En el armario', 'En la mochila'], correcta: 0 },
        { frase: 'La abuela hornea galletas en el horno.', pregunta: '¿Qué hornea la abuela?', options: ['Un pastel', 'Galletas', 'Pan'], correcta: 1 },
        { frase: 'Ana nada en la piscina.', pregunta: '¿Dónde nada Ana?', options: ['En el mar', 'En la piscina', 'En el río'], correcta: 1 },
        { frase: 'El pájaro construye un nido en el árbol.', pregunta: '¿Dónde construye el nido el pájaro?', options: ['En el árbol', 'En el tejado', 'En el suelo'], correcta: 0 },
        { frase: 'Luis lava los platos en el fregadero.', pregunta: '¿Qué lava Luis?', options: ['La ropa', 'Los platos', 'El coche'], correcta: 1 },
        { frase: 'Los peces nadan en el acuario.', pregunta: '¿Dónde nadan los peces?', options: ['En el mar', 'En el acuario', 'En el río'], correcta: 1 },
        { frase: 'La profesora escribe la fecha en la pizarra.', pregunta: '¿Qué escribe la profesora?', options: ['Su name', 'La fecha', 'Un dibujo'], correcta: 1 },
        { frase: 'El coche está aparcado en el garaje.', pregunta: '¿Dónde está el coche?', options: ['En la calle', 'En el garaje', 'En el parque'], correcta: 1 },
        { frase: 'Marta pone la mesa en el comedor.', pregunta: '¿Dónde pone la mesa Marta?', options: ['En la cocina', 'En el comedor', 'En el jardín'], correcta: 1 },
        { frase: 'El panadero hace pan en la panadería.', pregunta: '¿Qué hace el panadero?', options: ['Pan', 'Pasteles', 'Zumo'], correcta: 0 },
        { frase: 'Los niños ven una película en el cine.', pregunta: '¿Dónde ven la película los niños?', options: ['En casa', 'En el cine', 'En el colegio'], correcta: 1 },
        { frase: 'El abuelo juega a las cartas en el salón.', pregunta: '¿Dónde juega el abuelo a las cartas?', options: ['En la cocina', 'En el salón', 'En el jardín'], correcta: 1 },
        { frase: 'Laura pinta un cuadro en su habitación.', pregunta: '¿Qué pinta Laura?', options: ['Un cuadro', 'Una carta', 'Un mapa'], correcta: 0 },
        { frase: 'El panadero vende pan en el mercado.', pregunta: '¿Dónde vende pan el panadero?', options: ['En el mercado', 'En su casa', 'En el colegio'], correcta: 0 },
        { frase: 'El gato caza un ratón en el granero.', pregunta: '¿Qué caza el gato?', options: ['Un pájaro', 'Un ratón', 'Un pez'], correcta: 1 }
      ]
    },
    {
      id: 3,
      name: 'Nivel 3',
      descripcion: '¿Por qué?',
      estrellas: 3,
      items: [
        { frase: 'Ana coge el paraguas porque está lloviendo.', pregunta: '¿Por qué coge Ana el paraguas?', options: ['Porque hace sol', 'Porque está lloviendo', 'Porque tiene frío'], correcta: 1 },
        { frase: 'Pedro se pone el abrigo porque hace frío.', pregunta: '¿Por qué se pone Pedro el abrigo?', options: ['Porque hace frío', 'Porque hace calor', 'Porque va a nadar'], correcta: 0 },
        { frase: 'María enciende la luz porque está oscuro.', pregunta: '¿Por qué enciende María la luz?', options: ['Porque hay mucha luz', 'Porque está oscuro', 'Porque tiene sueño'], correcta: 1 },
        { frase: 'El niño se lava las manos porque están sucias.', pregunta: '¿Por qué se lava las manos el niño?', options: ['Porque están sucias', 'Porque tiene hambre', 'Porque está cansado'], correcta: 0 },
        { frase: 'Marta bebe agua porque tiene sed.', pregunta: '¿Por qué bebe agua Marta?', options: ['Porque tiene sed', 'Porque tiene sueño', 'Porque tiene frío'], correcta: 0 },
        { frase: 'El abuelo se sienta porque está cansado.', pregunta: '¿Por qué se sienta el abuelo?', options: ['Porque está contento', 'Porque está cansado', 'Porque tiene hambre'], correcta: 1 },
        { frase: 'Luis se pone las gafas de sol porque hay mucho sol.', pregunta: '¿Por qué se pone las gafas Luis?', options: ['Porque hay mucho sol', 'Porque está lloviendo', 'Porque es de noche'], correcta: 0 },
        { frase: 'El bebé llora porque tiene hambre.', pregunta: '¿Por qué llora el bebé?', options: ['Porque tiene sueño', 'Porque tiene hambre', 'Porque está contento'], correcta: 1 },
        { frase: 'Ana se pone el pijama porque va a dormir.', pregunta: '¿Por qué se pone el pijama Ana?', options: ['Porque va a dormir', 'Porque va a salir', 'Porque va a comer'], correcta: 0 },
        { frase: 'El perro ladra porque ha oído un ruido.', pregunta: '¿Por qué ladra el perro?', options: ['Porque tiene hambre', 'Porque ha oído un ruido', 'Porque está dormido'], correcta: 1 },
        { frase: 'Sofía se abriga porque va a nevar.', pregunta: '¿Por qué se abriga Sofía?', options: ['Porque va a nevar', 'Porque hace calor', 'Porque va a la piscina'], correcta: 0 },
        { frase: 'El coche se para porque el semáforo está en rojo.', pregunta: '¿Por qué se para el coche?', options: ['Porque no tiene gasolina', 'Porque el semáforo está en rojo', 'Porque está averiado'], correcta: 1 },
        { frase: 'María se pone crema porque va a la playa.', pregunta: '¿Por qué se pone crema María?', options: ['Porque va a la playa', 'Porque tiene frío', 'Porque va a dormir'], correcta: 0 },
        { frase: 'El niño se pone los guantes porque hace mucho frío.', pregunta: '¿Por qué se pone guantes el niño?', options: ['Porque hace calor', 'Porque hace mucho frío', 'Porque va a nadar'], correcta: 1 },
        { frase: 'Pedro apaga la tele porque es hora de dormir.', pregunta: '¿Por qué apaga la tele Pedro?', options: ['Porque es hora de dormir', 'Porque tiene hambre', 'Porque va a jugar'], correcta: 0 },
        { frase: 'Carlos se pone protector solar porque hay mucho sol.', pregunta: '¿Por qué se pone protector solar Carlos?', options: ['Porque hay mucho sol', 'Porque llueve', 'Porque tiene frío'], correcta: 0 },
        { frase: 'Laura cierra la ventana porque hace ruido fuera.', pregunta: '¿Por qué cierra la ventana Laura?', options: ['Porque hace ruido fuera', 'Porque hace calor', 'Porque quiere dormir'], correcta: 0 },
        { frase: 'El perro se esconde porque hay truenos.', pregunta: '¿Por qué se esconde el perro?', options: ['Porque tiene hambre', 'Porque hay truenos', 'Porque está contento'], correcta: 1 },
        { frase: 'Sofía enciende la calefacción porque tiene frío.', pregunta: '¿Por qué enciende la calefacción Sofía?', options: ['Porque tiene frío', 'Porque tiene calor', 'Porque va a salir'], correcta: 0 }
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
        descripcion: 'Who?',
        estrellas: 1,
        items: [
          { frase: 'Emma plays in the garden.', pregunta: 'Who plays in the garden?', options: ['Emma', 'Jack', 'The dog'], correcta: 0 },
          { frase: 'The dog runs across the field.', pregunta: 'Who runs across the field?', options: ['The cat', 'The dog', 'The bird'], correcta: 1 },
          { frase: 'Jack eats an apple.', pregunta: 'Who eats an apple?', options: ['Jack', 'Grace', 'Grandpa'], correcta: 0 },
          { frase: 'Grandma cooks dinner.', pregunta: 'Who cooks dinner?', options: ['Grandpa', 'Grandma', 'Mum'], correcta: 1 },
          { frase: 'Grace reads a book.', pregunta: 'Who reads a book?', options: ['Grace', 'Leo', 'The teacher'], correcta: 0 },
          { frase: 'The cat sleeps on the sofa.', pregunta: 'Who sleeps on the sofa?', options: ['The dog', 'The cat', 'The boy'], correcta: 1 },
          { frase: 'Leo paints a picture.', pregunta: 'Who paints a picture?', options: ['Leo', 'Martha', 'Dad'], correcta: 0 },
          { frase: 'The teacher writes on the board.', pregunta: 'Who writes on the board?', options: ['The pupil', 'The teacher', 'The head teacher'], correcta: 1 },
          { frase: 'The boy rides his bike.', pregunta: 'Who rides a bike?', options: ['The boy', 'The girl', 'Dad'], correcta: 0 },
          { frase: 'Martha sings a song.', pregunta: 'Who sings a song?', options: ['Martha', 'Sophie', 'The singer'], correcta: 0 },
          { frase: 'Dad drives the car.', pregunta: 'Who drives the car?', options: ['Mum', 'Dad', 'Grandpa'], correcta: 1 },
          { frase: 'The girl skips with a rope.', pregunta: 'Who skips with a rope?', options: ['The boy', 'The girl', 'The teacher'], correcta: 1 },
          { frase: 'The baby cries in the cot.', pregunta: 'Who cries in the cot?', options: ['The baby', 'The boy', 'The dog'], correcta: 0 },
          { frase: 'Sophie waters the plants.', pregunta: 'Who waters the plants?', options: ['Sophie', 'Ellen', 'The gardener'], correcta: 0 },
          { frase: 'Grandpa reads the newspaper.', pregunta: 'Who reads the newspaper?', options: ['Grandma', 'Grandpa', 'Dad'], correcta: 1 },
          { frase: 'Charlie waters the garden.', pregunta: 'Who waters the garden?', options: ['Charlie', 'Daniel', 'The neighbour'], correcta: 0 },
          { frase: 'The duck swims in the pond.', pregunta: 'Who swims in the pond?', options: ['The duck', 'The swan', 'The fish'], correcta: 0 },
          { frase: 'Laura does her homework in her room.', pregunta: 'Who does the homework?', options: ['Laura', 'Clara', 'The sister'], correcta: 0 },
          { frase: 'The postman leaves a letter in the mailbox.', pregunta: 'Who leaves the letter?', options: ['The neighbour', 'The postman', 'The teacher'], correcta: 1 }
        ]
      },
      {
        id: 2,
        name: 'Level 2',
        descripcion: 'What and where?',
        estrellas: 2,
        items: [
          { frase: 'The dog sleeps under the table.', pregunta: 'Where does the dog sleep?', options: ['In the bed', 'Under the table', 'In the garden'], correcta: 1 },
          { frase: 'Emma buys bread at the bakery.', pregunta: 'What does Emma buy?', options: ['Bread', 'Milk', 'Fruit'], correcta: 0 },
          { frase: 'The children play in the school yard.', pregunta: 'Where do the children play?', options: ['At home', 'In the park', 'In the school yard'], correcta: 2 },
          { frase: 'The cat drinks milk in the kitchen.', pregunta: 'What does the cat drink?', options: ['Water', 'Milk', 'Juice'], correcta: 1 },
          { frase: 'Jack keeps his toys in the box.', pregunta: 'Where does Jack keep his toys?', options: ['In the box', 'In the cupboard', 'In the bag'], correcta: 0 },
          { frase: 'Grandma bakes biscuits in the oven.', pregunta: 'What does Grandma bake?', options: ['A cake', 'Biscuits', 'Bread'], correcta: 1 },
          { frase: 'Grace swims in the pool.', pregunta: 'Where does Grace swim?', options: ['In the sea', 'In the pool', 'In the river'], correcta: 1 },
          { frase: 'The bird builds a nest in the tree.', pregunta: 'Where does the bird build its nest?', options: ['In the tree', 'On the roof', 'On the ground'], correcta: 0 },
          { frase: 'Leo washes the plates in the sink.', pregunta: 'What does Leo wash?', options: ['The clothes', 'The plates', 'The car'], correcta: 1 },
          { frase: 'The fish swim in the tank.', pregunta: 'Where do the fish swim?', options: ['In the sea', 'In the tank', 'In the river'], correcta: 1 },
          { frase: 'The teacher writes the date on the board.', pregunta: 'What does the teacher write?', options: ['Her name', 'The date', 'A picture'], correcta: 1 },
          { frase: 'The car is parked in the garage.', pregunta: 'Where is the car?', options: ['On the street', 'In the garage', 'In the park'], correcta: 1 },
          { frase: 'Martha sets the table in the dining room.', pregunta: 'Where does Martha set the table?', options: ['In the kitchen', 'In the dining room', 'In the garden'], correcta: 1 },
          { frase: 'The baker makes bread at the bakery.', pregunta: 'What does the baker make?', options: ['Bread', 'Cakes', 'Juice'], correcta: 0 },
          { frase: 'The children watch a film at the cinema.', pregunta: 'Where do the children watch the film?', options: ['At home', 'At the cinema', 'At school'], correcta: 1 },
          { frase: 'Grandpa plays cards in the living room.', pregunta: 'Where does grandpa play cards?', options: ['In the kitchen', 'In the living room', 'In the garden'], correcta: 1 },
          { frase: 'Laura paints a picture in her room.', pregunta: 'What does Laura paint?', options: ['A picture', 'A letter', 'A map'], correcta: 0 },
          { frase: 'The baker sells bread at the market.', pregunta: 'Where does the baker sell bread?', options: ['At the market', 'At home', 'At school'], correcta: 0 },
          { frase: 'The cat catches a mouse in the barn.', pregunta: 'What does the cat catch?', options: ['A bird', 'A mouse', 'A fish'], correcta: 1 }
        ]
      },
      {
        id: 3,
        name: 'Level 3',
        descripcion: 'Why?',
        estrellas: 3,
        items: [
          { frase: 'Grace takes an umbrella because it is raining.', pregunta: 'Why does Grace take an umbrella?', options: ['Because it is sunny', 'Because it is raining', 'Because she is cold'], correcta: 1 },
          { frase: 'Jack puts on his coat because it is cold.', pregunta: 'Why does Jack put on his coat?', options: ['Because it is cold', 'Because it is hot', 'Because he is going swimming'], correcta: 0 },
          { frase: 'Emma turns on the light because it is dark.', pregunta: 'Why does Emma turn on the light?', options: ['Because there is a lot of light', 'Because it is dark', 'Because she is sleepy'], correcta: 1 },
          { frase: 'The boy washes his hands because they are dirty.', pregunta: 'Why does the boy wash his hands?', options: ['Because they are dirty', 'Because he is hungry', 'Because he is tired'], correcta: 0 },
          { frase: 'Martha drinks water because she is thirsty.', pregunta: 'Why does Martha drink water?', options: ['Because she is thirsty', 'Because she is sleepy', 'Because she is cold'], correcta: 0 },
          { frase: 'Grandpa sits down because he is tired.', pregunta: 'Why does Grandpa sit down?', options: ['Because he is happy', 'Because he is tired', 'Because he is hungry'], correcta: 1 },
          { frase: 'Leo puts on sunglasses because it is very sunny.', pregunta: 'Why does Leo put on sunglasses?', options: ['Because it is very sunny', 'Because it is raining', 'Because it is night'], correcta: 0 },
          { frase: 'The baby cries because she is hungry.', pregunta: 'Why does the baby cry?', options: ['Because she is sleepy', 'Because she is hungry', 'Because she is happy'], correcta: 1 },
          { frase: 'Grace puts on her pyjamas because she is going to sleep.', pregunta: 'Why does Grace put on her pyjamas?', options: ['Because she is going to sleep', 'Because she is going out', 'Because she is going to eat'], correcta: 0 },
          { frase: 'The dog barks because it heard a noise.', pregunta: 'Why does the dog bark?', options: ['Because it is hungry', 'Because it heard a noise', 'Because it is asleep'], correcta: 1 },
          { frase: 'Sophie wraps up warm because it is going to snow.', pregunta: 'Why does Sophie wrap up warm?', options: ['Because it is going to snow', 'Because it is hot', 'Because she is going to the pool'], correcta: 0 },
          { frase: 'The car stops because the traffic light is red.', pregunta: 'Why does the car stop?', options: ['Because it has no petrol', 'Because the traffic light is red', 'Because it is broken'], correcta: 1 },
          { frase: 'Emma puts on sun cream because she is going to the beach.', pregunta: 'Why does Emma put on sun cream?', options: ['Because she is going to the beach', 'Because she is cold', 'Because she is going to sleep'], correcta: 0 },
          { frase: 'The boy puts on gloves because it is very cold.', pregunta: 'Why does the boy put on gloves?', options: ['Because it is hot', 'Because it is very cold', 'Because he is going swimming'], correcta: 1 },
          { frase: 'Jack turns off the television because it is bedtime.', pregunta: 'Why does Jack turn off the television?', options: ['Because it is bedtime', 'Because he is hungry', 'Because he is going to play'], correcta: 0 },
          { frase: 'Charlie puts on sun cream because it is very sunny.', pregunta: 'Why does Charlie put on sun cream?', options: ['Because it is very sunny', 'Because it is raining', 'Because he is cold'], correcta: 0 },
          { frase: 'Laura closes the window because it is noisy outside.', pregunta: 'Why does Laura close the window?', options: ['Because it is noisy outside', 'Because it is hot', 'Because she wants to sleep'], correcta: 0 },
          { frase: 'The dog hides because there is thunder.', pregunta: 'Why does the dog hide?', options: ['Because it is hungry', 'Because there is thunder', 'Because it is happy'], correcta: 1 },
          { frase: 'Sophie turns on the heating because she is cold.', pregunta: 'Why does Sophie turn on the heating?', options: ['Because she is cold', 'Because she is hot', 'Because she is going out'], correcta: 0 }
        ]
      }
    ]
  }
};
