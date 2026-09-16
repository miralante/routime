/* ============================================================
   Datos: La Compra (razonamiento/autonomía — AVD instrumental:
   secciones del supermercado y planificar la lista de la compra).
   Formato: DATA.es / DATA.en, cada uno con:
   { secciones: { porRonda, niveles: [{ id, name, descripcion,
       estrellas, categorias: string[3], items: [{ picto, palabra,
       categoria }] }] },
     lista: { porRonda, momentos: string[3] (compartidos por todos
       los niveles), niveles: [{ id, name, descripcion, estrellas,
       items: [{ picto, palabra, timeOfDay }] }] } }
   Dos actividades independientes elegibles desde un menú (regla 10):
   - 'secciones': clon exacto del motor de ¿Dónde lo guardo? —
     producto → sección del supermercado (Frutería/Carnicería/
     Limpieza). Regla 13: única variable por nivel es lo evidente del
     producto.
   - 'lista': clon exacto del motor de Partes del Día — producto →
     para qué comida del día (Desayuno/Comida/Cena), acumulando una
     lista visual por caja. Regla 13: única variable por nivel es lo
     evidente del producto.
   Cierra la cadena de AVD instrumental junto con El Monedero (pagar)
   y La Casa (cocinar/save).
   app.js usa DATA[App.i18n.locale()] || DATA.es.
   ============================================================ */
const DATA = {
  es: {
    secciones: {
      porRonda: 10,
      niveles: [
        {
          id: 1,
          name: 'Nivel 1',
          descripcion: 'Productos muy claros',
          estrellas: 1,
          categorias: ['Frutería', 'Carnicería', 'Limpieza'],
          items: [
            { picto: '🍎', palabra: 'Manzana', categoria: 'Frutería' },
            { picto: '🍌', palabra: 'Plátano', categoria: 'Frutería' },
            { picto: '🍇', palabra: 'Uvas', categoria: 'Frutería' },
            { picto: '🍊', palabra: 'Naranja', categoria: 'Frutería' },
            { picto: '🍗', palabra: 'Pollo', categoria: 'Carnicería' },
            { picto: '🥩', palabra: 'Filete de ternera', categoria: 'Carnicería' },
            { picto: '🌭', palabra: 'Salchichas', categoria: 'Carnicería' },
            { picto: '🥓', palabra: 'Bacon', categoria: 'Carnicería' },
            { picto: '🧽', palabra: 'Estropajo', categoria: 'Limpieza' },
            { picto: '🧴', palabra: 'Detergente', categoria: 'Limpieza' },
            { picto: '🧻', palabra: 'Papel higiénico', categoria: 'Limpieza' },
            { picto: '🧹', palabra: 'Escoba', categoria: 'Limpieza' },
            { picto: '🍓', palabra: 'Fresas', categoria: 'Frutería' },
            { picto: '🧼', palabra: 'Pastilla de jabón', categoria: 'Limpieza' }
          ]
        },
        {
          id: 2,
          name: 'Nivel 2',
          descripcion: 'Productos menos evidentes',
          estrellas: 2,
          categorias: ['Frutería', 'Carnicería', 'Limpieza'],
          items: [
            { picto: '🍋', palabra: 'Limón', categoria: 'Frutería' },
            { picto: '🥔', palabra: 'Patata', categoria: 'Frutería' },
            { picto: '🧄', palabra: 'Ajo', categoria: 'Frutería' },
            { picto: '🍅', palabra: 'Tomate', categoria: 'Frutería' },
            { picto: '🦃', palabra: 'Pavo', categoria: 'Carnicería' },
            { picto: '🍖', palabra: 'Costillas', categoria: 'Carnicería' },
            { picto: '🥚', palabra: 'Huevos', categoria: 'Carnicería' },
            { picto: '🐔', palabra: 'Muslos de pollo', categoria: 'Carnicería' },
            { picto: '🧼', palabra: 'Jabón de manos', categoria: 'Limpieza' },
            { picto: '🪣', palabra: 'Cubo', categoria: 'Limpieza' },
            { picto: '🧺', palabra: 'Cesta de la ropa', categoria: 'Limpieza' },
            { picto: '🧤', palabra: 'Guantes de goma', categoria: 'Limpieza' },
            { picto: '🥬', palabra: 'Acelgas', categoria: 'Frutería' },
            { picto: '🧆', palabra: 'Albóndigas', categoria: 'Carnicería' }
          ]
        }
      ]
    },
    lista: {
      porRonda: 8,
      momentos: ['Desayuno', 'Comida', 'Cena'],
      niveles: [
        {
          id: 1,
          name: 'Nivel 1',
          descripcion: 'Productos muy claros',
          estrellas: 1,
          items: [
            { picto: '🥛', palabra: 'Leche', timeOfDay: 'Desayuno' },
            { picto: '🥐', palabra: 'Cruasán', timeOfDay: 'Desayuno' },
            { picto: '🍞', palabra: 'Pan de molde', timeOfDay: 'Desayuno' },
            { picto: '🍯', palabra: 'Miel', timeOfDay: 'Desayuno' },
            { picto: '🍚', palabra: 'Arroz', timeOfDay: 'Comida' },
            { picto: '🥔', palabra: 'Patatas', timeOfDay: 'Comida' },
            { picto: '🍅', palabra: 'Tomate frito', timeOfDay: 'Comida' },
            { picto: '🐟', palabra: 'Filetes de merluza', timeOfDay: 'Comida' },
            { picto: '🥣', palabra: 'Sopa de sobre', timeOfDay: 'Cena' },
            { picto: '🥗', palabra: 'Lechuga para ensalada', timeOfDay: 'Cena' },
            { picto: '🧀', palabra: 'Queso', timeOfDay: 'Cena' },
            { picto: '🍳', palabra: 'Huevos para tortilla', timeOfDay: 'Cena' },
            { picto: '🍪', palabra: 'Galletas', timeOfDay: 'Desayuno' },
            { picto: '🍗', palabra: 'Pollo asado', timeOfDay: 'Comida' }
          ]
        },
        {
          id: 2,
          name: 'Nivel 2',
          descripcion: 'Productos menos evidentes',
          estrellas: 2,
          items: [
            { picto: '🥣', palabra: 'Cereales', timeOfDay: 'Desayuno' },
            { picto: '🍊', palabra: 'Zumo de naranja', timeOfDay: 'Desayuno' },
            { picto: '🧈', palabra: 'Mantequilla', timeOfDay: 'Desayuno' },
            { picto: '🍫', palabra: 'Cacao en polvo', timeOfDay: 'Desayuno' },
            { picto: '🍝', palabra: 'Pasta', timeOfDay: 'Comida' },
            { picto: '🫘', palabra: 'Lentejas', timeOfDay: 'Comida' },
            { picto: '🌽', palabra: 'Maíz en lata', timeOfDay: 'Comida' },
            { picto: '🧅', palabra: 'Cebolla para el sofrito', timeOfDay: 'Comida' },
            { picto: '🍲', palabra: 'Caldo', timeOfDay: 'Cena' },
            { picto: '🥒', palabra: 'Pepino', timeOfDay: 'Cena' },
            { picto: '🥪', palabra: 'Pan de sándwich', timeOfDay: 'Cena' },
            { picto: '🍇', palabra: 'Uvas de postre', timeOfDay: 'Cena' },
            { picto: '🫐', palabra: 'Arándanos para el yogur', timeOfDay: 'Desayuno' },
            { picto: '🥫', palabra: 'Atún en lata', timeOfDay: 'Cena' }
          ]
        }
      ]
    }
  },
  en: {
    secciones: {
      porRonda: 10,
      niveles: [
        {
          id: 1,
          name: 'Level 1',
          descripcion: 'Very clear products',
          estrellas: 1,
          categorias: ['Fruit shop', 'Butcher', 'Cleaning'],
          items: [
            { picto: '🍎', palabra: 'Apple', categoria: 'Fruit shop' },
            { picto: '🍌', palabra: 'Banana', categoria: 'Fruit shop' },
            { picto: '🍇', palabra: 'Grapes', categoria: 'Fruit shop' },
            { picto: '🍊', palabra: 'Orange', categoria: 'Fruit shop' },
            { picto: '🍗', palabra: 'Chicken', categoria: 'Butcher' },
            { picto: '🥩', palabra: 'Beef steak', categoria: 'Butcher' },
            { picto: '🌭', palabra: 'Sausages', categoria: 'Butcher' },
            { picto: '🥓', palabra: 'Bacon', categoria: 'Butcher' },
            { picto: '🧽', palabra: 'Scourer', categoria: 'Cleaning' },
            { picto: '🧴', palabra: 'Detergent', categoria: 'Cleaning' },
            { picto: '🧻', palabra: 'Toilet paper', categoria: 'Cleaning' },
            { picto: '🧹', palabra: 'Broom', categoria: 'Cleaning' },
            { picto: '🍓', palabra: 'Strawberries', categoria: 'Fruit shop' },
            { picto: '🧼', palabra: 'Bar of soap', categoria: 'Cleaning' }
          ]
        },
        {
          id: 2,
          name: 'Level 2',
          descripcion: 'Less obvious products',
          estrellas: 2,
          categorias: ['Fruit shop', 'Butcher', 'Cleaning'],
          items: [
            { picto: '🍋', palabra: 'Lemon', categoria: 'Fruit shop' },
            { picto: '🥔', palabra: 'Potato', categoria: 'Fruit shop' },
            { picto: '🧄', palabra: 'Garlic', categoria: 'Fruit shop' },
            { picto: '🍅', palabra: 'Tomato', categoria: 'Fruit shop' },
            { picto: '🦃', palabra: 'Turkey', categoria: 'Butcher' },
            { picto: '🍖', palabra: 'Ribs', categoria: 'Butcher' },
            { picto: '🥚', palabra: 'Eggs', categoria: 'Butcher' },
            { picto: '🐔', palabra: 'Chicken thighs', categoria: 'Butcher' },
            { picto: '🧼', palabra: 'Hand soap', categoria: 'Cleaning' },
            { picto: '🪣', palabra: 'Bucket', categoria: 'Cleaning' },
            { picto: '🧺', palabra: 'Laundry basket', categoria: 'Cleaning' },
            { picto: '🧤', palabra: 'Rubber gloves', categoria: 'Cleaning' },
            { picto: '🥬', palabra: 'Chard', categoria: 'Fruit shop' },
            { picto: '🧆', palabra: 'Meatballs', categoria: 'Butcher' }
          ]
        }
      ]
    },
    lista: {
      porRonda: 8,
      momentos: ['Breakfast', 'Lunch', 'Dinner'],
      niveles: [
        {
          id: 1,
          name: 'Level 1',
          descripcion: 'Very clear products',
          estrellas: 1,
          items: [
            { picto: '🥛', palabra: 'Milk', timeOfDay: 'Breakfast' },
            { picto: '🥐', palabra: 'Croissant', timeOfDay: 'Breakfast' },
            { picto: '🍞', palabra: 'Sliced bread', timeOfDay: 'Breakfast' },
            { picto: '🍯', palabra: 'Honey', timeOfDay: 'Breakfast' },
            { picto: '🍚', palabra: 'Rice', timeOfDay: 'Lunch' },
            { picto: '🥔', palabra: 'Potatoes', timeOfDay: 'Lunch' },
            { picto: '🍅', palabra: 'Tomato sauce', timeOfDay: 'Lunch' },
            { picto: '🐟', palabra: 'Hake fillets', timeOfDay: 'Lunch' },
            { picto: '🥣', palabra: 'Instant soup', timeOfDay: 'Dinner' },
            { picto: '🥗', palabra: 'Lettuce for salad', timeOfDay: 'Dinner' },
            { picto: '🧀', palabra: 'Cheese', timeOfDay: 'Dinner' },
            { picto: '🍳', palabra: 'Eggs for omelette', timeOfDay: 'Dinner' },
            { picto: '🍪', palabra: 'Biscuits', timeOfDay: 'Breakfast' },
            { picto: '🍗', palabra: 'Roast chicken', timeOfDay: 'Lunch' }
          ]
        },
        {
          id: 2,
          name: 'Level 2',
          descripcion: 'Less obvious products',
          estrellas: 2,
          items: [
            { picto: '🥣', palabra: 'Cereal', timeOfDay: 'Breakfast' },
            { picto: '🍊', palabra: 'Orange juice', timeOfDay: 'Breakfast' },
            { picto: '🧈', palabra: 'Butter', timeOfDay: 'Breakfast' },
            { picto: '🍫', palabra: 'Cocoa powder', timeOfDay: 'Breakfast' },
            { picto: '🍝', palabra: 'Pasta', timeOfDay: 'Lunch' },
            { picto: '🫘', palabra: 'Lentils', timeOfDay: 'Lunch' },
            { picto: '🌽', palabra: 'Tinned sweetcorn', timeOfDay: 'Lunch' },
            { picto: '🧅', palabra: 'Onion for the sauce', timeOfDay: 'Lunch' },
            { picto: '🍲', palabra: 'Broth', timeOfDay: 'Dinner' },
            { picto: '🥒', palabra: 'Cucumber', timeOfDay: 'Dinner' },
            { picto: '🥪', palabra: 'Sandwich bread', timeOfDay: 'Dinner' },
            { picto: '🍇', palabra: 'Grapes for dessert', timeOfDay: 'Dinner' },
            { picto: '🫐', palabra: 'Blueberries for yoghurt', timeOfDay: 'Breakfast' },
            { picto: '🥫', palabra: 'Tinned tuna', timeOfDay: 'Dinner' }
          ]
        }
      ]
    }
  }
};
