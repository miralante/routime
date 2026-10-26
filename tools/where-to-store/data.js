/* ============================================================
   Datos: ¿Dónde lo guardo? (autonomía — organización del hogar),
   es/en.
   Formato: DATA[locale] = { porRonda, niveles: [{ id, nombre,
     descripcion, estrellas, categorias: string[] (los sitios de
     ese nivel), items: [{ picto, palabra, categoria }] }] }
   'categoria' de cada item debe coincidir con uno de los valores
   de 'categorias' del mismo nivel (Armario/Nevera/Mochila).
   Orden: los items de cada nivel van agrupados por sitio (categoria),
   en el orden de 'categorias'. app.js los recorre en secuencia.
   Progresión (regla 13, un solo cambio por nivel): nivel 1 usa
   objetos muy típicos de cada sitio; nivel 2 mantiene los mismos 3
   sitios y solo cambia a objetos menos evidentes.
   Pictos iguales en ambos idiomas. app.js usa DATA[App.i18n.locale()].
   Para ampliar: añadir items al grupo (sitio) correspondiente de
   ambos idiomas, manteniendo la paridad es/en.
   ============================================================ */
const DATA = {
  es: {
    porRonda: 10,
    niveles: [
      {
        id: 1,
        nombre: 'Nivel 1',
        descripcion: 'Objetos muy típicos',
        estrellas: 1,
        categorias: ['Armario', 'Nevera', 'Mochila'],
        items: [
          { picto: '👕', palabra: 'Camiseta', categoria: 'Armario' },
          { picto: '👖', palabra: 'Pantalón', categoria: 'Armario' },
          { picto: '🧦', palabra: 'Calcetines', categoria: 'Armario' },
          { picto: '🧥', palabra: 'Abrigo', categoria: 'Armario' },
          { picto: '🧤', palabra: 'Guantes', categoria: 'Armario' },
          { picto: '👔', palabra: 'Camisa', categoria: 'Armario' },
          { picto: '🥛', palabra: 'Leche', categoria: 'Nevera' },
          { picto: '🧀', palabra: 'Queso', categoria: 'Nevera' },
          { picto: '🍎', palabra: 'Manzana', categoria: 'Nevera' },
          { picto: '🥚', palabra: 'Huevos', categoria: 'Nevera' },
          { picto: '🍦', palabra: 'Yogur', categoria: 'Nevera' },
          { picto: '🥕', palabra: 'Zanahorias', categoria: 'Nevera' },
          { picto: '📓', palabra: 'Cuaderno', categoria: 'Mochila' },
          { picto: '✏️', palabra: 'Lápiz', categoria: 'Mochila' },
          { picto: '📖', palabra: 'Libro', categoria: 'Mochila' },
          { picto: '🖊️', palabra: 'Estuche', categoria: 'Mochila' },
          { picto: '✂️', palabra: 'Tijeras', categoria: 'Mochila' }
        ]
      },
      {
        id: 2,
        nombre: 'Nivel 2',
        descripcion: 'Objetos menos evidentes',
        estrellas: 2,
        categorias: ['Armario', 'Nevera', 'Mochila'],
        items: [
          { picto: '🧣', palabra: 'Bufanda', categoria: 'Armario' },
          { picto: '👟', palabra: 'Zapatillas', categoria: 'Armario' },
          { picto: '👗', palabra: 'Vestido', categoria: 'Armario' },
          { picto: '🧢', palabra: 'Gorro', categoria: 'Armario' },
          { picto: '🩳', palabra: 'Pijama', categoria: 'Armario' },
          { picto: '🩱', palabra: 'Bañador', categoria: 'Armario' },
          { picto: '🧈', palabra: 'Mantequilla', categoria: 'Nevera' },
          { picto: '🧃', palabra: 'Zumo', categoria: 'Nevera' },
          { picto: '🐟', palabra: 'Pescado', categoria: 'Nevera' },
          { picto: '🥓', palabra: 'Jamón', categoria: 'Nevera' },
          { picto: '🥗', palabra: 'Ensalada que ha sobrado', categoria: 'Nevera' },
          { picto: '🍇', palabra: 'Uvas', categoria: 'Nevera' },
          { picto: '📏', palabra: 'Regla', categoria: 'Mochila' },
          { picto: '📅', palabra: 'Agenda', categoria: 'Mochila' },
          { picto: '🍶', palabra: 'Botella de agua', categoria: 'Mochila' },
          { picto: '🧮', palabra: 'Calculadora', categoria: 'Mochila' },
          { picto: '🖍️', palabra: 'Rotuladores', categoria: 'Mochila' }
        ]
      }
    ]
  },

  en: {
    porRonda: 10,
    niveles: [
      {
        id: 1,
        nombre: 'Level 1',
        descripcion: 'Very typical objects',
        estrellas: 1,
        categorias: ['Wardrobe', 'Fridge', 'Backpack'],
        items: [
          { picto: '👕', palabra: 'T-shirt', categoria: 'Wardrobe' },
          { picto: '👖', palabra: 'Trousers', categoria: 'Wardrobe' },
          { picto: '🧦', palabra: 'Socks', categoria: 'Wardrobe' },
          { picto: '🧥', palabra: 'Coat', categoria: 'Wardrobe' },
          { picto: '🧤', palabra: 'Gloves', categoria: 'Wardrobe' },
          { picto: '👔', palabra: 'Shirt', categoria: 'Wardrobe' },
          { picto: '🥛', palabra: 'Milk', categoria: 'Fridge' },
          { picto: '🧀', palabra: 'Cheese', categoria: 'Fridge' },
          { picto: '🍎', palabra: 'Apple', categoria: 'Fridge' },
          { picto: '🥚', palabra: 'Eggs', categoria: 'Fridge' },
          { picto: '🍦', palabra: 'Yoghurt', categoria: 'Fridge' },
          { picto: '🥕', palabra: 'Carrots', categoria: 'Fridge' },
          { picto: '📓', palabra: 'Notebook', categoria: 'Backpack' },
          { picto: '✏️', palabra: 'Pencil', categoria: 'Backpack' },
          { picto: '📖', palabra: 'Book', categoria: 'Backpack' },
          { picto: '🖊️', palabra: 'Pencil case', categoria: 'Backpack' },
          { picto: '✂️', palabra: 'Scissors', categoria: 'Backpack' }
        ]
      },
      {
        id: 2,
        nombre: 'Level 2',
        descripcion: 'Less obvious objects',
        estrellas: 2,
        categorias: ['Wardrobe', 'Fridge', 'Backpack'],
        items: [
          { picto: '🧣', palabra: 'Scarf', categoria: 'Wardrobe' },
          { picto: '👟', palabra: 'Trainers', categoria: 'Wardrobe' },
          { picto: '👗', palabra: 'Dress', categoria: 'Wardrobe' },
          { picto: '🧢', palabra: 'Cap', categoria: 'Wardrobe' },
          { picto: '🩳', palabra: 'Pyjamas', categoria: 'Wardrobe' },
          { picto: '🩱', palabra: 'Swimsuit', categoria: 'Wardrobe' },
          { picto: '🧈', palabra: 'Butter', categoria: 'Fridge' },
          { picto: '🧃', palabra: 'Juice', categoria: 'Fridge' },
          { picto: '🐟', palabra: 'Fish', categoria: 'Fridge' },
          { picto: '🥓', palabra: 'Ham', categoria: 'Fridge' },
          { picto: '🥗', palabra: 'Leftover salad', categoria: 'Fridge' },
          { picto: '🍇', palabra: 'Grapes', categoria: 'Fridge' },
          { picto: '📏', palabra: 'Ruler', categoria: 'Backpack' },
          { picto: '📅', palabra: 'Planner', categoria: 'Backpack' },
          { picto: '🍶', palabra: 'Water bottle', categoria: 'Backpack' },
          { picto: '🧮', palabra: 'Calculator', categoria: 'Backpack' },
          { picto: '🖍️', palabra: 'Felt-tip pens', categoria: 'Backpack' }
        ]
      }
    ]
  }
};
