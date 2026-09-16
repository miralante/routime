/* ============================================================
   Datos: Categorías (lenguaje — clasificar words), es/en.
   Formato: DATA[locale] = { porRonda, niveles: [{ id, name,
     descripcion, estrellas, categorias: string[] (las cajas de
     ese nivel), items: [{ picto, palabra, categoria }] }] }
   'categoria' de cada item debe coincidir con uno de los valores
   de 'categorias' del mismo nivel. Mínimo 60 items por idioma.
   Pictos iguales en ambos idiomas. app.js usa DATA[App.i18n.locale()].
   Para ampliar: añadir items al array del nivel correspondiente.
   Progresión (regla 13, un solo cambio por nivel): nivel 1→2 sube el
   nº de cajas (2→3), dominios siempre muy distintos entre sí. Nivel
   2→3 mantiene el nº de cajas en 3 y solo afina la distinción
   semántica (las tres categorías son alimentos, más difícil de
   separar que Comida/Animales/Ropa).
   ============================================================ */
const DATA = {
  es: {
  porRonda: 10,
  niveles: [
    {
      id: 1,
      name: 'Nivel 1',
      descripcion: 'Animales o ropa',
      estrellas: 1,
      categorias: ['Animales', 'Ropa'],
      items: [
        { picto: '🐶', palabra: 'Perro', categoria: 'Animales' },
        { picto: '🐱', palabra: 'Gato', categoria: 'Animales' },
        { picto: '🐘', palabra: 'Elefante', categoria: 'Animales' },
        { picto: '🦁', palabra: 'León', categoria: 'Animales' },
        { picto: '🐦', palabra: 'Pájaro', categoria: 'Animales' },
        { picto: '🐟', palabra: 'Pez', categoria: 'Animales' },
        { picto: '🐴', palabra: 'Caballo', categoria: 'Animales' },
        { picto: '🐮', palabra: 'Vaca', categoria: 'Animales' },
        { picto: '🐷', palabra: 'Cerdo', categoria: 'Animales' },
        { picto: '🐰', palabra: 'Conejo', categoria: 'Animales' },
        { picto: '👕', palabra: 'Camiseta', categoria: 'Ropa' },
        { picto: '👖', palabra: 'Pantalón', categoria: 'Ropa' },
        { picto: '🧦', palabra: 'Calcetines', categoria: 'Ropa' },
        { picto: '👗', palabra: 'Vestido', categoria: 'Ropa' },
        { picto: '🧥', palabra: 'Abrigo', categoria: 'Ropa' },
        { picto: '👟', palabra: 'Zapatillas', categoria: 'Ropa' },
        { picto: '🧤', palabra: 'Guantes', categoria: 'Ropa' },
        { picto: '🎩', palabra: 'Sombrero', categoria: 'Ropa' },
        { picto: '👔', palabra: 'Corbata', categoria: 'Ropa' },
        { picto: '🧣', palabra: 'Bufanda', categoria: 'Ropa' }
      ]
    },
    {
      id: 2,
      name: 'Nivel 2',
      descripcion: 'Comida, animales o ropa',
      estrellas: 2,
      categorias: ['Comida', 'Animales', 'Ropa'],
      items: [
        { picto: '🍎', palabra: 'Manzana', categoria: 'Comida' },
        { picto: '🍞', palabra: 'Pan', categoria: 'Comida' },
        { picto: '🧀', palabra: 'Queso', categoria: 'Comida' },
        { picto: '🥛', palabra: 'Leche', categoria: 'Comida' },
        { picto: '🍕', palabra: 'Pizza', categoria: 'Comida' },
        { picto: '🍗', palabra: 'Pollo', categoria: 'Comida' },
        { picto: '🍚', palabra: 'Arroz', categoria: 'Comida' },
        { picto: '🍫', palabra: 'Chocolate', categoria: 'Comida' },
        { picto: '🐶', palabra: 'Perro', categoria: 'Animales' },
        { picto: '🐱', palabra: 'Gato', categoria: 'Animales' },
        { picto: '🐦', palabra: 'Pájaro', categoria: 'Animales' },
        { picto: '🐟', palabra: 'Pez', categoria: 'Animales' },
        { picto: '🐴', palabra: 'Caballo', categoria: 'Animales' },
        { picto: '🦁', palabra: 'León', categoria: 'Animales' },
        { picto: '🐮', palabra: 'Vaca', categoria: 'Animales' },
        { picto: '🐰', palabra: 'Conejo', categoria: 'Animales' },
        { picto: '👕', palabra: 'Camiseta', categoria: 'Ropa' },
        { picto: '👖', palabra: 'Pantalón', categoria: 'Ropa' },
        { picto: '🧦', palabra: 'Calcetines', categoria: 'Ropa' },
        { picto: '👗', palabra: 'Vestido', categoria: 'Ropa' },
        { picto: '🧥', palabra: 'Abrigo', categoria: 'Ropa' },
        { picto: '👟', palabra: 'Zapatillas', categoria: 'Ropa' },
        { picto: '🎩', palabra: 'Sombrero', categoria: 'Ropa' },
        { picto: '🧣', palabra: 'Bufanda', categoria: 'Ropa' }
      ]
    },
    {
      id: 3,
      name: 'Nivel 3',
      descripcion: 'Frutas, verduras o frutos secos',
      estrellas: 3,
      categorias: ['Frutas', 'Verduras', 'Frutos secos'],
      items: [
        { picto: '🍎', palabra: 'Manzana', categoria: 'Frutas' },
        { picto: '🍌', palabra: 'Plátano', categoria: 'Frutas' },
        { picto: '🍇', palabra: 'Uvas', categoria: 'Frutas' },
        { picto: '🍊', palabra: 'Naranja', categoria: 'Frutas' },
        { picto: '🍓', palabra: 'Fresa', categoria: 'Frutas' },
        { picto: '🍉', palabra: 'Sandía', categoria: 'Frutas' },
        { picto: '🍍', palabra: 'Piña', categoria: 'Frutas' },
        { picto: '🍑', palabra: 'Melocotón', categoria: 'Frutas' },
        { picto: '🍒', palabra: 'Cereza', categoria: 'Frutas' },
        { picto: '🥝', palabra: 'Kiwi', categoria: 'Frutas' },
        { picto: '🥕', palabra: 'Zanahoria', categoria: 'Verduras' },
        { picto: '🥦', palabra: 'Brócoli', categoria: 'Verduras' },
        { picto: '🍅', palabra: 'Tomate', categoria: 'Verduras' },
        { picto: '🥒', palabra: 'Pepino', categoria: 'Verduras' },
        { picto: '🌽', palabra: 'Maíz', categoria: 'Verduras' },
        { picto: '🥔', palabra: 'Patata', categoria: 'Verduras' },
        { picto: '🧅', palabra: 'Cebolla', categoria: 'Verduras' },
        { picto: '🫑', palabra: 'Pimiento', categoria: 'Verduras' },
        { picto: '🥬', palabra: 'Lechuga', categoria: 'Verduras' },
        { picto: '🍆', palabra: 'Berenjena', categoria: 'Verduras' },
        { picto: '🥜', palabra: 'Cacahuete', categoria: 'Frutos secos' },
        { picto: '🌰', palabra: 'Castaña', categoria: 'Frutos secos' },
        { picto: '🥥', palabra: 'Coco', categoria: 'Frutos secos' }
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
      descripcion: 'Animals or clothes',
      estrellas: 1,
      categorias: ['Animals', 'Clothes'],
      items: [
        { picto: '🐶', palabra: 'Dog', categoria: 'Animals' },
        { picto: '🐱', palabra: 'Cat', categoria: 'Animals' },
        { picto: '🐘', palabra: 'Elephant', categoria: 'Animals' },
        { picto: '🦁', palabra: 'Lion', categoria: 'Animals' },
        { picto: '🐦', palabra: 'Bird', categoria: 'Animals' },
        { picto: '🐟', palabra: 'Fish', categoria: 'Animals' },
        { picto: '🐴', palabra: 'Horse', categoria: 'Animals' },
        { picto: '🐮', palabra: 'Cow', categoria: 'Animals' },
        { picto: '🐷', palabra: 'Pig', categoria: 'Animals' },
        { picto: '🐰', palabra: 'Rabbit', categoria: 'Animals' },
        { picto: '👕', palabra: 'T-shirt', categoria: 'Clothes' },
        { picto: '👖', palabra: 'Trousers', categoria: 'Clothes' },
        { picto: '🧦', palabra: 'Socks', categoria: 'Clothes' },
        { picto: '👗', palabra: 'Dress', categoria: 'Clothes' },
        { picto: '🧥', palabra: 'Coat', categoria: 'Clothes' },
        { picto: '👟', palabra: 'Trainers', categoria: 'Clothes' },
        { picto: '🧤', palabra: 'Gloves', categoria: 'Clothes' },
        { picto: '🎩', palabra: 'Hat', categoria: 'Clothes' },
        { picto: '👔', palabra: 'Tie', categoria: 'Clothes' },
        { picto: '🧣', palabra: 'Scarf', categoria: 'Clothes' }
      ]
    },
    {
      id: 2,
      name: 'Level 2',
      descripcion: 'Food, animals or clothes',
      estrellas: 2,
      categorias: ['Food', 'Animals', 'Clothes'],
      items: [
        { picto: '🍎', palabra: 'Apple', categoria: 'Food' },
        { picto: '🍞', palabra: 'Bread', categoria: 'Food' },
        { picto: '🧀', palabra: 'Cheese', categoria: 'Food' },
        { picto: '🥛', palabra: 'Milk', categoria: 'Food' },
        { picto: '🍕', palabra: 'Pizza', categoria: 'Food' },
        { picto: '🍗', palabra: 'Chicken', categoria: 'Food' },
        { picto: '🍚', palabra: 'Rice', categoria: 'Food' },
        { picto: '🍫', palabra: 'Chocolate', categoria: 'Food' },
        { picto: '🐶', palabra: 'Dog', categoria: 'Animals' },
        { picto: '🐱', palabra: 'Cat', categoria: 'Animals' },
        { picto: '🐦', palabra: 'Bird', categoria: 'Animals' },
        { picto: '🐟', palabra: 'Fish', categoria: 'Animals' },
        { picto: '🐴', palabra: 'Horse', categoria: 'Animals' },
        { picto: '🦁', palabra: 'Lion', categoria: 'Animals' },
        { picto: '🐮', palabra: 'Cow', categoria: 'Animals' },
        { picto: '🐰', palabra: 'Rabbit', categoria: 'Animals' },
        { picto: '👕', palabra: 'T-shirt', categoria: 'Clothes' },
        { picto: '👖', palabra: 'Trousers', categoria: 'Clothes' },
        { picto: '🧦', palabra: 'Socks', categoria: 'Clothes' },
        { picto: '👗', palabra: 'Dress', categoria: 'Clothes' },
        { picto: '🧥', palabra: 'Coat', categoria: 'Clothes' },
        { picto: '👟', palabra: 'Trainers', categoria: 'Clothes' },
        { picto: '🎩', palabra: 'Hat', categoria: 'Clothes' },
        { picto: '🧣', palabra: 'Scarf', categoria: 'Clothes' }
      ]
    },
    {
      id: 3,
      name: 'Level 3',
      descripcion: 'Fruit, vegetables or nuts',
      estrellas: 3,
      categorias: ['Fruit', 'Vegetables', 'Nuts'],
      items: [
        { picto: '🍎', palabra: 'Apple', categoria: 'Fruit' },
        { picto: '🍌', palabra: 'Banana', categoria: 'Fruit' },
        { picto: '🍇', palabra: 'Grapes', categoria: 'Fruit' },
        { picto: '🍊', palabra: 'Orange', categoria: 'Fruit' },
        { picto: '🍓', palabra: 'Strawberry', categoria: 'Fruit' },
        { picto: '🍉', palabra: 'Watermelon', categoria: 'Fruit' },
        { picto: '🍍', palabra: 'Pineapple', categoria: 'Fruit' },
        { picto: '🍑', palabra: 'Peach', categoria: 'Fruit' },
        { picto: '🍒', palabra: 'Cherry', categoria: 'Fruit' },
        { picto: '🥝', palabra: 'Kiwi', categoria: 'Fruit' },
        { picto: '🥕', palabra: 'Carrot', categoria: 'Vegetables' },
        { picto: '🥦', palabra: 'Broccoli', categoria: 'Vegetables' },
        { picto: '🍅', palabra: 'Tomato', categoria: 'Vegetables' },
        { picto: '🥒', palabra: 'Cucumber', categoria: 'Vegetables' },
        { picto: '🌽', palabra: 'Corn', categoria: 'Vegetables' },
        { picto: '🥔', palabra: 'Potato', categoria: 'Vegetables' },
        { picto: '🧅', palabra: 'Onion', categoria: 'Vegetables' },
        { picto: '🫑', palabra: 'Pepper', categoria: 'Vegetables' },
        { picto: '🥬', palabra: 'Lettuce', categoria: 'Vegetables' },
        { picto: '🍆', palabra: 'Aubergine', categoria: 'Vegetables' },
        { picto: '🥜', palabra: 'Peanut', categoria: 'Nuts' },
        { picto: '🌰', palabra: 'Chestnut', categoria: 'Nuts' },
        { picto: '🥥', palabra: 'Coconut', categoria: 'Nuts' }
      ]
    }
  ]
  }
};
