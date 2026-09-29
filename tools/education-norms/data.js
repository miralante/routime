// Activity data: "Education and Good Manners".
// Daily-life simulation: recognisable scene + decision + consequence + transfer.
//
// Structure: { levels, situations }
// - levels: difficulty progression (changes one variable per level)
// - situations: 30+ training scenarios across school, public spaces, civic life
//
// NO UI logic or text here. Text goes in strings.es.js and strings.en.js.

var DATA = {
  levels: [
    { name: 'level.level1', maxSituations: 3 },  // Easy: 3 scenarios, 3 clear options
    { name: 'level.level2', maxSituations: 4 },  // Medium: 4 scenarios, adds "do nothing" distractor
    { name: 'level.level3', maxSituations: 5 }  // Hard: 5 scenarios, judgement calls
  ],

  // Each scenario has: context, character, message, options[], correct, level, hint
  // hint is a Socratic question shown on the FIRST mistake (rule 12)
  // Progression: simple classroom rules -> public spaces -> civic judgement

  situations: [
    // ---------- LEVEL 1: Basic classroom rules and routines ----------
    {
      context: 'situation.class_talk',
      character: 'teacher',
      message: 'message.teacher_speaking',
      options: ['option.quiet_and_listen', 'option.keep_shouting', 'option.run_out'],
      correct: 'option.quiet_and_listen',
      hint: 'hint.respect_turn',
      level: 1
    },
    {
      context: 'situation.ask_permission',
      character: 'teacher',
      message: 'message.question_class',
      options: ['option.raise_hand', 'option.shout_answer', 'option.leave_class'],
      correct: 'option.raise_hand',
      hint: 'hint.turn_class',
      level: 1
    },
    {
      context: 'situation.canteen_queue',
      character: 'monitor',
      message: 'message.canteen_wait',
      options: ['option.queue', 'option.cut_in', 'option.sit_floor'],
      correct: 'option.queue',
      hint: 'hint.fair_queue',
      level: 1
    },
    {
      context: 'situation.paper_floor',
      character: 'classmate',
      message: 'message.paper_dropped',
      options: ['option.pick_up', 'option.step_on', 'option.ignore'],
      correct: 'option.pick_up',
      hint: 'hint.clean_place',
      level: 1
    },
    {
      context: 'situation.lending_material',
      character: 'classmate',
      message: 'message.lend_pencil',
      options: ['option.lend_and_thank', 'option.refuse', 'option.break_it'],
      correct: 'option.lend_and_thank',
      hint: 'hint.sharing_helps',
      level: 1
    },
    {
      context: 'situation.bathroom_wait',
      character: 'classmate',
      message: 'message.bathroom_busy',
      options: ['option.wait_outside', 'option.knock_loud', 'option.force_door'],
      correct: 'option.wait_outside',
      hint: 'hint.privacy_respect',
      level: 1
    },

    // ---------- LEVEL 2: Public spaces and shared rules ----------
    {
      context: 'situation.library_silence',
      character: 'librarian',
      message: 'message.library_rules',
      options: ['option.speak_low', 'option.speak_loud', 'option.sing'],
      correct: 'option.speak_low',
      hint: 'hint.quiet_space',
      level: 2
    },
    {
      context: 'situation.bus_get_on',
      character: 'driver',
      message: 'message.bus_get_on',
      options: ['option.step_aside', 'option.push', 'option.skip_queue'],
      correct: 'option.step_aside',
      hint: 'hint.others_first',
      level: 2
    },
    {
      context: 'situation.park_play',
      character: 'other_child',
      message: 'message.park_wait_turn',
      options: ['option.wait_turn', 'option.take_toy', 'option.shout_child'],
      correct: 'option.wait_turn',
      hint: 'hint.turn_park',
      level: 2
    },
    {
      context: 'situation.recycling_container',
      character: 'teacher',
      message: 'message.recycling_container',
      options: ['option.yellow_bin', 'option.grey_bin', 'option.throw_street'],
      correct: 'option.yellow_bin',
      hint: 'hint.recycling_colour',
      level: 2
    },
    {
      context: 'situation.recycling_paper',
      character: 'teacher',
      message: 'message.recycling_paper',
      options: ['option.blue_bin', 'option.yellow_bin', 'option.throw_floor'],
      correct: 'option.blue_bin',
      hint: 'hint.recycling_colour',
      level: 2
    },
    {
      context: 'situation.crossing_light',
      character: 'person',
      message: 'message.light_red',
      options: ['option.wait_green', 'option.cross_red', 'option.run_street'],
      correct: 'option.wait_green',
      hint: 'hint.light_safety',
      level: 2
    },
    {
      context: 'situation.sidewalk_walk',
      character: 'elder',
      message: 'message.sidewalk_blocked',
      options: ['option.move_aside', 'option.push', 'option.stop_middle'],
      correct: 'option.move_aside',
      hint: 'hint.let_pass',
      level: 2
    },
    {
      context: 'situation.cinema_phone',
      character: 'viewer',
      message: 'message.cinema_quiet',
      options: ['option.silence_phone', 'option.call_friend', 'option.play_games'],
      correct: 'option.silence_phone',
      hint: 'hint.respect_others',
      level: 2
    },

    // ---------- LEVEL 3: Judgement calls — inclusion, honesty, helping ----------
    {
      context: 'situation.playground_exclude',
      character: 'classmate',
      message: 'message.playground_exclude',
      options: ['option.invite_play', 'option.laugh_with', 'option.do_nothing'],
      correct: 'option.invite_play',
      hint: 'hint.inclusion_friendship',
      level: 3
    },
    {
      context: 'situation.lost_object',
      character: 'teacher',
      message: 'message.object_lost',
      options: ['option.give_teacher', 'option.keep_it', 'option.hide'],
      correct: 'option.give_teacher',
      hint: 'hint.honesty_trust',
      level: 3
    },
    {
      context: 'situation.own_mistake',
      character: 'teacher',
      message: 'message.mistake_recognise',
      options: ['option.say_sorry', 'option.blame_other', 'option.say_nothing'],
      correct: 'option.say_sorry',
      hint: 'hint.responsibility',
      level: 3
    },
    {
      context: 'situation.argument_couple',
      character: 'classmate',
      message: 'message.classmate_fight',
      options: ['option.mediate_calm', 'option.take_side', 'option.shout_too'],
      correct: 'option.mediate_calm',
      hint: 'hint.dialogue_peace',
      level: 3
    },
    {
      context: 'situation.vandalism_wall',
      character: 'classmate',
      message: 'message.wall_graffiti',
      options: ['option.tell_teacher', 'option.join_in', 'option.do_nothing'],
      correct: 'option.tell_teacher',
      hint: 'hint.common_care',
      level: 3
    },
    {
      context: 'situation.pet_rescue',
      character: 'elder',
      message: 'message.dog_scared',
      options: ['option.help_calm', 'option.shout', 'option.run_after'],
      correct: 'option.help_calm',
      hint: 'hint.animal_wellbeing',
      level: 3
    },
    {
      context: 'situation.internet_hoax',
      character: 'friend',
      message: 'message.news_internet',
      options: ['option.check_before_share', 'option.share_fast', 'option.laugh_news'],
      correct: 'option.check_before_share',
      hint: 'hint.verify_information',
      level: 3
    },
    {
      context: 'situation.car_pedestrian',
      character: 'driver',
      message: 'message.car_waiting',
      options: ['option.wave_thanks', 'option.keep_walking', 'option.ignore'],
      correct: 'option.wave_thanks',
      hint: 'hint.thank_drivers',
      level: 3
    },

    // ---------- Additional scenarios for variety (total >= 25) ----------
    {
      context: 'situation.table_clean',
      character: 'monitor',
      message: 'message.collect_table',
      options: ['option.collect_tray', 'option.leave_tray', 'option.push_tray'],
      correct: 'option.collect_tray',
      hint: 'hint.clean_place',
      level: 2
    },
    {
      context: 'situation.bathroom_paper',
      character: 'classmate',
      message: 'message.bathroom_paper_floor',
      options: ['option.tell_cleaner', 'option.leave_floor', 'option.step_on_it'],
      correct: 'option.tell_cleaner',
      hint: 'hint.common_care',
      level: 2
    },
    {
      context: 'situation.water_tap',
      character: 'teacher',
      message: 'message.tap_left_open',
      options: ['option.close_tap', 'option.leave_open', 'option.play_water'],
      correct: 'option.close_tap',
      hint: 'hint.save_water',
      level: 1
    },
    {
      context: 'situation.light_class',
      character: 'classmate',
      message: 'message.light_on',
      options: ['option.turn_off_light', 'option.leave_on', 'option.turn_up_brightness'],
      correct: 'option.turn_off_light',
      hint: 'hint.save_energy',
      level: 2
    },
    {
      context: 'situation.speech_listen',
      character: 'classmate',
      message: 'message.classmate_presents',
      options: ['option.listen_carefully', 'option.talk_same_time', 'option.play_phone'],
      correct: 'option.listen_carefully',
      hint: 'hint.respect_turn',
      level: 2
    },
    {
      context: 'situation.cinema_queue',
      character: 'person',
      message: 'message.cinema_queue',
      options: ['option.wait_queue', 'option.cut_in', 'option.leave_cinema'],
      correct: 'option.wait_queue',
      hint: 'hint.fair_queue',
      level: 3
    },
    {
      context: 'situation.phone_class',
      character: 'teacher',
      message: 'message.phone_class',
      options: ['option.put_away', 'option.use_hidden', 'option.call_friend'],
      correct: 'option.put_away',
      hint: 'hint.class_attention',
      level: 1
    },
    {
      context: 'situation.birthday_invite',
      character: 'friend',
      message: 'message.party_not_invited',
      options: ['option.talk_to_them', 'option.bully_them', 'option.ignore_all'],
      correct: 'option.talk_to_them',
      hint: 'hint.inclusion_friendship',
      level: 3
    }
  ]
};
