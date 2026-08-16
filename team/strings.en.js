/* ============================================================
   Apptonomia — Support team guide text (EN)
   Language-specific file. Loaded conditionally from index.html
   based on App.i18n.locale().
   ============================================================ */
(function () {
  'use strict';

  App.i18n.register({
    "pageTitle": 'Guide for the support team',
    "routeNotice": 'Page for the support team. It does not appear in the app menu: the only way here is typing this address.',
    "title": 'Apptonomia — Guide for the support team',
    "intro1": 'Information for ',
    "introStrong": 'families, occupational therapists and teachers',
    "intro2": ' about the project’s goals, the areas it works on, and the therapeutic purpose of each activity. It includes a technical note for the AI agent that maintains the code.',
    "navProject": 'The project',
    "navDesign": 'How it is designed',
    "navAreas": 'Areas and activities',
    "navProgress": 'Progress and privacy',
    "navSupport": 'How to support without taking over',
    "navExceptions": 'Pure-skill training',
    "navAgentAI": 'Technical note (AI)',
    "projectTitle": 'The project',
    "projectP1a": 'Apptonomia is an ',
    "projectP1Strong1": 'occupational therapy',
    "projectP1b": ' web app for people with intellectual disabilities. Its goal is to offer cognitive stimulation, motor skill and daily-living exercises that the person can do ',
    "projectP1Strong2": 'on their own',
    "projectP1c": ', without a professional beside them.',
    "projectLi1Label": 'Autonomy',
    "projectLi1Text": 'everything is understood and used without help. Works offline (can be installed as an app), no sign-up and no cost.',
    "projectLi2Label": 'Functional independence',
    "projectLi2Text": 'the activities train skills that are useful day to day — handling money, telling time, following routines, typing on a keyboard, asking for calm.',
    "projectLi3Label": 'Cognitive stimulation',
    "projectLi3Text": 'memory, attention, reasoning, language and emotional management, with graded difficulty and no pressure.',
    "projectP2a": 'The interface the person using the app sees ',
    "projectP2Strong": 'never',
    "projectP2b": ' uses clinical language ("patient", "therapy", "disability"). This page is the only one with that vocabulary, because it is written for the support team.',
    "designTitle": 'How it is designed',
    "designIntro": 'Every screen follows these principles. If you notice something that does not, that is a bug to fix.',
    "designLi1Label": 'Plain Language',
    "designLi1Text": 'short sentences, one idea per sentence, no metaphors or irony.',
    "designLi2Label": 'No pressure',
    "designLi2Text": 'no visible timers, no negative scoring, no "game over". Mistakes get encouragement ("Almost. Try again!"), never punishment.',
    "designLi3Label": 'Positive reinforcement',
    "designLi3Text": 'immediate and brief when the person gets it right. Stars ⭐ only ever add up.',
    "designLi4Label": 'No comparing people',
    "designLi4Text": 'no rankings and no competition.',
    "designLi5Label": 'Accessibility',
    "designLi5Text": 'large buttons (64 pixels minimum), large text, high contrast, audio 🔊 only when gamification or the activity design requires it (e.g. hearing what is typed on the keyboard, listening to a sequence), full keyboard navigation, and animations that turn off if the system asks for it.',
    "designLi6Label": 'Few options at once',
    "designLi6Text": 'a maximum of 4–6 visible options and one main action per screen.',
    "areasTitle": 'The six areas of work and their activities',
    "areasIntro": 'The main menu groups activities into six modules, each with its own color. Here you can see what each activity works on from a therapeutic point of view.',
    "colActivity": 'Activity',
    "colDoes": 'What the person does',
    "colWorks": 'What it works on',
    "colDaily": 'In daily life',
    "module1Title": '🎯 Aiming and hands — Coordination and motor skills',
    "module1Intro": 'Eye-hand coordination, fine motor skills, handwriting readiness, writing and copying.',
    "module2Title": '📋 My day to day — Independence and home',
    "module2Intro": 'Daily-living activities, household tasks, organization and everyday-situation behavior.',
    "module3Title": '🧠 Memory and attention',
    "module3Intro": 'Visual, auditory and short-term memory; sustained attention; global and detail perception.',
    "module4Title": '🎲 Board games',
    "module4Intro": 'Six classic board games, with levels and an opponent that plays gently.',
    "module5Title": '💬 Language and words — Language and communication',
    "module5Intro": 'Vocabulary, categories, reading comprehension, figurative language and humor.',
    "module6Title": '💜 Emotions — Emotions and relationships',
    "module6Intro": 'Recognizing and expressing emotions, self-regulation, breathing and conflict resolution.',
    "module7Title": '💗 Body and relationships — Affective-sexual education',
    "module7Intro": 'Body, consent, healthy relationships and sexual and reproductive health, always pointing to trusted people or health professionals.',
    activity: {
      "catch": {
        "name": 'Catch It',
        "does": 'Taps a target that keeps changing position. Difficulty rises on its own, unannounced: first one target, then several at once, and later tapping them in the order of their numbers.',
        "works": 'Eye-hand coordination, precision, reaction time (never shown as a score).',
        "daily": 'Practice real aiming games together (throwing a ball into a basket, velcro darts).'
      },
      "connect-dots": {
        "name": 'Connect the Dots',
        "does": 'Touches numbers in order (5, 7 or 9 depending on the level); each correct tap draws a line to the next dot and, once finished, a closed shape appears (house, boat, star, arrow, fish, rocket...).',
        "works": 'Gesture precision, following a numeric sequence, motor planning.',
        "daily": 'Let them connect the dots in real puzzle books or draw by following numbers on paper.'
      },
      "tracing": {
        "name": 'Traces',
        "does": 'Traces shapes and letters by following a dotted line.',
        "works": 'Handwriting readiness, stroke control, pre-writing skills.',
        "daily": 'Give them sheets to trace, or let them draw freely with pencil and paper.'
      },
      "coloring": {
        "name": 'Coloring',
        "does": 'Colors pictures zone by zone.',
        "works": 'Creativity, perception, fine motor skills, free choice.',
        "daily": 'Keep colored pencils and coloring pages handy at home.'
      },
      "piano-keys": {
        "name": 'Piano',
        "does": 'Plays the computer keyboard like a piano: freely, following a melody, memorizing sequences (Simon says), learning songs, or composing their own.',
        "works": 'Hand-ear coordination, fine motor skills, musicality and rhythm, sequential memory.',
        "daily": 'If there is a real keyboard or piano at home, let them freely play what they have practiced.'
      },
      "builders": {
        "name": 'Builders',
        "does": 'A Minecraft-style block world with two modes: build freely (choosing the world size) or follow a model, where each cell gently shows which block goes there and the build celebrates itself once finished. A mistake is never penalized.',
        "works": 'Fine motor skills, creativity, attention to detail and optional model-copying (a guided, more open version than The Blocks).',
        "daily": 'Give them real blocks or pieces to build freely or copy from a photo.'
      },
      "routines": {
        "name": 'My Routines',
        "does": 'Follows step by step the typical routines of a home: morning, personal care, meals, household tasks, pets, afternoon, leaving home and night.',
        "works": 'Sequencing, self-care habits, personal and domestic autonomy. Resets every day.',
        "daily": 'Print or copy the routine and hang it where it happens (bathroom, kitchen). After practicing it, do it together for real.'
      },
      "house": {
        "name": 'The House',
        "does": 'Orders the steps of household tasks: setting the table, sweeping, mopping, making the bed, taking out the trash, watering plants, caring for pets…',
        "works": 'Planning, prioritizing, logical sequence of everyday household tasks.',
        "daily": 'Pick a real household task and do it together following the ordered steps.'
      },
      "situations": {
        "name": 'Situations',
        "does": 'Chooses what they would do in an everyday situation ("What do you do if…?").',
        "works": 'Social judgment, self-control, everyday safety.',
        "daily": 'Talk together about what you would really do if the same situation happened.'
      },
      "safe-chat": {
        "name": 'Safe Chat',
        "does": 'Practices in simulated chats how to respond to people who try to manipulate them: asking for photos, personal details, passwords, secrets or meetups.',
        "works": 'Prevention of online abuse and deception (grooming, scams), digital assertiveness, spotting warning signs, asking trusted people for help.',
        "daily": 'Review the privacy settings of their real apps and social media together.'
      },
      "bullying-chat": {
        "name": 'Bullying Chat',
        "does": 'Practices in simulated chats how to recognize bullying among peers (insults, exclusion, rumors, photos taken to laugh at someone, threats, pressure to bully someone else) and what to do about it.',
        "works": 'Telling bullying and cyberbullying apart from normal conflict; the right response always includes telling a trusted person; the bystander’s role (not joining in, supporting, and reporting it).',
        "daily": 'Agree together on who the trusted person is to tell if something happens.'
      },
      "post-or-not": {
        "name": 'Should I Post It?',
        "does": 'Decides what is safer in social media situations: photos showing personal details, fake profiles, viral challenges, chain hoaxes, scams and privacy settings.',
        "works": 'Protecting personal data and digital footprint, critical thinking about strangers and viral content, spotting deception, asking trusted people for help before sharing something doubtful.',
        "daily": 'Review together what they actually share on their social media and its privacy settings.'
      },
      "social-safety": {
        "name": 'Social Media, Privacy and the Law',
        "does": 'Works through 27 non-graphic cases about sexual manipulation, intimate images, pornography, blackmail, fake images and asking for help.',
        "works": 'Recognizing grooming and sexual pressure, consent, digital privacy, stopping the spread of content, and a basic understanding of possible legal consequences.',
        "daily": 'Always use it with professional or family supervision. Remind them that asking for help never means it is their fault, and agree on who the trusted people are.'
      },
      "signs": {
        "name": 'Signs',
        "does": 'Recognizes street and building signs (danger, restroom, forbidden, exit, emergency, transport) and chooses what each one means.',
        "works": 'Community safety: understanding everyday signage to get around independently. 6 levels, one per type of sign.',
        "daily": 'Look for and talk about real signs out on the street: "what do you think that one means?"'
      },
      "times-of-day": {
        "name": 'Times of Day',
        "does": 'Places each daily task (having breakfast, doing homework, having dinner…) in the right time of day: Morning, Afternoon or Night.',
        "works": 'Structure and sequence of the daily routine, time orientation, autonomy in organizing the day.',
        "daily": 'Use a real visual schedule at home with Morning/Afternoon/Night.'
      },
      "what-first": {
        "name": 'What Do I Do First?',
        "does": 'Reads a situation with two or more things that could be done and picks the most urgent or necessary one.',
        "works": 'Prioritizing: telling what is urgent from what can wait, putting safety and deadlines ahead of leisure.',
        "daily": 'When a real task is urgent, ask them what they would do first.'
      },
      "what-do-i-need": {
        "name": 'What Do I Need?',
        "does": 'Reads a task or goal (brushing your teeth, baking a cake…) and chooses what needs to be prepared beforehand.',
        "works": 'Planning: anticipating what is needed before starting a task.',
        "daily": 'Before a real outing or task, let them get what is needed ready themselves.'
      },
      "where-to-store": {
        "name": 'Where Do I Keep It?',
        "does": 'Taps the box for the place in the house where each object is kept (closet, fridge, backpack).',
        "works": 'Organization: sorting everyday objects by where they are stored.',
        "daily": 'Put away groceries or clothes together, letting them decide where things go.'
      },
      "task-list": {
        "name": 'Task List',
        "does": 'Puts independent tasks from home, work and personal care into the logical order they would happen through the day.',
        "works": 'Organizing and planning mixed tasks (not just the steps of one household chore, like in The House): logical sequencing across different areas, including work.',
        "daily": 'Write tomorrow’s real task list together.'
      },
      "my-agenda": {
        "name": 'My Schedule',
        "does": 'Chooses plans for an appointment or task: orders the steps, gets what is needed ready, and decides when to leave.',
        "works": 'Time planning, anticipation, organizing materials, and working out a realistic margin for arriving on time, without reminders or personal data.',
        "daily": 'Before a real appointment, get together what to bring and what time to leave.'
      },
      "what-to-wear": {
        "name": 'What Do I Wear?',
        "does": 'Given the weather (very hot, very cold, rain), chooses the right item for the torso, legs, feet and one extra.',
        "works": 'Independence in dressing: matching clothes to actual weather (summer/winter, hot/cold), not just personal taste.',
        "daily": 'Before going out, talk about the real weather together and choose real clothes with the same reasoning.'
      },
      "street": {
        "name": 'The Street',
        "does": 'Street and transport situations: crossing with and without a traffic light, waiting for the bus, what to do if lost, who to follow and who not to.',
        "works": 'Community mobility and road safety: the number-one goal of occupational therapy for independent living that the app did not cover until now.',
        "daily": 'Practice real crossings on quiet streets, saying each step out loud.'
      },
      "emergencies": {
        "name": 'Emergencies',
        "does": 'Two parts: telling a real emergency apart from something that is not one, and practicing what to say when asking for help (name, what is happening, where they are).',
        "works": 'Recognizing real emergencies vs. false alarms; the structure of a call for help. Makes clear that 911 is only for real emergencies.',
        "daily": 'Agree with the person on their exact address and practice saying it out loud.'
      },
      "while-help-arrives": {
        "name": 'While Help Is on Its Way',
        "does": 'Two parts: a 3-option quiz on what to do after calling 112 while waiting for the ambulance, firefighters or police (leave, do not move the injured person, press the wound, recovery position, do not give anything by mouth); and ordering the immediate steps for a specific emergency.',
        "works": 'Safe behaviour in the minutes after calling 112: the part that the Emergencies activity did not cover. Teaches basic (non-clinical) first-aid actions that avoid making things worse while waiting for help.',
        "daily": 'After doing it, repeat at home with the family what each person would do if something really happened: leave and close the door, do not move, press the wound, etc.'
      },
      "be-prepared": {
        "name": 'Before the Emergency',
        "does": 'Two parts: a 3-option quiz on prevention (where 112 should be, the address, the smoke detector, pills); and a family checklist to check with the family what is already ready at home.',
        "works": 'Prevention: the best emergency is the one that never happens. Covers the "before" that the Emergencies activity did not work on. Designed to be done at home with the family.',
        "daily": 'Go through the list together at home: is 112 written down? Is the address visible? Are pills out of a small child\'s reach? Anything missing, write it down to do this week.'
      },
      "phone-numbers": {
        "name": 'Important Phone Numbers',
        "does": 'Three steps in order: looks at one card per service (police, fire, medical emergency) with its situation and number; reads a summary that brings the three together; and takes a test on which number to call in each situation.',
        "works": 'Long-term memory of a safety fact: that 911 is the same number for police, fire and a medical emergency, whatever the specific situation.',
        "daily": 'Ask them from time to time "which number do you call if…?" using real situations from home or the neighborhood.'
      },
      "my-details": {
        "name": 'My Details',
        "does": 'Reviews their own and their family\'s address and phone (set up beforehand in Settings): first some cards, then a multiple-choice test with decoys, and finally the same thing typed, with no hints on screen.',
        "works": 'Autobiographical memory of safety-related information. The real details are only ever saved on this device (never asked for from within the activity itself, never sent anywhere); they need to be set up beforehand in Settings.',
        "daily": 'Use the moment to say the home address and phone number out loud together before going out.'
      },
      "shopping": {
        "name": 'The Shopping',
        "does": 'Two parts: which supermarket section each product is in, and which meal of the day it is needed for (building a visual list).',
        "works": 'Instrumental daily living: closes the loop with The Coin Purse (paying) and The House (cooking), menu planning and shopping organization.',
        "daily": 'Take the person along to do part of the real shopping from the list.'
      },
      "shop": {
        "name": 'The Shop',
        "does": 'Uses money like in real life, with the app’s realistic-looking coins and bills. "A Purchase": a full 3-step simulation — can you afford it? (if not, pick something cheaper), pay with a limited purse (each coin used once), and check the change (sometimes it is wrong and needs catching). "What Do I Have Left?": chained subtraction of real expenses from what remains. "A Lot or a Little?": sense of price — deciding whether a price is fair or too much, compared with what things normally cost.',
        "works": 'Generalizing money management to real situations: purchase decisions, paying with limited money, checking change, spending control and price sense (protection against being cheated).',
        "daily": 'Let them pay cash for small real purchases, check the change, and save toward something specific with a real piggy bank.'
      },
      "healthy-food": {
        "name": 'Healthy Food',
        "does": 'Sorts foods into two boxes: "Every day" or "Now and then". A short sentence on each correct answer explains how that food makes your body feel.',
        "works": 'Healthy eating with a moderation approach (never labelling a food as "bad"): links to The Shopping and The House within the home-autonomy chain.',
        "daily": 'While doing the shopping or planning the week’s menu, ask them whether what they pick is an every-day food or a now-and-then one.'
      },
      "first-aid-kit": {
        "name": 'My First-Aid Kit',
        "does": 'Reads an everyday health situation (small cut, burn, fever, strong pain…) and chooses what to do: take care of themselves following what they have practised, or — if the situation is urgent — ask a trusted person or call 112.',
        "works": 'Closes the health-autonomy cycle between noticing the signal (My Body Tells Me) and putting it into words (I Tell the Doctor). Level 2 explicitly trains the safety net: ask for help or call 112, never self-medicate or hold the pain in.',
        "daily": 'When a small cut or a minor burn happens at home, review together what to do and, in doubt, who to ask for help.'
      },
      "pairs": {
        "name": 'Pairs',
        "does": 'Finds matching cards in a face-down grid.',
        "works": 'Short-term visual memory, executive functions.',
        "daily": 'Play a real memory card game together as a family.'
      },
      "differences": {
        "name": 'Spot the Difference',
        "does": 'Finds what is different between two scenes.',
        "works": 'Attention to detail, perception, comparison.',
        "daily": 'Look for differences in real photos or drawings around the house.'
      },
      "whats-missing": {
        "name": 'What Is Missing?',
        "does": 'Memorizes objects and spots which one disappears.',
        "works": 'Visual memory, sustained attention.',
        "daily": 'Play at hiding an object from the table and guessing which one is missing.'
      },
      "ecos": {
        "name": 'Echoes',
        "does": 'Repeats sequences of sounds and colors.',
        "works": 'Auditory memory, rhythm, sequential attention.',
        "daily": 'Take turns repeating claps or sounds like in the app.'
      },
      "turns-mirrors": {
        "name": 'Turns and Mirrors',
        "does": 'Taps the figure that matches the model even when rotated, its mirror reflection, or the identical letter among its mirror-image letters (b/d/p/q).',
        "works": 'Visual-spatial perception: mental rotation, symmetry and letter reversals (the basis of telling b/d/p/q apart in reading and writing).',
        "daily": 'Play with a hand mirror: look together at how objects and letters are reflected.'
      },
      "blocks": {
        "name": 'The Blocks',
        "does": 'Copies a model made of colored blocks on a grid, choosing a color and tapping cells.',
        "works": 'Visual-spatial construction, position-to-position matching, attention to detail. A hint on the first mistake; on the second it corrects itself.',
        "daily": 'Copy simple builds with real blocks or pieces (one person makes the model, the other copies it).'
      },
      "where-is": {
        "name": 'Where Is It?',
        "does": 'Taps the object that is to the left/right/above/below another one.',
        "works": 'Spatial vocabulary and directionality; the hint teaches the strategy (find the reference object first, then look toward the side).',
        "daily": 'Practice with real objects: "hand me what is to the left of the glass."'
      },
      "path": {
        "name": 'The Path',
        "does": 'Guides the turtle to the star with 4 arrows, avoiding trees (floor-robot style).',
        "works": 'Spatial orientation, route planning, step-by-step directionality. Bumping into something only gives a calm heads-up, never a penalty.',
        "daily": 'Play "robot": one person gives commands (forward, left…) and the other walks them out at home.'
      },
      "fit": {
        "name": 'Fit the Piece',
        "does": 'Moves, rotates and drops a piece into the gap with its matching shape (Tetris with no rush: nothing falls on its own, no timer).',
        "works": 'Applied mental rotation, anticipating the fit, coordinating actions (move + rotate + drop). On the third mistake the piece places itself.',
        "daily": 'Fit real pieces together (cutlery tray, tupperware and lids, shape-sorter boxes).'
      },
      "theatre": {
        "name": 'The Theatre',
        "does": 'Sets up a scene by placing characters in front of or behind the backdrop that the sentence describes.',
        "works": 'Depth and planes (background / foreground), in-front-of/behind vocabulary, understanding spatial instructions.',
        "daily": 'Act out real scenes with toys: "put the bear in front of the box."'
      },
      "tic-tac-toe": {
        "name": 'Tic-Tac-Toe',
        "does": 'Makes a line of three against an opponent that plays gently (by level: random, completes its own line, also blocks).',
        "works": 'Logic, anticipating the other player’s move, turn-taking, tolerating losing without punishment (losing only gives a tip and another round). An on-demand 💡 help button: first a question that directs attention, then the specific square with the reasoning.',
        "daily": 'Play tic-tac-toe on paper; think out loud about where it makes sense to place a mark.'
      },
      "visual-sudoku": {
        "name": 'Visual Sudoku',
        "does": 'Fills a 4×4 board with pictures without repeating any in a row, column or box.',
        "works": 'Reasoning by elimination, attention to rows/columns, cognitive flexibility. A hint on the first mistake; on the second it places itself so as not to get stuck. An on-demand 💡 help button: marks the easiest gap and asks what is missing; a second tap says the picture and why (placing it is still up to the person).',
        "daily": 'Look for easy sudoku books with pictures or colors to do on paper.'
      },
      "domino": {
        "name": 'Dominoes',
        "does": 'A real game against a calm opponent: a hand of 4 tiles, a draw pile and turns. The tile orients itself when tapped; it only asks which side if it fits both ends.',
        "works": 'Matching quantities (pips), a rule-based board game with turns, choosing between options, and tolerating losing without punishment (losing only gives encouragement and another round).',
        "daily": 'Play real dominoes as a family, starting with few tiles.'
      },
      "checkers": {
        "name": 'Checkers',
        "does": 'Adapted checkers on a 6×6 board with 6 pieces per side, against a calm opponent. Tap your piece, then a lit-up square: only legal moves can be tapped. Capturing is not mandatory and there are no multi-jumps; reaching the far end crowns the piece as a king. A two-step Socratic 💡 help button.',
        "works": 'Anticipation and planning (looking at what the opponent could do before moving), diagonal spatial reasoning, turn-taking and tolerating losing without punishment (a blocked-game ending compares pieces, and a tie is celebrated).',
        "daily": 'Play real checkers at home, starting with fewer pieces in a corner of the board.'
      },
      "chess": {
        "name": 'Chess',
        "does": 'A menu with two activities. "The Pieces": star-collecting puzzles on a 5×5 board to learn how each piece moves (one level per piece: rook, bishop, queen, knight); boards are generated on the fly and always have a solution. "Mini Match": a 5×5 duel with those pieces plus the king, no pawns or check — you win by capturing the opponent’s king. Two-step Socratic 💡 help.',
        "works": 'Spatial reasoning (straight, diagonal, L-shaped jump), planning and anticipation (looking at what the opponent threatens), rule memory and tolerating losing without punishment.',
        "daily": 'If it catches their interest, try real chess starting with just rooks and pawns.'
      },
      "connect-four": {
        "name": 'Four in a Row',
        "does": 'An adapted Connect Four (6 columns × 5 rows): each column is a single large button and the piece drops on its own, no timer. The opponent plays like in Tic-Tac-Toe (random → completes its line → also blocks).  Two-step Socratic 💡 help.',
        "works": 'Anticipation in two directions (completing your own line and blocking the opponent’s), sustained attention on a larger board than Tic-Tac-Toe, turn-taking and tolerating losing without punishment (a tie is celebrated).',
        "daily": 'Physical Connect Four exists in many homes: play the real version with the same ideas (check their line before dropping a piece).'
      },
      "comedy-club": {
        "name": 'Comedy Club',
        "does": 'Reads or listens to a joke and answers why it is funny.',
        "works": 'Understanding humor, double meaning, theory of mind.',
        "daily": 'Tell jokes as a family and ask them why they are funny.'
      },
      "idioms": {
        "name": 'Idioms',
        "does": 'Chooses the meaning of sayings and set phrases.',
        "works": 'Figurative language, everyday culture.',
        "daily": 'Use idioms in real conversations and explain what they mean.'
      },
      "double-meaning": {
        "name": 'Double Meaning',
        "does": 'Listens to a sentence with an ambiguous word (bank, bat, spring...) and decides whether that word can mean one thing or two. Each group mixes double-meaning words with regular ones, so the contrast teaches the distinction.',
        "works": 'Lexical ambiguity and context comprehension: the basis of pragmatic communication (avoiding misunderstandings, getting jokes and double meanings in real conversations). Getting it right always explains both real meanings.',
        "daily": 'When a word could be misread in a real conversation, pause and talk through both possible meanings together.'
      },
      "categories": {
        "name": 'Categories',
        "does": 'Sorts pictured words into their group (food, animals, clothes…).',
        "works": 'Semantic categorization, vocabulary.',
        "daily": 'Sort the shopping or the closet together by category.'
      },
      "sentence": {
        "name": 'The Sentence',
        "does": 'Reads a sentence and answers who, what or where.',
        "works": 'Reading comprehension, sentence analysis.',
        "daily": 'Read short sentences together (signs, messages) and ask who and what.'
      },
      "dictionary": {
        "name": 'Dictionary',
        "does": 'For each group of 8 difficult words: first a card per word (the word, its meaning in Plain Language and a real-life example), then a 3-option test to check what was remembered.',
        "works": 'Advanced vocabulary with meaningful learning (Ausubel): the new word is anchored to a real-life example instead of memorized on its own. The hint on the first test mistake reuses that same example.',
        "daily": 'When a hard word comes up in a conversation or a book, pause and find a real-life example that explains it together.'
      },
      "vocabulary": {
        "name": 'Topic Vocabulary',
        "does": 'For each round of 8 words: pick a block (general, autonomous life, health, social world) and a level (1=easy to 4=hard); then a card per word with its Plain Language meaning, a real-life example and the visible category, plus a 3-option test with distractors taken from the same block.',
        "works": 'Adult vocabulary explained in Plain Language, organised by thematic block and difficulty level. It enables concrete therapeutic pathways (autonomous life, health, social) in a single activity.',
        "daily": 'Pick together a block that is useful right now (for example, health or contracts) and start at the lowest level; move up when the person feels comfortable.'
      },
      "spelling": {
        "name": 'Complete the Word',
        "does": 'For each group of 8 words: sees the word with one letter hidden and picks which of 3 letters spells it correctly (vowels, letters confused because they sound alike, silent letters and double letters).',
        "works": 'Spelling aimed at the language’s real errors, not generic ones: in English, homophones and silent letters; in Spanish, its own equivalent pairs. The hint on the first mistake reads the word out loud.',
        "daily": 'When they misspell a word, point out together which letter is wrong and why (how it sounds, whether it is silent, or a double letter).'
      },
      "mirror-letters": {
        "name": 'Mirror Letters',
        "does": 'Sees a big lowercase letter (b, d, p or q) and touches which of 3 letters matches it, not turned around. Level 1 trains only b/d, level 2 only p/q, level 3 mixes all four.',
        "works": 'Visual discrimination of mirror-image letters, typical of visual dyslexia: telling apart shapes that only differ in orientation, a step before reading without reversing letters.',
        "daily": 'When they mix up a b with a d (or a p with a q) while reading or writing, point out together which way each one faces.'
      },
      "colored-spelling": {
        "name": 'Colored Spelling',
        "does": 'For each level of 6 sentences: reads the full sentence (with a pictogram and a first-letter hint), types it in full and, on Check, sees each letter coloured according to whether it is correct (green), misspelled (pink), or missing (underlined).',
        "works": 'Visual self-correction and free written production: the person sees their own exact mistakes at a glance without the app "punishing" them — it only marks them with colour so they can fix them and retry without pressure. It targets the same real errors as Complete the Word but from free writing instead of multiple choice, and makes repeated patterns in their own mistakes visible.',
        "daily": 'Use the app while writing the shopping list, a note or an email: let the person write first and then go over the pink and underlined letters together.'
      },
      "word-search": {
        "name": 'Word Search',
        "does": 'Finds themed words hidden in a letter grid, with graded levels and hints that highlight letters.',
        "works": 'Visual word recognition, sustained attention, themed vocabulary.',
        "daily": 'Do word searches on paper with words from their everyday life.'
      },
      "emotions": {
        "name": 'How Do I Feel?',
        "does": 'Chooses their emotion for the day and gets a response that validates it.',
        "works": 'Emotional identification, weekly log, regulation suggestions. No emotion is ever judged as bad.',
        "daily": 'Ask them every day how they feel, without judging the answer.'
      },
      "calm": {
        "name": 'Calm',
        "does": 'Follows guided breathing and relaxation sessions.',
        "works": 'Self-regulation, stress management, body awareness.',
        "daily": 'Practice the same breathing together when they are genuinely upset.'
      },
      "friends": {
        "name": 'Among Friends',
        "does": 'Recognizes emotions in other people, resolves simple conflicts, and, in level 5, recognizes when a "friend" is manipulating.',
        "works": 'Empathy, social interaction, conflict management, and signs of manipulation in friendship (secrecy, emotional blackmail, isolation).',
        "daily": 'Talk about real conflicts with friends using what was practiced in the app.'
      },
      "my-body": {
        "name": 'My Body Tells Me',
        "does": 'Given a signal from the body (hunger, thirst, tiredness, pain, nerves…), chooses what to do to take care of themselves.',
        "works": 'Interoception: noticing the body’s own signals and acting on them, the missing bridge between How Do I Feel? and Calm. The basis of health-related autonomy.',
        "daily": 'Help them put a name to what they notice in their body when something really happens to them.'      },
      "goodmanners": {
        "name": 'Good Manners',
        "does": 'Practice courtesy phrases in everyday situations: saying thank you, asking politely, greeting, saying goodbye, giving way to others.',
        "works": 'Basic social norms, social skills, respectful interaction.',
        "daily": 'Reinforce these phrases in real life: celebrate when they use them spontaneously.'      },
      "school-rules": {
        "name": 'School Rules and Civics',
        "does": 'Reads situations at school and in public places (classroom, canteen, library, bus, street, park, cinema) and chooses the right civic action: raising your hand, queuing, recycling, crossing on green, turning off the lights, mediating an argument, inviting someone excluded to play.',
        "works": 'Coexistence rules, civics, respect in shared and public spaces, care for the environment, inclusion, honesty and responsibility.',
        "daily": 'Stay with them at school and on outings: notice the rules they apply on their own and celebrate each civic gesture (giving way, picking up paper, recycling) in real life.'
      },
      "self-esteem": {
        "name": 'This Is Me',
        "does": 'Reads situations about disability, differences, comparison and insensitive people, and chooses the response that reflects healthy self-esteem.',
        "works": 'Self-acceptance, personal strengths and weaknesses, responding to discrimination and insensitive people, not depending on others’ recognition.',
        "daily": 'Remind them of their strengths when something goes wrong, and celebrate when they follow their own path.'
      },
      "resilience": {
        "name": "When It's Hard",
        "does": 'Reads situations about frustration or needing help, and chooses the response that helps them calm down or ask for support.',
        "works": 'Frustration tolerance, emotional regulation after a setback, vulnerability and asking for help without shame, honest expression of feelings.',
        "daily": 'Stay with them when something truly frustrates them, and celebrate when they ask for help instead of hiding how they feel.'
      },
      "trust-circle": {
        "name": 'Circle of Trust',
        "does": 'Classifies relationships (friend, companion, acquaintance) and chooses the healthy response to manipulation attempts, including requests for money.',
        "works": "Distinguishing closeness levels in relationships, spotting manipulation signs (isolation, secrecy, emotional blackmail, group pressure), and the money boundary: someone who truly cares about you doesn't ask for it.",
        "daily": "Talk with them about the people they really know, and remind them to never give money or personal details without checking with family first."
      },
      "sexual-health": {
        "name": 'My Body, My Choices',
        "does": 'Practises 48 non-graphic cases about consent, healthy relationships, contraception, hygiene and sexual health, pressure and blackmail, and protection and infections.',
        "works": 'Body autonomy, recognizing consent, warning signs of harmful relationships, and knowing when to ask a health professional for help instead of getting clinical instructions from the app.',
        "daily": 'Always use it with professional or family supervision. Remember that asking for help never implies blame, and agree together on who the trusted people or professionals are.'
      }
    },
    "scopeNote1": 'Out of scope',
    "scopeNote2": ' for a self-guided website: gross motor skills and whole-body coordination (need physical space and a companion), teamwork (the app is for one person at a time), and evaluated spoken expression (the browser’s speech recognition is not reliable).',
    "progressTitle": 'Progress and privacy',
    "progressLi1a": 'Progress (stars, completed levels, mood log) is saved ',
    "progressLi1Strong": 'only in the device’s browser',
    "progressLi1b": ' (localStorage). It never leaves it.',
    "progressLi2Strong": 'No personal data is requested or stored',
    "progressLi2b": '. No accounts, cookies or analytics. The only optional piece of data is a first name, in the Keyboard and Piano activities, which stays on the device.',
    "progressLi3": 'Practical consequence: switching device or browser, or clearing browsing data, resets progress to zero. To track progress over time, always use the same device and browser.',
    "progressLi4a": 'To delete the saved language and names (or reset the whole app), there is a',
    "progressLi4Link": 'settings page',
    "progressLi4b": 'that, like this guide, does not appear in the app menu. That same page has a read-only view with the saved stars per activity, so progress can be tracked without having to play.',
    "progressLi5": 'The stars ⭐ in the main menu add up those from every activity: they are encouragement, not an assessment.',
    "supportTitle": 'How to support without taking over autonomy',
    "supportLi1a": 'The app is meant to be used ',
    "supportLi1Strong": 'without help',
    "supportLi1b": '. If the person asks for support, help them the first time and step back gradually after that.',
    "supportLi2": 'Let them choose the activity. The menu order is not a mandatory route.',
    "supportLi3": 'Do not correct the mistake before the app does: the encouragement message and the retry are part of the training.',
    "supportLi4": 'The weekly "How Do I Feel?" log can be a good conversation starter, always without judging the emotion they picked.',
    "supportLi5": 'Every activity has levels or modes: start with the easiest one even if it looks simple; finishing successfully builds more confidence than "living up to" a harder level.',
    "exceptionsTitle": 'Pure-skill training: prioritised design decision',
    "exceptionsIntro": "Most Apptonomia activities follow the daily-life simulation contract (a recognisable scene, a decision, Socratic feedback and a closing transfer to the real world, see SPEC §3.6). The activities below use the other vehicle the product recognises — pure-skill training — which is a prioritised design decision, not an exception to justify (see SPEC §3.6.b). The stimulus is the context (the piano, the grid, the pieces, the sequence): adding an everyday scene here would confuse the therapeutic goal and saturate the screen. These activities keep the rest of the product principles (no pressure, no punishment, positive reinforcement) and, when they add value, expose a verbal context and a transfer line.",
    "exceptionBlocks": 'Blocks · copy the model with coloured pieces (fine motor skills, spatial perception).',
    "exceptionBuilders": 'Builders · free composition with blocks and pieces (creativity and fine motor).',
    "exceptionCatch": 'Catch It · hand-eye coordination and reflexes.',
    "exceptionCheckers": 'Checkers · strategy and anticipation.',
    "exceptionChess": 'Chess · strategy, planning and respect for turns.',
    "exceptionColoring": 'Colouring · free creativity and fine motor skills.',
    "exceptionConnectDots": 'Connect the Dots · number sequence and stroke precision.',
    "exceptionConnectFour": 'Connect Four · strategy and sustained attention.',
    "exceptionDifferences": 'Spot the Difference · attention to detail and visual comparison.',
    "exceptionDomino": 'Dominoes · counting and matching.',
    "exceptionEcos": 'Echoes · auditory memory.',
    "exceptionFit": 'Fit It · shape perception and fine motor skills.',
    "exceptionKeyboardTyping": 'Keyboard · guided typing one key at a time.',
    "exceptionOca": 'Goose · board route and counting.',
    "exceptionPairs": 'Pairs · visual memory.',
    "exceptionPath": 'Path · spatial orientation in a maze.',
    "exceptionPianoKeys": 'Piano Keys · free musical exploration.',
    "exceptionPuzzle": 'Puzzle · piece fitting and global shape perception.',
    "exceptionTicTacToe": 'Tic-Tac-Toe · simple strategy.',
    "exceptionTracing": 'Traces · graphomotor skills.',
    "exceptionTurnsMirrors": 'Turns and Mirrors · spatial perception and orientation.',
    "exceptionVisualSudoku": 'Visual Sudoku · logical reasoning with pictograms.',
    "exceptionCalm": 'Calm · guided breathing (no decision, no right/wrong).',
    "exceptionEmotions": 'Emotions · emotional recognition with no single right answer.',
    "exceptionsNote": "Daily-life simulation remains the product's preferred vehicle (SPEC §3.6): any new activity that represents a real-life decision must include the full contract. This list declares which activities are built, by prioritised design decision, on the pure-skill vehicle (SPEC §3.6.b). It is reviewed and updated alongside the repository (git log keeps the history of every inclusion and exclusion).",
    "agentTitle": 'Technical note for the AI agent that codes the app',
    "agentP1a": 'If you are a coding agent working in this repository, the sources of truth are',
    "agentP1code": 'CLAUDE.md',
    "agentP1b": '(operating workflow for AI agents) and the',
    "agentP1Link": 'documentation map',
    "agentP1c": 'in',
    "agentP1code2": 'doc/',
    "agentP1d": '. Non-negotiable summary:',
    "agentLi1": 'HTML + CSS + vanilla JavaScript. No frameworks, no build step, no backend, no runtime dependencies. Persistence only in localStorage.',
    "agentLi2": 'User interface in Spanish (Spain) and English, in Plain Language, with no clinical language and no pressure or competition mechanics. CLAUDE.md’s 10 accessibility rules are mandatory.',
    "agentLi3a": 'Each activity lives in',
    "agentLi3code1": 'tools/<slug>/',
    "agentLi3b": 'with',
    "agentLi3code2": 'index.html',
    "agentLi3c": ',',
    "agentLi3code3": 'app.js',
    "agentLi3d": '(logic),',
    "agentLi3code4": 'data.js',
    "agentLi3e": '(data) and',
    "agentLi3code5": 'styles.css',
    "agentLi3f": '; it uses the shared',
    "agentLi3code6": 'window.App.*',
    "agentLi3g": 'modules from',
    "agentLi3code7": 'assets/js/',
    "agentLi3h": '.',
    "agentLi4a": 'When adding or touching files: update the cache list and version in',
    "agentLi4code": 'sw.js',
    "agentLi4b": '.',
    "agentLi5a": 'This page (',
    "agentLi5code1": 'team/',
    "agentLi5b": ') is deliberately',
    "agentLi5Strong": 'a hidden route',
    "agentLi5c": ', just like',
    "agentLi5code2": 'settings/',
    "agentLi5d": '(view/delete',
    "agentLi5code3": 'localStorage',
    "agentLi5e": '): never link to them from',
    "agentLi5code4": 'site/index.html',
    "agentLi5f": 'or from any activity. Keep this guide up to date whenever activities or modules are added.',
    "footerActivities": 'Go to the activities'
  }, 'en');
})();
