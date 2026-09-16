/* ============================================================
   Datos: Comida Sana (autonomía/hogar — alimentación saludable).
   Formato: DATA[locale] = { porRonda, niveles: [{ id, name,
     descripcion, estrellas, categorias: string[2] (las cajas de
     ese nivel), items: [{ picto, palabra, categoria, consecuencia }] }] }
   'categoria' de cada item debe coincidir con uno de los valores de
   'categorias' del mismo nivel. 'consecuencia' es una frase corta y
   positiva (nunca de miedo ni culpa) sobre cómo te sienta ese
   alimento en el cuerpo, para acompañar la explicación del acierto.
   Pictos iguales en ambos idiomas. app.js usa DATA[App.i18n.locale()].
   Progresión (regla 13, un solo cambio por nivel): las dos cajas son
   siempre "Cada día" / "De vez en cuando" (enfoque de moderación, sin
   etiquetar ningún alimento como "malo"); nivel 1→2 solo sube lo
   evidente del alimento (de frutas y dulces muy claros a alimentos
   procesados más sutiles).
   ============================================================ */
const DATA = {
  es: {
    porRonda: 10,
    niveles: [
      {
        id: 1,
        name: 'Nivel 1',
        descripcion: 'Alimentos muy claros',
        estrellas: 1,
        categorias: ['Cada día', 'De vez en cuando'],
        items: [
          { picto: '🍎', palabra: 'Manzana', categoria: 'Cada día', consecuencia: 'Te da energía para jugar.' },
          { picto: '🍌', palabra: 'Plátano', categoria: 'Cada día', consecuencia: 'Te da energía para todo el día.' },
          { picto: '🍊', palabra: 'Naranja', categoria: 'Cada día', consecuencia: 'Ayuda a tus defensas.' },
          { picto: '🍇', palabra: 'Uvas', categoria: 'Cada día', consecuencia: 'Fruta fresca de cada día.' },
          { picto: '🥕', palabra: 'Zanahoria', categoria: 'Cada día', consecuencia: 'Es buena para tus ojos.' },
          { picto: '🥦', palabra: 'Brócoli', categoria: 'Cada día', consecuencia: 'Te ayuda a crecer fuerte.' },
          { picto: '🍅', palabra: 'Tomate', categoria: 'Cada día', consecuencia: 'Es fresco y te hidrata.' },
          { picto: '🥬', palabra: 'Lechuga', categoria: 'Cada día', consecuencia: 'Es ligera y te deja con energía.' },
          { picto: '💧', palabra: 'Agua', categoria: 'Cada día', consecuencia: 'Te mantiene hidratado/a todo el día.' },
          { picto: '🐟', palabra: 'Pescado', categoria: 'Cada día', consecuencia: 'Te da fuerza para tus músculos.' },
          { picto: '🍗', palabra: 'Pollo a la plancha', categoria: 'Cada día', consecuencia: 'Te da fuerza sin pesarte mucho.' },
          { picto: '🥛', palabra: 'Yogur natural', categoria: 'Cada día', consecuencia: 'Sienta bien a tu tripa.' },
          { picto: '🍬', palabra: 'Chuches', categoria: 'De vez en cuando', consecuencia: 'Están ricas, pero no dan energía de verdad.' },
          { picto: '🥤', palabra: 'Refresco de cola', categoria: 'De vez en cuando', consecuencia: 'Tiene mucho azúcar; el agua hidrata mejor.' },
          { picto: '🍟', palabra: 'Patatas fritas de bolsa', categoria: 'De vez en cuando', consecuencia: 'Comer muchas te puede dar sed.' },
          { picto: '🍔', palabra: 'Hamburguesa de comida rápida', categoria: 'De vez en cuando', consecuencia: 'Llena rápido, pero luego te deja cansado/a.' },
          { picto: '🍕', palabra: 'Pizza de comida rápida', categoria: 'De vez en cuando', consecuencia: 'Está rica de vez en cuando, no cada día.' },
          { picto: '🍩', palabra: 'Donut', categoria: 'De vez en cuando', consecuencia: 'Tiene mucho azúcar; mejor de vez en cuando.' },
          { picto: '🍫', palabra: 'Chocolatina', categoria: 'De vez en cuando', consecuencia: 'Es un capricho para de vez en cuando.' },
          { picto: '🍦', palabra: 'Helado', categoria: 'De vez en cuando', consecuencia: 'Es un capricho, no de cada día.' },
          { picto: '🌭', palabra: 'Perrito caliente', categoria: 'De vez en cuando', consecuencia: 'De vez en cuando está bien, no cada día.' },
          { picto: '🍗', palabra: 'Nuggets fritos', categoria: 'De vez en cuando', consecuencia: 'Fritos: mejor de vez en cuando.' },
          { picto: '🍪', palabra: 'Galletas con mucho azúcar', categoria: 'De vez en cuando', consecuencia: 'Con mucho azúcar; de vez en cuando.' },
          { picto: '🥐', palabra: 'Bollo relleno', categoria: 'De vez en cuando', consecuencia: 'Es un capricho dulce, no de cada día.' }
        ]
      },
      {
        id: 2,
        name: 'Nivel 2',
        descripcion: 'Alimentos menos evidentes',
        estrellas: 2,
        categorias: ['Cada día', 'De vez en cuando'],
        items: [
          { picto: '🫘', palabra: 'Lentejas', categoria: 'Cada día', consecuencia: 'Te da energía que dura toda la tarde.' },
          { picto: '🥚', palabra: 'Huevo cocido', categoria: 'Cada día', consecuencia: 'Te ayuda a empezar bien el día.' },
          { picto: '🍚', palabra: 'Arroz integral', categoria: 'Cada día', consecuencia: 'Te da energía que dura más tiempo.' },
          { picto: '🍝', palabra: 'Pasta integral', categoria: 'Cada día', consecuencia: 'Va bien en un día con mucho movimiento.' },
          { picto: '🥝', palabra: 'Kiwi', categoria: 'Cada día', consecuencia: 'Ayuda a tus defensas, como la naranja.' },
          { picto: '🥒', palabra: 'Pepino', categoria: 'Cada día', consecuencia: 'Es fresco y te hidrata.' },
          { picto: '🐟', palabra: 'Atún al natural', categoria: 'Cada día', consecuencia: 'Te da fuerza sin grasa de más.' },
          { picto: '🥛', palabra: 'Leche semidesnatada', categoria: 'Cada día', consecuencia: 'Buena para tus huesos cada día.' },
          { picto: '🌰', palabra: 'Puñado de frutos secos', categoria: 'Cada día', consecuencia: 'Un puñado te da energía entre horas.' },
          { picto: '🫒', palabra: 'Aceite de oliva en la ensalada', categoria: 'Cada día', consecuencia: 'Un poco cada día es bueno para el corazón.' },
          { picto: '🥣', palabra: 'Avena', categoria: 'Cada día', consecuencia: 'Te llena y te da energía por la mañana.' },
          { picto: '🍐', palabra: 'Pera', categoria: 'Cada día', consecuencia: 'Fruta fresca de cada día.' },
          { picto: '🥣', palabra: 'Cereales de chocolate', categoria: 'De vez en cuando', consecuencia: 'Tienen azúcar añadido; de vez en cuando.' },
          { picto: '🧃', palabra: 'Zumo envasado', categoria: 'De vez en cuando', consecuencia: 'La fruta entera es mejor cada día.' },
          { picto: '🥤', palabra: 'Batido de chocolate', categoria: 'De vez en cuando', consecuencia: 'Es un capricho dulce, no de cada día.' },
          { picto: '🍞', palabra: 'Bollería industrial', categoria: 'De vez en cuando', consecuencia: 'Rica de vez en cuando, no cada mañana.' },
          { picto: '🍦', palabra: 'Yogur azucarado de sabores', categoria: 'De vez en cuando', consecuencia: 'Tiene más azúcar que el yogur natural.' },
          { picto: '🍟', palabra: 'Patatas fritas de restaurante', categoria: 'De vez en cuando', consecuencia: 'Ricas de vez en cuando, no cada comida.' },
          { picto: '🌭', palabra: 'Salchichas tipo frankfurt', categoria: 'De vez en cuando', consecuencia: 'Mejor de vez en cuando que cada día.' },
          { picto: '🥐', palabra: 'Croissant de chocolate', categoria: 'De vez en cuando', consecuencia: 'Un capricho dulce para de vez en cuando.' },
          { picto: '🍫', palabra: 'Chocolate con leche', categoria: 'De vez en cuando', consecuencia: 'Rico de vez en cuando, en un trocito.' },
          { picto: '🍿', palabra: 'Snacks de bolsa', categoria: 'De vez en cuando', consecuencia: 'Salados: mejor de vez en cuando.' },
          { picto: '🍕', palabra: 'Pizza congelada', categoria: 'De vez en cuando', consecuencia: 'Rápida de hacer, pero de vez en cuando.' },
          { picto: '🍮', palabra: 'Flan industrial', categoria: 'De vez en cuando', consecuencia: 'Dulce envasado, de vez en cuando.' }
        ]
      }
    ]
  },
  en: {
    porRonda: 10,
    niveles: [
      {
        id: 1,
        name: 'Level 1',
        descripcion: 'Very clear foods',
        estrellas: 1,
        categorias: ['Every day', 'Now and then'],
        items: [
          { picto: '🍎', palabra: 'Apple', categoria: 'Every day', consecuencia: 'Gives you energy to play.' },
          { picto: '🍌', palabra: 'Banana', categoria: 'Every day', consecuencia: 'Gives you energy for the whole day.' },
          { picto: '🍊', palabra: 'Orange', categoria: 'Every day', consecuencia: 'Helps your body fight off colds.' },
          { picto: '🍇', palabra: 'Grapes', categoria: 'Every day', consecuencia: 'Fresh fruit for every day.' },
          { picto: '🥕', palabra: 'Carrot', categoria: 'Every day', consecuencia: 'Good for your eyes.' },
          { picto: '🥦', palabra: 'Broccoli', categoria: 'Every day', consecuencia: 'Helps you grow strong.' },
          { picto: '🍅', palabra: 'Tomato', categoria: 'Every day', consecuencia: 'Fresh and helps keep you hydrated.' },
          { picto: '🥬', palabra: 'Lettuce', categoria: 'Every day', consecuencia: 'Light, and leaves you full of energy.' },
          { picto: '💧', palabra: 'Water', categoria: 'Every day', consecuencia: 'Keeps you hydrated all day.' },
          { picto: '🐟', palabra: 'Fish', categoria: 'Every day', consecuencia: 'Gives strength to your muscles.' },
          { picto: '🍗', palabra: 'Grilled chicken', categoria: 'Every day', consecuencia: 'Gives you strength without feeling heavy.' },
          { picto: '🥛', palabra: 'Plain yoghurt', categoria: 'Every day', consecuencia: 'Feels good on your tummy.' },
          { picto: '🍬', palabra: 'Sweets', categoria: 'Now and then', consecuencia: 'Tasty, but they don’t give real energy.' },
          { picto: '🥤', palabra: 'Cola soda', categoria: 'Now and then', consecuencia: 'Full of sugar; water hydrates you better.' },
          { picto: '🍟', palabra: 'Bagged crisps', categoria: 'Now and then', consecuencia: 'Eating a lot can leave you thirsty.' },
          { picto: '🍔', palabra: 'Fast-food burger', categoria: 'Now and then', consecuencia: 'Fills you fast, but can leave you tired later.' },
          { picto: '🍕', palabra: 'Fast-food pizza', categoria: 'Now and then', consecuencia: 'Tasty now and then, not every day.' },
          { picto: '🍩', palabra: 'Donut', categoria: 'Now and then', consecuencia: 'Full of sugar; better now and then.' },
          { picto: '🍫', palabra: 'Candy bar', categoria: 'Now and then', consecuencia: 'A treat for now and then.' },
          { picto: '🍦', palabra: 'Ice cream', categoria: 'Now and then', consecuencia: 'A treat, not an every-day food.' },
          { picto: '🌭', palabra: 'Hot dog', categoria: 'Now and then', consecuencia: 'Fine now and then, not every day.' },
          { picto: '🍗', palabra: 'Fried nuggets', categoria: 'Now and then', consecuencia: 'Fried food: better now and then.' },
          { picto: '🍪', palabra: 'Sugary biscuits', categoria: 'Now and then', consecuencia: 'Full of sugar; save them for now and then.' },
          { picto: '🥐', palabra: 'Filled pastry', categoria: 'Now and then', consecuencia: 'A sweet treat, not an every-day food.' }
        ]
      },
      {
        id: 2,
        name: 'Level 2',
        descripcion: 'Less obvious foods',
        estrellas: 2,
        categorias: ['Every day', 'Now and then'],
        items: [
          { picto: '🫘', palabra: 'Lentils', categoria: 'Every day', consecuencia: 'Energy that lasts all afternoon.' },
          { picto: '🥚', palabra: 'Boiled egg', categoria: 'Every day', consecuencia: 'Helps you start the day well.' },
          { picto: '🍚', palabra: 'Brown rice', categoria: 'Every day', consecuencia: 'Energy that lasts longer.' },
          { picto: '🍝', palabra: 'Wholemeal pasta', categoria: 'Every day', consecuencia: 'Good for a day full of movement.' },
          { picto: '🥝', palabra: 'Kiwi', categoria: 'Every day', consecuencia: 'Helps your body, just like oranges.' },
          { picto: '🥒', palabra: 'Cucumber', categoria: 'Every day', consecuencia: 'Fresh and keeps you hydrated.' },
          { picto: '🐟', palabra: 'Tuna in water', categoria: 'Every day', consecuencia: 'Gives you strength without extra fat.' },
          { picto: '🥛', palabra: 'Semi-skimmed milk', categoria: 'Every day', consecuencia: 'Good for your bones every day.' },
          { picto: '🌰', palabra: 'Handful of nuts', categoria: 'Every day', consecuencia: 'A handful gives you energy between meals.' },
          { picto: '🫒', palabra: 'Olive oil on the salad', categoria: 'Every day', consecuencia: 'A little every day is good for your heart.' },
          { picto: '🥣', palabra: 'Porridge oats', categoria: 'Every day', consecuencia: 'Fills you up with morning energy.' },
          { picto: '🍐', palabra: 'Pear', categoria: 'Every day', consecuencia: 'Fresh fruit for every day.' },
          { picto: '🥣', palabra: 'Chocolate cereal', categoria: 'Now and then', consecuencia: 'Added sugar; save it for now and then.' },
          { picto: '🧃', palabra: 'Packaged juice', categoria: 'Now and then', consecuencia: 'Whole fruit is better every day.' },
          { picto: '🥤', palabra: 'Chocolate milkshake', categoria: 'Now and then', consecuencia: 'A sweet treat, not an every-day drink.' },
          { picto: '🍞', palabra: 'Packaged pastries', categoria: 'Now and then', consecuencia: 'Tasty now and then, not every morning.' },
          { picto: '🍦', palabra: 'Sugary flavoured yoghurt', categoria: 'Now and then', consecuencia: 'Has more sugar than plain yoghurt.' },
          { picto: '🍟', palabra: 'Restaurant fries', categoria: 'Now and then', consecuencia: 'Tasty now and then, not every meal.' },
          { picto: '🌭', palabra: 'Frankfurter sausages', categoria: 'Now and then', consecuencia: 'Better now and then than every day.' },
          { picto: '🥐', palabra: 'Chocolate croissant', categoria: 'Now and then', consecuencia: 'A sweet treat for now and then.' },
          { picto: '🍫', palabra: 'Milk chocolate', categoria: 'Now and then', consecuencia: 'Tasty now and then, in a small piece.' },
          { picto: '🍿', palabra: 'Bagged snacks', categoria: 'Now and then', consecuencia: 'Salty: better now and then.' },
          { picto: '🍕', palabra: 'Frozen pizza', categoria: 'Now and then', consecuencia: 'Quick to make, but a now-and-then food.' },
          { picto: '🍮', palabra: 'Packaged custard', categoria: 'Now and then', consecuencia: 'A packaged sweet, for now and then.' }
        ]
      }
    ]
  }
};
