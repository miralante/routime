/* ============================================================
   Datos: Se lo Cuento al Médico (Mi día a día — comunicar un
   síntoma corporal con words sencillas para poder contárselo
   a un médico).
   Formato: DATA.es / DATA.en, cada uno con:
   { porRonda, niveles: [{ id, name, descripcion, estrellas,
     items: [{ text, options: string[3], correct: indice }] }] }
   'text' describe una escena en 2ª persona (qué le pasa a la
   persona); la opción correcta es siempre la frase que mejor
   describe ese síntoma en primera persona para decírsela al
   médico. Complementa a tools/my-body (que practica notar la
   señal y elegir la acción de autocuidado): aquí se practica
   ponerla en words para otra persona.
   Progresión (regla 13, un solo cambio por nivel): nivel 1 usa
   dolor con localización clara (tripa, cabeza, garganta...);
   nivel 2 mantiene el mismo formato de 3 options y amplía el
   tipo de síntoma (picor, mareo, fiebre, tos...) añadiendo el
   matiz temporal ("desde ayer", "desde hace una semana").
   Para ampliar: añadir items al array del nivel correspondiente.
   app.js usa DATA[App.i18n.locale()] || DATA.es.
   ============================================================ */
const DATA = {
  es: {
    porRonda: 8,
    niveles: [
      {
        id: 1,
        name: 'Nivel 1',
        descripcion: 'Dónde me duele',
        estrellas: 1,
        items: [
          { text: 'Te duele la tripa desde esta mañana.', options: ['Me duele la tripa', 'Me duele la pierna', 'No me duele nada'], correct: 0 },
          { text: 'Te duele la cabeza.', options: ['Me duele la cabeza', 'Me duele el brazo', 'Tengo frío'], correct: 0 },
          { text: 'Te duele la garganta al tragar.', options: ['Me duele la garganta', 'Me duele el pie', 'Tengo sueño'], correct: 0 },
          { text: 'Te duele el oído.', options: ['Me duele el oído', 'Me duele la tripa', 'Tengo hambre'], correct: 0 },
          { text: 'Te duele una muela al comer.', options: ['Me duele una muela', 'Me duele la espalda', 'Tengo sed'], correct: 0 },
          { text: 'Te duele la espalda al agacharte.', options: ['Me duele la espalda', 'Me duele el ojo', 'Estoy cansado'], correct: 0 },
          { text: 'Te duele el pie al caminar.', options: ['Me duele el pie', 'Me duele la mano', 'Tengo calor'], correct: 0 },
          { text: 'Te duele la mano después de escribir mucho.', options: ['Me duele la mano', 'Me duele el cuello', 'Tengo frío'], correct: 0 },
          { text: 'Te duele el cuello al girar la cabeza.', options: ['Me duele el cuello', 'Me duele la rodilla', 'Tengo sueño'], correct: 0 },
          { text: 'Te duele la rodilla al subir escaleras.', options: ['Me duele la rodilla', 'Me duele el hombro', 'Tengo hambre'], correct: 0 },
          { text: 'Te duele el hombro al levantar el brazo.', options: ['Me duele el hombro', 'Me duele la tripa', 'Tengo sed'], correct: 0 },
          { text: 'Te duele el ojo y lo notas rojo.', options: ['Me duele el ojo', 'Me duele la garganta', 'Tengo frío'], correct: 0 },
          { text: 'Te duele el estómago después de comer.', options: ['Me duele el estómago', 'Me duele la muñeca', 'Tengo sueño'], correct: 0 }
        ]
      },
      {
        id: 2,
        name: 'Nivel 2',
        descripcion: 'Qué siento y desde cuándo',
        estrellas: 2,
        items: [
          { text: 'Te pica mucho la piel del brazo desde ayer.', options: ['Me pica el brazo desde ayer', 'Me duele el brazo desde hace un mes', 'No me pasa nada en el brazo'], correct: 0 },
          { text: 'Notas mareo cuando te levantas rápido.', options: ['Me mareo cuando me levanto rápido', 'Me pica la mano cuando como', 'Tengo mucha hambre por la mañana'], correct: 0 },
          { text: 'Tienes fiebre y notas el cuerpo caliente desde esta mañana.', options: ['Tengo fiebre desde esta mañana', 'Tengo frío desde hace una semana', 'Me duele el dedo desde ayer'], correct: 0 },
          { text: 'Tienes tos desde hace tres días.', options: ['Tengo tos desde hace tres días', 'Tengo sueño desde esta mañana', 'Me pica la garganta desde hace un año'], correct: 0 },
          { text: 'Notas náuseas después de comer.', options: ['Tengo náuseas después de comer', 'Me duele la oreja después de comer', 'Tengo sed después de dormir'], correct: 0 },
          { text: 'Te sientes muy cansado desde hace una semana, aunque duermes bien.', options: ['Estoy muy cansado desde hace una semana', 'Me pica la rodilla desde ayer', 'Tengo frío desde esta mañana'], correct: 0 },
          { text: 'Notas que te quema el pecho después de comer.', options: ['Me quema el pecho después de comer', 'Me pica el ojo después de comer', 'Tengo sueño después de comer'], correct: 0 },
          { text: 'Te duele la tripa y además tienes diarrea desde ayer.', options: ['Me duele la tripa y tengo diarrea desde ayer', 'Me duele la cabeza desde hace un mes', 'Tengo mucho frío desde esta mañana'], correct: 0 },
          { text: 'Notas manchas rojas en la piel desde hace dos días.', options: ['Tengo manchas rojas en la piel desde hace dos días', 'Tengo fiebre desde hace un año', 'Me duele el brazo desde ayer por la tarde'], correct: 0 },
          { text: 'Te falta el aire después de subir pocas escaleras.', options: ['Me falta el aire al subir escaleras', 'Me pica la mano al subir escaleras', 'Tengo hambre al subir escaleras'], correct: 0 },
          { text: 'Notas hormigueo en la pierna después de estar sentado mucho rato.', options: ['Tengo hormigueo en la pierna', 'Tengo fiebre en la pierna', 'Me duele el ojo'], correct: 0 },
          { text: 'Te duele la tripa desde hace una semana, cada día un poco.', options: ['Me duele la tripa desde hace una semana', 'Me duele la tripa desde hace cinco minutos', 'No me duele la tripa nunca'], correct: 0 },
          { text: 'Tienes la nariz tapada y estornudas mucho desde hace dos días.', options: ['Tengo la nariz tapada desde hace dos días', 'Tengo la nariz tapada desde hace un año', 'No tengo nada en la nariz'], correct: 0 }
        ]
      },
      {
        id: 3,
        name: 'Nivel 3',
        descripcion: 'Antes de entrar y en la sala de espera',
        estrellas: 3,
        items: [
          { text: 'Estás en la sala de espera y te llaman por tu nombre.', options: ['Levantar la mano, decir "soy yo" y seguir al profesional', 'Quedarte sentado en silencio sin moverte', 'Ir detrás de otra persona que se levante'], correct: 0 },
          { text: 'La persona de recepción te pregunta tu nombre.', options: ['Decir tu nombre despacio', 'Inventarte un name distinto', 'No contestar y mirar al suelo'], correct: 0 },
          { text: 'La persona de recepción te pregunta cuándo naciste.', options: ['Decir tu fecha de nacimiento despacio', 'Inventar otra fecha', 'No contestar'], correct: 0 },
          { text: 'La persona de recepción te pregunta por qué vienes.', options: ['Decirle en una frase lo que te pasa', 'Contarle toda tu vida', 'Decir "no sé" y marcharte'], correct: 0 },
          { text: 'Antes de salir de casa, tu madre te pregunta si llevas la tarjeta sanitaria.', options: ['Buscar la tarjeta sanitaria y meterla en el bolsillo', 'Decir que no hace falta', 'Meter un caramelo en su lugar'], correct: 0 },
          { text: 'El médico te ha dicho que vayas "en ayunas" para un análisis.', options: ['No desayunar nada hasta que te hagan el análisis', 'Desayunar mucho para tener fuerza', 'Solo beber mucho café'], correct: 0 },
          { text: 'Vas a la consulta y la enfermera te dice que te sientes y te relajes.', options: ['Sentarte y respirar despacio, como en Calma', 'Quedarte de pie sin saber dónde ponerte', 'Tumbarte en la camilla sin que te lo pidan'], correct: 0 },
          { text: 'Tu acompañante tiene que irse un momento y te quedas solo con el médico.', options: ['Decir lo que te pasa y preguntar lo que no entiendas', 'No hablar hasta que vuelva tu acompañante', 'Levantarte y salir sin decir nada'], correct: 0 },
          { text: 'El médico te pregunta si estás tomando alguna medicina.', options: ['Decir el nombre de las medicinas que tomas', 'Decir "no sé" siempre', 'Inventarte el nombre de una medicina'], correct: 0 },
          { text: 'Tienes dudas de lo que te ha dicho el médico.', options: ['Pedir que te lo explique otra vez con palabras más sencillas', 'Quedarte con la duda y no decir nada', 'Inventar una respuesta para parecer que lo has entendido'], correct: 0 },
          { text: 'El médico te da un papel con una receta.', options: ['Coger la receta, darle las gracias y preguntar si tienes dudas', 'Tirar el papel a la papelera', 'Meter el papel en el bolsillo sin mirarlo'], correct: 0 },
          { text: 'Tienes que volver a la consulta en una semana.', options: ['Pedir que te lo apunten y poner una alarma con tu acompañante', 'Decir que sí sin saber cuándo es', 'No volver aunque te encuentres mal'], correct: 0 }
        ]
      },
      {
        id: 4,
        name: 'Nivel 4',
        descripcion: 'Entiendo lo que me dicen',
        estrellas: 3,
        items: [
          { text: 'El médico te dice: "te vamos a hacer un análisis de sangre".', options: ['Me van a sacar un poco de sangre para mirarla', 'Me van a operar del corazón', 'Me van a poner una inyección para dormirme'], correct: 0 },
          { text: 'El médico te dice: "esto se cura en una semana".', options: ['En una semana estaré mejor', 'Me tendré que quedar en el hospital un mes', 'Ya nunca se me pasará'], correct: 0 },
          { text: 'El médico te dice: "vuelve si empeoras".', options: ['Tengo que volver a la consulta si me encuentro peor', 'Tengo que ir a urgencias hoy mismo', 'No tengo que volver nunca más'], correct: 0 },
          { text: 'El médico te dice: "tómate la medicina después de comer".', options: ['Tengo que tomar la medicina cuando termine de comer', 'Tengo que tomar la medicina antes de dormir', 'Tengo que tomar la medicina con el estómago vacío'], correct: 0 },
          { text: 'El médico te dice: "no te preocupes, es algo leve".', options: ['Es algo pequeño y me voy a poner bien', 'Es algo grave y tengo que preocuparme mucho', 'El médico no sabe lo que dice'], correct: 0 },
          { text: 'El médico te dice: "bebe mucho agua".', options: ['Tengo que beber agua muchas veces al día', 'Solo puedo beber agua una vez al día', 'No puedo beber agua nunca más'], correct: 0 },
          { text: 'El médico te dice: "duerme ocho horas".', options: ['Tengo que dormir unas ocho horas cada noche', 'Tengo que dormir solo cuatro horas', 'Tengo que dormir todo el día'], correct: 0 },
          { text: 'El médico te dice: "no hagas esfuerzos".', options: ['Tengo que descansar y no cargar cosas pesadas', 'Tengo que correr mucho cada día', 'Tengo que levantar pesas en el gimnasio'], correct: 0 },
          { text: 'El médico te dice: "te vamos a hacer una radiografía".', options: ['Me van a hacer una foto del cuerpo por dentro', 'Me van a poner una vacuna', 'Me van a operar'], correct: 0 },
          { text: 'El médico te dice: "pide cita con tu médico de cabecera".', options: ['Tengo que llamar a mi médico de siempre para volver', 'Tengo que ir a urgencias ahora', 'Tengo que llamar a una ambulancia'], correct: 0 },
          { text: 'El médico te dice: "no fumes y no bebas alcohol".', options: ['No puedo fumar ni tomar bebidas con alcohol', 'Solo puedo fumar un poco al día', 'Puedo beber todo el alcohol que quiera'], correct: 0 },
          { text: 'El médico te dice: "si te pica mucho, avísanos".', options: ['Si me pica mucho, tengo que llamar o volver a la consulta', 'Tengo que rascarme muy fuerte sin decir nada', 'Tengo que esperar a que se pase solo'], correct: 0 }
        ]
      }
    ]
  },
  en: {
    porRonda: 8,
    niveles: [
      {
        id: 3,
        name: 'Level 3',
        descripcion: 'Before the visit and in the waiting room',
        estrellas: 3,
        items: [
          { text: 'You are in the waiting room and someone calls your name.', options: ['Raise your hand, say "that is me" and follow the staff member', 'Stay seated in silence without moving', 'Follow another person who stands up'], correct: 0 },
          { text: 'The receptionist asks your name.', options: ['Say your name slowly', 'Make up a different name', 'Stay silent and look at the floor'], correct: 0 },
          { text: 'The receptionist asks when you were born.', options: ['Say your date of birth slowly', 'Make up a different date', 'Do not answer'], correct: 0 },
          { text: 'The receptionist asks why you are here.', options: ['Tell them in one sentence what is wrong', 'Tell them your whole life story', 'Say "I do not know" and leave'], correct: 0 },
          { text: 'Before leaving home, your mother asks if you have your health card.', options: ['Find the health card and put it in your pocket', 'Say it is not needed', 'Put a candy in its place'], correct: 0 },
          { text: 'The doctor told you to come "fasting" for a blood test.', options: ['Do not eat anything until the test is done', 'Eat a big breakfast for energy', 'Only drink a lot of coffee'], correct: 0 },
          { text: 'You arrive at the office and the nurse tells you to sit down and relax.', options: ['Sit down and breathe slowly, like in Calm', 'Stay standing without knowing where to go', 'Lie down on the exam table without being asked'], correct: 0 },
          { text: 'Your companion has to step out for a moment and you stay alone with the doctor.', options: ['Say what is wrong and ask about anything you do not understand', 'Stay silent until your companion comes back', 'Get up and leave without saying anything'], correct: 0 },
          { text: 'The doctor asks if you are taking any medicine.', options: ['Say the name of the medicines you take', 'Always say "I do not know"', 'Make up the name of a medicine'], correct: 0 },
          { text: 'You are not sure about what the doctor just said.', options: ['Ask them to explain it again in simpler words', 'Keep the doubt and say nothing', 'Make up an answer to look as if you understood'], correct: 0 },
          { text: 'The doctor hands you a paper with a prescription.', options: ['Take the prescription, say thank you and ask if you have any doubt', 'Throw the paper in the bin', 'Put it in your pocket without looking at it'], correct: 0 },
          { text: 'You have to go back to the doctor in a week.', options: ['Ask them to write it down and set an alarm with your companion', 'Say yes without knowing when it is', 'Do not go back even if you feel worse'], correct: 0 }
        ]
      },
      {
        id: 4,
        name: 'Level 4',
        descripcion: 'Understanding what they tell me',
        estrellas: 3,
        items: [
          { text: 'The doctor says: "we are going to do a blood test".', options: ['They will take a little of my blood to look at it', 'They will operate on my heart', 'They will give me a shot to put me to sleep'], correct: 0 },
          { text: 'The doctor says: "this will clear up in a week".', options: ['In a week I will feel better', 'I will have to stay in hospital for a month', 'It will never go away'], correct: 0 },
          { text: 'The doctor says: "come back if it gets worse".', options: ['I have to come back to the office if I feel worse', 'I have to go to A&E right now', 'I never have to come back'], correct: 0 },
          { text: 'The doctor says: "take the medicine after eating".', options: ['I have to take the medicine when I finish eating', 'I have to take the medicine before sleeping', 'I have to take the medicine on an empty stomach'], correct: 0 },
          { text: 'The doctor says: "do not worry, it is something mild".', options: ['It is something small and I will get better', 'It is something serious and I have to worry a lot', 'The doctor does not know what they are saying'], correct: 0 },
          { text: 'The doctor says: "drink plenty of water".', options: ['I have to drink water many times during the day', 'I can only drink water once a day', 'I can never drink water again'], correct: 0 },
          { text: 'The doctor says: "sleep eight hours".', options: ['I have to sleep about eight hours every night', 'I have to sleep only four hours', 'I have to sleep all day'], correct: 0 },
          { text: 'The doctor says: "do not make any effort".', options: ['I have to rest and not carry heavy things', 'I have to run a lot every day', 'I have to lift weights at the gym'], correct: 0 },
          { text: 'The doctor says: "we are going to take an X-ray".', options: ['They will take a picture of the inside of my body', 'They will give me a vaccine', 'They will operate on me'], correct: 0 },
          { text: 'The doctor says: "book an appointment with your GP".', options: ['I have to call my usual doctor to go back', 'I have to go to A&E right now', 'I have to call an ambulance'], correct: 0 },
          { text: 'The doctor says: "do not smoke and do not drink alcohol".', options: ['I cannot smoke or drink alcohol', 'I can only smoke a little each day', 'I can drink as much alcohol as I want'], correct: 0 },
          { text: 'The doctor says: "if it itches a lot, let us know".', options: ['If it itches a lot, I have to call or go back to the office', 'I have to scratch very hard without telling anyone', 'I have to wait for it to go away on its own'], correct: 0 }
        ]
      },
      {
        id: 1,
        name: 'Level 1',
        descripcion: 'Where it hurts',
        estrellas: 1,
        items: [
          { text: 'Your tummy has hurt since this morning.', options: ['My tummy hurts', 'My leg hurts', 'Nothing hurts'], correct: 0 },
          { text: 'You have a headache.', options: ['My head hurts', 'My arm hurts', 'I am cold'], correct: 0 },
          { text: 'Your throat hurts when you swallow.', options: ['My throat hurts', 'My foot hurts', 'I am sleepy'], correct: 0 },
          { text: 'Your ear hurts.', options: ['My ear hurts', 'My tummy hurts', 'I am hungry'], correct: 0 },
          { text: 'A tooth hurts when you eat.', options: ['A tooth hurts', 'My back hurts', 'I am thirsty'], correct: 0 },
          { text: 'Your back hurts when you bend down.', options: ['My back hurts', 'My eye hurts', 'I am tired'], correct: 0 },
          { text: 'Your foot hurts when you walk.', options: ['My foot hurts', 'My hand hurts', 'I am hot'], correct: 0 },
          { text: 'Your hand hurts after writing a lot.', options: ['My hand hurts', 'My neck hurts', 'I am cold'], correct: 0 },
          { text: 'Your neck hurts when you turn your head.', options: ['My neck hurts', 'My knee hurts', 'I am sleepy'], correct: 0 },
          { text: 'Your knee hurts when you go up stairs.', options: ['My knee hurts', 'My shoulder hurts', 'I am hungry'], correct: 0 },
          { text: 'Your shoulder hurts when you lift your arm.', options: ['My shoulder hurts', 'My tummy hurts', 'I am thirsty'], correct: 0 },
          { text: 'Your eye hurts and looks red.', options: ['My eye hurts', 'My throat hurts', 'I am cold'], correct: 0 },
          { text: 'Your stomach hurts after eating.', options: ['My stomach hurts', 'My wrist hurts', 'I am sleepy'], correct: 0 }
        ]
      },
      {
        id: 2,
        name: 'Level 2',
        descripcion: 'What you feel and since when',
        estrellas: 2,
        items: [
          { text: 'Your arm has been very itchy since yesterday.', options: ['My arm has been itchy since yesterday', 'My arm has hurt for a month', 'Nothing is wrong with my arm'], correct: 0 },
          { text: 'You feel dizzy when you stand up quickly.', options: ['I feel dizzy when I stand up quickly', 'My hand itches when I eat', 'I am very hungry in the morning'], correct: 0 },
          { text: 'You have a fever and your body feels hot since this morning.', options: ['I have had a fever since this morning', 'I have been cold for a week', 'My finger has hurt since yesterday'], correct: 0 },
          { text: 'You have had a cough for three days.', options: ['I have had a cough for three days', 'I have been sleepy since this morning', 'My throat has itched for a year'], correct: 0 },
          { text: 'You feel sick after eating.', options: ['I feel sick after eating', 'My ear hurts after eating', 'I am thirsty after sleeping'], correct: 0 },
          { text: 'You have felt very tired for a week, even though you sleep well.', options: ['I have felt very tired for a week', 'My knee has itched since yesterday', 'I have been cold since this morning'], correct: 0 },
          { text: 'You feel a burning in your chest after eating.', options: ['My chest burns after eating', 'My eye itches after eating', 'I feel sleepy after eating'], correct: 0 },
          { text: 'Your tummy hurts and you have had diarrhoea since yesterday.', options: ['My tummy hurts and I have had diarrhoea since yesterday', 'My head has hurt for a month', 'I have been very cold since this morning'], correct: 0 },
          { text: 'You notice red spots on your skin since two days ago.', options: ['I have had red spots on my skin for two days', 'I have had a fever for a year', 'My arm has hurt since yesterday afternoon'], correct: 0 },
          { text: 'You run out of breath after climbing just a few stairs.', options: ['I run out of breath climbing stairs', 'My hand itches climbing stairs', 'I am hungry climbing stairs'], correct: 0 },
          { text: 'You feel tingling in your leg after sitting for a long time.', options: ['I have tingling in my leg', 'I have a fever in my leg', 'My eye hurts'], correct: 0 },
          { text: 'Your tummy has hurt a little every day for a week.', options: ['My tummy has hurt for a week', 'My tummy has hurt for five minutes', 'My tummy never hurts'], correct: 0 },
          { text: 'Your nose has been blocked and you keep sneezing for two days.', options: ['My nose has been blocked for two days', 'My nose has been blocked for a year', 'Nothing is wrong with my nose'], correct: 0 }
        ]
      }
    ]
  }
};
