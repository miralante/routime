// Activity data: "Normas de Educación" (good manners and civic education).
// Daily-life simulation: recognisable scene + decision + consequence + transfer.
//
// Structure: { niveles, situaciones }
// - niveles: difficulty progression (changes one variable per level)
// - situaciones: 30+ training scenarios across school, public spaces, civic life
//
// NO UI logic or text here. Text goes in strings.es.js and strings.en.js.

var DATA = {
  niveles: [
    { nombre: 'nivel.nivel1', maxSituaciones: 3 },  // Easy: 3 scenarios, 3 clear options
    { nombre: 'nivel.nivel2', maxSituaciones: 4 },  // Medium: 4 scenarios, adds "do nothing" distractor
    { nombre: 'nivel.nivel3', maxSituaciones: 5 }   // Hard: 5 scenarios, judgement calls
  ],

  // Each scenario has: contexto, personaje, mensaje, opciones[], correcta, nivel, pista
  // pista is a Socratic question shown on the FIRST mistake (rule 12)
  // Progression: simple classroom rules -> public spaces -> civic judgement

  situaciones: [
    // ---------- NIVEL 1: Basic classroom rules and routines ----------
    {
      contexto: 'situacion.aula_hablar',
      personaje: 'profesor',
      mensaje: 'mensaje.profesor_hablando',
      opciones: ['opcion.callar_y_escuchar', 'opcion.gritar_mas', 'opcion.correr_salir'],
      correcta: 'opcion.callar_y_escuchar',
      pista: 'pista.respeto_turno',
      nivel: 1
    },
    {
      contexto: 'situacion.pedir_palabra',
      personaje: 'profesor',
      mensaje: 'mensaje.pregunta_clase',
      opciones: ['opcion.levantar_mano', 'opcion.gritar_respuesta', 'opcion.salir_aula'],
      correcta: 'opcion.levantar_mano',
      pista: 'pista.turno_clase',
      nivel: 1
    },
    {
      contexto: 'situacion.comedor_cola',
      personaje: 'monitor',
      mensaje: 'mensaje.comedor_espera',
      opciones: ['opcion.hacer_cola', 'opcion.colarse', 'opcion.sentarse_suelo'],
      correcta: 'opcion.hacer_cola',
      pista: 'pista.cola_justa',
      nivel: 1
    },
    {
      contexto: 'situacion.papel_suelo',
      personaje: 'companero',
      mensaje: 'mensaje.papel_caido',
      opciones: ['opcion.recoger', 'opcion.pisar', 'opcion.ignorar'],
      correcta: 'opcion.recoger',
      pista: 'pista.lugar_limpio',
      nivel: 1
    },
    {
      contexto: 'situacion.material_prestado',
      personaje: 'companero',
      mensaje: 'mensaje.prestar_material',
      opciones: ['opcion.prestar_y_gracias', 'opcion.negarse', 'opcion.romperlo'],
      correcta: 'opcion.prestar_y_gracias',
      pista: 'pista.compartir_ayuda',
      nivel: 1
    },
    {
      contexto: 'situacion.bano_espera',
      personaje: 'companero',
      mensaje: 'mensaje.bano_ocupado',
      opciones: ['opcion.espaciar_fuera', 'opcion.tocar_puerta_fuerte', 'opcion.forzar_puerta'],
      correcta: 'opcion.espaciar_fuera',
      pista: 'pista.intimidad_respeto',
      nivel: 1
    },

    // ---------- NIVEL 2: Public spaces and shared rules ----------
    {
      contexto: 'situacion.biblioteca_silencio',
      personaje: 'bibliotecaria',
      mensaje: 'mensaje.biblioteca_normas',
      opciones: ['opcion.hablar_bajo', 'opcion.hablar_alto', 'opcion.cantar'],
      correcta: 'opcion.hablar_bajo',
      pista: 'pista.silencio_espacio',
      nivel: 2
    },
    {
      contexto: 'situacion.autobus_sube',
      personaje: 'conductor',
      mensaje: 'mensaje.autobus_subir',
      opciones: ['opcion.dejar_pasar', 'opcion.empujar', 'opcion.saltarse_cola'],
      correcta: 'opcion.dejar_pasar',
      pista: 'pista.primero_otros',
      nivel: 2
    },
    {
      contexto: 'situacion.parque_juego',
      personaje: 'nino_otro',
      mensaje: 'mensaje.parque_espera_turno',
      opciones: ['opcion.esperar_turno', 'opcion.quitar_juguete', 'opcion.gritar_al_nino'],
      correcta: 'opcion.esperar_turno',
      pista: 'pista.turno_parque',
      nivel: 2
    },
    {
      contexto: 'situacion.reciclar_envase',
      personaje: 'profesor',
      mensaje: 'mensaje.envase_reciclar',
      opciones: ['opcion.contenedor_amarillo', 'opcion.contenedor_gris', 'opcion.tirar_calle'],
      correcta: 'opcion.contenedor_amarillo',
      pista: 'pista.reciclar_color',
      nivel: 2
    },
    {
      contexto: 'situacion.reciclar_papel',
      personaje: 'profesor',
      mensaje: 'mensaje.papel_reciclar',
      opciones: ['opcion.contenedor_azul', 'opcion.contenedor_amarillo', 'opcion.tirar_suelo'],
      correcta: 'opcion.contenedor_azul',
      pista: 'pista.reciclar_color',
      nivel: 2
    },
    {
      contexto: 'situacion.cruce_semaforo',
      personaje: 'persona',
      mensaje: 'mensaje.semaforo_rojo',
      opciones: ['opcion.esperar_verde', 'opcion.cruzar_rojo', 'opcion.correr_calle'],
      correcta: 'opcion.esperar_verde',
      pista: 'pista.semaforo_seguridad',
      nivel: 2
    },
    {
      contexto: 'situacion.acera_andar',
      personaje: 'mayor',
      mensaje: 'mensaje.acera_ocupada',
      opciones: ['opcion.apartarse', 'opcion.empujar', 'opcion.pararse_medio'],
      correcta: 'opcion.apartarse',
      pista: 'pista.dejar_pasar',
      nivel: 2
    },
    {
      contexto: 'situacion.cine_celular',
      personaje: 'espectador',
      mensaje: 'mensaje.cine_silencio',
      opciones: ['opcion.silencio_celular', 'opcion.llamar_amigo', 'opcion.jugar_videojuego'],
      correcta: 'opcion.silencio_celular',
      pista: 'pista.respeto_otros',
      nivel: 2
    },

    // ---------- NIVEL 3: Judgement calls — inclusion, honesty, helping ----------
    {
      contexto: 'situacion.recreo_excluir',
      personaje: 'companero',
      mensaje: 'mensaje.recreo_excluir',
      opciones: ['opcion.invitar_jugar', 'opcion.reirse_con_ellos', 'opcion.no_hacer_nada'],
      correcta: 'opcion.invitar_jugar',
      pista: 'pista.inclusion_amistad',
      nivel: 3
    },
    {
      contexto: 'situacion.perdido_objeto',
      personaje: 'profesor',
      mensaje: 'mensaje.objeto_perdido',
      opciones: ['opcion.entregar_profesor', 'opcion.quedarse_objeto', 'opcion.esconder'],
      correcta: 'opcion.entregar_profesor',
      pista: 'pista.honestidad_confianza',
      nivel: 3
    },
    {
      contexto: 'situacion.error_propio',
      personaje: 'profesor',
      mensaje: 'mensaje.error_reconocer',
      opciones: ['opcion.pedir_perdon', 'opcion.echar_la culpa', 'opcion.no_decir_nada'],
      correcta: 'opcion.pedir_perdon',
      pista: 'pista.responsabilidad',
      nivel: 3
    },
    {
      contexto: 'situacion.discusion_pareja',
      personaje: 'companero',
      mensaje: 'mensaje.companero_pelea',
      opciones: ['opcion.mediar_palabra', 'opcion.ponerse_de_un_lado', 'opcion.gritar_tambien'],
      correcta: 'opcion.mediar_palabra',
      pista: 'pista.dialogo_paz',
      nivel: 3
    },
    {
      contexto: 'situacion.vandalismo_pared',
      personaje: 'companero',
      mensaje: 'mensaje.pintada_pared',
      opciones: ['opcion.avisar_profesor', 'opcion.sumarme', 'opcion.no_hacer_nada'],
      correcta: 'opcion.avisar_profesor',
      pista: 'pista.cuidado_comun',
      nivel: 3
    },
    {
      contexto: 'situacion.mascota_rescate',
      personaje: 'mayor',
      mensaje: 'mensaje.perro_asustado',
      opciones: ['opcion.ayudar_tranquilo', 'opcion.gritar', 'opcion.correr_detras'],
      correcta: 'opcion.ayudar_tranquilo',
      pista: 'pista.bienestar_animal',
      nivel: 3
    },
    {
      contexto: 'situacion.internet_bulo',
      personaje: 'amigo',
      mensaje: 'mensaje.noticia_internet',
      opciones: ['opcion.comprobar_antes_compartir', 'opcion.compartir_rapido', 'opcion.reirme'],
      correcta: 'opcion.comprobar_antes_compartir',
      pista: 'pista.verificar_informacion',
      nivel: 3
    },
    {
      contexto: 'situacion.coche_peaton',
      personaje: 'conductor',
      mensaje: 'mensaje.coche_esperando',
      opciones: ['opcion.gracias_mano', 'opcion.seguir_andando', 'opcion.ignorar'],
      correcta: 'opcion.gracias_mano',
      pista: 'pista.agradecer_conductores',
      nivel: 3
    },

    // ---------- Additional scenarios for variety (total >= 25) ----------
    {
      contexto: 'situacion.mesa_limpia',
      personaje: 'monitor',
      mensaje: 'mensaje.recoger_mesa',
      opciones: ['opcion.recoger_bandeja', 'opcion.dejar_bandeja', 'opcion.empujar_a_otro'],
      correcta: 'opcion.recoger_bandeja',
      pista: 'pista.lugar_limpio',
      nivel: 2
    },
    {
      contexto: 'situacion.bano_papel',
      personaje: 'companero',
      mensaje: 'mensaje.bano_papel_suelo',
      opciones: ['opcion.avisar_limpieza', 'opcion.dejarlo_suelo', 'opcion.pisarlo'],
      correcta: 'opcion.avisar_limpieza',
      pista: 'pista.cuidado_comun',
      nivel: 2
    },
    {
      contexto: 'situacion.agua_grifo',
      personaje: 'profesor',
      mensaje: 'mensaje.grifo_cerrado',
      opciones: ['opcion.cerrar_grifo', 'opcion.dejar_abierto', 'opcion.jugar_agua'],
      correcta: 'opcion.cerrar_grifo',
      pista: 'pista.ahorro_agua',
      nivel: 1
    },
    {
      contexto: 'situacion.luz_aula',
      personaje: 'companero',
      mensaje: 'mensaje.luz_encendida',
      opciones: ['opcion.apagar_luz', 'opcion.dejar_encendida', 'opcion.subir_brillo'],
      correcta: 'opcion.apagar_luz',
      pista: 'pista.ahorro_energia',
      nivel: 2
    },
    {
      contexto: 'situacion.discurso_escucha',
      personaje: 'companero',
      mensaje: 'mensaje.companero_expone',
      opciones: ['opcion.escuchar_atento', 'opcion.hablar_a_la_vez', 'opcion.jugar_telefono'],
      correcta: 'opcion.escuchar_atento',
      pista: 'pista.respeto_turno',
      nivel: 2
    },
    {
      contexto: 'situacion.fila_cine',
      personaje: 'persona',
      mensaje: 'mensaje.cine_cola',
      opciones: ['opcion.esperar_cola', 'opcion.colarse', 'opcion.salir'],
      correcta: 'opcion.esperar_cola',
      pista: 'pista.cola_justa',
      nivel: 3
    },
    {
      contexto: 'situacion.celular_clase',
      personaje: 'profesor',
      mensaje: 'mensaje.telefono_clase',
      opciones: ['opcion.guardar_mochila', 'opcion.usar_oculto', 'opcion.llamar_amigo'],
      correcta: 'opcion.guardar_mochila',
      pista: 'pista.atencion_clase',
      nivel: 1
    },
    {
      contexto: 'situacion.cumpleanos_invitar',
      personaje: 'amigo',
      mensaje: 'mensaje.fiesta_no_invita',
      opciones: ['opcion.hablar_con_el', 'opcion.hacer_bullying', 'opcion.ignorar_todo'],
      correcta: 'opcion.hablar_con_el',
      pista: 'pista.inclusion_amistad',
      nivel: 3
    }
  ]
};