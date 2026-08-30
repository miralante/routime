/* ============================================================
   Routime — Vocabulario por tema (lenguaje: banco de palabras
   complejas en una sola actividad con filtro por bloque y por
   tier).
   Este data.js es una copia estática del banco histórico
   `content/dictionary/{es,en}.json` (eliminado en 2026-08-30;
   el contenido de este archivo es la versión conservada para la
   actividad). Las opciones incorrectas del test se generan
   tomando el significado de otras palabras del mismo bloque
   (nunca inventadas). El filtro por tier deja ver solo rondas
   con palabras del tier elegido (1, 2, 3 o 4).
   ============================================================ */
(function () {
  'use strict';

  /* Cada ronda tiene 8 palabras. Las opciones incorrectas del
     test se generan tomando el significado de otras palabras del
     mismo bloque (nunca inventadas). El filtro por tier deja ver
     solo rondas con palabras del tier elegido (1, 2, 3 o 4). */

  var DATA = {
    porRonda: 8,
    bloques: [
  {
    "id": "A",
    "nombre": {
      "es": "Vocabulario general adulto",
      "en": "General adult vocabulary"
    },
    "categorias": [
      "d+�a a d+�a",
      "personalidad y emociones",
      "trabajo y sociedad",
      "ciencia, ideas y mundo",
      "el cuerpo y la salud",
      "el dinero y las compras",
      "el tiempo y el calendario",
      "los viajes y los lugares",
      "la tecnolog+�a y la comunicaci+�n",
      "los derechos y la convivencia",
      "pensar y aprender",
      "acciones del d+�a a d+�a (avanzado)"
    ],
    "rondas": [
      {
        "id": "A-dia-a-dia-1",
        "bloqueId": "A",
        "category": "d+�a a d+�a",
        "chunkIndex": 0,
        "chunkCount": 4,
        "tier": 1,
        "words": [
          {
            "word": "asequible",
            "definition": "Que se puede comprar o conseguir sin gastar mucho dinero.",
            "example": "Este piso es asequible: cuesta menos que otros del barrio.",
            "category": "d+�a a d+�a",
            "tier": 1
          },
          {
            "word": "rutinario",
            "definition": "Que se repite siempre de la misma manera.",
            "example": "Guardar la compra es una tarea rutinaria en casa.",
            "category": "d+�a a d+�a",
            "tier": 1
          },
          {
            "word": "pr+�ctico",
            "definition": "Que sirve para algo +�til, sin complicaciones.",
            "example": "Este bolso es pr+�ctico: cabe todo lo que necesito.",
            "category": "d+�a a d+�a",
            "tier": 1
          },
          {
            "word": "accesible",
            "definition": "Que es f+�cil de usar o de llegar hasta +�l.",
            "example": "La rampa hace que la entrada sea accesible en silla de ruedas.",
            "category": "d+�a a d+�a",
            "tier": 1
          },
          {
            "word": "puntual",
            "definition": "Que llega a la hora exacta, ni antes ni despu+�s.",
            "example": "Fue puntual: lleg+� justo a las nueve.",
            "category": "d+�a a d+�a",
            "tier": 1
          },
          {
            "word": "razonable",
            "definition": "Que tiene sentido y no es exagerado.",
            "example": "El precio del billete me pareci+� razonable.",
            "category": "d+�a a d+�a",
            "tier": 1
          },
          {
            "word": "suficiente",
            "definition": "Que hay la cantidad justa que hace falta.",
            "example": "Tenemos comida suficiente para toda la semana.",
            "category": "d+�a a d+�a",
            "tier": 1
          },
          {
            "word": "previsible",
            "definition": "Que se puede saber antes de que pase.",
            "example": "La lluvia era previsible: lo dijo el tiempo esta ma+�ana.",
            "category": "d+�a a d+�a",
            "tier": 1
          }
        ]
      },
      {
        "id": "A-dia-a-dia-2",
        "bloqueId": "A",
        "category": "d+�a a d+�a",
        "chunkIndex": 1,
        "chunkCount": 4,
        "tier": 1,
        "words": [
          {
            "word": "duradero",
            "definition": "Que dura mucho tiempo sin romperse.",
            "example": "Estos zapatos son duraderos: los uso desde hace tres a+�os.",
            "category": "d+�a a d+�a",
            "tier": 1
          },
          {
            "word": "sencillo",
            "definition": "Que no tiene complicaciones, es f+�cil de entender.",
            "example": "La receta es sencilla: solo tiene tres pasos.",
            "category": "d+�a a d+�a",
            "tier": 1
          },
          {
            "word": "habitual",
            "definition": "Que pasa casi siempre, es lo normal.",
            "example": "Tomar caf+� por la ma+�ana es habitual en mi casa.",
            "category": "d+�a a d+�a",
            "tier": 1
          },
          {
            "word": "urgente",
            "definition": "Que hay que hacerlo ya, no puede esperar.",
            "example": "La llamada era urgente: hab+�a un problema en el trabajo.",
            "category": "d+�a a d+�a",
            "tier": 1
          },
          {
            "word": "provisional",
            "definition": "Que dura poco tiempo, hasta que llegue algo definitivo.",
            "example": "Vivimos en un piso provisional mientras arreglan el nuestro.",
            "category": "d+�a a d+�a",
            "tier": 1
          },
          {
            "word": "voluntario",
            "definition": "Que se hace porque uno quiere, no porque lo obliguen.",
            "example": "Ayudar en el comedor social es un trabajo voluntario.",
            "category": "d+�a a d+�a",
            "tier": 1
          },
          {
            "word": "gradual",
            "definition": "Que pasa poco a poco, no de golpe.",
            "example": "El cambio de horario fue gradual, un poco cada semana.",
            "category": "d+�a a d+�a",
            "tier": 1
          },
          {
            "word": "notable",
            "definition": "Que se nota mucho, es f+�cil de ver.",
            "example": "Hizo una mejora notable en su forma de leer.",
            "category": "d+�a a d+�a",
            "tier": 1
          }
        ]
      },
      {
        "id": "A-dia-a-dia-3",
        "bloqueId": "A",
        "category": "d+�a a d+�a",
        "chunkIndex": 2,
        "chunkCount": 4,
        "tier": 1,
        "words": [
          {
            "word": "impecable",
            "definition": "Que est+� perfecto, sin ning+�n fallo.",
            "example": "Dej+� la cocina impecable despu+�s de limpiar.",
            "category": "d+�a a d+�a",
            "tier": 1
          },
          {
            "word": "viable",
            "definition": "Que se puede hacer de verdad, es posible.",
            "example": "El plan es viable si empezamos esta semana.",
            "category": "d+�a a d+�a",
            "tier": 1
          },
          {
            "word": "c+�modo",
            "definition": "Que hace sentir bien, sin molestias.",
            "example": "Este sill+�n es muy c+�modo para ver la tele.",
            "category": "d+�a a d+�a",
            "tier": 1
          },
          {
            "word": "vers+�til",
            "definition": "Que sirve para muchas cosas distintas.",
            "example": "Esta herramienta es vers+�til: sirve para varios trabajos.",
            "category": "d+�a a d+�a",
            "tier": 1
          },
          {
            "word": "fiable",
            "definition": "Que se puede confiar en ello, no falla.",
            "example": "Este reloj es fiable: siempre da la hora bien.",
            "category": "d+�a a d+�a",
            "tier": 1
          },
          {
            "word": "moderado",
            "definition": "Que no es ni mucho ni poco, es equilibrado.",
            "example": "Hizo un gasto moderado en el viaje.",
            "category": "d+�a a d+�a",
            "tier": 1
          },
          {
            "word": "flexible",
            "definition": "Que se puede cambiar o adaptar con facilidad.",
            "example": "Mi horario de trabajo es flexible, puedo elegirlo.",
            "category": "d+�a a d+�a",
            "tier": 1
          },
          {
            "word": "eventual",
            "definition": "Que puede pasar, pero no es seguro.",
            "example": "Hay un eventual cambio de planes si llueve.",
            "category": "d+�a a d+�a",
            "tier": 1
          }
        ]
      },
      {
        "id": "A-dia-a-dia-4",
        "bloqueId": "A",
        "category": "d+�a a d+�a",
        "chunkIndex": 3,
        "chunkCount": 4,
        "tier": 1,
        "words": [
          {
            "word": "genuino",
            "definition": "Que es de verdad, no es una copia.",
            "example": "Ese cuadro es un genuino Picasso.",
            "category": "d+�a a d+�a",
            "tier": 1
          }
        ]
      },
      {
        "id": "A-personalidad-y-emociones-1",
        "bloqueId": "A",
        "category": "personalidad y emociones",
        "chunkIndex": 0,
        "chunkCount": 4,
        "tier": 2,
        "words": [
          {
            "word": "optimista",
            "definition": "Que ve el lado bueno de las cosas.",
            "example": "Es optimista: cree que todo saldr+� bien.",
            "category": "personalidad y emociones",
            "tier": 2
          },
          {
            "word": "pesimista",
            "definition": "Que ve el lado malo de las cosas.",
            "example": "Es pesimista: piensa que algo saldr+� mal.",
            "category": "personalidad y emociones",
            "tier": 2
          },
          {
            "word": "generoso",
            "definition": "Que le gusta compartir lo que tiene con los dem+�s.",
            "example": "Fue generoso: dio la mitad de su comida.",
            "category": "personalidad y emociones",
            "tier": 2
          },
          {
            "word": "orgulloso",
            "definition": "Que se siente muy contento por algo que ha hecho.",
            "example": "Est+� orgulloso de haber aprobado el examen.",
            "category": "personalidad y emociones",
            "tier": 2
          },
          {
            "word": "humilde",
            "definition": "Que no presume de lo que tiene o hace.",
            "example": "Es humilde: nunca habla de sus premios.",
            "category": "personalidad y emociones",
            "tier": 2
          },
          {
            "word": "impulsivo",
            "definition": "Que act+�a r+�pido, sin pensar antes.",
            "example": "Fue impulsivo: compr+� el coche sin mirar el precio.",
            "category": "personalidad y emociones",
            "tier": 2
          },
          {
            "word": "prudente",
            "definition": "Que piensa bien antes de actuar, para evitar problemas.",
            "example": "Fue prudente: mir+� a los dos lados antes de cruzar.",
            "category": "personalidad y emociones",
            "tier": 2
          },
          {
            "word": "curioso",
            "definition": "Que quiere saber cosas nuevas todo el rato.",
            "example": "Es curioso: siempre pregunta c+�mo funcionan las cosas.",
            "category": "personalidad y emociones",
            "tier": 2
          }
        ]
      },
      {
        "id": "A-personalidad-y-emociones-2",
        "bloqueId": "A",
        "category": "personalidad y emociones",
        "chunkIndex": 1,
        "chunkCount": 4,
        "tier": 2,
        "words": [
          {
            "word": "resiliente",
            "definition": "Que se recupera bien despu+�s de algo dif+�cil.",
            "example": "Fue resiliente: volvi+� a intentarlo despu+�s del fracaso.",
            "category": "personalidad y emociones",
            "tier": 2
          },
          {
            "word": "introvertido",
            "definition": "Que prefiere estar solo o con poca gente.",
            "example": "Es introvertido: le gusta quedarse en casa leyendo.",
            "category": "personalidad y emociones",
            "tier": 2
          },
          {
            "word": "extrovertido",
            "definition": "Que le gusta estar rodeado de gente y hablar.",
            "example": "Es extrovertido: conoce a todo el mundo en la fiesta.",
            "category": "personalidad y emociones",
            "tier": 2
          },
          {
            "word": "sensible",
            "definition": "Que se emociona con facilidad.",
            "example": "Es sensible: llora viendo pel+�culas tristes.",
            "category": "personalidad y emociones",
            "tier": 2
          },
          {
            "word": "cauteloso",
            "definition": "Que tiene cuidado para no equivocarse.",
            "example": "Fue cauteloso: ley+� el contrato dos veces antes de firmar.",
            "category": "personalidad y emociones",
            "tier": 2
          },
          {
            "word": "compasivo",
            "definition": "Que siente pena por el dolor de otros y quiere ayudar.",
            "example": "Fue compasivo: ayud+� al se+�or que se hab+�a ca+�do.",
            "category": "personalidad y emociones",
            "tier": 2
          },
          {
            "word": "rencoroso",
            "definition": "Que no olvida ni perdona cuando le hacen da+�o.",
            "example": "Es rencoroso: sigue enfadado por algo de hace un a+�o.",
            "category": "personalidad y emociones",
            "tier": 2
          },
          {
            "word": "afable",
            "definition": "Que trata bien a la gente, es amable al hablar.",
            "example": "El vecino es afable: siempre saluda con una sonrisa.",
            "category": "personalidad y emociones",
            "tier": 2
          }
        ]
      },
      {
        "id": "A-personalidad-y-emociones-3",
        "bloqueId": "A",
        "category": "personalidad y emociones",
        "chunkIndex": 2,
        "chunkCount": 4,
        "tier": 2,
        "words": [
          {
            "word": "altruista",
            "definition": "Que ayuda a los dem+�s sin esperar nada a cambio.",
            "example": "Fue altruista: don+� dinero sin dec+�rselo a nadie.",
            "category": "personalidad y emociones",
            "tier": 2
          },
          {
            "word": "desconfiado",
            "definition": "Que no cree f+�cilmente en lo que dicen los dem+�s.",
            "example": "Es desconfiado: pregunta varias veces antes de creer algo.",
            "category": "personalidad y emociones",
            "tier": 2
          },
          {
            "word": "entusiasta",
            "definition": "Que muestra mucha ilusi+�n y ganas por algo.",
            "example": "Es entusiasta con el nuevo trabajo: llega feliz cada d+�a.",
            "category": "personalidad y emociones",
            "tier": 2
          },
          {
            "word": "obstinado",
            "definition": "Que no cambia de idea aunque le digan que se equivoca.",
            "example": "Fue obstinado: sigui+� con su plan aunque todos le avisaron.",
            "category": "personalidad y emociones",
            "tier": 2
          },
          {
            "word": "servicial",
            "definition": "Que le gusta ayudar a los dem+�s.",
            "example": "Es servicial: siempre ayuda a cargar las bolsas.",
            "category": "personalidad y emociones",
            "tier": 2
          },
          {
            "word": "vulnerable",
            "definition": "Que puede sufrir da+�o con facilidad, necesita protecci+�n.",
            "example": "Las personas mayores son m+�s vulnerables al fr+�o.",
            "category": "personalidad y emociones",
            "tier": 2
          },
          {
            "word": "asertivo",
            "definition": "Que dice lo que piensa con respeto, sin miedo.",
            "example": "Fue asertivo: dijo que no le gustaba el plan sin enfadarse.",
            "category": "personalidad y emociones",
            "tier": 2
          },
          {
            "word": "melanc+�lico",
            "definition": "Que siente una tristeza suave, como a+�oranza.",
            "example": "Se puso melanc+�lico al ver fotos antiguas.",
            "category": "personalidad y emociones",
            "tier": 2
          }
        ]
      },
      {
        "id": "A-personalidad-y-emociones-4",
        "bloqueId": "A",
        "category": "personalidad y emociones",
        "chunkIndex": 3,
        "chunkCount": 4,
        "tier": 2,
        "words": [
          {
            "word": "jovial",
            "definition": "Que est+� alegre y de buen humor casi siempre.",
            "example": "La abuela es jovial: siempre est+� riendo y contando historias.",
            "category": "personalidad y emociones",
            "tier": 2
          }
        ]
      },
      {
        "id": "A-trabajo-y-sociedad-1",
        "bloqueId": "A",
        "category": "trabajo y sociedad",
        "chunkIndex": 0,
        "chunkCount": 4,
        "tier": 3,
        "words": [
          {
            "word": "jornada",
            "definition": "El tiempo que se trabaja en un d+�a.",
            "example": "Su jornada laboral empieza a las ocho.",
            "category": "trabajo y sociedad",
            "tier": 3
          },
          {
            "word": "contrato",
            "definition": "Un papel que dice las condiciones de un trabajo o acuerdo.",
            "example": "Firm+� el contrato antes de empezar a trabajar.",
            "category": "trabajo y sociedad",
            "tier": 3
          },
          {
            "word": "sueldo",
            "definition": "El dinero que se recibe por trabajar.",
            "example": "Cobra el sueldo el +�ltimo d+�a del mes.",
            "category": "trabajo y sociedad",
            "tier": 3
          },
          {
            "word": "presupuesto",
            "definition": "El dinero que se puede gastar en algo, calculado antes.",
            "example": "Hicimos un presupuesto para las vacaciones.",
            "category": "trabajo y sociedad",
            "tier": 3
          },
          {
            "word": "impuesto",
            "definition": "Dinero que se paga al Estado por ley.",
            "example": "Los impuestos sirven para pagar hospitales y colegios.",
            "category": "trabajo y sociedad",
            "tier": 3
          },
          {
            "word": "normativa",
            "definition": "El conjunto de reglas que hay que cumplir.",
            "example": "La normativa dice que hay que llevar casco en bici.",
            "category": "trabajo y sociedad",
            "tier": 3
          },
          {
            "word": "tr+�mite",
            "definition": "Un paso que hay que hacer para conseguir algo oficial.",
            "example": "Pedir el DNI es un tr+�mite en la comisar+�a.",
            "category": "trabajo y sociedad",
            "tier": 3
          },
          {
            "word": "solicitud",
            "definition": "Un papel donde se pide algo de forma oficial.",
            "example": "Rellen+� la solicitud para pedir la beca.",
            "category": "trabajo y sociedad",
            "tier": 3
          }
        ]
      },
      {
        "id": "A-trabajo-y-sociedad-2",
        "bloqueId": "A",
        "category": "trabajo y sociedad",
        "chunkIndex": 1,
        "chunkCount": 4,
        "tier": 3,
        "words": [
          {
            "word": "entidad",
            "definition": "Una organizaci+�n, como una empresa o una asociaci+�n.",
            "example": "El banco es una entidad que guarda el dinero.",
            "category": "trabajo y sociedad",
            "tier": 3
          },
          {
            "word": "colectivo",
            "definition": "Un grupo de personas que comparten algo en com+�n.",
            "example": "Ayuda a un colectivo de personas mayores.",
            "category": "trabajo y sociedad",
            "tier": 3
          },
          {
            "word": "inclusi+�n",
            "definition": "Hacer que todas las personas puedan participar, sin dejar a nadie fuera.",
            "example": "La rampa mejora la inclusi+�n de las personas en silla de ruedas.",
            "category": "trabajo y sociedad",
            "tier": 3
          },
          {
            "word": "discriminaci+�n",
            "definition": "Tratar peor a una persona por ser diferente.",
            "example": "La ley proh+�be la discriminaci+�n por el origen de la persona.",
            "category": "trabajo y sociedad",
            "tier": 3
          },
          {
            "word": "autonom+�a",
            "definition": "Poder hacer las cosas uno mismo, sin ayuda de otros.",
            "example": "Cocinar solo le da m+�s autonom+�a.",
            "category": "trabajo y sociedad",
            "tier": 3
          },
          {
            "word": "instituci+�n",
            "definition": "Una organizaci+�n grande, como el Ayuntamiento o un hospital.",
            "example": "El Ayuntamiento es una instituci+�n del pueblo.",
            "category": "trabajo y sociedad",
            "tier": 3
          },
          {
            "word": "comunidad",
            "definition": "Un grupo de personas que viven o comparten algo en el mismo lugar.",
            "example": "Toda la comunidad ayud+� a limpiar el parque.",
            "category": "trabajo y sociedad",
            "tier": 3
          },
          {
            "word": "ciudadan+�a",
            "definition": "El derecho y el deber de vivir como parte de un pa+�s.",
            "example": "Votar es parte de la ciudadan+�a.",
            "category": "trabajo y sociedad",
            "tier": 3
          }
        ]
      },
      {
        "id": "A-trabajo-y-sociedad-3",
        "bloqueId": "A",
        "category": "trabajo y sociedad",
        "chunkIndex": 2,
        "chunkCount": 4,
        "tier": 3,
        "words": [
          {
            "word": "legislaci+�n",
            "definition": "El conjunto de leyes de un pa+�s.",
            "example": "La legislaci+�n protege los derechos de los trabajadores.",
            "category": "trabajo y sociedad",
            "tier": 3
          },
          {
            "word": "convocatoria",
            "definition": "Un aviso para que la gente vaya a un sitio o participe en algo.",
            "example": "Sali+� la convocatoria para el nuevo curso.",
            "category": "trabajo y sociedad",
            "tier": 3
          },
          {
            "word": "subvenci+�n",
            "definition": "Dinero que da el Estado para ayudar a hacer algo.",
            "example": "La asociaci+�n recibi+� una subvenci+�n para el taller.",
            "category": "trabajo y sociedad",
            "tier": 3
          },
          {
            "word": "gesti+�n",
            "definition": "Organizar y llevar bien las tareas de algo.",
            "example": "La gesti+�n del dinero de la casa la hace entre los dos.",
            "category": "trabajo y sociedad",
            "tier": 3
          },
          {
            "word": "infraestructura",
            "definition": "Las cosas construidas que hacen falta para vivir, como carreteras o el agua.",
            "example": "El pueblo mejor+� su infraestructura con una carretera nueva.",
            "category": "trabajo y sociedad",
            "tier": 3
          },
          {
            "word": "sostenible",
            "definition": "Que se puede mantener en el tiempo sin da+�ar las cosas.",
            "example": "Usar la bici es un transporte sostenible.",
            "category": "trabajo y sociedad",
            "tier": 3
          },
          {
            "word": "colaborar",
            "definition": "Ayudar entre varias personas para conseguir algo juntos.",
            "example": "Todos colaboraron para organizar la fiesta.",
            "category": "trabajo y sociedad",
            "tier": 3
          },
          {
            "word": "representante",
            "definition": "La persona que habla en nombre de un grupo.",
            "example": "El representante de los vecinos habl+� en la reuni+�n.",
            "category": "trabajo y sociedad",
            "tier": 3
          }
        ]
      },
      {
        "id": "A-trabajo-y-sociedad-4",
        "bloqueId": "A",
        "category": "trabajo y sociedad",
        "chunkIndex": 3,
        "chunkCount": 4,
        "tier": 3,
        "words": [
          {
            "word": "transparencia",
            "definition": "Hacer las cosas de forma clara, sin esconder nada.",
            "example": "El club explic+� con transparencia en qu+� gasta el dinero.",
            "category": "trabajo y sociedad",
            "tier": 3
          }
        ]
      },
      {
        "id": "A-ciencia-ideas-y-mundo-1",
        "bloqueId": "A",
        "category": "ciencia, ideas y mundo",
        "chunkIndex": 0,
        "chunkCount": 4,
        "tier": 4,
        "words": [
          {
            "word": "hip+�tesis",
            "definition": "Una idea que se piensa que puede ser verdad, pero a+�n no se sabe seguro.",
            "example": "El cient+�fico hizo una hip+�tesis antes del experimento.",
            "category": "ciencia, ideas y mundo",
            "tier": 4
          },
          {
            "word": "teor+�a",
            "definition": "Una explicaci+�n de por qu+� pasan las cosas, basada en pruebas.",
            "example": "La teor+�a explica por qu+� llueve.",
            "category": "ciencia, ideas y mundo",
            "tier": 4
          },
          {
            "word": "fen+�meno",
            "definition": "Algo que pasa en la naturaleza y se puede observar.",
            "example": "El arco+�ris es un fen+�meno que pasa cuando llueve y hace sol.",
            "category": "ciencia, ideas y mundo",
            "tier": 4
          },
          {
            "word": "ecosistema",
            "definition": "Todos los seres vivos y el lugar donde viven juntos.",
            "example": "El bosque es un ecosistema con +�rboles, animales e insectos.",
            "category": "ciencia, ideas y mundo",
            "tier": 4
          },
          {
            "word": "biodiversidad",
            "definition": "La gran variedad de plantas y animales que hay en un lugar.",
            "example": "La selva tiene mucha biodiversidad: miles de especies diferentes.",
            "category": "ciencia, ideas y mundo",
            "tier": 4
          },
          {
            "word": "clima",
            "definition": "El tiempo que suele hacer en un lugar durante mucho tiempo.",
            "example": "El clima de Espa+�a es c+�lido en verano.",
            "category": "ciencia, ideas y mundo",
            "tier": 4
          },
          {
            "word": "tecnolog+�a",
            "definition": "Las m+�quinas y herramientas que ayudan a hacer las cosas m+�s f+�cil.",
            "example": "El m+�vil es un ejemplo de tecnolog+�a.",
            "category": "ciencia, ideas y mundo",
            "tier": 4
          },
          {
            "word": "digital",
            "definition": "Que funciona con ordenadores o pantallas, no en papel.",
            "example": "Ahora muchos tr+�mites se hacen de forma digital.",
            "category": "ciencia, ideas y mundo",
            "tier": 4
          }
        ]
      },
      {
        "id": "A-ciencia-ideas-y-mundo-2",
        "bloqueId": "A",
        "category": "ciencia, ideas y mundo",
        "chunkIndex": 1,
        "chunkCount": 4,
        "tier": 4,
        "words": [
          {
            "word": "innovador",
            "definition": "Que trae algo nuevo que no exist+�a antes.",
            "example": "Ese invento es innovador: nadie lo hab+�a hecho antes.",
            "category": "ciencia, ideas y mundo",
            "tier": 4
          },
          {
            "word": "globalizaci+�n",
            "definition": "Cuando pa+�ses de todo el mundo est+�n conectados y se parecen m+�s.",
            "example": "La globalizaci+�n hace que se pueda comprar de otros pa+�ses f+�cilmente.",
            "category": "ciencia, ideas y mundo",
            "tier": 4
          },
          {
            "word": "patrimonio",
            "definition": "Todo lo importante de un lugar que viene del pasado, como monumentos o costumbres.",
            "example": "La catedral es parte del patrimonio de la ciudad.",
            "category": "ciencia, ideas y mundo",
            "tier": 4
          },
          {
            "word": "civilizaci+�n",
            "definition": "Un grupo grande de personas que vive de forma organizada, con normas y cultura.",
            "example": "Los romanos fueron una gran civilizaci+�n.",
            "category": "ciencia, ideas y mundo",
            "tier": 4
          },
          {
            "word": "filosof+�a",
            "definition": "La forma de pensar sobre la vida y sus grandes preguntas.",
            "example": "La filosof+�a intenta responder qu+� es la felicidad.",
            "category": "ciencia, ideas y mundo",
            "tier": 4
          },
          {
            "word": "+�tica",
            "definition": "Lo que se considera bueno o malo hacer.",
            "example": "Por +�tica, un m+�dico debe decir la verdad sobre tu salud.",
            "category": "ciencia, ideas y mundo",
            "tier": 4
          },
          {
            "word": "emp+�rico",
            "definition": "Que se sabe porque se ha comprobado, no porque se imagina.",
            "example": "El resultado es emp+�rico: se comprob+� varias veces en el laboratorio.",
            "category": "ciencia, ideas y mundo",
            "tier": 4
          },
          {
            "word": "objetivo",
            "definition": "Que se basa en hechos reales, no en lo que uno siente.",
            "example": "El +�rbitro debe ser objetivo y no favorecer a ning+�n equipo.",
            "category": "ciencia, ideas y mundo",
            "tier": 4
          }
        ]
      },
      {
        "id": "A-ciencia-ideas-y-mundo-3",
        "bloqueId": "A",
        "category": "ciencia, ideas y mundo",
        "chunkIndex": 2,
        "chunkCount": 4,
        "tier": 4,
        "words": [
          {
            "word": "subjetivo",
            "definition": "Que depende de lo que piensa o siente cada persona.",
            "example": "Que una pel+�cula sea buena es algo subjetivo.",
            "category": "ciencia, ideas y mundo",
            "tier": 4
          },
          {
            "word": "abstracto",
            "definition": "Que no se puede tocar ni ver, es una idea.",
            "example": "La libertad es un concepto abstracto.",
            "category": "ciencia, ideas y mundo",
            "tier": 4
          },
          {
            "word": "concreto",
            "definition": "Que es claro y real, no una idea vaga.",
            "example": "Dame un ejemplo concreto de lo que quieres decir.",
            "category": "ciencia, ideas y mundo",
            "tier": 4
          },
          {
            "word": "paradoja",
            "definition": "Algo que parece imposible o contradictorio, pero puede ser cierto.",
            "example": "Es una paradoja: cuanto m+�s r+�pido corres en la cinta, menos avanzas.",
            "category": "ciencia, ideas y mundo",
            "tier": 4
          },
          {
            "word": "analog+�a",
            "definition": "Comparar dos cosas distintas porque se parecen en algo.",
            "example": "Explic+� el coraz+�n con una analog+�a: es como una bomba de agua.",
            "category": "ciencia, ideas y mundo",
            "tier": 4
          },
          {
            "word": "herm+�tico",
            "definition": "Que est+� cerrado del todo, no deja pasar nada.",
            "example": "El bote es herm+�tico: no entra ni sale aire.",
            "category": "ciencia, ideas y mundo",
            "tier": 4
          },
          {
            "word": "sofisticado",
            "definition": "Que es complicado y avanzado, hecho con mucho cuidado.",
            "example": "Ese aparato es sofisticado: tiene muchas funciones.",
            "category": "ciencia, ideas y mundo",
            "tier": 4
          },
          {
            "word": "aut+�ctono",
            "definition": "Que es originario del lugar donde vive, no viene de fuera.",
            "example": "El lince es un animal aut+�ctono de Espa+�a.",
            "category": "ciencia, ideas y mundo",
            "tier": 4
          }
        ]
      },
      {
        "id": "A-ciencia-ideas-y-mundo-4",
        "bloqueId": "A",
        "category": "ciencia, ideas y mundo",
        "chunkIndex": 3,
        "chunkCount": 4,
        "tier": 4,
        "words": [
          {
            "word": "universal",
            "definition": "Que vale o se entiende en todas partes, para todo el mundo.",
            "example": "La m+�sica es un lenguaje universal.",
            "category": "ciencia, ideas y mundo",
            "tier": 4
          }
        ]
      },
      {
        "id": "A-el-cuerpo-y-la-salud-1",
        "bloqueId": "A",
        "category": "el cuerpo y la salud",
        "chunkIndex": 0,
        "chunkCount": 2,
        "tier": 1,
        "words": [
          {
            "word": "s+�ntoma",
            "definition": "Una se+�al del cuerpo que avisa de que algo no va bien.",
            "example": "La fiebre es un s+�ntoma de que el cuerpo est+� luchando contra una infecci+�n.",
            "category": "el cuerpo y la salud",
            "tier": 1
          },
          {
            "word": "remedio",
            "definition": "Algo que se toma o se hace para curar o aliviar una dolencia.",
            "example": "El m+�dico le dio un remedio para el dolor de cabeza.",
            "category": "el cuerpo y la salud",
            "tier": 1
          },
          {
            "word": "receta",
            "definition": "Un papel del m+�dico que dice qu+� medicina tienes que tomar.",
            "example": "Llev+� la receta a la farmacia para comprar las pastillas.",
            "category": "el cuerpo y la salud",
            "tier": 1
          },
          {
            "word": "alergia",
            "definition": "Reacci+�n del cuerpo que molesta cuando toca o come algo.",
            "example": "Tiene alergia a los frutos secos: le pica la piel.",
            "category": "el cuerpo y la salud",
            "tier": 1
          },
          {
            "word": "cita",
            "definition": "El d+�a y la hora acordados para ir al m+�dico o a otro sitio.",
            "example": "Tengo cita con el dentista el jueves a las cinco.",
            "category": "el cuerpo y la salud",
            "tier": 1
          },
          {
            "word": "urgencias",
            "definition": "La zona del hospital para los casos graves que no pueden esperar.",
            "example": "Lo llevaron a urgencias porque se hab+�a hecho una herida muy grande.",
            "category": "el cuerpo y la salud",
            "tier": 1
          },
          {
            "word": "an+�lisis",
            "definition": "Una prueba m+�dica para ver c+�mo est+� tu cuerpo.",
            "example": "Le hicieron un an+�lisis de sangre para ver si estaba enfermo.",
            "category": "el cuerpo y la salud",
            "tier": 1
          },
          {
            "word": "vacuna",
            "definition": "Una inyecci+�n que protege al cuerpo de algunas enfermedades.",
            "example": "Le pusieron la vacuna de la gripe en octubre.",
            "category": "el cuerpo y la salud",
            "tier": 1
          }
        ]
      },
      {
        "id": "A-el-cuerpo-y-la-salud-2",
        "bloqueId": "A",
        "category": "el cuerpo y la salud",
        "chunkIndex": 1,
        "chunkCount": 2,
        "tier": 1,
        "words": [
          {
            "word": "muleta",
            "definition": "Un bast+�n que se apoya debajo del brazo para caminar cuando te duele una pierna.",
            "example": "Andaba con muletas despu+�s de romperse un tobillo.",
            "category": "el cuerpo y la salud",
            "tier": 1
          },
          {
            "word": "rehabilitaci+�n",
            "definition": "Un conjunto de ejercicios para recuperar el cuerpo despu+�s de una lesi+�n.",
            "example": "Hace rehabilitaci+�n dos veces por semana para mover mejor el brazo.",
            "category": "el cuerpo y la salud",
            "tier": 1
          }
        ]
      },
      {
        "id": "A-el-dinero-y-las-compras-1",
        "bloqueId": "A",
        "category": "el dinero y las compras",
        "chunkIndex": 0,
        "chunkCount": 2,
        "tier": 2,
        "words": [
          {
            "word": "precio",
            "definition": "El dinero que cuesta algo.",
            "example": "El precio de esta camisa es de veinte euros.",
            "category": "el dinero y las compras",
            "tier": 2
          },
          {
            "word": "descuento",
            "definition": "Una cantidad de dinero que te quitan del precio.",
            "example": "Con el descuento, la televisi+�n cost+� la mitad.",
            "category": "el dinero y las compras",
            "tier": 2
          },
          {
            "word": "factura",
            "definition": "Un papel que dice cu+�nto tienes que pagar y por qu+�.",
            "example": "Recibi+� la factura de la luz por correo electr+�nico.",
            "category": "el dinero y las compras",
            "tier": 2
          },
          {
            "word": "recibo",
            "definition": "Un papel peque+�o que demuestra que has pagado algo.",
            "example": "Guard+� el recibo de la compra por si tiene que devolverla.",
            "category": "el dinero y las compras",
            "tier": 2
          },
          {
            "word": "deuda",
            "definition": "Dinero que le debes a alguien y a+�n no has pagado.",
            "example": "Tiene una deuda con el banco por el pr+�stamo del coche.",
            "category": "el dinero y las compras",
            "tier": 2
          },
          {
            "word": "ahorro",
            "definition": "Dinero que guardas en lugar de gastarlo, para usarlo m+�s tarde.",
            "example": "Cada mes aparta algo de dinero como ahorro.",
            "category": "el dinero y las compras",
            "tier": 2
          },
          {
            "word": "pr+�stamo",
            "definition": "Dinero que te deja una entidad y que tienes que devolver despu+�s.",
            "example": "Pidi+� un pr+�stamo al banco para reformar la cocina.",
            "category": "el dinero y las compras",
            "tier": 2
          },
          {
            "word": "cuota",
            "definition": "Una cantidad de dinero que se paga cada cierto tiempo.",
            "example": "Paga una cuota mensual al gimnasio para poder ir.",
            "category": "el dinero y las compras",
            "tier": 2
          }
        ]
      },
      {
        "id": "A-el-dinero-y-las-compras-2",
        "bloqueId": "A",
        "category": "el dinero y las compras",
        "chunkIndex": 1,
        "chunkCount": 2,
        "tier": 2,
        "words": [
          {
            "word": "cambio",
            "definition": "Lo que te devuelven cuando pagas con dinero de m+�s.",
            "example": "Si pagas con un billete de veinte y cuesta doce, te dan ocho de cambio.",
            "category": "el dinero y las compras",
            "tier": 2
          },
          {
            "word": "garant+�a",
            "definition": "La promesa de que algo se arregla o se cambia si se rompe en un tiempo.",
            "example": "El m+�vil tiene dos a+�os de garant+�a.",
            "category": "el dinero y las compras",
            "tier": 2
          }
        ]
      },
      {
        "id": "A-el-tiempo-y-el-calendario-1",
        "bloqueId": "A",
        "category": "el tiempo y el calendario",
        "chunkIndex": 0,
        "chunkCount": 2,
        "tier": 2,
        "words": [
          {
            "word": "calendario",
            "definition": "Una tabla con los d+�as, semanas y meses del a+�o.",
            "example": "Mira el calendario para saber qu+� d+�a es hoy.",
            "category": "el tiempo y el calendario",
            "tier": 2
          },
          {
            "word": "cita previa",
            "definition": "El acuerdo de ir a un sitio un d+�a y hora que se ha decidido antes.",
            "example": "Pidi+� cita previa en el m+�dico por internet.",
            "category": "el tiempo y el calendario",
            "tier": 2
          },
          {
            "word": "plazo",
            "definition": "El tiempo que tienes para hacer algo antes de que se acabe.",
            "example": "El plazo para entregar el formulario termina el viernes.",
            "category": "el tiempo y el calendario",
            "tier": 2
          },
          {
            "word": "retraso",
            "definition": "Cuando algo pasa m+�s tarde de la hora prevista.",
            "example": "El tren lleg+� con veinte minutos de retraso.",
            "category": "el tiempo y el calendario",
            "tier": 2
          },
          {
            "word": "antelaci+�n",
            "definition": "Tiempo de antes con el que preparas o avisas de algo.",
            "example": "Hay que avisar con una semana de antelaci+�n para cambiar la cita.",
            "category": "el tiempo y el calendario",
            "tier": 2
          },
          {
            "word": "vencimiento",
            "definition": "El d+�a en que algo deja de ser v+�lido o se tiene que pagar.",
            "example": "La fecha de vencimiento del carn+� es en mayo.",
            "category": "el tiempo y el calendario",
            "tier": 2
          },
          {
            "word": "aniversario",
            "definition": "El d+�a del a+�o en que se cumple otro a+�o de un hecho importante.",
            "example": "Celebraron el aniversario de bodas con una cena.",
            "category": "el tiempo y el calendario",
            "tier": 2
          },
          {
            "word": "turno",
            "definition": "El momento que te toca a ti entre varias personas.",
            "example": "Cuando sea tu turno, pasa a la consulta.",
            "category": "el tiempo y el calendario",
            "tier": 2
          }
        ]
      },
      {
        "id": "A-el-tiempo-y-el-calendario-2",
        "bloqueId": "A",
        "category": "el tiempo y el calendario",
        "chunkIndex": 1,
        "chunkCount": 2,
        "tier": 2,
        "words": [
          {
            "word": "horario",
            "definition": "La lista de las horas a las que se hace cada cosa.",
            "example": "El horario del autob+�s est+� pegado en la parada.",
            "category": "el tiempo y el calendario",
            "tier": 2
          },
          {
            "word": "frecuencia",
            "definition": "Las veces que algo pasa en un periodo de tiempo.",
            "example": "La frecuencia del tren es cada quince minutos.",
            "category": "el tiempo y el calendario",
            "tier": 2
          }
        ]
      },
      {
        "id": "A-los-viajes-y-los-lugares-1",
        "bloqueId": "A",
        "category": "los viajes y los lugares",
        "chunkIndex": 0,
        "chunkCount": 2,
        "tier": 2,
        "words": [
          {
            "word": "itinerario",
            "definition": "El camino que se sigue para llegar de un sitio a otro.",
            "example": "El itinerario del viaje pasa por tres ciudades.",
            "category": "los viajes y los lugares",
            "tier": 2
          },
          {
            "word": "destino",
            "definition": "El sitio al que quieres llegar.",
            "example": "El destino del avi+�n es Barcelona.",
            "category": "los viajes y los lugares",
            "tier": 2
          },
          {
            "word": "equipaje",
            "definition": "Las maletas y bolsas que llevas cuando viajas.",
            "example": "Factur+� el equipaje antes de subir al avi+�n.",
            "category": "los viajes y los lugares",
            "tier": 2
          },
          {
            "word": "alojamiento",
            "definition": "El sitio donde te quedas a dormir cuando est+�s de viaje.",
            "example": "Reserv+� el alojamiento en un hotel cerca de la playa.",
            "category": "los viajes y los lugares",
            "tier": 2
          },
          {
            "word": "documentaci+�n",
            "definition": "Los papeles oficiales que necesitas para un viaje, como el DNI o el pasaporte.",
            "example": "Lleva la documentaci+�n en la maleta de mano para ense+�arla al subir al avi+�n.",
            "category": "los viajes y los lugares",
            "tier": 2
          },
          {
            "word": "trayecto",
            "definition": "El camino entre un sitio y otro.",
            "example": "El trayecto de casa al trabajo dura media hora.",
            "category": "los viajes y los lugares",
            "tier": 2
          },
          {
            "word": "turista",
            "definition": "Una persona que visita un lugar por diversi+�n, no para vivir all+�.",
            "example": "En verano la ciudad se llena de turistas.",
            "category": "los viajes y los lugares",
            "tier": 2
          },
          {
            "word": "transbordo",
            "definition": "Bajar de un transporte y subir a otro para seguir el viaje.",
            "example": "Hacemos transbordo en Madrid para coger el tren a Sevilla.",
            "category": "los viajes y los lugares",
            "tier": 2
          }
        ]
      },
      {
        "id": "A-los-viajes-y-los-lugares-2",
        "bloqueId": "A",
        "category": "los viajes y los lugares",
        "chunkIndex": 1,
        "chunkCount": 2,
        "tier": 2,
        "words": [
          {
            "word": "and+�n",
            "definition": "La zona alargada y elevada desde donde se sube al tren.",
            "example": "El tren espera en el and+�n n+�mero tres.",
            "category": "los viajes y los lugares",
            "tier": 2
          },
          {
            "word": "frontera",
            "definition": "La l+�nea que separa un pa+�s de otro.",
            "example": "Pasaron la frontera entre Espa+�a y Francia por la tarde.",
            "category": "los viajes y los lugares",
            "tier": 2
          }
        ]
      },
      {
        "id": "A-la-tecnologia-y-la-comunicacion-1",
        "bloqueId": "A",
        "category": "la tecnolog+�a y la comunicaci+�n",
        "chunkIndex": 0,
        "chunkCount": 2,
        "tier": 3,
        "words": [
          {
            "word": "contrase+�a",
            "definition": "Una palabra secreta que se usa para entrar en una cuenta o aparato.",
            "example": "Cambi+� la contrase+�a del banco despu+�s de leer sobre seguridad.",
            "category": "la tecnolog+�a y la comunicaci+�n",
            "tier": 3
          },
          {
            "word": "wifi",
            "definition": "La se+�al sin cables que permite conectarse a internet.",
            "example": "Pidi+� la clave del wifi del bar para navegar con el m+�vil.",
            "category": "la tecnolog+�a y la comunicaci+�n",
            "tier": 3
          },
          {
            "word": "descarga",
            "definition": "Pasar un archivo de internet a tu aparato para usarlo sin conexi+�n.",
            "example": "Hizo la descarga de la aplicaci+�n en su m+�vil.",
            "category": "la tecnolog+�a y la comunicaci+�n",
            "tier": 3
          },
          {
            "word": "pantalla",
            "definition": "La superficie del ordenador o del m+�vil donde se ven las im+�genes.",
            "example": "Se le rompi+� la pantalla del m+�vil y necesita arreglarla.",
            "category": "la tecnolog+�a y la comunicaci+�n",
            "tier": 3
          },
          {
            "word": "notificaci+�n",
            "definition": "Un aviso que aparece en la pantalla para decirte algo.",
            "example": "Le lleg+� una notificaci+�n del banco por un cargo en la cuenta.",
            "category": "la tecnolog+�a y la comunicaci+�n",
            "tier": 3
          },
          {
            "word": "videollamada",
            "definition": "Una llamada donde te ves y te oyes por una pantalla.",
            "example": "Hicieron una videollamada con la familia que vive lejos.",
            "category": "la tecnolog+�a y la comunicaci+�n",
            "tier": 3
          },
          {
            "word": "adjuntar",
            "definition": "Poner un archivo junto a un mensaje para que la otra persona lo reciba.",
            "example": "Adjunt+� la foto del documento al correo electr+�nico.",
            "category": "la tecnolog+�a y la comunicaci+�n",
            "tier": 3
          },
          {
            "word": "borrador",
            "definition": "Un mensaje que a+�n no has enviado y que guardas para terminar luego.",
            "example": "Guardo el correo en borradores para repasarlo antes de enviarlo.",
            "category": "la tecnolog+�a y la comunicaci+�n",
            "tier": 3
          }
        ]
      },
      {
        "id": "A-la-tecnologia-y-la-comunicacion-2",
        "bloqueId": "A",
        "category": "la tecnolog+�a y la comunicaci+�n",
        "chunkIndex": 1,
        "chunkCount": 2,
        "tier": 3,
        "words": [
          {
            "word": "red social",
            "definition": "Una p+�gina de internet donde la gente comparte cosas y se relaciona.",
            "example": "Sube fotos de sus paseos a una red social.",
            "category": "la tecnolog+�a y la comunicaci+�n",
            "tier": 3
          },
          {
            "word": "navegar",
            "definition": "Buscar y ver cosas en internet.",
            "example": "Naveg+� por internet buscando horarios de autob+�s.",
            "category": "la tecnolog+�a y la comunicaci+�n",
            "tier": 3
          }
        ]
      },
      {
        "id": "A-los-derechos-y-la-convivencia-1",
        "bloqueId": "A",
        "category": "los derechos y la convivencia",
        "chunkIndex": 0,
        "chunkCount": 2,
        "tier": 3,
        "words": [
          {
            "word": "derecho",
            "definition": "Algo que la ley dice que toda persona puede tener o hacer.",
            "example": "El derecho a votar es de todas las personas mayores de edad.",
            "category": "los derechos y la convivencia",
            "tier": 3
          },
          {
            "word": "deber",
            "definition": "Algo que tienes que hacer por ley o por compromiso.",
            "example": "Es un deber pagar los impuestos al Estado.",
            "category": "los derechos y la convivencia",
            "tier": 3
          },
          {
            "word": "igualdad",
            "definition": "Tratar a todas las personas de la misma manera, sin favoritismos.",
            "example": "La igualdad entre hombres y mujeres es un principio b+�sico.",
            "category": "los derechos y la convivencia",
            "tier": 3
          },
          {
            "word": "respeto",
            "definition": "Tratar a los dem+�s con educaci+�n, sin ofender ni molestar.",
            "example": "Habl+� con respeto aunque no estaba de acuerdo.",
            "category": "los derechos y la convivencia",
            "tier": 3
          },
          {
            "word": "conflicto",
            "definition": "Una pelea o desacuerdo entre personas o grupos.",
            "example": "Intentaron resolver el conflicto hablando en lugar de gritar.",
            "category": "los derechos y la convivencia",
            "tier": 3
          },
          {
            "word": "mediador",
            "definition": "Una persona que ayuda a que dos partes se entiendan.",
            "example": "Un mediador habl+� con los vecinos para llegar a un acuerdo.",
            "category": "los derechos y la convivencia",
            "tier": 3
          },
          {
            "word": "denuncia",
            "definition": "Un aviso oficial que se hace a la polic+�a cuando pasa algo ilegal.",
            "example": "Puso una denuncia porque le hab+�an robado la bicicleta.",
            "category": "los derechos y la convivencia",
            "tier": 3
          },
          {
            "word": "testigo",
            "definition": "Una persona que vio pasar algo y puede contarlo.",
            "example": "La testigo cont+� a la polic+�a lo que hab+�a visto.",
            "category": "los derechos y la convivencia",
            "tier": 3
          }
        ]
      },
      {
        "id": "A-los-derechos-y-la-convivencia-2",
        "bloqueId": "A",
        "category": "los derechos y la convivencia",
        "chunkIndex": 1,
        "chunkCount": 2,
        "tier": 3,
        "words": [
          {
            "word": "consentimiento",
            "definition": "Decir que s+� de forma clara a algo que afecta a tu cuerpo o a tus cosas.",
            "example": "El m+�dico pidi+� su consentimiento antes de operarla.",
            "category": "los derechos y la convivencia",
            "tier": 3
          },
          {
            "word": "intimidad",
            "definition": "La parte privada de tu vida que solo compartes si quieres.",
            "example": "Respet+� su intimidad y no abri+� sus cartas.",
            "category": "los derechos y la convivencia",
            "tier": 3
          }
        ]
      },
      {
        "id": "A-pensar-y-aprender-1",
        "bloqueId": "A",
        "category": "pensar y aprender",
        "chunkIndex": 0,
        "chunkCount": 2,
        "tier": 4,
        "words": [
          {
            "word": "aprender",
            "definition": "Conseguir un conocimiento o habilidad nuevos con pr+�ctica.",
            "example": "Aprendi+� a montar en bicicleta con su hermano mayor.",
            "category": "pensar y aprender",
            "tier": 4
          },
          {
            "word": "ense+�ar",
            "definition": "Mostrar a alguien algo para que lo entienda o lo sepa hacer.",
            "example": "La profesora ense+�a a leer a los ni+�os con cuentos.",
            "category": "pensar y aprender",
            "tier": 4
          },
          {
            "word": "recordar",
            "definition": "Tener algo en la memoria, ser capaz de decirlo otra vez.",
            "example": "No recuerda d+�nde dej+� las llaves esta ma+�ana.",
            "category": "pensar y aprender",
            "tier": 4
          },
          {
            "word": "olvidar",
            "definition": "Dejar de tener algo en la memoria, no ser capaz de recordarlo.",
            "example": "Olvid+� comprar el pan al salir del trabajo.",
            "category": "pensar y aprender",
            "tier": 4
          },
          {
            "word": "entender",
            "definition": "Comprender el sentido de algo, saber qu+� quiere decir.",
            "example": "No entendi+� las instrucciones del electrodom+�stico.",
            "category": "pensar y aprender",
            "tier": 4
          },
          {
            "word": "reflexionar",
            "definition": "Pensar despacio sobre algo para sacar conclusiones.",
            "example": "Se sent+� a reflexionar antes de tomar la decisi+�n.",
            "category": "pensar y aprender",
            "tier": 4
          },
          {
            "word": "dudar",
            "definition": "No estar seguro de algo, pensar que puede ser de varias formas.",
            "example": "Dudo entre ir al cine o quedarme en casa.",
            "category": "pensar y aprender",
            "tier": 4
          },
          {
            "word": "imaginar",
            "definition": "Pensar algo que no ha pasado o que no existe, como una historia.",
            "example": "Le gusta imaginar c+�mo ser+�a vivir en otra ciudad.",
            "category": "pensar y aprender",
            "tier": 4
          }
        ]
      },
      {
        "id": "A-pensar-y-aprender-2",
        "bloqueId": "A",
        "category": "pensar y aprender",
        "chunkIndex": 1,
        "chunkCount": 2,
        "tier": 4,
        "words": [
          {
            "word": "observar",
            "definition": "Mirar algo con atenci+�n para entenderlo mejor.",
            "example": "Observ+� las nubes un rato antes de decir que iba a llover.",
            "category": "pensar y aprender",
            "tier": 4
          },
          {
            "word": "comparar",
            "definition": "Mirar dos cosas juntas para ver en qu+� se parecen y en qu+� se diferencian.",
            "example": "Compar+� los precios de dos tiendas antes de comprar.",
            "category": "pensar y aprender",
            "tier": 4
          }
        ]
      },
      {
        "id": "A-acciones-del-dia-a-dia-avanzado-1",
        "bloqueId": "A",
        "category": "acciones del d+�a a d+�a (avanzado)",
        "chunkIndex": 0,
        "chunkCount": 2,
        "tier": 4,
        "words": [
          {
            "word": "encargarse",
            "definition": "Hacerse cargo de algo, ocuparse de que se haga bien.",
            "example": "Ella se encarga de pedir la cita del m+�dico.",
            "category": "acciones del d+�a a d+�a (avanzado)",
            "tier": 4
          },
          {
            "word": "enterarse",
            "definition": "Llegar a saber algo que pasaba, conocer la noticia.",
            "example": "Se enter+� del cambio de hora por la radio.",
            "category": "acciones del d+�a a d+�a (avanzado)",
            "tier": 4
          },
          {
            "word": "atreverse",
            "definition": "Ser capaz de hacer algo que da miedo o verg++enza.",
            "example": "Se atrevi+� a hablar en p+�blico por primera vez.",
            "category": "acciones del d+�a a d+�a (avanzado)",
            "tier": 4
          },
          {
            "word": "quejarse",
            "definition": "Decir que algo no te gusta o que te molesta.",
            "example": "Se quej+� del ruido de la obra de al lado.",
            "category": "acciones del d+�a a d+�a (avanzado)",
            "tier": 4
          },
          {
            "word": "arrepentirse",
            "definition": "Sentir que ojal+� no hubieras hecho algo.",
            "example": "Se arrepinti+� de no haber ido a la cita del m+�dico.",
            "category": "acciones del d+�a a d+�a (avanzado)",
            "tier": 4
          },
          {
            "word": "esforzarse",
            "definition": "Poner mucho empe+�o en algo para que salga bien.",
            "example": "Se esforz+� mucho y aprob+� el examen a la primera.",
            "category": "acciones del d+�a a d+�a (avanzado)",
            "tier": 4
          },
          {
            "word": "fijarse",
            "definition": "Poner atenci+�n en algo que se ve o se oye.",
            "example": "No se fij+� en el cartel y se pas+� la parada.",
            "category": "acciones del d+�a a d+�a (avanzado)",
            "tier": 4
          },
          {
            "word": "asumir",
            "definition": "Aceptar una responsabilidad o una consecuencia.",
            "example": "Asumi+� las consecuencias de llegar tarde al trabajo.",
            "category": "acciones del d+�a a d+�a (avanzado)",
            "tier": 4
          }
        ]
      },
      {
        "id": "A-acciones-del-dia-a-dia-avanzado-2",
        "bloqueId": "A",
        "category": "acciones del d+�a a d+�a (avanzado)",
        "chunkIndex": 1,
        "chunkCount": 2,
        "tier": 4,
        "words": [
          {
            "word": "someterse",
            "definition": "Hacerse una prueba m+�dica o un tratamiento que te han indicado.",
            "example": "Se someti+� a una revisi+�n m+�dica el mes pasado.",
            "category": "acciones del d+�a a d+�a (avanzado)",
            "tier": 4
          },
          {
            "word": "beneficiarse",
            "definition": "Recibir algo bueno que te ayuda o te mejora.",
            "example": "Se benefici+� de una ayuda del Gobierno para pagar el alquiler.",
            "category": "acciones del d+�a a d+�a (avanzado)",
            "tier": 4
          }
        ]
      }
    ]
  },
  {
    "id": "B",
    "nombre": {
      "es": "Vida adulta aut+�noma",
      "en": "Autonomous adult life"
    },
    "categorias": [
      "vida cotidiana y apoyos",
      "derechos y autodefensa",
      "salud, citas y consentimiento",
      "servicios sociales y ayudas",
      "seguridad y emergencias",
      "dinero y fraudes",
      "trabajo con apoyo",
      "emociones avanzadas y relaciones",
      "contratos y firmas",
      "herencias y testamentos",
      "facturas y recibos del hogar",
      "formas de pago y cuentas",
      "ingresos y gastos del hogar",
      "vida independiente y hogar",
      "transporte y ciudad",
      "alimentaci+�n y cocina"
    ],
    "rondas": [
      {
        "id": "B-vida-cotidiana-y-apoyos",
        "bloqueId": "B",
        "category": "vida cotidiana y apoyos",
        "chunkIndex": 0,
        "chunkCount": 1,
        "tier": 2,
        "words": [
          {
            "word": "derecho",
            "definition": "Algo que toda persona puede pedir o hacer porque la ley lo reconoce.",
            "example": "Tienes derecho a que te escuchen y a que te traten con respeto.",
            "category": "vida cotidiana y apoyos",
            "tier": 2
          },
          {
            "word": "intimidad",
            "definition": "Lo privado de cada persona: su cuerpo, sus cosas y sus mensajes.",
            "example": "No abras mis mensajes sin permiso: respeta mi intimidad.",
            "category": "vida cotidiana y apoyos",
            "tier": 2
          },
          {
            "word": "asociaci+�n de vecinos",
            "definition": "Un grupo de personas del barrio que se unen para cuidar los asuntos comunes.",
            "example": "La asociaci+�n de vecinos organiza la fiesta del barrio cada a+�o.",
            "category": "vida cotidiana y apoyos",
            "tier": 2
          },
          {
            "word": "servicio de atenci+�n",
            "definition": "Un lugar al que se llama para preguntar o pedir una ayuda concreta.",
            "example": "Llam+� al servicio de atenci+�n al cliente para resolver su duda.",
            "category": "vida cotidiana y apoyos",
            "tier": 2
          },
          {
            "word": "cita previa",
            "definition": "Un acuerdo para ir a un sitio a una hora y d+�a concretos.",
            "example": "Pidi+� cita previa en el m+�dico para el martes por la tarde.",
            "category": "vida cotidiana y apoyos",
            "tier": 2
          },
          {
            "word": "queja",
            "definition": "Lo que dices cuando algo no te ha gustado o no se ha hecho bien.",
            "example": "Puso una queja porque la factura vino con un cargo que no esperaba.",
            "category": "vida cotidiana y apoyos",
            "tier": 2
          },
          {
            "word": "presupuesto",
            "definition": "Una lista previa de lo que cuesta algo antes de hacerlo.",
            "example": "Pidi+� un presupuesto antes de empezar la obra en casa.",
            "category": "vida cotidiana y apoyos",
            "tier": 2
          },
          {
            "word": "recibo",
            "definition": "Un papel que demuestra que has pagado algo.",
            "example": "Guarda el recibo por si luego tienes que reclamar.",
            "category": "vida cotidiana y apoyos",
            "tier": 2
          }
        ]
      },
      {
        "id": "B-derechos-y-autodefensa",
        "bloqueId": "B",
        "category": "derechos y autodefensa",
        "chunkIndex": 0,
        "chunkCount": 1,
        "tier": 3,
        "words": [
          {
            "word": "derechos humanos",
            "definition": "Las cosas b+�sicas que todas las personas tienen solo por ser personas.",
            "example": "La libertad y el respeto son derechos humanos.",
            "category": "derechos y autodefensa",
            "tier": 3
          },
          {
            "word": "dignidad",
            "definition": "El valor que tiene cada persona solo por ser persona, y que debe respetarse.",
            "example": "Le trataron con dignidad en todo momento.",
            "category": "derechos y autodefensa",
            "tier": 3
          },
          {
            "word": "defensor",
            "definition": "Una persona que habla en tu nombre o te ayuda a defender tus derechos.",
            "example": "La defensora del pueblo escucha los problemas de los ciudadanos.",
            "category": "derechos y autodefensa",
            "tier": 3
          },
          {
            "word": "abogado",
            "definition": "La persona que te aconseja y te defiende ante la ley.",
            "example": "Habl+� con su abogado antes de firmar el contrato.",
            "category": "derechos y autodefensa",
            "tier": 3
          },
          {
            "word": "queja",
            "definition": "Decir de forma oficial que algo no est+� bien o que no te han tratado bien.",
            "example": "Puso una queja en el hospital por la mala atenci+�n recibida.",
            "category": "derechos y autodefensa",
            "tier": 3
          },
          {
            "word": "reclamaci+�n",
            "definition": "Pedir por escrito que se solucione algo que no se hizo bien.",
            "example": "Envi+� una reclamaci+�n a la empresa porque le cobraron de m+�s.",
            "category": "derechos y autodefensa",
            "tier": 3
          }
        ]
      },
      {
        "id": "B-salud-citas-y-consentimiento",
        "bloqueId": "B",
        "category": "salud, citas y consentimiento",
        "chunkIndex": 0,
        "chunkCount": 1,
        "tier": 3,
        "words": [
          {
            "word": "consentimiento informado",
            "definition": "Cuando el m+�dico te explica un tratamiento y t+� aceptas hacerlo.",
            "example": "Firm+� el consentimiento informado antes de la operaci+�n.",
            "category": "salud, citas y consentimiento",
            "tier": 3
          },
          {
            "word": "diagn+�stico",
            "definition": "Lo que dice el m+�dico sobre qu+� enfermedad tienes.",
            "example": "El diagn+�stico fue diabetes: tiene que cuidar el az+�car.",
            "category": "salud, citas y consentimiento",
            "tier": 3
          },
          {
            "word": "tratamiento",
            "definition": "Lo que hace el m+�dico o lo que tomas para curarte o estar mejor.",
            "example": "El tratamiento son pastillas cada d+�a durante un mes.",
            "category": "salud, citas y consentimiento",
            "tier": 3
          },
          {
            "word": "efecto secundario",
            "definition": "Una molestia que causa una medicina y que no es lo principal que cura.",
            "example": "Esta pastilla me da sue+�o como efecto secundario.",
            "category": "salud, citas y consentimiento",
            "tier": 3
          },
          {
            "word": "anestesia",
            "definition": "Una medicina que te duerme una parte del cuerpo para no sentir dolor.",
            "example": "Le pusieron anestesia antes de sacarle la muela.",
            "category": "salud, citas y consentimiento",
            "tier": 3
          },
          {
            "word": "hospital",
            "definition": "Un edificio grande donde atienden a personas enfermas o heridas.",
            "example": "Estuvo en el hospital tres d+�as tras la operaci+�n.",
            "category": "salud, citas y consentimiento",
            "tier": 3
          },
          {
            "word": "ambulancia",
            "definition": "Un veh+�culo que lleva a personas enfermas o heridas al hospital.",
            "example": "La ambulancia lleg+� en cinco minutos.",
            "category": "salud, citas y consentimiento",
            "tier": 3
          },
          {
            "word": "historial m+�dico",
            "definition": "El papel donde se guardan todas las enfermedades y visitas al m+�dico.",
            "example": "El m+�dico mir+� su historial m+�dico antes de recetarle.",
            "category": "salud, citas y consentimiento",
            "tier": 3
          }
        ]
      },
      {
        "id": "B-servicios-sociales-y-ayudas-1",
        "bloqueId": "B",
        "category": "servicios sociales y ayudas",
        "chunkIndex": 0,
        "chunkCount": 2,
        "tier": 3,
        "words": [
          {
            "word": "servicios sociales",
            "definition": "El conjunto de ayudas que da el Estado a las personas que lo necesitan.",
            "example": "Pidi+� ayuda a servicios sociales para pagar el alquiler.",
            "category": "servicios sociales y ayudas",
            "tier": 3
          },
          {
            "word": "dependencia",
            "definition": "Cuando una persona necesita ayuda para hacer las tareas de la vida diaria.",
            "example": "Le reconocieron la dependencia tras la valoraci+�n.",
            "category": "servicios sociales y ayudas",
            "tier": 3
          },
          {
            "word": "ayuda a domicilio",
            "definition": "Una persona que va a tu casa a ayudarte con las tareas de cada d+�a.",
            "example": "Recibe ayuda a domicilio para limpiar y cocinar.",
            "category": "servicios sociales y ayudas",
            "tier": 3
          },
          {
            "word": "teleasistencia",
            "definition": "Un servicio con un bot+�n para pedir ayuda en casa si te pasa algo.",
            "example": "Pulsa el bot+�n de teleasistencia si se cae en casa.",
            "category": "servicios sociales y ayudas",
            "tier": 3
          },
          {
            "word": "prestaci+�n",
            "definition": "Una ayuda econ+�mica o un servicio que da el Estado a quien lo necesita.",
            "example": "Cobra una prestaci+�n por hijo a cargo.",
            "category": "servicios sociales y ayudas",
            "tier": 3
          },
          {
            "word": "solicitar",
            "definition": "Pedir algo por escrito de forma oficial.",
            "example": "Solicit+� la beca en el Ayuntamiento.",
            "category": "servicios sociales y ayudas",
            "tier": 3
          },
          {
            "word": "valoraci+�n",
            "definition": "Cuando un profesional eval+�a tu situaci+�n para ver qu+� ayuda necesitas.",
            "example": "Tras la valoraci+�n, le dieron el grado de dependencia.",
            "category": "servicios sociales y ayudas",
            "tier": 3
          },
          {
            "word": "subsidio",
            "definition": "Una ayuda econ+�mica que da el Estado a quien cumple unas condiciones.",
            "example": "Cobra un subsidio de desempleo mientras busca trabajo.",
            "category": "servicios sociales y ayudas",
            "tier": 3
          }
        ]
      },
      {
        "id": "B-servicios-sociales-y-ayudas-2",
        "bloqueId": "B",
        "category": "servicios sociales y ayudas",
        "chunkIndex": 1,
        "chunkCount": 2,
        "tier": 3,
        "words": [
          {
            "word": "baremo",
            "definition": "Una lista de puntos que se usa para decidir cu+�nto ayuda recibe una persona.",
            "example": "Seg+�n el baremo, le corresponden tres horas de ayuda.",
            "category": "servicios sociales y ayudas",
            "tier": 3
          }
        ]
      },
      {
        "id": "B-seguridad-y-emergencias-1",
        "bloqueId": "B",
        "category": "seguridad y emergencias",
        "chunkIndex": 0,
        "chunkCount": 2,
        "tier": 2,
        "words": [
          {
            "word": "emergencia",
            "definition": "Una situaci+�n grave que necesita ayuda r+�pida.",
            "example": "Llama al 112 si tienes una emergencia.",
            "category": "seguridad y emergencias",
            "tier": 2
          },
          {
            "word": "112",
            "definition": "El n+�mero de tel+�fono al que se llama en Europa para pedir ayuda urgente.",
            "example": "Llama al 112 si ves un fuego o un accidente.",
            "category": "seguridad y emergencias",
            "tier": 2
          },
          {
            "word": "polic+�a",
            "definition": "Las personas que velan por la seguridad y la ley en un lugar.",
            "example": "Llam+� a la polic+�a cuando oy+� un ruido extra+�o.",
            "category": "seguridad y emergencias",
            "tier": 2
          },
          {
            "word": "bombero",
            "definition": "La persona que apaga fuegos y rescata a personas en accidentes.",
            "example": "Los bomberos sacaron al gato del +�rbol.",
            "category": "seguridad y emergencias",
            "tier": 2
          },
          {
            "word": "accidente",
            "definition": "Algo malo que pasa sin querer y causa da+�o.",
            "example": "Tuvo un accidente de coche en la carretera.",
            "category": "seguridad y emergencias",
            "tier": 2
          },
          {
            "word": "peligro",
            "definition": "Algo que puede hacerte da+�o.",
            "example": "El cartel avisa del peligro de ca+�da de piedras.",
            "category": "seguridad y emergencias",
            "tier": 2
          },
          {
            "word": "primeros auxilios",
            "definition": "La ayuda que se le da a alguien herido antes de que llegue el m+�dico.",
            "example": "Le hizo los primeros auxilios hasta que vino la ambulancia.",
            "category": "seguridad y emergencias",
            "tier": 2
          },
          {
            "word": "robo",
            "definition": "Cuando alguien se lleva tus cosas sin permiso.",
            "example": "Puso una denuncia por el robo del bolso.",
            "category": "seguridad y emergencias",
            "tier": 2
          }
        ]
      },
      {
        "id": "B-seguridad-y-emergencias-2",
        "bloqueId": "B",
        "category": "seguridad y emergencias",
        "chunkIndex": 1,
        "chunkCount": 2,
        "tier": 2,
        "words": [
          {
            "word": "alarma",
            "definition": "Un aviso fuerte que suena para avisar de un peligro.",
            "example": "La alarma del coche son+� al abrir la puerta.",
            "category": "seguridad y emergencias",
            "tier": 2
          },
          {
            "word": "evacuar",
            "definition": "Salir r+�pido de un lugar porque hay un peligro.",
            "example": "Tuvieron que evacuar el edificio por el fuego.",
            "category": "seguridad y emergencias",
            "tier": 2
          }
        ]
      },
      {
        "id": "B-dinero-y-fraudes-1",
        "bloqueId": "B",
        "category": "dinero y fraudes",
        "chunkIndex": 0,
        "chunkCount": 2,
        "tier": 3,
        "words": [
          {
            "word": "banco",
            "definition": "Una entidad donde se guarda dinero y se hacen tr+�mites de dinero.",
            "example": "Va al banco una vez al mes a ingresar la paga.",
            "category": "dinero y fraudes",
            "tier": 3
          },
          {
            "word": "cuenta bancaria",
            "definition": "Un sitio en el banco donde se guarda tu dinero.",
            "example": "Cobra la pensi+�n en su cuenta bancaria.",
            "category": "dinero y fraudes",
            "tier": 3
          },
          {
            "word": "cajero",
            "definition": "Una m+�quina del banco que da o recibe dinero.",
            "example": "Sac+� dinero del cajero con su tarjeta.",
            "category": "dinero y fraudes",
            "tier": 3
          },
          {
            "word": "tarjeta",
            "definition": "Una pieza de pl+�stico con tu nombre que sirve para pagar sin dinero en mano.",
            "example": "Pag+� con la tarjeta en el supermercado.",
            "category": "dinero y fraudes",
            "tier": 3
          },
          {
            "word": "transferencia",
            "definition": "Pasar dinero de una cuenta a otra.",
            "example": "Hizo una transferencia al hijo para pagar el alquiler.",
            "category": "dinero y fraudes",
            "tier": 3
          },
          {
            "word": "estafa",
            "definition": "Enga+�ar a alguien para quedarse con su dinero.",
            "example": "Le estafaron por internet con un premio falso.",
            "category": "dinero y fraudes",
            "tier": 3
          },
          {
            "word": "fraude",
            "definition": "Enga+�ar a otra persona o a una empresa para conseguir un beneficio.",
            "example": "Lo condenaron por fraude fiscal: no declar+� todo su dinero.",
            "category": "dinero y fraudes",
            "tier": 3
          },
          {
            "word": "phishing",
            "definition": "Un enga+�o por internet que intenta sacarte datos o dinero.",
            "example": "No abri+� el mensaje: era un intento de phishing.",
            "category": "dinero y fraudes",
            "tier": 3
          }
        ]
      },
      {
        "id": "B-dinero-y-fraudes-2",
        "bloqueId": "B",
        "category": "dinero y fraudes",
        "chunkIndex": 1,
        "chunkCount": 2,
        "tier": 3,
        "words": [
          {
            "word": "robo de identidad",
            "definition": "Cuando alguien usa tus datos personales para hacerse pasar por ti.",
            "example": "Sufr+�o un robo de identidad: pidieron un pr+�stamo con su nombre.",
            "category": "dinero y fraudes",
            "tier": 3
          }
        ]
      },
      {
        "id": "B-trabajo-con-apoyo-1",
        "bloqueId": "B",
        "category": "trabajo con apoyo",
        "chunkIndex": 0,
        "chunkCount": 2,
        "tier": 4,
        "words": [
          {
            "word": "curr+�culum",
            "definition": "Un papel con tu experiencia y tus estudios para buscar trabajo.",
            "example": "Llev+� su curr+�culum a la entrevista.",
            "category": "trabajo con apoyo",
            "tier": 4
          },
          {
            "word": "entrevista de trabajo",
            "definition": "Una reuni+�n en la que una empresa decide si te da un trabajo.",
            "example": "Tiene una entrevista de trabajo el jueves.",
            "category": "trabajo con apoyo",
            "tier": 4
          },
          {
            "word": "contrato de trabajo",
            "definition": "Un papel firmado que dice las condiciones de un trabajo.",
            "example": "Firm+� el contrato de trabajo antes de empezar.",
            "category": "trabajo con apoyo",
            "tier": 4
          },
          {
            "word": "jornada laboral",
            "definition": "Las horas que trabajas cada d+�a.",
            "example": "Su jornada laboral es de ocho horas, de nueve a cinco.",
            "category": "trabajo con apoyo",
            "tier": 4
          },
          {
            "word": "preparador laboral",
            "definition": "Una persona que ense+�a y acompa+�a a alguien en su trabajo.",
            "example": "El preparador laboral le ense+�a c+�mo usar la caja registradora.",
            "category": "trabajo con apoyo",
            "tier": 4
          },
          {
            "word": "empleo con apoyo",
            "definition": "Un trabajo normal en el que una persona recibe ayuda para hacerlo bien.",
            "example": "Trabaja en una biblioteca con un empleo con apoyo.",
            "category": "trabajo con apoyo",
            "tier": 4
          },
          {
            "word": "taller ocupacional",
            "definition": "Un sitio donde se aprende un oficio y se hacen tareas adaptadas.",
            "example": "Va al taller ocupacional tres d+�as a la semana.",
            "category": "trabajo con apoyo",
            "tier": 4
          },
          {
            "word": "jubilaci+�n",
            "definition": "El tiempo de la vida en que una persona deja de trabajar por edad.",
            "example": "Con la jubilaci+�n cobra una pensi+�n cada mes.",
            "category": "trabajo con apoyo",
            "tier": 4
          }
        ]
      },
      {
        "id": "B-trabajo-con-apoyo-2",
        "bloqueId": "B",
        "category": "trabajo con apoyo",
        "chunkIndex": 1,
        "chunkCount": 2,
        "tier": 4,
        "words": [
          {
            "word": "pensi+�n",
            "definition": "El dinero que cobra cada mes una persona jubilada o que no puede trabajar.",
            "example": "Cobra una pensi+�n desde que se jubil+�.",
            "category": "trabajo con apoyo",
            "tier": 4
          },
          {
            "word": "sindicato",
            "definition": "Una asociaci+�n que defiende los derechos de los trabajadores.",
            "example": "Se apunt+� al sindicato para tener asesoramiento legal.",
            "category": "trabajo con apoyo",
            "tier": 4
          }
        ]
      },
      {
        "id": "B-emociones-avanzadas-y-relaciones-1",
        "bloqueId": "B",
        "category": "emociones avanzadas y relaciones",
        "chunkIndex": 0,
        "chunkCount": 2,
        "tier": 4,
        "words": [
          {
            "word": "l+�mite",
            "definition": "Una l+�nea que marca hasta d+�nde puedes llegar con alguien.",
            "example": "Es sano poner l+�mites en las relaciones.",
            "category": "emociones avanzadas y relaciones",
            "tier": 4
          },
          {
            "word": "espacio personal",
            "definition": "La distancia que necesitas con otra persona para sentirte c+�modo.",
            "example": "Respeta su espacio personal: no le gusta que le abracen.",
            "category": "emociones avanzadas y relaciones",
            "tier": 4
          },
          {
            "word": "confianza",
            "definition": "Creer en alguien porque sabes que no te va a fallar.",
            "example": "Tiene confianza en su amiga: sabe que guarda sus secretos.",
            "category": "emociones avanzadas y relaciones",
            "tier": 4
          },
          {
            "word": "autoestima",
            "definition": "La buena opini+�n que tienes de ti mismo.",
            "example": "Tras el curso mejor+� su autoestima y se siente m+�s seguro.",
            "category": "emociones avanzadas y relaciones",
            "tier": 4
          },
          {
            "word": "bienestar",
            "definition": "Sentirse bien por dentro, con calma y salud.",
            "example": "Medita cada d+�a para cuidar su bienestar.",
            "category": "emociones avanzadas y relaciones",
            "tier": 4
          },
          {
            "word": "duelo",
            "definition": "La tristeza que se siente cuando muere alguien cercano.",
            "example": "Tras la muerte de su madre, hizo un duelo con ayuda.",
            "category": "emociones avanzadas y relaciones",
            "tier": 4
          },
          {
            "word": "abuso",
            "definition": "Cuando alguien hace da+�o a otra persona de forma repetida.",
            "example": "Pidi+� ayuda por el abuso que sufr+�a en casa.",
            "category": "emociones avanzadas y relaciones",
            "tier": 4
          },
          {
            "word": "maltrato",
            "definition": "Tratar mal a otra persona, con insultos, golpes o desprecio.",
            "example": "Llam+� al tel+�fono contra el maltrato para pedir ayuda.",
            "category": "emociones avanzadas y relaciones",
            "tier": 4
          }
        ]
      },
      {
        "id": "B-emociones-avanzadas-y-relaciones-2",
        "bloqueId": "B",
        "category": "emociones avanzadas y relaciones",
        "chunkIndex": 1,
        "chunkCount": 2,
        "tier": 4,
        "words": [
          {
            "word": "aislamiento",
            "definition": "Estar solo y sin contacto con otras personas durante mucho tiempo.",
            "example": "Tras la mudanza sinti+� un gran aislamiento.",
            "category": "emociones avanzadas y relaciones",
            "tier": 4
          },
          {
            "word": "apoyo emocional",
            "definition": "La ayuda que das a alguien para que se sienta mejor cuando est+� mal.",
            "example": "Su amiga le dio apoyo emocional tras la operaci+�n.",
            "category": "emociones avanzadas y relaciones",
            "tier": 4
          }
        ]
      },
      {
        "id": "B-contratos-y-firmas-1",
        "bloqueId": "B",
        "category": "contratos y firmas",
        "chunkIndex": 0,
        "chunkCount": 2,
        "tier": 3,
        "words": [
          {
            "word": "contrato de alquiler",
            "definition": "Un papel firmado por el due+�o y el inquilino con las condiciones para vivir en una casa de alquiler.",
            "example": "Firm+� el contrato de alquiler por un a+�o.",
            "category": "contratos y firmas",
            "tier": 3
          },
          {
            "word": "firmar",
            "definition": "Poner tu firma en un papel para decir que est+�s de acuerdo con lo que dice.",
            "example": "Tuvo que firmar el contrato antes de empezar el trabajo.",
            "category": "contratos y firmas",
            "tier": 3
          },
          {
            "word": "firma",
            "definition": "El nombre que escribes de tu pu+�o y letra para decir que aceptas un papel.",
            "example": "Puso su firma al final de la carta.",
            "category": "contratos y firmas",
            "tier": 3
          },
          {
            "word": "cl+�usula",
            "definition": "Cada uno de los puntos o reglas que aparecen en un contrato.",
            "example": "Ley+� cada cl+�usula del contrato antes de firmar.",
            "category": "contratos y firmas",
            "tier": 3
          },
          {
            "word": "letra peque+�a",
            "definition": "Las partes de un contrato que est+�n escritas con letra muy chica y son dif+�ciles de leer.",
            "example": "Pregunt+� al abogado qu+� dec+�a la letra peque+�a del seguro.",
            "category": "contratos y firmas",
            "tier": 3
          },
          {
            "word": "condiciones generales",
            "definition": "Las reglas que pone una empresa para usar su servicio o comprar su producto.",
            "example": "Acept+� las condiciones generales antes de abrir la cuenta.",
            "category": "contratos y firmas",
            "tier": 3
          },
          {
            "word": "plazo de pago",
            "definition": "Los d+�as que tienes para pagar una factura antes de que cobre recargo.",
            "example": "El plazo de pago de la factura termina el d+�a 10.",
            "category": "contratos y firmas",
            "tier": 3
          },
          {
            "word": "fecha de vencimiento",
            "definition": "El d+�a en que algo deja de ser v+�lido o se tiene que pagar.",
            "example": "La fecha de vencimiento del carn+� es en mayo.",
            "category": "contratos y firmas",
            "tier": 3
          }
        ]
      },
      {
        "id": "B-contratos-y-firmas-2",
        "bloqueId": "B",
        "category": "contratos y firmas",
        "chunkIndex": 1,
        "chunkCount": 2,
        "tier": 3,
        "words": [
          {
            "word": "rescindir",
            "definition": "Acabar con un contrato antes del tiempo que se hab+�a acordado.",
            "example": "Rescindi+� el contrato del gimnasio por no usarlo.",
            "category": "contratos y firmas",
            "tier": 3
          },
          {
            "word": "renovar contrato",
            "definition": "Volver a firmar un contrato para que siga valiendo por m+�s tiempo.",
            "example": "Renov+� el contrato del alquiler por dos a+�os m+�s.",
            "category": "contratos y firmas",
            "tier": 3
          }
        ]
      },
      {
        "id": "B-herencias-y-testamentos-1",
        "bloqueId": "B",
        "category": "herencias y testamentos",
        "chunkIndex": 0,
        "chunkCount": 2,
        "tier": 4,
        "words": [
          {
            "word": "herencia",
            "definition": "Los bienes y el dinero que deja una persona cuando se muere.",
            "example": "Recibi+� una herencia de su t+�a: una casa y algo de dinero.",
            "category": "herencias y testamentos",
            "tier": 4
          },
          {
            "word": "heredero",
            "definition": "La persona que recibe los bienes de alguien que ha fallecido.",
            "example": "Es la heredera +�nica de la casa de sus padres.",
            "category": "herencias y testamentos",
            "tier": 4
          },
          {
            "word": "testamento",
            "definition": "Un papel firmado donde una persona dice a qui+�n deja sus bienes cuando muera.",
            "example": "Hizo el testamento ante notario antes de operarse.",
            "category": "herencias y testamentos",
            "tier": 4
          },
          {
            "word": "albacea",
            "definition": "La persona que se encarga de cumplir lo que dice un testamento.",
            "example": "Su hermano fue nombrado albacea en el testamento del padre.",
            "category": "herencias y testamentos",
            "tier": 4
          },
          {
            "word": "legado",
            "definition": "Un bien concreto que una persona deja a otra en su testamento.",
            "example": "Le dej+� como legado el reloj de su abuelo.",
            "category": "herencias y testamentos",
            "tier": 4
          },
          {
            "word": "sucesi+�n",
            "definition": "El proceso legal por el que los bienes pasan de una persona fallecida a sus herederos.",
            "example": "La sucesi+�n tard+� un a+�o en resolverse.",
            "category": "herencias y testamentos",
            "tier": 4
          },
          {
            "word": "aceptar herencia",
            "definition": "Decir formalmente que quieres recibir los bienes que te han dejado.",
            "example": "Tuvo que aceptar la herencia en el notario.",
            "category": "herencias y testamentos",
            "tier": 4
          },
          {
            "word": "renunciar a herencia",
            "definition": "Decir formalmente que no quieres recibir los bienes que te han dejado.",
            "example": "Renunci+� a la herencia porque ten+�a muchas deudas.",
            "category": "herencias y testamentos",
            "tier": 4
          }
        ]
      },
      {
        "id": "B-herencias-y-testamentos-2",
        "bloqueId": "B",
        "category": "herencias y testamentos",
        "chunkIndex": 1,
        "chunkCount": 2,
        "tier": 4,
        "words": [
          {
            "word": "notario",
            "definition": "Una persona con autoridad legal que da fe de los papeles oficiales.",
            "example": "Firm+� la herencia delante del notario.",
            "category": "herencias y testamentos",
            "tier": 4
          },
          {
            "word": "escritura p+�blica",
            "definition": "Un papel oficial firmado por un notario que prueba un acuerdo legal.",
            "example": "La escritura p+�blica de la casa est+� en la caja fuerte.",
            "category": "herencias y testamentos",
            "tier": 4
          }
        ]
      },
      {
        "id": "B-facturas-y-recibos-del-hogar-1",
        "bloqueId": "B",
        "category": "facturas y recibos del hogar",
        "chunkIndex": 0,
        "chunkCount": 2,
        "tier": 2,
        "words": [
          {
            "word": "factura de la luz",
            "definition": "El papel donde la empresa de electricidad dice cu+�nta energ+�a has gastado y cu+�nto tienes que pagar.",
            "example": "La factura de la luz de este mes ha subido.",
            "category": "facturas y recibos del hogar",
            "tier": 2
          },
          {
            "word": "recibo digital",
            "definition": "Un papel electr+�nico que demuestra que has pagado, enviado por correo o por una aplicaci+�n.",
            "example": "Me lleg+� el recibo digital de la compra al m+�vil.",
            "category": "facturas y recibos del hogar",
            "tier": 2
          },
          {
            "word": "contador",
            "definition": "El aparato que mide cu+�nta agua, luz o gas se ha gastado en una casa.",
            "example": "El operario pas+� a leer el contador del agua.",
            "category": "facturas y recibos del hogar",
            "tier": 2
          },
          {
            "word": "IBI",
            "definition": "Un impuesto municipal que se paga cada a+�o por ser due+�o de una casa o un piso.",
            "example": "Paga el IBI del piso en el banco antes de junio.",
            "category": "facturas y recibos del hogar",
            "tier": 2
          },
          {
            "word": "gastos comunes",
            "definition": "Los gastos que comparten los vecinos de un edificio, como la luz de la escalera o la limpieza.",
            "example": "Cada vecino paga una cuota para los gastos comunes.",
            "category": "facturas y recibos del hogar",
            "tier": 2
          },
          {
            "word": "comunidad de propietarios",
            "definition": "El grupo formado por todos los due+�os de las casas o pisos de un edificio.",
            "example": "La comunidad de propietarios se re+�ne una vez al a+�o.",
            "category": "facturas y recibos del hogar",
            "tier": 2
          },
          {
            "word": "suministro",
            "definition": "El servicio que llega a una casa, como el agua, la luz o el gas.",
            "example": "Le cortaron el suministro de agua por no pagar.",
            "category": "facturas y recibos del hogar",
            "tier": 2
          },
          {
            "word": "presupuesto mensual",
            "definition": "Una lista de lo que entra y lo que sale de dinero cada mes en una casa.",
            "example": "Hicimos un presupuesto mensual para no gastar de m+�s.",
            "category": "facturas y recibos del hogar",
            "tier": 2
          }
        ]
      },
      {
        "id": "B-facturas-y-recibos-del-hogar-2",
        "bloqueId": "B",
        "category": "facturas y recibos del hogar",
        "chunkIndex": 1,
        "chunkCount": 2,
        "tier": 2,
        "words": [
          {
            "word": "consumo",
            "definition": "La cantidad de agua, luz o gas que se ha gastado en un periodo.",
            "example": "Este mes el consumo de luz ha bajado.",
            "category": "facturas y recibos del hogar",
            "tier": 2
          },
          {
            "word": "lectura del contador",
            "definition": "El n+�mero que se anota del contador para saber cu+�nta energ+�a o agua se ha gastado.",
            "example": "Manda la lectura del contador por la app de la empresa.",
            "category": "facturas y recibos del hogar",
            "tier": 2
          }
        ]
      },
      {
        "id": "B-formas-de-pago-y-cuentas-1",
        "bloqueId": "B",
        "category": "formas de pago y cuentas",
        "chunkIndex": 0,
        "chunkCount": 2,
        "tier": 3,
        "words": [
          {
            "word": "efectivo",
            "definition": "El dinero en monedas y billetes, no en tarjeta ni en banco.",
            "example": "Pag+� la compra en efectivo con un billete de veinte euros.",
            "category": "formas de pago y cuentas",
            "tier": 3
          },
          {
            "word": "tarjeta de d+�bito",
            "definition": "Una tarjeta de pl+�stico que usa el dinero que ya tienes en tu cuenta del banco.",
            "example": "Pag+� el pan con la tarjeta de d+�bito.",
            "category": "formas de pago y cuentas",
            "tier": 3
          },
          {
            "word": "transferencia bancaria",
            "definition": "Una orden al banco para pasar dinero de tu cuenta a la cuenta de otra persona.",
            "example": "Hizo una transferencia bancaria para pagar el alquiler.",
            "category": "formas de pago y cuentas",
            "tier": 3
          },
          {
            "word": "bizum",
            "definition": "Un servicio del banco que permite enviar dinero al momento con el m+�vil.",
            "example": "Le envi+� el dinero por bizum para pagar la mitad de la cena.",
            "category": "formas de pago y cuentas",
            "tier": 3
          },
          {
            "word": "cajero autom+�tico",
            "definition": "Una m+�quina del banco que permite sacar o ingresar dinero a cualquier hora.",
            "example": "Sac+� cincuenta euros del cajero autom+�tico.",
            "category": "formas de pago y cuentas",
            "tier": 3
          },
          {
            "word": "banco online",
            "definition": "La aplicaci+�n o p+�gina web del banco que te permite operar sin ir a la oficina.",
            "example": "Consult+� el saldo desde el banco online.",
            "category": "formas de pago y cuentas",
            "tier": 3
          },
          {
            "word": "saldo",
            "definition": "El dinero que tienes en una cuenta del banco en un momento dado.",
            "example": "Queda poco saldo en la cuenta hasta que llegue la n+�mina.",
            "category": "formas de pago y cuentas",
            "tier": 3
          },
          {
            "word": "moneda suelta",
            "definition": "Las monedas peque+�as que llevas encima para pagar cosas de poco dinero.",
            "example": "Llevaba moneda suelta en el bolsillo para el parking.",
            "category": "formas de pago y cuentas",
            "tier": 3
          }
        ]
      },
      {
        "id": "B-formas-de-pago-y-cuentas-2",
        "bloqueId": "B",
        "category": "formas de pago y cuentas",
        "chunkIndex": 1,
        "chunkCount": 2,
        "tier": 3,
        "words": [
          {
            "word": "c+�digo IBAN",
            "definition": "Un n+�mero largo que identifica tu cuenta del banco para hacer transferencias.",
            "example": "Le dio su c+�digo IBAN al amigo para que le pagara.",
            "category": "formas de pago y cuentas",
            "tier": 3
          },
          {
            "word": "pago sin contacto",
            "definition": "Una forma de pagar acercando la tarjeta o el m+�vil a un aparato, sin meterla en ning+�n sitio.",
            "example": "Pag+� el caf+� con el m+�vil, con pago sin contacto.",
            "category": "formas de pago y cuentas",
            "tier": 3
          }
        ]
      },
      {
        "id": "B-ingresos-y-gastos-del-hogar-1",
        "bloqueId": "B",
        "category": "ingresos y gastos del hogar",
        "chunkIndex": 0,
        "chunkCount": 2,
        "tier": 3,
        "words": [
          {
            "word": "n+�mina",
            "definition": "Un papel que dice cu+�nto dinero ha ganado una persona en un mes y lo que se le ha descontado.",
            "example": "La empresa le manda la n+�mina cada final de mes.",
            "category": "ingresos y gastos del hogar",
            "tier": 3
          },
          {
            "word": "sueldo neto",
            "definition": "El dinero que te queda del sueldo despu+�s de quitar los impuestos y la seguridad social.",
            "example": "Su sueldo neto es menor que el sueldo bruto.",
            "category": "ingresos y gastos del hogar",
            "tier": 3
          },
          {
            "word": "IRPF",
            "definition": "El impuesto que se quita del sueldo de los trabajadores para el Estado.",
            "example": "En la n+�mina le descontaron el IRPF.",
            "category": "ingresos y gastos del hogar",
            "tier": 3
          },
          {
            "word": "aut+�nomo",
            "definition": "Una persona que trabaja por su cuenta y paga sus propios impuestos.",
            "example": "Es aut+�noma: tiene una peluquer+�a en casa.",
            "category": "ingresos y gastos del hogar",
            "tier": 3
          },
          {
            "word": "ingreso",
            "definition": "El dinero que entra en una casa o en una cuenta, por el sueldo o por otras cosas.",
            "example": "Los ingresos de la familia son el sueldo y la pensi+�n.",
            "category": "ingresos y gastos del hogar",
            "tier": 3
          },
          {
            "word": "gasto",
            "definition": "El dinero que sale de una casa o de una cuenta para pagar algo.",
            "example": "El alquiler es el gasto m+�s grande del mes.",
            "category": "ingresos y gastos del hogar",
            "tier": 3
          },
          {
            "word": "hipoteca",
            "definition": "Un pr+�stamo que pide un banco para comprar una casa y se paga durante muchos a+�os.",
            "example": "Paga la hipoteca del piso durante veinte a+�os.",
            "category": "ingresos y gastos del hogar",
            "tier": 3
          },
          {
            "word": "alquiler",
            "definition": "El dinero que se paga cada mes por vivir en una casa que no es tuya.",
            "example": "El alquiler del piso sube cada a+�o.",
            "category": "ingresos y gastos del hogar",
            "tier": 3
          }
        ]
      },
      {
        "id": "B-ingresos-y-gastos-del-hogar-2",
        "bloqueId": "B",
        "category": "ingresos y gastos del hogar",
        "chunkIndex": 1,
        "chunkCount": 2,
        "tier": 3,
        "words": [
          {
            "word": "deuda pendiente",
            "definition": "Dinero que todav+�a debes y no has terminado de pagar.",
            "example": "Tiene una deuda pendiente con la tienda del barrio.",
            "category": "ingresos y gastos del hogar",
            "tier": 3
          },
          {
            "word": "recibo de n+�mina",
            "definition": "El papel o archivo digital que te entrega la empresa con el detalle de lo que has cobrado.",
            "example": "Guarda el recibo de n+�mina por si lo necesita para el alquiler.",
            "category": "ingresos y gastos del hogar",
            "tier": 3
          }
        ]
      },
      {
        "id": "B-vida-independiente-y-hogar-1",
        "bloqueId": "B",
        "category": "vida independiente y hogar",
        "chunkIndex": 0,
        "chunkCount": 2,
        "tier": 2,
        "words": [
          {
            "word": "alquiler compartido",
            "definition": "Vivir en una casa con otras personas que tambi+�n pagan su parte.",
            "example": "Vive en un alquiler compartido con dos amigas.",
            "category": "vida independiente y hogar",
            "tier": 2
          },
          {
            "word": "convivencia",
            "definition": "La forma de vivir juntos varias personas en el mismo sitio.",
            "example": "La convivencia en el piso funciona bien.",
            "category": "vida independiente y hogar",
            "tier": 2
          },
          {
            "word": "vecino",
            "definition": "La persona que vive en una casa cercana a la tuya.",
            "example": "Su vecino le cuida el gato cuando se va.",
            "category": "vida independiente y hogar",
            "tier": 2
          },
          {
            "word": "tareas del hogar",
            "definition": "Las cosas que hay que hacer en casa para mantenerla limpia y ordenada.",
            "example": "Se reparte las tareas del hogar con su compa+�ero de piso.",
            "category": "vida independiente y hogar",
            "tier": 2
          },
          {
            "word": "limpieza",
            "definition": "El trabajo de quitar la suciedad y dejar algo ordenado.",
            "example": "La limpieza del ba+�o la hace los s+�bados.",
            "category": "vida independiente y hogar",
            "tier": 2
          },
          {
            "word": "lavadora",
            "definition": "Una m+�quina que lava la ropa.",
            "example": "Pone la lavadora tres veces por semana.",
            "category": "vida independiente y hogar",
            "tier": 2
          },
          {
            "word": "plancha",
            "definition": "Un aparato caliente que se usa para quitar las arrugas de la ropa.",
            "example": "Pasa la plancha por las camisas del trabajo.",
            "category": "vida independiente y hogar",
            "tier": 2
          },
          {
            "word": "tendedero",
            "definition": "El sitio donde se pone la ropa mojada para que se seque.",
            "example": "Tiende la ropa en el tendedero del patio.",
            "category": "vida independiente y hogar",
            "tier": 2
          }
        ]
      },
      {
        "id": "B-vida-independiente-y-hogar-2",
        "bloqueId": "B",
        "category": "vida independiente y hogar",
        "chunkIndex": 1,
        "chunkCount": 2,
        "tier": 2,
        "words": [
          {
            "word": "mudanza",
            "definition": "El cambio de una casa a otra llev+�ndose los muebles.",
            "example": "La mudanza al piso nuevo fue el s+�bado.",
            "category": "vida independiente y hogar",
            "tier": 2
          },
          {
            "word": "buscar piso",
            "definition": "Mirar anuncios y visitar casas o pisos para encontrar uno donde vivir.",
            "example": "Se pasa la tarde buscando piso por internet.",
            "category": "vida independiente y hogar",
            "tier": 2
          }
        ]
      },
      {
        "id": "B-transporte-y-ciudad-1",
        "bloqueId": "B",
        "category": "transporte y ciudad",
        "chunkIndex": 0,
        "chunkCount": 2,
        "tier": 2,
        "words": [
          {
            "word": "autob+�s urbano",
            "definition": "Un autob+�s que recorre el camino dentro de una ciudad.",
            "example": "Coge el autob+�s urbano para ir al centro.",
            "category": "transporte y ciudad",
            "tier": 2
          },
          {
            "word": "metro",
            "definition": "Un tren que circula bajo tierra por dentro de una ciudad.",
            "example": "Va al trabajo en metro cada ma+�ana.",
            "category": "transporte y ciudad",
            "tier": 2
          },
          {
            "word": "tranv+�a",
            "definition": "Un veh+�culo que circula por railes en la calle, con catenaria el+�ctrica.",
            "example": "El tranv+�a les lleva al centro comercial.",
            "category": "transporte y ciudad",
            "tier": 2
          },
          {
            "word": "taxi",
            "definition": "Un coche con conductor que cobra por llevar a una persona de un sitio a otro.",
            "example": "Tom+� un taxi para volver a casa de noche.",
            "category": "transporte y ciudad",
            "tier": 2
          },
          {
            "word": "VTC",
            "definition": "Un coche con conductor que pides desde una aplicaci+�n del m+�vil.",
            "example": "Pidi+� un VTC con el m+�vil a las once de la noche.",
            "category": "transporte y ciudad",
            "tier": 2
          },
          {
            "word": "tren de cercan+�as",
            "definition": "Un tren que hace trayectos cortos entre pueblos y ciudades cercanas.",
            "example": "Coge el tren de cercan+�as para ir al pueblo de su madre.",
            "category": "transporte y ciudad",
            "tier": 2
          },
          {
            "word": "avi+�n",
            "definition": "Un veh+�culo que vuela y que lleva pasajeros de una ciudad a otra, a veces a otro pa+�s.",
            "example": "El avi+�n a Mallorca sale a las seis de la ma+�ana.",
            "category": "transporte y ciudad",
            "tier": 2
          },
          {
            "word": "bicicleta",
            "definition": "Un veh+�culo de dos ruedas que se mueve pedaleando.",
            "example": "Va al trabajo en bicicleta todos los d+�as.",
            "category": "transporte y ciudad",
            "tier": 2
          }
        ]
      },
      {
        "id": "B-transporte-y-ciudad-2",
        "bloqueId": "B",
        "category": "transporte y ciudad",
        "chunkIndex": 1,
        "chunkCount": 2,
        "tier": 2,
        "words": [
          {
            "word": "parada de autob+�s",
            "definition": "El sitio marcado en la calle donde se espera el autob+�s.",
            "example": "Te espero en la parada de autob+�s de la plaza.",
            "category": "transporte y ciudad",
            "tier": 2
          },
          {
            "word": "billete de transporte",
            "definition": "Un papel o una app que demuestra que has pagado el viaje.",
            "example": "Compr+� el billete de transporte en la m+�quina.",
            "category": "transporte y ciudad",
            "tier": 2
          }
        ]
      },
      {
        "id": "B-alimentacion-y-cocina-1",
        "bloqueId": "B",
        "category": "alimentaci+�n y cocina",
        "chunkIndex": 0,
        "chunkCount": 2,
        "tier": 2,
        "words": [
          {
            "word": "receta de cocina",
            "definition": "Una lista de pasos e ingredientes para preparar una comida.",
            "example": "Busc+� una receta de cocina de lentejas en internet.",
            "category": "alimentaci+�n y cocina",
            "tier": 2
          },
          {
            "word": "ingrediente",
            "definition": "Cada uno de los alimentos que se usan para preparar una receta.",
            "example": "Los huevos y la harina son los ingredientes de la tortilla.",
            "category": "alimentaci+�n y cocina",
            "tier": 2
          },
          {
            "word": "alimento fresco",
            "definition": "Un alimento que no ha sido congelado ni procesado.",
            "example": "Compra fruta y verdura, que son alimentos frescos.",
            "category": "alimentaci+�n y cocina",
            "tier": 2
          },
          {
            "word": "dieta equilibrada",
            "definition": "Una forma de comer que tiene alimentos sanos en cantidades justas.",
            "example": "Lleva una dieta equilibrada con fruta y verdura cada d+�a.",
            "category": "alimentaci+�n y cocina",
            "tier": 2
          },
          {
            "word": "porci+�n",
            "definition": "La cantidad de comida que se sirve a una persona en una comida.",
            "example": "Puso una porci+�n de pasta en cada plato.",
            "category": "alimentaci+�n y cocina",
            "tier": 2
          },
          {
            "word": "al+�rgeno alimentario",
            "definition": "Un alimento que puede causar una reacci+�n al+�rgica en algunas personas.",
            "example": "Lee las etiquetas para ver si lleva al+�rgenos alimentarios.",
            "category": "alimentaci+�n y cocina",
            "tier": 2
          },
          {
            "word": "desayuno",
            "definition": "La comida que se toma por la ma+�ana al empezar el d+�a.",
            "example": "Toma un caf+� con tostadas en el desayuno.",
            "category": "alimentaci+�n y cocina",
            "tier": 2
          },
          {
            "word": "cena",
            "definition": "La comida que se toma al final del d+�a, antes de dormir.",
            "example": "Hoy cenamos una ensalada y un pescado.",
            "category": "alimentaci+�n y cocina",
            "tier": 2
          }
        ]
      },
      {
        "id": "B-alimentacion-y-cocina-2",
        "bloqueId": "B",
        "category": "alimentaci+�n y cocina",
        "chunkIndex": 1,
        "chunkCount": 2,
        "tier": 2,
        "words": [
          {
            "word": "hambre",
            "definition": "La sensaci+�n que tiene el cuerpo cuando necesita comer.",
            "example": "Siento hambre: toca comer algo.",
            "category": "alimentaci+�n y cocina",
            "tier": 2
          },
          {
            "word": "hidrataci+�n",
            "definition": "Beber suficiente agua para que el cuerpo funcione bien.",
            "example": "Lleva una botella para mantener una buena hidrataci+�n.",
            "category": "alimentaci+�n y cocina",
            "tier": 2
          }
        ]
      }
    ]
  },
  {
    "id": "C",
    "nombre": {
      "es": "Salud ampliada",
      "en": "Expanded health"
    },
    "categorias": [
      "salud (especialidades y pruebas)",
      "salud (pruebas y seguimientos)",
      "farmacia y medicaci+�n",
      "salud mental y bienestar"
    ],
    "rondas": [
      {
        "id": "C-salud-especialidades-y-pruebas-1",
        "bloqueId": "C",
        "category": "salud (especialidades y pruebas)",
        "chunkIndex": 0,
        "chunkCount": 2,
        "tier": 3,
        "words": [
          {
            "word": "cardiolog+�a",
            "definition": "La parte de la medicina que cuida el coraz+�n.",
            "example": "Le derivaron a cardiolog+�a por unas palpitaciones.",
            "category": "salud (especialidades y pruebas)",
            "tier": 3
          },
          {
            "word": "dermatolog+�a",
            "definition": "La parte de la medicina que cuida la piel.",
            "example": "Pidi+� cita en dermatolog+�a por una mancha en la cara.",
            "category": "salud (especialidades y pruebas)",
            "tier": 3
          },
          {
            "word": "ginecolog+�a",
            "definition": "La parte de la medicina que cuida los +�rganos sexuales de la mujer.",
            "example": "Va a ginecolog+�a para la revisi+�n anual.",
            "category": "salud (especialidades y pruebas)",
            "tier": 3
          },
          {
            "word": "oftalmolog+�a",
            "definition": "La parte de la medicina que cuida los ojos.",
            "example": "En oftalmolog+�a le revisaron la vista y le cambiaron la graduaci+�n.",
            "category": "salud (especialidades y pruebas)",
            "tier": 3
          },
          {
            "word": "otorrino",
            "definition": "La parte de la medicina que cuida los o+�dos, la nariz y la garganta.",
            "example": "Fue al otorrino por un dolor de o+�do que no se le quitaba.",
            "category": "salud (especialidades y pruebas)",
            "tier": 3
          },
          {
            "word": "digestivo",
            "definition": "La parte de la medicina que cuida el est+�mago y los intestinos.",
            "example": "El digest+�logo le mand+� una prueba para ver qu+� le sentaba mal.",
            "category": "salud (especialidades y pruebas)",
            "tier": 3
          },
          {
            "word": "traumatolog+�a",
            "definition": "La parte de la medicina que cuida los huesos, las articulaciones y los m+�sculos.",
            "example": "Tras la ca+�da, le vio traumatolog+�a por un esguince.",
            "category": "salud (especialidades y pruebas)",
            "tier": 3
          },
          {
            "word": "psiquiatr+�a",
            "definition": "La parte de la medicina que trata los problemas mentales con medicaci+�n.",
            "example": "Su m+�dico de cabecera le deriv+� a psiquiatr+�a por la ansiedad.",
            "category": "salud (especialidades y pruebas)",
            "tier": 3
          }
        ]
      },
      {
        "id": "C-salud-especialidades-y-pruebas-2",
        "bloqueId": "C",
        "category": "salud (especialidades y pruebas)",
        "chunkIndex": 1,
        "chunkCount": 2,
        "tier": 3,
        "words": [
          {
            "word": "psicolog+�a",
            "definition": "La disciplina que trata los problemas emocionales y de conducta hablando con la persona.",
            "example": "Va a psicolog+�a cada quince d+�as para hablar de sus miedos.",
            "category": "salud (especialidades y pruebas)",
            "tier": 3
          },
          {
            "word": "endocrinolog+�a",
            "definition": "La parte de la medicina que cuida las hormonas y el metabolismo.",
            "example": "En endocrinolog+�a le controlan la diabetes.",
            "category": "salud (especialidades y pruebas)",
            "tier": 3
          }
        ]
      },
      {
        "id": "C-salud-pruebas-y-seguimientos-1",
        "bloqueId": "C",
        "category": "salud (pruebas y seguimientos)",
        "chunkIndex": 0,
        "chunkCount": 2,
        "tier": 3,
        "words": [
          {
            "word": "an+�lisis de sangre",
            "definition": "Una prueba donde se saca sangre para ver c+�mo est+� el cuerpo.",
            "example": "Le hicieron un an+�lisis de sangre en ayunas.",
            "category": "salud (pruebas y seguimientos)",
            "tier": 3
          },
          {
            "word": "radiograf+�a",
            "definition": "Una foto del interior del cuerpo que se hace con rayos para ver huesos o pulmones.",
            "example": "Le hicieron una radiograf+�a del pecho por la tos.",
            "category": "salud (pruebas y seguimientos)",
            "tier": 3
          },
          {
            "word": "ecograf+�a",
            "definition": "Una imagen del interior del cuerpo que se hace con sonido.",
            "example": "La ecograf+�a del embarazo muestra c+�mo va el beb+�.",
            "category": "salud (pruebas y seguimientos)",
            "tier": 3
          },
          {
            "word": "TAC",
            "definition": "Una prueba que hace muchas fotos del interior del cuerpo para ver un +�rgano.",
            "example": "Le hicieron un TAC de cabeza tras el golpe.",
            "category": "salud (pruebas y seguimientos)",
            "tier": 3
          },
          {
            "word": "resonancia magn+�tica",
            "definition": "Una prueba que usa imanes para ver con detalle el interior del cuerpo.",
            "example": "Le mandaron una resonancia magn+�tica de la rodilla.",
            "category": "salud (pruebas y seguimientos)",
            "tier": 3
          },
          {
            "word": "mamograf+�a",
            "definition": "Una radiograf+�a de los pechos para detectar problemas a tiempo.",
            "example": "Se hace una mamograf+�a cada dos a+�os.",
            "category": "salud (pruebas y seguimientos)",
            "tier": 3
          },
          {
            "word": "colonoscopia",
            "definition": "Una prueba donde se mira el interior del intestino con una c+�mara fina.",
            "example": "Le hicieron una colonoscopia para ver el motivo del dolor.",
            "category": "salud (pruebas y seguimientos)",
            "tier": 3
          },
          {
            "word": "m+�dico de cabecera",
            "definition": "El m+�dico que ve normalmente y que te env+�a a otros especialistas si hace falta.",
            "example": "Pidi+� cita con su m+�dico de cabecera para el resfriado.",
            "category": "salud (pruebas y seguimientos)",
            "tier": 3
          }
        ]
      },
      {
        "id": "C-salud-pruebas-y-seguimientos-2",
        "bloqueId": "C",
        "category": "salud (pruebas y seguimientos)",
        "chunkIndex": 1,
        "chunkCount": 2,
        "tier": 3,
        "words": [
          {
            "word": "derivaci+�n m+�dica",
            "definition": "Cuando tu m+�dico te env+�a a otro especialista para una prueba o un tratamiento.",
            "example": "Recibi+� una derivaci+�n m+�dica al cardi+�logo.",
            "category": "salud (pruebas y seguimientos)",
            "tier": 3
          },
          {
            "word": "chequeo",
            "definition": "Una revisi+�n m+�dica completa para ver si todo est+� bien.",
            "example": "Cada a+�o se hace un chequeo general.",
            "category": "salud (pruebas y seguimientos)",
            "tier": 3
          }
        ]
      },
      {
        "id": "C-farmacia-y-medicacion-1",
        "bloqueId": "C",
        "category": "farmacia y medicaci+�n",
        "chunkIndex": 0,
        "chunkCount": 2,
        "tier": 2,
        "words": [
          {
            "word": "pastilla",
            "definition": "Un medicamento peque+�o y s+�lido que se toma con agua.",
            "example": "Se toma una pastilla para el dolor de cabeza.",
            "category": "farmacia y medicaci+�n",
            "tier": 2
          },
          {
            "word": "c+�psula",
            "definition": "Un medicamento dentro de una cubierta que se disuelve en el est+�mago.",
            "example": "La c+�psula de omega 3 se toma despu+�s de comer.",
            "category": "farmacia y medicaci+�n",
            "tier": 2
          },
          {
            "word": "jarabe",
            "definition": "Un medicamento l+�quido que se toma con una cuchara.",
            "example": "Le dio jarabe para la tos al ni+�o.",
            "category": "farmacia y medicaci+�n",
            "tier": 2
          },
          {
            "word": "inyecci+�n",
            "definition": "Una medicina que se mete en el cuerpo con una aguja.",
            "example": "Le pusieron una inyecci+�n en el brazo.",
            "category": "farmacia y medicaci+�n",
            "tier": 2
          },
          {
            "word": "pomada",
            "definition": "Una crema medicinal que se aplica sobre la piel.",
            "example": "Se puso pomada en la quemadura del sol.",
            "category": "farmacia y medicaci+�n",
            "tier": 2
          },
          {
            "word": "gotas",
            "definition": "Un medicamento l+�quido que se echa en los ojos, los o+�dos o la nariz.",
            "example": "Se echa gotas en los ojos tres veces al d+�a.",
            "category": "farmacia y medicaci+�n",
            "tier": 2
          },
          {
            "word": "inhalador",
            "definition": "Un aparato que echa un medicamento en forma de vapor para respirar.",
            "example": "Usa el inhalador cuando le falta el aire.",
            "category": "farmacia y medicaci+�n",
            "tier": 2
          },
          {
            "word": "parche",
            "definition": "Un trozo que se pega a la piel y va soltando medicina poco a poco.",
            "example": "Lleva un parche para el dolor de espalda.",
            "category": "farmacia y medicaci+�n",
            "tier": 2
          }
        ]
      },
      {
        "id": "C-farmacia-y-medicacion-2",
        "bloqueId": "C",
        "category": "farmacia y medicaci+�n",
        "chunkIndex": 1,
        "chunkCount": 2,
        "tier": 2,
        "words": [
          {
            "word": "antibi+�tico",
            "definition": "Un medicamento que mata las bacterias que causan infecciones.",
            "example": "Le recetaron antibi+�tico diez d+�as para la infecci+�n.",
            "category": "farmacia y medicaci+�n",
            "tier": 2
          },
          {
            "word": "antiinflamatorio",
            "definition": "Un medicamento que baja la hinchaz+�n y el dolor.",
            "example": "Tom+� un antiinflamatorio para el tobillo hinchado.",
            "category": "farmacia y medicaci+�n",
            "tier": 2
          }
        ]
      },
      {
        "id": "C-salud-mental-y-bienestar-1",
        "bloqueId": "C",
        "category": "salud mental y bienestar",
        "chunkIndex": 0,
        "chunkCount": 2,
        "tier": 3,
        "words": [
          {
            "word": "estr+�s",
            "definition": "La sensaci+�n de tensi+�n del cuerpo y la mente cuando hay mucha presi+�n.",
            "example": "Siente mucho estr+�s antes de cada examen.",
            "category": "salud mental y bienestar",
            "tier": 3
          },
          {
            "word": "ansiedad",
            "definition": "Una sensaci+�n de miedo o nervios fuerte que no se va.",
            "example": "La ansiedad no la deja dormir antes de la revisi+�n.",
            "category": "salud mental y bienestar",
            "tier": 3
          },
          {
            "word": "depresi+�n",
            "definition": "Una tristeza profunda que dura mucho y no deja hacer cosas.",
            "example": "Tras el fallecimiento pas+� una depresi+�n larga.",
            "category": "salud mental y bienestar",
            "tier": 3
          },
          {
            "word": "insomnio",
            "definition": "Cuando una persona no puede dormir o se despierta muchas veces.",
            "example": "El insomnio la deja cansada al d+�a siguiente.",
            "category": "salud mental y bienestar",
            "tier": 3
          },
          {
            "word": "apoyo psicol+�gico",
            "definition": "La ayuda que da un profesional para hablar de las emociones y los problemas.",
            "example": "Recibe apoyo psicol+�gico tras la p+�rdida del trabajo.",
            "category": "salud mental y bienestar",
            "tier": 3
          },
          {
            "word": "terapeuta",
            "definition": "La persona que ayuda a otra a mejorar sus emociones o su salud.",
            "example": "Su terapeuta la escucha cada semana.",
            "category": "salud mental y bienestar",
            "tier": 3
          },
          {
            "word": "grupo de apoyo",
            "definition": "Un grupo de personas con un problema parecido que se ayudan entre s+�.",
            "example": "Asiste a un grupo de apoyo para personas con ansiedad.",
            "category": "salud mental y bienestar",
            "tier": 3
          },
          {
            "word": "mindfulness",
            "definition": "Una t+�cnica para prestar atenci+�n al momento presente y calmar la mente.",
            "example": "Practica mindfulness diez minutos al d+�a.",
            "category": "salud mental y bienestar",
            "tier": 3
          }
        ]
      },
      {
        "id": "C-salud-mental-y-bienestar-2",
        "bloqueId": "C",
        "category": "salud mental y bienestar",
        "chunkIndex": 1,
        "chunkCount": 2,
        "tier": 3,
        "words": [
          {
            "word": "resiliencia",
            "definition": "La capacidad de una persona para recuperarse despu+�s de algo dif+�cil.",
            "example": "Demostr+� mucha resiliencia tras la operaci+�n.",
            "category": "salud mental y bienestar",
            "tier": 3
          },
          {
            "word": "crisis",
            "definition": "Un momento en que un problema se vuelve muy grave o urgente.",
            "example": "Tuvo una crisis de ansiedad en el trabajo.",
            "category": "salud mental y bienestar",
            "tier": 3
          }
        ]
      }
    ]
  },
  {
    "id": "D",
    "nombre": {
      "es": "Mundo social, digital y cultural",
      "en": "Social, digital and cultural world"
    },
    "categorias": [
      "educaci+�n y formaci+�n",
      "clima y naturaleza",
      "geograf+�a y mundo",
      "cultura, ocio y deporte",
      "comunicaci+�n y gestos",
      "comunidad y tradiciones",
      "derechos digitales y verificaci+�n"
    ],
    "rondas": [
      {
        "id": "D-educacion-y-formacion-1",
        "bloqueId": "D",
        "category": "educaci+�n y formaci+�n",
        "chunkIndex": 0,
        "chunkCount": 2,
        "tier": 3,
        "words": [
          {
            "word": "matr+�cula",
            "definition": "El pago que se hace al centro para apuntarse a un curso o estudios.",
            "example": "Pag+� la matr+�cula del curso de cocina.",
            "category": "educaci+�n y formaci+�n",
            "tier": 3
          },
          {
            "word": "beca",
            "definition": "Una ayuda econ+�mica que se da para poder pagar estudios.",
            "example": "Le concedieron una beca por sus buenas notas.",
            "category": "educaci+�n y formaci+�n",
            "tier": 3
          },
          {
            "word": "curso de formaci+�n",
            "definition": "Unas clases para aprender un trabajo o habilidad.",
            "example": "Hizo un curso de formaci+�n en cocina.",
            "category": "educaci+�n y formaci+�n",
            "tier": 3
          },
          {
            "word": "certificado",
            "definition": "Un papel oficial que dice que has terminado un curso o sabes hacer algo.",
            "example": "Le dieron un certificado de manipulador de alimentos.",
            "category": "educaci+�n y formaci+�n",
            "tier": 3
          },
          {
            "word": "t+�tulo",
            "definition": "Un papel oficial que dice que has acabado unos estudios.",
            "example": "Sac+� el t+�tulo de auxiliar administrativo.",
            "category": "educaci+�n y formaci+�n",
            "tier": 3
          },
          {
            "word": "expediente acad+�mico",
            "definition": "El historial con todas las notas y materias de una persona.",
            "example": "Pidi+� el expediente acad+�mico al instituto.",
            "category": "educaci+�n y formaci+�n",
            "tier": 3
          },
          {
            "word": "tutor",
            "definition": "La persona que acompa+�a a un alumno para guiar sus estudios.",
            "example": "Habl+� con su tutor del colegio sobre las notas.",
            "category": "educaci+�n y formaci+�n",
            "tier": 3
          },
          {
            "word": "educaci+�n especial",
            "definition": "Una ense+�anza con apoyos extra para quien lo necesite, en clase o en un aula aparte.",
            "example": "Asisti+� a educaci+�n especial hasta los veinte a+�os.",
            "category": "educaci+�n y formaci+�n",
            "tier": 3
          }
        ]
      },
      {
        "id": "D-educacion-y-formacion-2",
        "bloqueId": "D",
        "category": "educaci+�n y formaci+�n",
        "chunkIndex": 1,
        "chunkCount": 2,
        "tier": 3,
        "words": [
          {
            "word": "apoyo escolar",
            "definition": "Una ayuda extra que recibe un alumno en el colegio para aprender mejor.",
            "example": "Recibe apoyo escolar en lengua y matem+�ticas.",
            "category": "educaci+�n y formaci+�n",
            "tier": 3
          },
          {
            "word": "logopeda",
            "definition": "El profesional que ayuda a una persona a hablar y pronunciar mejor.",
            "example": "El logopeda le ense+�a ejercicios para pronunciar la r.",
            "category": "educaci+�n y formaci+�n",
            "tier": 3
          }
        ]
      },
      {
        "id": "D-clima-y-naturaleza-1",
        "bloqueId": "D",
        "category": "clima y naturaleza",
        "chunkIndex": 0,
        "chunkCount": 2,
        "tier": 2,
        "words": [
          {
            "word": "lluvia",
            "definition": "El agua que cae de las nubes en gotas.",
            "example": "Hoy amaneci+� con lluvia fina.",
            "category": "clima y naturaleza",
            "tier": 2
          },
          {
            "word": "viento",
            "definition": "Aire que se mueve en la atm+�sfera.",
            "example": "Hace mucho viento: cierra la ventana.",
            "category": "clima y naturaleza",
            "tier": 2
          },
          {
            "word": "nieve",
            "definition": "Agua congelada que cae del cielo en copos blancos.",
            "example": "Anoche cay+� nieve en la monta+�a.",
            "category": "clima y naturaleza",
            "tier": 2
          },
          {
            "word": "tormenta",
            "definition": "Una lluvia muy fuerte con truenos, rel+�mpagos y viento.",
            "example": "Por la tarde habr+� tormenta con aparato el+�ctrico.",
            "category": "clima y naturaleza",
            "tier": 2
          },
          {
            "word": "calor",
            "definition": "Una temperatura alta del ambiente o del cuerpo.",
            "example": "Hoy hace un calor sofocante en la calle.",
            "category": "clima y naturaleza",
            "tier": 2
          },
          {
            "word": "fr+�o",
            "definition": "Una temperatura baja del ambiente o del cuerpo.",
            "example": "Siente mucho fr+�o: ponte el abrigo.",
            "category": "clima y naturaleza",
            "tier": 2
          },
          {
            "word": "sol",
            "definition": "La estrella que da luz y calor a la Tierra.",
            "example": "Sali+� el sol y nos fuimos a la playa.",
            "category": "clima y naturaleza",
            "tier": 2
          },
          {
            "word": "nube",
            "definition": "Una masa blanca o gris que flota en el cielo y puede soltar lluvia.",
            "example": "El cielo est+� lleno de nubes oscuras.",
            "category": "clima y naturaleza",
            "tier": 2
          }
        ]
      },
      {
        "id": "D-clima-y-naturaleza-2",
        "bloqueId": "D",
        "category": "clima y naturaleza",
        "chunkIndex": 1,
        "chunkCount": 2,
        "tier": 2,
        "words": [
          {
            "word": "primavera",
            "definition": "La estaci+�n del a+�o entre el invierno y el verano, cuando las flores abren.",
            "example": "En primavera vamos al parque a ver los cerezos.",
            "category": "clima y naturaleza",
            "tier": 2
          },
          {
            "word": "oto+�o",
            "definition": "La estaci+�n del a+�o entre el verano y el invierno, cuando caen las hojas.",
            "example": "En oto+�o las hojas se vuelven amarillas.",
            "category": "clima y naturaleza",
            "tier": 2
          }
        ]
      },
      {
        "id": "D-geografia-y-mundo-1",
        "bloqueId": "D",
        "category": "geograf+�a y mundo",
        "chunkIndex": 0,
        "chunkCount": 2,
        "tier": 3,
        "words": [
          {
            "word": "pa+�s",
            "definition": "Una zona grande de tierra con su propio gobierno.",
            "example": "Espa+�a es un pa+�s del sur de Europa.",
            "category": "geograf+�a y mundo",
            "tier": 3
          },
          {
            "word": "continente",
            "definition": "Cada una de las grandes extensiones de tierra del mundo.",
            "example": "Europa es uno de los cinco continentes habitados.",
            "category": "geograf+�a y mundo",
            "tier": 3
          },
          {
            "word": "ciudad capital",
            "definition": "La ciudad m+�s importante de un pa+�s, donde suele estar el gobierno.",
            "example": "Madrid es la ciudad capital de Espa+�a.",
            "category": "geograf+�a y mundo",
            "tier": 3
          },
          {
            "word": "oc+�ano",
            "definition": "Una extensi+�n muy grande de agua salada que cubre gran parte de la Tierra.",
            "example": "El oc+�ano Atl+�ntico separa Europa de Am+�rica.",
            "category": "geograf+�a y mundo",
            "tier": 3
          },
          {
            "word": "isla",
            "definition": "Una porci+�n de tierra rodeada de agua por todas partes.",
            "example": "Mallorca es una isla del Mediterr+�neo.",
            "category": "geograf+�a y mundo",
            "tier": 3
          },
          {
            "word": "desierto",
            "definition": "Una zona de tierra muy seca donde casi nunca llueve.",
            "example": "El S+�hara es el desierto m+�s grande del mundo.",
            "category": "geograf+�a y mundo",
            "tier": 3
          },
          {
            "word": "selva tropical",
            "definition": "Un bosque muy grande, caluroso y h+�medo, con much+�simas plantas y animales.",
            "example": "La Amazonia es una selva tropical de Sudam+�rica.",
            "category": "geograf+�a y mundo",
            "tier": 3
          },
          {
            "word": "cordillera",
            "definition": "Una cadena de monta+�as seguidas unas de otras.",
            "example": "Los Andes son una cordillera muy larga.",
            "category": "geograf+�a y mundo",
            "tier": 3
          }
        ]
      },
      {
        "id": "D-geografia-y-mundo-2",
        "bloqueId": "D",
        "category": "geograf+�a y mundo",
        "chunkIndex": 1,
        "chunkCount": 2,
        "tier": 3,
        "words": [
          {
            "word": "volc+�n",
            "definition": "Una monta+�a con un agujero por donde sale roca caliente del interior de la Tierra.",
            "example": "El Teide es un volc+�n en la isla de Tenerife.",
            "category": "geograf+�a y mundo",
            "tier": 3
          },
          {
            "word": "hemisferio",
            "definition": "Cada una las dos mitades en que se divide la Tierra.",
            "example": "Espa+�a est+� en el hemisferio norte.",
            "category": "geograf+�a y mundo",
            "tier": 3
          }
        ]
      },
      {
        "id": "D-cultura-ocio-y-deporte-1",
        "bloqueId": "D",
        "category": "cultura, ocio y deporte",
        "chunkIndex": 0,
        "chunkCount": 2,
        "tier": 3,
        "words": [
          {
            "word": "museo",
            "definition": "Un edificio donde se guardan y se muestran obras de arte o cosas del pasado.",
            "example": "El domingo visitamos el museo del Prado.",
            "category": "cultura, ocio y deporte",
            "tier": 3
          },
          {
            "word": "teatro",
            "definition": "Un sitio donde se ven obras representadas por actores.",
            "example": "Vieron una obra de teatro en el teatro romano.",
            "category": "cultura, ocio y deporte",
            "tier": 3
          },
          {
            "word": "cine",
            "definition": "Un sitio o una sala donde se ven pel+�culas en una pantalla grande.",
            "example": "Fueron al cine a ver una comedia.",
            "category": "cultura, ocio y deporte",
            "tier": 3
          },
          {
            "word": "concierto",
            "definition": "Un espect+�culo en directo donde se toca m+�sica para el p+�blico.",
            "example": "Compr+� entradas para un concierto de rock.",
            "category": "cultura, ocio y deporte",
            "tier": 3
          },
          {
            "word": "festival",
            "definition": "Una celebraci+�n que dura varios d+�as con actividades, m+�sica o comida.",
            "example": "El festival de jazz se celebra en julio.",
            "category": "cultura, ocio y deporte",
            "tier": 3
          },
          {
            "word": "biblioteca",
            "definition": "Un sitio donde se guardan libros y donde se puede leer o estudiar.",
            "example": "Estudia en la biblioteca tres tardes por semana.",
            "category": "cultura, ocio y deporte",
            "tier": 3
          },
          {
            "word": "libro",
            "definition": "Un conjunto de p+�ginas escritas y encuadernadas juntas.",
            "example": "Le gusta leer un libro antes de dormir.",
            "category": "cultura, ocio y deporte",
            "tier": 3
          },
          {
            "word": "deporte",
            "definition": "Una actividad f+�sica que se hace para competir o para mantenerse sano.",
            "example": "El f+�tbol es su deporte favorito.",
            "category": "cultura, ocio y deporte",
            "tier": 3
          }
        ]
      },
      {
        "id": "D-cultura-ocio-y-deporte-2",
        "bloqueId": "D",
        "category": "cultura, ocio y deporte",
        "chunkIndex": 1,
        "chunkCount": 2,
        "tier": 3,
        "words": [
          {
            "word": "afici+�n",
            "definition": "Algo que te gusta hacer en tu tiempo libre.",
            "example": "La lectura es su gran afici+�n.",
            "category": "cultura, ocio y deporte",
            "tier": 3
          },
          {
            "word": "manualidad",
            "definition": "Una actividad en la que se hacen cosas con las manos, como pintar o recortar.",
            "example": "Hacen una manualidad de papel en el centro.",
            "category": "cultura, ocio y deporte",
            "tier": 3
          }
        ]
      },
      {
        "id": "D-comunicacion-y-gestos-1",
        "bloqueId": "D",
        "category": "comunicaci+�n y gestos",
        "chunkIndex": 0,
        "chunkCount": 2,
        "tier": 2,
        "words": [
          {
            "word": "saludar",
            "definition": "Decir hola o algo amable a una persona cuando la ves.",
            "example": "Le gusta saludar a los vecinos por la ma+�ana.",
            "category": "comunicaci+�n y gestos",
            "tier": 2
          },
          {
            "word": "despedirse",
            "definition": "Decir adi+�s a una persona cuando te vas.",
            "example": "Se despidi+� antes de cerrar la puerta.",
            "category": "comunicaci+�n y gestos",
            "tier": 2
          },
          {
            "word": "disculparse",
            "definition": "Decir que sientes haber hecho algo mal.",
            "example": "Se disculp+� por llegar tarde.",
            "category": "comunicaci+�n y gestos",
            "tier": 2
          },
          {
            "word": "agradecer",
            "definition": "Mostrar a una persona que valoras algo que ha hecho por ti.",
            "example": "Le agradeci+� el regalo con una carta.",
            "category": "comunicaci+�n y gestos",
            "tier": 2
          },
          {
            "word": "preguntar",
            "definition": "Hacer una pregunta para saber algo.",
            "example": "Pregunt+� al m+�dico qu+� medicina ten+�a que tomar.",
            "category": "comunicaci+�n y gestos",
            "tier": 2
          },
          {
            "word": "responder",
            "definition": "Contestar a algo que te han dicho o preguntado.",
            "example": "Tard+� en responder al mensaje.",
            "category": "comunicaci+�n y gestos",
            "tier": 2
          },
          {
            "word": "conversaci+�n",
            "definition": "Una charla entre dos o m+�s personas.",
            "example": "Tuvieron una conversaci+�n larga por tel+�fono.",
            "category": "comunicaci+�n y gestos",
            "tier": 2
          },
          {
            "word": "escuchar",
            "definition": "Prestar atenci+�n a lo que dice otra persona.",
            "example": "Le cuesta escuchar cuando hay ruido.",
            "category": "comunicaci+�n y gestos",
            "tier": 2
          }
        ]
      },
      {
        "id": "D-comunicacion-y-gestos-2",
        "bloqueId": "D",
        "category": "comunicaci+�n y gestos",
        "chunkIndex": 1,
        "chunkCount": 2,
        "tier": 2,
        "words": [
          {
            "word": "sonre+�r",
            "definition": "Hacer con la cara una expresi+�n de alegr+�a mostrando los dientes.",
            "example": "Sonri+� al ver a su hijo.",
            "category": "comunicaci+�n y gestos",
            "tier": 2
          },
          {
            "word": "abrazar",
            "definition": "Pasar los brazos alrededor de una persona como muestra de cari+�o.",
            "example": "Se abrazaron al reencontrarse.",
            "category": "comunicaci+�n y gestos",
            "tier": 2
          }
        ]
      },
      {
        "id": "D-comunidad-y-tradiciones-1",
        "bloqueId": "D",
        "category": "comunidad y tradiciones",
        "chunkIndex": 0,
        "chunkCount": 2,
        "tier": 3,
        "words": [
          {
            "word": "colectivo local",
            "definition": "El grupo de personas que se unen en un mismo lugar para cosas comunes.",
            "example": "El colectivo local del pueblo se re+�ne cada domingo.",
            "category": "comunidad y tradiciones",
            "tier": 3
          },
          {
            "word": "amistad",
            "definition": "La relaci+�n de cari+�o y confianza entre personas amigas.",
            "example": "Cuida su amistad desde el colegio.",
            "category": "comunidad y tradiciones",
            "tier": 3
          },
          {
            "word": "pareja sentimental",
            "definition": "Las dos personas que tienen una relaci+�n amorosa.",
            "example": "Lleva cinco a+�os con su pareja sentimental.",
            "category": "comunidad y tradiciones",
            "tier": 3
          },
          {
            "word": "vecindario",
            "definition": "El conjunto de personas que viven en la misma zona de una ciudad.",
            "example": "En el vecindario se avisan cuando pasa algo raro.",
            "category": "comunidad y tradiciones",
            "tier": 3
          },
          {
            "word": "familia",
            "definition": "El grupo de personas unidas por parentesco: padres, hijos, hermanos, abuelos.",
            "example": "Pasa los domingos con su familia.",
            "category": "comunidad y tradiciones",
            "tier": 3
          },
          {
            "word": "celebraci+�n",
            "definition": "Un acto que se hace para festejar algo importante.",
            "example": "Hizo una celebraci+�n por su cumple.",
            "category": "comunidad y tradiciones",
            "tier": 3
          },
          {
            "word": "cumplea+�os",
            "definition": "El d+�a del a+�o en que una persona cumple un a+�o m+�s.",
            "example": "Celebramos el cumplea+�os con una tarta.",
            "category": "comunidad y tradiciones",
            "tier": 3
          },
          {
            "word": "boda",
            "definition": "La ceremonia en que dos personas deciden vivir juntas como pareja.",
            "example": "Le invitaron a la boda de su prima.",
            "category": "comunidad y tradiciones",
            "tier": 3
          }
        ]
      },
      {
        "id": "D-comunidad-y-tradiciones-2",
        "bloqueId": "D",
        "category": "comunidad y tradiciones",
        "chunkIndex": 1,
        "chunkCount": 2,
        "tier": 3,
        "words": [
          {
            "word": "tradici+�n",
            "definition": "Una costumbre que pasa de padres a hijos durante mucho tiempo.",
            "example": "Comer doce uvas en Nochevieja es una tradici+�n.",
            "category": "comunidad y tradiciones",
            "tier": 3
          },
          {
            "word": "Navidad",
            "definition": "La fiesta que se celebra a finales de diciembre en muchos pa+�ses.",
            "example": "En Navidad se re+�ne toda la familia.",
            "category": "comunidad y tradiciones",
            "tier": 3
          }
        ]
      },
      {
        "id": "D-derechos-digitales-y-verificacion-1",
        "bloqueId": "D",
        "category": "derechos digitales y verificaci+�n",
        "chunkIndex": 0,
        "chunkCount": 2,
        "tier": 3,
        "words": [
          {
            "word": "huella digital",
            "definition": "La informaci+�n que dejas en internet cuando navegas, escribes o compras.",
            "example": "Cada vez que publicas algo dejas huella digital.",
            "category": "derechos digitales y verificaci+�n",
            "tier": 3
          },
          {
            "word": "datos personales",
            "definition": "Informaci+�n sobre una persona, como el nombre, la direcci+�n o el DNI.",
            "example": "No compartas tus datos personales con desconocidos.",
            "category": "derechos digitales y verificaci+�n",
            "tier": 3
          },
          {
            "word": "consentimiento digital",
            "definition": "Decir que s+� de forma clara a usar tus datos en una p+�gina o aplicaci+�n.",
            "example": "La web te pide consentimiento digital para usar cookies.",
            "category": "derechos digitales y verificaci+�n",
            "tier": 3
          },
          {
            "word": "cookies",
            "definition": "Peque+�os archivos que una p+�gina web guarda en tu aparato para recordar tus visitas.",
            "example": "La p+�gina pregunta si aceptas las cookies.",
            "category": "derechos digitales y verificaci+�n",
            "tier": 3
          },
          {
            "word": "suplantaci+�n de identidad",
            "definition": "Cuando alguien se hace pasar por ti en internet para enga+�ar a otros.",
            "example": "Le hackearon la cuenta y sufrieron suplantaci+�n de identidad.",
            "category": "derechos digitales y verificaci+�n",
            "tier": 3
          },
          {
            "word": "bulo",
            "definition": "Una noticia falsa que se difunde como si fuera verdad.",
            "example": "No compartas el mensaje sin comprobar que no sea un bulo.",
            "category": "derechos digitales y verificaci+�n",
            "tier": 3
          },
          {
            "word": "noticia falsa",
            "definition": "Una informaci+�n inventada que se presenta como verdadera para confundir.",
            "example": "Esa noticia falsa se desminti+� en televisi+�n.",
            "category": "derechos digitales y verificaci+�n",
            "tier": 3
          },
          {
            "word": "verificar informaci+�n",
            "definition": "Comprobar si una noticia o un dato es verdadero antes de difundirlo.",
            "example": "Verifica la informaci+�n antes de reenviar el mensaje.",
            "category": "derechos digitales y verificaci+�n",
            "tier": 3
          }
        ]
      },
      {
        "id": "D-derechos-digitales-y-verificacion-2",
        "bloqueId": "D",
        "category": "derechos digitales y verificaci+�n",
        "chunkIndex": 1,
        "chunkCount": 2,
        "tier": 3,
        "words": [
          {
            "word": "contrase+�a segura",
            "definition": "Una contrase+�a larga y dif+�cil de adivinar que protege tu cuenta.",
            "example": "Usa una contrase+�a segura con n+�meros y s+�mbolos.",
            "category": "derechos digitales y verificaci+�n",
            "tier": 3
          },
          {
            "word": "doble verificaci+�n",
            "definition": "Un paso extra de seguridad que pide un c+�digo aparte de la contrase+�a.",
            "example": "Activa la doble verificaci+�n en tu correo.",
            "category": "derechos digitales y verificaci+�n",
            "tier": 3
          }
        ]
      }
    ]
  }
]
  };

  if (typeof window !== 'undefined') window.DATA = DATA;
  if (typeof module !== 'undefined' && module.exports) module.exports = DATA;
})();
