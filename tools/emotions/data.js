/* ============================================================
   Datos: ¿Cómo me siento? — emociones básicas (es) y su
   equivalente en inglés (en). app.js usa DATA[App.i18n.locale()].
   Formato: { emociones: [{ id, name, picto, color, colorSuave,
              mensaje (validación, nunca juzga),
              sugerencia: { tipo: 'text' | 'respiracion', text } }],
              dias: [7 nombres de días, domingo a sábado] }
   Todas las emociones son válidas. Nunca "está mal sentirse así".
   Para ampliar: añadir objetos al array de cada idioma (máx. 6 visibles).
   ============================================================ */
const DATA = {
  es: {
    emociones: [
      {
        id: 'contento',
        name: 'Contento',
        picto: '😊',
        color: '#2E7D32',
        colorSuave: '#E6F2E6',
        mensaje: 'Estás contento. ¡Qué bien!',
        sugerencia: {
          tipo: 'text',
          text: 'Disfruta este momento. Puedes contárselo a alguien que quieres.'
        }
      },
      {
        id: 'triste',
        name: 'Triste',
        picto: '😢',
        color: '#1B6CA8',
        colorSuave: '#E3EEF6',
        mensaje: 'Estás triste. No pasa nada. A veces nos sentimos así.',
        sugerencia: {
          tipo: 'text',
          text: 'Puedes hablar con alguien de confianza. También puedes hacer algo que te guste.'
        }
      },
      {
        id: 'enfadado',
        name: 'Enfadado',
        picto: '😠',
        color: '#C05621',
        colorSuave: '#F9EBE2',
        mensaje: 'Estás enfadado. Es normal enfadarse a veces.',
        sugerencia: {
          tipo: 'respiracion',
          text: 'Vamos a respirar despacio. Te ayudará a calmarte.'
        }
      },
      {
        id: 'asustado',
        name: 'Asustado',
        picto: '😨',
        color: '#6B3FA0',
        colorSuave: '#EFE8F7',
        mensaje: 'Estás asustado. Tranquilo, estás a salvo.',
        sugerencia: {
          tipo: 'respiracion',
          text: 'Vamos a respirar despacio. El miedo se hace más pequeño.'
        }
      },
      {
        id: 'cansado',
        name: 'Cansado',
        picto: '😴',
        color: '#4A4A68',
        colorSuave: '#EDEDF2',
        mensaje: 'Estás cansado. Tu cuerpo te pide descanso.',
        sugerencia: {
          tipo: 'text',
          text: 'Puedes descansar un rato. Beber agua también ayuda.'
        }
      },
      {
        id: 'tranquilo',
        name: 'Tranquilo',
        picto: '😌',
        color: '#2E7D32',
        colorSuave: '#E6F2E6',
        mensaje: 'Estás tranquilo. Qué sensación tan agradable.',
        sugerencia: {
          tipo: 'text',
          text: 'Aprovecha esta calma para hacer algo que te guste.'
        }
      }
    ],
    dias: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
  },
  en: {
    emociones: [
      {
        id: 'contento',
        name: 'Happy',
        picto: '😊',
        color: '#2E7D32',
        colorSuave: '#E6F2E6',
        mensaje: 'You are happy. That is great!',
        sugerencia: {
          tipo: 'text',
          text: 'Enjoy this moment. You can tell someone you love about it.'
        }
      },
      {
        id: 'triste',
        name: 'Sad',
        picto: '😢',
        color: '#1B6CA8',
        colorSuave: '#E3EEF6',
        mensaje: 'You are sad. That is okay. Sometimes we feel this way.',
        sugerencia: {
          tipo: 'text',
          text: 'You can talk to someone you trust. You can also do something you like.'
        }
      },
      {
        id: 'enfadado',
        name: 'Angry',
        picto: '😠',
        color: '#C05621',
        colorSuave: '#F9EBE2',
        mensaje: 'You are angry. It is normal to feel angry sometimes.',
        sugerencia: {
          tipo: 'respiracion',
          text: 'Let’s breathe slowly. It will help you feel calm.'
        }
      },
      {
        id: 'asustado',
        name: 'Scared',
        picto: '😨',
        color: '#6B3FA0',
        colorSuave: '#EFE8F7',
        mensaje: 'You are scared. Don’t worry, you are safe.',
        sugerencia: {
          tipo: 'respiracion',
          text: 'Let’s breathe slowly. Fear becomes smaller.'
        }
      },
      {
        id: 'cansado',
        name: 'Tired',
        picto: '😴',
        color: '#4A4A68',
        colorSuave: '#EDEDF2',
        mensaje: 'You are tired. Your body needs rest.',
        sugerencia: {
          tipo: 'text',
          text: 'You can rest for a while. Drinking water also helps.'
        }
      },
      {
        id: 'tranquilo',
        name: 'Calm',
        picto: '😌',
        color: '#2E7D32',
        colorSuave: '#E6F2E6',
        mensaje: 'You are calm. What a nice feeling.',
        sugerencia: {
          tipo: 'text',
          text: 'Enjoy this calm feeling. Do something you like.'
        }
      }
    ],
    dias: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  }
};
