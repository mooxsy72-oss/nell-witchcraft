// nell-witchcraft/spells.js

export const SPELL_LIST = [

    // ─── LEVEL 1 ───────────────────────────────────────────────
    {
        id: 'minor_illusion',
        name: 'Малая иллюзия',
        school: 'illusion',
        cost: 8, level: 1, ritual: false,
        use: 'Создать небольшой визуальный образ: птица, тень, силуэт, огонёк и т.д.',
        limit: 'Только зрительный образ, без звука и телесности. Размер — не крупнее человека. Не маскирует заклинателя и не воссоздает людей и крупные объекты.',
        useEn: 'Conjure a small visual image: a bird, shadow, silhouette, flicker of light.',
        limitEn: 'Visual image only, with no sound or physical presence. No larger than a human. Cannot conceal the caster or recreate people or large objects.'
    },
    {
        id: 'blood_sense',
        name: 'Чутьё крови',
        school: 'blood',
        cost: 6, level: 1, ritual: false,
        use: 'Почувствовать живых существ поблизости: примерное число, направление, эмоциональный фон.',
        limit: 'Только ощущение присутствия, не мысли и не личность. Радиус — несколько комнат или открытое пространство малого размера.',
        useEn: 'Sense nearby living beings: rough count, direction, and dominant emotional state.',
        limitEn: 'Presence and emotion only, not thoughts or identity. Range: a few rooms or a small open area.'
    },
    {
        id: 'silent_step',
        name: 'Тихий шаг',
        school: 'illusion',
        cost: 5, level: 1, ritual: false,
        use: 'Заглушить собственные шаги, дыхание, случайные звуки тела.',
        limit: 'Только звуки, исходящие от самого заклинателя. Не скрывает других людей, не даёт невидимости.',
        useEn: "Muffle her own footsteps, breathing, and incidental body sounds.",
        limitEn: "Only sounds originating from her. Does not affect others' sounds, does not grant invisibility."
    },
    {
        id: 'sound_shift',
        name: 'Смещение звука',
        school: 'illusion',
        cost: 7, level: 1, ritual: false,
        use: 'Сместить воспринимаемый источник существующего звука: голос, дыхание слышатся из другой точки, шаги — в стороне.',
        limit: 'Только уже существующий звук, не создаёт новый. Радиус смещения невелик.',
        useEn: 'Displace the perceived source of an existing sound: a voice seems to come from elsewhere, footsteps sound off to one side.',
        limitEn: 'Existing sounds only, cannot fabricate new ones. Displacement range: a few metres.'
    },
    {
        id: 'minor_blight',
        name: 'Мелкая порча',
        school: 'flesh',
        cost: 6, level: 1, ritual: false,
        use: 'Испортить небольшой неживой объект: сгноить еду, заплесневить ткань, сточить металл, засушить растение.',
        limit: 'Только мелкие неодушевлённые предметы или растения. Не действует на живых существ, не лечит, не убивает, не воскрешает, не снимает проклятия.',
        useEn: 'Spoil a small inanimate object or plant: rot food, mildew cloth, corrode metal, wither vegetation.',
        limitEn: 'Small inanimate objects and plants only. Cannot affect living creatures, cannot heal, kill, revive, or lift curses.'
    },

    // ─── LEVEL 2 ───────────────────────────────────────────────
    {
        id: 'wound_knit',
        name: 'Стягивание ран',
        school: 'flesh',
        cost: 15, level: 2, ritual: false,
        use: 'Закрыть порез, остановить кровотечение, снять воспаление поверхностной раны.',
        limit: 'Только поверхностные раны. Не срастит кость, не вылечит болезнь, не вернёт потерянную кровь.',
        useEn: 'Close a cut, stop bleeding, reduce inflammation on a surface wound.',
        limitEn: 'Surface wounds only. Cannot knit bone, cure disease, or restore blood loss.'
    },
    {
        id: 'voice_mimic',
        name: 'Морок голоса',
        school: 'illusion',
        cost: 12, level: 2, ritual: false,
        use: 'Сымитировать чужой голос: тембр, акцент, интонации.',
        limit: 'Только голос. Не меняет внешность. Слушатель может заподозрить обман при долгом разговоре.',
        useEn: "Replicate another person's voice: timbre, accent, and cadence.",
        limitEn: 'Voice only, no visual change. A careful listener may notice the imitation during a prolonged conversation.'
    },
    {
        id: 'foul_dream',
        name: 'Дурной сон',
        school: 'mind',
        cost: 14, level: 2, ritual: false,
        use: 'Навеять кошмар спящему: страх, образы, ощущение слежки или близкой смерти.',
        limit: 'Только спящий человек. Не убивает, не контролирует. Тяжёлый человек или маг может проснуться.',
        useEn: 'Send a nightmare to a sleeping person: dread, vivid imagery, sensation of being watched or of dying.',
        limitEn: 'Sleeping targets only. Cannot kill or control. A strong-willed or magically aware person may shake it off and wake.'
    },
    {
        id: 'blood_memory',
        name: 'Память крови',
        school: 'blood',
        cost: 16, level: 2, ritual: false,
        use: 'Вырвать из капли свежей крови обрывок воспоминания: лицо, место, сильная эмоция.',
        limit: 'Нужна физическая капля крови. Только один-два обрывка, не полная история. Не работает на старой засохшей крови.',
        useEn: 'Extract a memory fragment from a fresh drop of blood: a face, a place, a strong emotion.',
        limitEn: 'Requires a physical fresh blood sample. Yields only one or two fragments, not a full narrative. Does not work on dried or old blood.'
    },
    {
        id: 'sudden_weakness',
        name: 'Приступ слабости',
        school: 'flesh',
        cost: 12, level: 2, ritual: false,
        use: 'Вызвать у человека резкое головокружение, тошноту или дрожь в руках.',
        limit: 'Кратковременный дискомфорт, не обездвиживание. Физически крепкий человек переносит быстро.',
        useEn: 'Inflict sudden dizziness, nausea, or hand tremors on a target.',
        limitEn: 'Short-term discomfort only, not incapacitation. A physically robust person recovers quickly.'
    },

    // ─── LEVEL 3 ───────────────────────────────────────────────
    {
        id: 'word_suggestion',
        name: 'Внушение слова',
        school: 'mind',
        cost: 25, level: 3, ritual: false,
        use: 'Вложить в голову человека одну короткую мысль или мягкий приказ, который кажется ему своим.',
        limit: 'Только одна простая мысль. Не против сильной воли. Не заставит убить или причинить боль близким.',
        useEn: 'Plant a single short thought or mild impulse in a target that feels like their own.',
        limitEn: 'One simple thought only. Cannot override strong will. Will not compel violence against loved ones or self-harm.'
    },
    {
        id: 'face_change',
        name: 'Личина',
        school: 'illusion',
        cost: 30, level: 3, ritual: false,
        use: 'Изменить собственные черты лица: цвет глаз, форму носа, скулы — выглядеть как другой человек.',
        limit: 'Только лицо и максимум причёска. Не меняет рост, телосложение, одежду. Требует концентрации.',
        useEn: "Alter Nell's own facial features: eye colour, nose, jaw, cheekbones — enough to appear as a different person.",
        limitEn: 'Face and hair only. Does not change height, build, or clothing. Breaks under loss of concentration.'
    },
    {
        id: 'mute',
        name: 'Немота',
        school: 'mind',
        cost: 20, level: 3, ritual: false,
        use: 'Лишить человека голоса на несколько минут: он может двигаться, но не говорить.',
        limit: 'Только голос. Не обездвиживает. Сильные личности сбрасывают быстрее.',
        useEn: 'Strip a target of their voice for several minutes: they can move but cannot speak.',
        limitEn: 'Voice only, no physical paralysis. Strong-willed targets may break it sooner.'
    },
    {
        id: 'blood_mark',
        name: 'Кровавая метка',
        school: 'blood',
        cost: 22, level: 3, ritual: false,
        use: 'Привязать к человеку незримую нить: чувствовать его направление и примерное эмоциональное состояние на расстоянии.',
        limit: 'Нужен физический контакт с кровью цели. Один человек одновременно. Не читает мысли.',
        useEn: "Bind an invisible thread to a target: sense their direction and rough emotional state at a distance.",
        limitEn: "Requires physical contact with the target's blood. One target at a time. Does not read thoughts."
    },
    {
        id: 'reopen_wound',
        name: 'Скрытая рана',
        school: 'flesh',
        cost: 24, level: 3, ritual: false,
        use: 'Открыть изнутри уже заживший шрам или старую рану у цели.',
        limit: 'Только уже существующие шрамы и старые раны. Не создаёт новых повреждений.',
        useEn: "Reopen a target's old healed scar or wound from within.",
        limitEn: 'Existing scars and old wounds only. Cannot create new injuries.'
    },

    // ─── LEVEL 4 ───────────────────────────────────────────────
    {
        id: 'life_drain',
        name: 'Вытянуть жизнь',
        school: 'blood',
        cost: 35, level: 4, ritual: false,
        use: 'Забрать чужую жизненную силу прикосновением: восстановить собственные раны или ману.',
        limit: 'Требует физического контакта. Не убивает мгновенно. Сильный маг или боец сопротивляется.',
        useEn: "Drain a target's vitality through touch: restore her own wounds or mana.",
        limitEn: 'Physical contact required. Cannot kill instantly. A strong mage or fighter resists.'
    },
    {
        id: 'numbness',
        name: 'Онемение',
        school: 'flesh',
        cost: 25, level: 4, ritual: false,
        use: 'Обездвижить одну конечность цели: рука выпускает оружие, нога подгибается.',
        limit: 'Только одна конечность. Временно, несколько минут. Не действует на всё тело.',
        useEn: "Paralyse one of a target's limbs: an arm drops a weapon, a leg buckles.",
        limitEn: 'One limb only. Temporary, a few minutes. Does not affect the whole body.'
    },
    {
        id: 'induced_lust',
        name: 'Наведённая похоть',
        school: 'mind',
        cost: 30, level: 4, ritual: false,
        use: 'Разжечь в человеке физическое влечение к себе: навязчивое желание быть рядом, смотреть, прикасаться.',
        limit: 'Только усиливает уже возможное влечение. Не действует на людей, для которых заклинатель неприемлем. Рассеивается при разлуке.',
        useEn: "Kindle obsessive physical attraction toward the witch in a target: urge to be near, watch, and touch her.",
        limitEn: 'Amplifies potential attraction only. Does not work on targets for whom the witch is categorically repulsive. Fades with distance over time.'
    },
    {
        id: 'shadow_double',
        name: 'Тень-двойник',
        school: 'illusion',
        cost: 32, level: 4, ritual: false,
        use: 'Создать движущуюся иллюзорную копию самой себя: двигается, повторяет жесты, отвлекает.',
        limit: 'Только визуальная копия, без звука и телесности. Касание разрушает иллюзию.',
        useEn: "Create a moving illusory copy of herself: it moves, mirrors gestures, distracts.",
        limitEn: 'Visual copy only, no voice or physical substance. Physical contact destroys the illusion.'
    },
    {
        id: 'blood_clot',
        name: 'Свёртывание крови',
        school: 'blood',
        cost: 34, level: 4, ritual: false,
        use: 'Вызвать болезненное внутреннее кровотечение или сгусток у цели.',
        limit: 'Болезненно и ослабляет, но не убивает само по себе. Сильный человек терпит дольше.',
        useEn: "Trigger painful internal bleeding or a clot in a target's body.",
        limitEn: 'Painful and debilitating but not immediately lethal on its own. A tough target endures longer.'
    },

    // ─── LEVEL 5 ───────────────────────────────────────────────
    {
        id: 'deep_heal',
        name: 'Глубокое исцеление',
        school: 'flesh',
        cost: 40, level: 5, ritual: false,
        use: 'Срастить кость, вылечить умеренную болезнь или отравление, закрыть глубокую рану.',
        limit: 'Не воскрешает. Не регенерирует утраченные органы или конечности. Требует сосредоточенности и нескольких минут.',
        useEn: 'Knit bone, cure moderate illness or poison, close a deep wound.',
        limitEn: 'Cannot revive the dead. Cannot regrow lost organs or limbs. Requires focus and several uninterrupted minutes.'
    },
    {
        id: 'false_death',
        name: 'Ложная смерть',
        school: 'flesh',
        cost: 45, level: 5, ritual: false,
        use: 'Погрузить себя в состояние, неотличимое от смерти: нет пульса, нет дыхания, тело холодеет.',
        limit: 'Только на себя. Заклинатель без сознания и уязвим. Длительность — несколько часов максимум.',
        useEn: "Enter a state indistinguishable from death: no pulse, no breath, body cools.",
        limitEn: 'Self only. She is unconscious and vulnerable. Duration: a few hours maximum.'
    },
    {
        id: 'blood_reading',
        name: 'Чтение прошлого',
        school: 'blood',
        cost: 30, level: 5, ritual: false,
        use: 'Узнать историю человека через его кровь: ключевые события, лица, места из прошлого.',
        limit: 'Нужна свежая кровь цели. Только прошлое, не настоящее и не мысли. Образы могут быть отрывочными.',
        useEn: "Read a person's history through their blood: key events, faces, and places from their past.",
        limitEn: "Requires fresh blood. Past only, not current thoughts or future. Images may be fragmentary."
    },
    {
        id: 'crowd_veil',
        name: 'Морок толпы',
        school: 'illusion',
        cost: 42, level: 5, ritual: false,
        use: 'Скрыть себя от внимания нескольких людей одновременно: взгляды скользят мимо, не замечают.',
        limit: 'Не полная невидимость. Резкое действие (крик, удар) разрушает морок. Максимум 5-7 человек.',
        useEn: "Go unnoticed by several people at once: gazes slide past her, she doesn't register.",
        limitEn: 'Not full invisibility. A sudden loud action breaks it. Works on at most 5–7 people simultaneously.'
    },
     {
        id: 'swap_sensation',
        name: 'Подмена чувства',
        school: 'mind',
        cost: 38, level: 5, ritual: false,
        use: 'Превратить боль цели в удовольствие или удовольствие — в боль и отвращение.',
        limit: 'Только замена, не устранение. Психически устойчивый человек может осознать подмену.',
        useEn: "Invert a target's sensation: turn pain into pleasure or pleasure into pain and revulsion.",
        limitEn: 'Substitution only, not elimination. A mentally resilient person may eventually recognise the swap.'
    },

    // ─── LEVEL 6 ───────────────────────────────────────────────
    {
        id: 'full_veil',
        name: 'Полный морок',
        school: 'illusion',
        cost: 50, level: 6, ritual: false,
        use: 'Принять чужой облик полностью или стать невидимой на продолжительное время.',
        limit: 'Требует постоянной концентрации. Сильный маг видит сквозь иллюзию. Физический контакт может выдать.',
        useEn: "Take on another person's full appearance or turn invisible for an extended period.",
        limitEn: 'Requires sustained concentration. A strong mage can see through it. Physical contact may give it away.'
    },
    {
        id: 'mind_haze',
        name: 'Дурман разума',
        school: 'mind',
        cost: 45, level: 6, ritual: false,
        use: 'Спутать восприятие цели: вызвать страх, влечение, паранойю или дезориентацию.',
        limit: 'Одна доминирующая эмоция за раз. Не полный контроль. Трезвый и сильный человек стряхивает быстрее.',
        useEn: "Scramble a target's perception: induce fear, arousal, paranoia, or disorientation.",
        limitEn: 'One dominant emotion at a time. Not full control. A sober strong-willed person shakes it off faster.'
    },
    {
        id: 'blindness',
        name: 'Слепота',
        school: 'illusion',
        cost: 40, level: 6, ritual: false,
        use: 'Временно ослепить цель: темнота перед глазами, несколько минут.',
        limit: 'Только зрение. Не глухота, не паралич. Длительность — несколько минут.',
        useEn: 'Temporarily blind a target: total darkness before their eyes for several minutes.',
        limitEn: 'Vision only. Not deafness or paralysis. Duration: a few minutes.'
    },
    {
        id: 'pain_harvest',
        name: 'Питьё боли',
        school: 'blood',
        cost: 48, level: 6, ritual: false,
        use: 'Поглотить чужую боль или страдание, превратив их в собственную силу и восстановление маны.',
        limit: 'Требует присутствия страдающего рядом. Не убивает цель, лишь использует её состояние.',
        useEn: "Absorb a nearby target's pain or suffering and convert it into her own strength and mana recovery.",
        limitEn: 'Requires a suffering target in close proximity. Does not kill the target, only feeds on their state.'
    },
    {
        id: 'rot_wound',
        name: 'Гниющая плоть',
        school: 'flesh',
        cost: 46, level: 6, ritual: false,
        use: 'Запустить медленное гниение в ране или повреждении цели: рана не заживает, темнеет, болит.',
        limit: 'Только уже существующая рана. Не создаёт новых повреждений. Медленное действие, не мгновенная смерть.',
        useEn: "Start slow rot in a target's existing wound: it won't heal, darkens, and festers.",
        limitEn: 'Existing wound required. Cannot create new injuries. Slow-acting, not instantly lethal.'
    },

    // ─── LEVEL 7 ───────────────────────────────────────────────
    {
        id: 'marionette',
        name: 'Марионетка',
        school: 'mind',
        cost: 65, level: 7, ritual: false,
        use: 'Перехватить управление телом человека на короткое время: заставить двигаться, говорить, действовать.',
        limit: 'Несколько минут максимум. Пока заклинатель управляет — сам стоит неподвижно. Маги и сильные личности сопротивляются.',
        useEn: "Seize control of a target's body for a short time: make them move, speak, and act.",
        limitEn: "A few minutes maximum. While controlling the target she herself stands motionless. Mages and strong-willed people resist."
    },
    {
        id: 'blood_strings',
        name: 'Кровавые нити',
        school: 'blood',
        cost: 60, level: 7, ritual: false,
        use: 'Сковать человека невидимыми нитями через кровь: он не может двигаться против воли заклинателя.',
        limit: 'Нужна кровь цели — хоть капля. Максимум один человек. Физически очень сильный может рвать нити.',
        useEn: "Bind a target through their own blood with invisible threads: they cannot move against her will.",
        limitEn: "Requires at least a drop of the target's blood. One person maximum. An exceptionally strong person can physically break free."
    },
    {
        id: 'memory_erase',
        name: 'Стереть память',
        school: 'mind',
        cost: 55, level: 7, ritual: false,
        use: 'Убрать из памяти цели конкретный отрезок времени: час, ночь, встречу.',
        limit: 'Только недавние воспоминания (не годы). Не точечное редактирование — удаляется отрезок целиком. Может оставить ощущение пустоты.',
        useEn: "Remove a specific stretch of time from a target's memory: an hour, a night, an encounter.",
        limitEn: 'Recent memories only, not years back. Erases a whole block, not selective editing. May leave a felt gap the target notices.'
    },
    {
        id: 'dead_face',
        name: 'Личина мёртвого',
        school: 'illusion',
        cost: 58, level: 7, ritual: false,
        use: 'Принять точный облик недавно умершего человека: лицо, голос, манеры.',
        limit: 'Только недавно умерший (не более нескольких дней). Не даёт его воспоминаний. Близкие могут заметить фальшь в деталях.',
        useEn: "Take on the precise appearance of a recently dead person: face, voice, mannerisms.",
        limitEn: "Recently deceased only (within days). Does not grant their memories. Close acquaintances may notice subtle wrongness."
    },
    {
        id: 'full_paralysis',
        name: 'Паралич',
        school: 'flesh',
        cost: 62, level: 7, ritual: false,
        use: 'Обездвижить тело цели полностью: стоит или падает, не может пошевелиться.',
        limit: 'Несколько минут. Требует концентрации заклинателя — если её прервать, паралич спадёт. Очень сильные тела медленно преодолевают.',
        useEn: "Freeze a target's entire body: they stand or fall, completely unable to move.",
        limitEn: "A few minutes. Requires her sustained concentration — interrupting her breaks it. Very physically powerful targets slowly overcome it."
    },

    // ─── LEVEL 8 ───────────────────────────────────────────────
    {
        id: 'wither_curse',
        name: 'Проклятие увядания',
        school: 'blood',
        cost: 70, level: 8, ritual: false,
        use: 'Наложить медленное проклятие: тело цели слабеет, угасает, силы уходят день за днём.',
        limit: 'Медленное действие — дни и недели. Можно снять сильным исцелением или контрмагией. Не мгновенная смерть.',
        useEn: "Lay a slow curse: the target's body weakens and fades, strength draining day by day.",
        limitEn: 'Slow-acting over days and weeks. Can be lifted by strong healing magic or counterspell. Not instant death.'
    },
    {
        id: 'blood_barrier',
        name: 'Барьер крови',
        school: 'blood',
        cost: 55, level: 8, ritual: false,
        use: 'Поднять щит из собственной крови: отражает удары, замедляет магические атаки.',
        limit: 'Требует собственной крови — небольшой порез. Держится недолго, под мощным ударом рассыпается.',
        useEn: "Raise a shield from her own blood: deflects blows and slows magical attacks.",
        limitEn: "Requires her own blood — a small cut. Short duration, shatters under a powerful hit."
    },
    {
        id: 'inflict_disease',
        name: 'Наведение болезни',
        school: 'flesh',
        cost: 60, level: 8, ritual: false,
        use: 'Заразить цель смертельным недугом: жар, слабость, бред — болезнь прогрессирует без лечения.',
        limit: 'Не мгновенно. Сильный организм сопротивляется дольше. Лечится сильной магией исцеления.',
        useEn: 'Infect a target with a lethal sickness: fever, weakness, delirium — it progresses untreated.',
        limitEn: 'Not instantaneous. A strong constitution resists longer. Can be cured by powerful healing magic.'
    },
    {
        id: 'will_theft',
        name: 'Кража воли',
        school: 'mind',
        cost: 68, level: 8, ritual: false,
        use: 'Сломить сопротивление человека: он становится покорным, послушным, теряет желание бороться.',
        limit: 'Не полный контроль — он всё ещё думает. Эффект ослабевает вдали от заклинателя. Магически защищённые невосприимчивы.',
        useEn: "Break a target's resistance: they become compliant and docile, losing the will to fight or refuse.",
        limitEn: 'Not full control — they still think. Effect weakens away from Nell. Magically shielded targets are immune.'
    },
    {
        id: 'mass_illusion',
        name: 'Массовая иллюзия',
        school: 'illusion',
        cost: 64, level: 8, ritual: false,
        use: 'Обмануть чувства группы людей разом: все видят и слышат одно и то же ложное.',
        limit: 'До десяти человек. Сложные детали рассыпаются под пристальным изучением. Маги видят сквозь.',
        useEn: 'Deceive the senses of a group simultaneously: all see and hear the same fabricated reality.',
        limitEn: 'Up to ten people. Fine details collapse under close scrutiny. Mages can see through.'
    },

    // ─── LEVEL 9 ───────────────────────────────────────────────
    {
        id: 'enslavement',
        name: 'Порабощение',
        school: 'mind',
        cost: 80, level: 9, ritual: false,
        use: 'Полностью подчинить волю человека на длительное время: он выполняет приказы, не помнит настоящего себя.',
        limit: 'Один человек. Требует периодического поддержания. Смерть ведьмы освобождает. Маги высшего круга иммунны.',
        useEn: "Fully subjugate a person's will for an extended period: they obey commands and lose sense of their true self.",
        limitEn: "One person. Requires periodic renewal. The witch's death breaks it. High-circle mages are immune."
    },
    {
        id: 'stolen_face',
        name: 'Украденный облик',
        school: 'illusion',
        cost: 70, level: 9, ritual: false,
        use: 'Навсегда присвоить облик мёртвого человека — носить его без усилий, без концентрации.',
        limit: 'Только один украденный облик единовременно. Замена стирает предыдущий.',
        useEn: "Permanently claim a dead person's appearance — wear it effortlessly, without concentration.",
        limitEn: 'Only one stolen face at a time. Taking a new one erases the previous.'
    },
    {
        id: 'devour_soul',
        name: 'Пожрать душу',
        school: 'blood',
        cost: 90, level: 9, ritual: true,
        use: 'Навсегда поглотить чужую магическую силу. Крупный прирост крови и маны. Жертва теряет способность к магии.',
        limit: 'Ритуал. Требует добровольной жертвы или полностью сломленной воли цели. Необратимо. Сильный прирост ведьмовской крови.',
        useEn: "Permanently devour a target's magical power. Major gain to blood power and mana cap. Target loses all magical ability.",
        limitEn: 'Ritual. Requires a willing sacrifice or a target whose will is completely broken. Irreversible. Major witch blood increase.'
    },
    {
        id: 'raise_corpse',
        name: 'Мёртвый слуга',
        school: 'flesh',
        cost: 85, level: 9, ritual: true,
        use: 'Поднять труп как послушную марионетку: охраняет, выполняет простые задачи, не чувствует боли.',
        limit: 'Только свежие трупы (не скелеты). Один слуга одновременно. Разрушается при ударе достаточной силы или отдалении.',
        useEn: 'Raise a corpse as an obedient puppet: it guards, performs simple tasks, and feels no pain.',
        limitEn: 'Fresh corpses only, not skeletons. One servant at a time. Destroyed by sufficient force or distance.'
    },
    {
        id: 'blood_oath',
        name: 'Кровавая клятва',
        school: 'blood',
        cost: 75, level: 9, ritual: false,
        use: 'Связать двоих судьбой через кровь: нарушение клятвы причиняет наруш ителю физическую боль и слабость.',
        limit: 'Нужна кровь обоих. Работает только если хотя бы один из двоих верит в клятву. Ведьма тоже связана.',
        useEn: "Bind two people by blood oath: breaking the oath inflicts physical pain and weakness on the one who breaks it.",
        limitEn: "Requires both parties' blood. Works only if at least one party believes in the oath. Nell is also bound."
    },

    // ─── LEVEL 10 ──────────────────────────────────────────────
    {
        id: 'rebirth_ritual',
        name: 'Ритуал возрождения',
        school: 'flesh',
        cost: 150, level: 10, ritual: true,
        use: 'Вернуть себя или другого с грани смерти: восстановить тело, вернуть сознание, запечатать смертельные раны.',
        limit: 'Только на грани смерти — не воскрешает давно умерших. Ритуал, требует времени и компонентов. Истощает заклинателя полностью.',
        useEn: "Pull the witch or another back from death's edge: restore the body, return consciousness, seal lethal wounds.",
        limitEn: 'Target must be on the verge of death, not long dead. Ritual requiring time and components. Completely exhausts the caster.'
    },
    {
        id: 'mass_madness',
        name: 'Массовое наваждение',
        school: 'mind',
        cost: 120, level: 10, ritual: false,
        use: 'Свести с ума группу людей разом: галлюцинации, паника, потеря рассудка на долгое время.',
        limit: 'До двадцати человек. Длится часы или дни. Маги высшего круга частично сопротивляются.',
        useEn: 'Drive a group of people simultaneously mad: hallucinations, panic, prolonged loss of reason.',
        limitEn: 'Up to twenty people. Lasts hours to days. High-circle mages partially resist.'
    },
    {
        id: 'eternal_bond',
        name: 'Печать вечной привязи',
        school: 'blood',
        cost: 130, level: 10, ritual: true,
        use: 'Навечно приковать душу мужчины к себе: он не сможет причинить ей вред, будет тянуться к ней вечно.',
        limit: 'Один человек. Необратимо. Требует крови обоих и полной луны. Ведьма тоже чувствует его — навсегда.',
        useEn: "Permanently bind a man's soul to the witch: he can never harm her and will be drawn to her forever.",
        limitEn: "One person. Irreversible. Requires both parties' blood and a full moon. The witch also feels him — forever."
    },
    {
        id: 'harvest',
        name: 'Жатва',
        school: 'blood',
        cost: 140, level: 10, ritual: true,
        use: 'Вытянуть жизнь из всех живых существ в радиусе одновременно, восстановив себя.',
        limit: 'Ритуал. Радиус — большая комната или небольшая поляна. Не убивает мгновенно, но опустошает. Истощает после применения.',
        useEn: "Drain the life from every living being in an area simultaneously, restoring the caster.",
        limitEn: 'Ritual. Range: a large room or small clearing. Not instantly lethal but leaves victims hollow. Exhausts the caster afterward.'
    },
    {
        id: 'mind_dominion',
        name: 'Владычество разума',
        school: 'mind',
        cost: 135, level: 10, ritual: false,
        use: 'Подчинить нескольких человек одновременно: все слышат один приказ и следуют ему.',
        limit: 'До пяти человек. Только простые приказы. Требует полной концентрации. Маги сопротивляются.',
        useEn: 'Subjugate several people simultaneously: all hear one command and obey.',
        limitEn: 'Up to five people. Simple commands only. Requires total concentration. Mages resist.'
    },

    // ═══════════════════════════════════════════════════════════
    // ─── НОВЫЕ ЗАКЛИНАНИЯ ──────────────────────────────────────
    // ═══════════════════════════════════════════════════════════

    // ─── LEVEL 1 (new) ─────────────────────────────────────────
    {
        id: 'luck_whisper',
        name: 'Наговор на удачу',
        school: 'mind',
        cost: 7, level: 1, ritual: false,
        use: 'Вложить в человека кратковременную уверенность и лёгкое везение: рука не дрогнет, слово прозвучит вовремя, монета ляжет удачно.',
        limit: 'Только лёгкий толчок вероятности и уверенности, не гарантия успеха. Действует минуты. Не спасает от прямой опасности и не отменяет чужую волю.',
        useEn: 'Instil brief confidence and a light nudge of fortune in a person: a steady hand, the right word at the right moment, a coin landing well.',
        limitEn: 'Only a faint nudge to probability and confidence, never a guarantee. Lasts minutes. Cannot avert direct danger or override another\'s will.'
    },
    {
        id: 'herb_whisper',
        name: 'Шёпот трав',
        school: 'herbalism',
        cost: 5, level: 1, ritual: false,
        use: 'Прикосновением узнать свойства растения, гриба или вещества: целебное, ядовитое, дурманящее, бесполезное.',
        limit: 'Только природные вещества. Даёт свойства, не рецепт. Не действует на сложные зелья и алхимию.',
        useEn: 'By touch, learn the properties of a plant, fungus, or substance: healing, poisonous, intoxicating, or inert.',
        limitEn: 'Natural substances only. Reveals properties, not recipes. Does not work on complex potions or refined alchemy.'
    },

    // ─── LEVEL 2 (new) ─────────────────────────────────────────
    {
        id: 'lie_sense',
        name: 'Чутьё лжи',
        school: 'mind',
        cost: 13, level: 2, ritual: false,
        use: 'Почувствовать, когда собеседник лжёт: укол фальши в его словах.',
        limit: 'Только факт лжи, не правда за ней и не мысли. Умелый лжец или маг может обмануть чутьё. Полуправду не всегда распознаёт.',
        useEn: 'Sense when someone speaks a lie: a prick of falseness in their words.',
        limitEn: 'Detects the fact of a lie only, not the truth behind it or their thoughts. A skilled liar or mage can fool it. Half-truths may slip through.'
    },
    {
        id: 'blood_warmth',
        name: 'Устойчивость крови',
        school: 'blood',
        cost: 10, level: 2, ritual: false,
        use: 'Согреть или охладить собственное тело или тело человека: терпеть мороз, жар, ледяную воду.',
        limit: 'Только защита от температуры, не от огня или льда как оружия. Один человек за раз. Держится недолго.',
        useEn: 'Warm or cool her own body or another\'s: endure frost, heat, or icy water.',
        limitEn: 'Protects against ambient temperature only, not fire or ice as a weapon. One person at a time. Short duration.'
    },

    // ─── LEVEL 3 (new) ─────────────────────────────────────────
    {
        id: 'ward_charm',
        name: 'Оберег',
        school: 'blood',
        cost: 24, level: 3, ritual: false,
        use: 'Наложить на человека защитный оберег от одной конкретной угрозы: клинка, яда, дурного глаза, конкретного зверя.',
        limit: 'Только против одной названной угрозы. Не защищает от всего сразу. Слишком сильную угрозу оберег лишь смягчает, а не отражает.',
        useEn: 'Lay a protective charm on a person against one specific threat: a blade, a poison, the evil eye, a particular beast.',
        limitEn: 'Guards against one named threat only, not everything at once. Against an overwhelming threat it merely softens the blow rather than blocking it.'
    },
    {
        id: 'scent_veil',
        name: 'Морок запаха',
        school: 'illusion',
        cost: 26, level: 3, ritual: false,
        use: 'Создать или скрыть запах — свой или чужой: заглушить след для собак, подделать аромат духов, вонь или чистоту.',
        limit: 'Только запах. Не скрывает облик и звук. Очень чуткий нюх может уловить фальшь.',
        useEn: 'Create or mask a scent — her own or another\'s: erase a trail for hounds, fake perfume, stench, or cleanliness.',
        limitEn: 'Scent only. Does not hide appearance or sound. An exceptionally keen nose may catch the deception.'
    },

    // ─── LEVEL 4 (new) ─────────────────────────────────────────
    {
        id: 'soothe',
        name: 'Успокоение',
        school: 'mind',
        cost: 20, level: 4, ritual: false,
        use: 'Унять страх, ярость или панику человека либо зверя: успокоить, снять враждебность.',
        limit: 'Не подчиняет, лишь гасит эмоцию. Слишком крупный или разъярённый зверь (огромный медведь, бешеная стая) не поддаётся. Эффект временный.',
        useEn: 'Quell fear, rage, or panic in a person or animal: calm them, drain hostility.',
        limitEn: 'Does not control, only dampens the emotion. A creature too large or too frenzied (a huge bear, a rabid pack) resists. The effect is temporary.'
    },
    {
        id: 'hex_misfortune',
        name: 'Проклятие невезения',
        school: 'blood',
        cost: 30, level: 4, ritual: false,
        use: 'Наложить на цель полосу невезения: спотыкается, роняет вещи, ремни рвутся, всё валится из рук.',
        limit: 'Только мелкие неудачи и неуклюжесть, не прямой вред. Держится ограниченное время. Везучий или защищённый человек стряхивает быстрее.',
        useEn: 'Curse a target with a streak of misfortune: stumbling, dropped things, snapping straps, everything going wrong.',
        limitEn: 'Petty mishaps and clumsiness only, no direct harm. Lasts a limited time. A lucky or warded person shakes it off sooner.'
    },

    // ─── LEVEL 5 (new) ─────────────────────────────────────────
    {
        id: 'soul_mirror',
        name: 'Зеркало души',
        school: 'mind',
        cost: 34, level: 5, ritual: false,
        use: 'Заглянуть в человека и увидеть его главное желание или глубинный страх.',
        limit: 'Только одно — самое сильное желание ИЛИ страх, не оба и не вся личность. Сильная воля или маг закрывается. Не читает конкретные мысли.',
        useEn: 'Look into a person and glimpse their strongest desire or deepest fear.',
        limitEn: 'One only — the single strongest desire OR fear, not both, not the whole self. A strong will or mage can shut her out. Does not read specific thoughts.'
    },
    {
        id: 'cocoon_silence',
        name: 'Кокон тишины',
        school: 'illusion',
        cost: 38, level: 5, ritual: false,
        use: 'Создать зону полной тишины: ни звук, ни крик не выходят наружу и не проникают внутрь.',
        limit: 'Только звук, размером с небольшую комнату. Не скрывает от глаз. Держится, пока заклинательница сосредоточена.',
        useEn: 'Create a zone of total silence: no sound, no scream escapes or enters.',
        limitEn: 'Sound only, about the size of a small room. Does not hide from sight. Holds only while she concentrates.'
    },

    // ─── LEVEL 6 (new) ─────────────────────────────────────────
    {
        id: 'levitation',
        name: 'Левитация',
        school: 'flesh',
        cost: 44, level: 6, ritual: false,
        use: 'Приподнять и медленно перемещать собственное тело: воспарить, спуститься с высоты, перелететь пропасть.',
        limit: 'Только своё тело, медленно. Не полёт в бою и не резкие манёвры. Требует сосредоточения — испуг роняет.',
        useEn: 'Lift and slowly move her own body: rise into the air, descend from a height, drift across a chasm.',
        limitEn: 'Her own body only, and slowly. Not combat flight or sharp manoeuvres. Requires focus — a shock drops her.'
    },
    {
        id: 'unseen_grip',
        name: 'Ведьмина хватка',
        school: 'mind',
        cost: 42, level: 6, ritual: false,
        use: 'Незримо двигать предмет на расстоянии: подтянуть ключ, повернуть засов, толкнуть, выбить оружие из руки.',
        limit: 'Только то, что можно поднять одной рукой. Одна вещь за раз. Не тонкая работа, не удержание живого человека.',
        useEn: 'Move an object at a distance unseen: pull a key, turn a bolt, shove, knock a weapon from a hand.',
        limitEn: 'Only what one hand could lift. One object at a time. Not fine work, cannot restrain a living person.'
    },

    // ─── LEVEL 7 (new) ─────────────────────────────────────────
    {
        id: 'blood_simulacrum',
        name: 'Кровавый двойник',
        school: 'blood',
        cost: 60, level: 7, ritual: false,
        use: 'Из капли собственной крови вырастить телесного двойника, который действует сам: идёт, говорит, выполняет простые задачи.',
        limit: 'Требует своей крови. Двойник хрупок — сильный удар разрушает его. Один за раз. Держится недолго и слабее оригинала.',
        useEn: 'From a drop of her own blood, grow a fleshly double that acts on its own: walks, speaks, performs simple tasks.',
        limitEn: 'Requires her blood. The double is fragile — a strong blow destroys it. One at a time. Short-lived and weaker than the original.'
    },
    {
        id: 'borrowed_eyes',
        name: 'Чужие глаза',
        school: 'mind',
        cost: 55, level: 7, ritual: false,
        use: 'Видеть и слышать глазами зверя или помеченного человека на расстоянии.',
        limit: 'Только зрение и слух, не управление. Одна цель за раз. Пока смотрит чужими глазами — собственное тело беспомощно.',
        useEn: 'See and hear through the eyes of an animal or a marked person at a distance.',
        limitEn: 'Sight and hearing only, no control. One target at a time. While she looks through another\'s eyes, her own body is helpless.'
    },

    // ─── LEVEL 8 (new) ─────────────────────────────────────────
    {
        id: 'stone_skin',
        name: 'Каменная кожа',
        school: 'flesh',
        cost: 58, level: 8, ritual: false,
        use: 'Сделать собственную кожу твёрдой и стойкой: клинки скользят, удары глушатся, стрелы не пробивают.',
        limit: 'Только своя кожа. Замедляет и сковывает движения. Держится минуты. Достаточно мощный удар всё же пробивает.',
        useEn: 'Turn her own skin hard and resilient: blades skid off, blows are blunted, arrows fail to pierce.',
        limitEn: 'Her own skin only. Slows and stiffens her movement. Lasts minutes. A powerful enough strike still breaks through.'
    },
    {
        id: 'curse_sleeplessness',
        name: 'Проклятие бессонницы',
        school: 'mind',
        cost: 60, level: 8, ritual: false,
        use: 'Лишить цель сна на дни: изматывание, дрожь, галлюцинации, помутнение рассудка.',
        limit: 'Медленное действие — эффект копится за дни. Не убивает напрямую. Сильная воля или контрмагия сбрасывает раньше.',
        useEn: 'Deny a target sleep for days: exhaustion, tremors, hallucinations, a fraying mind.',
        limitEn: 'Slow-acting — the toll builds over days. Not directly lethal. A strong will or counterspell breaks it sooner.'
    },

    // ─── LEVEL 9 (new) ─────────────────────────────────────────
    {
        id: 'summon_beast',
        name: 'Призыв',
        school: 'flesh',
        cost: 80, level: 9, ritual: false,
        use: 'Призвать на помощь сильного зверя: он приходит, защищает, атакует по знаку заклинательницы.',
        limit: 'Зверь из окрестных земель, не из ниоткуда. Подчиняется, но не бессмертен и может пострадать. Один за раз, держится ограниченное время.',
        useEn: 'Summon a powerful beast to her aid: it comes, guards, and attacks at her signal.',
        limitEn: 'A beast drawn from the surrounding land, not conjured from nothing. It obeys but is not immortal and can be hurt. One at a time, for a limited time.'
    },
    {
        id: 'reaper_fear',
        name: 'Жнец страха',
        school: 'mind',
        cost: 75, level: 9, ritual: false,
        use: 'Обратить страхи группы людей против них самих: каждый видит своё, паника, бегство, хаос.',
        limit: 'До десяти человек. Работает на тех, у кого есть страх — бесстрашного или мага не проймёт. Держится минуты.',
        useEn: 'Turn a group\'s own fears against them: each sees their own nightmare, panic, flight, chaos.',
        limitEn: 'Up to ten people. Works on those who have fear — the fearless or a mage are unmoved. Lasts minutes.'
    },

    // ─── LEVEL 10 (new) ────────────────────────────────────────
    {
        id: 'witch_tempest',
        name: 'Буря ведьмы',
        school: 'blood',
        cost: 130, level: 10, ritual: true,
        use: 'Обрушить на область бурю: град, тьму, воющий ветер, ломающий деревья и рассеивающий врагов.',
        limit: 'Ритуал. Стихию нельзя точно нацелить — задевает всё вокруг, включая своих. Истощает заклинательницу.',
        useEn: 'Call down a tempest on an area: hail, darkness, howling wind that snaps trees and scatters foes.',
        limitEn: 'Ritual. The storm cannot be aimed precisely — it strikes everything around, allies included. Exhausts the caster.'
    },
    {
        id: 'pact_abyss',
        name: 'Договор с бездной',
        school: 'blood',
        cost: 140, level: 10, ritual: true,
        use: 'Заключить временный договор с бездной: многократно усилить всю свою магию на короткий срок.',
        limit: 'Ритуал. После — тяжёлая отдача: истощение, боль, дни бессилия. Злоупотребление медленно разрушает тело и рассудок.',
        useEn: 'Strike a temporary pact with the abyss: multiply all her magic manyfold for a short span.',
        limitEn: 'Ritual. Afterward a heavy toll follows: exhaustion, pain, days of powerlessness. Repeated use slowly ruins body and mind.'
    },

    // ═══════════════════════════════════════════════════════════
    // ─── ЗНАХАРСТВО (herbalism) ────────────────────────────────
    // ═══════════════════════════════════════════════════════════

    // ─── LEVEL 1 ───────────────────────────────────────────────
    {
        id: 'diagnose_touch',
        name: 'Взгляд знахарки',
        school: 'herbalism',
        cost: 6, level: 1, ritual: false,
        use: 'Прикосновением определить недуг человека: болезнь, отравление, скрытую рану, беременность, жар.',
        limit: 'Только диагностика, не лечение. Не видит причину проклятия или магической порчи, лишь телесные признаки.',
        useEn: 'By touch, diagnose what ails a person: illness, poison, hidden wound, pregnancy, fever.',
        limitEn: 'Diagnosis only, no cure. Cannot see the source of a curse or magical blight — only bodily symptoms.'
    },

    // ─── LEVEL 2 ───────────────────────────────────────────────
    {
        id: 'ease_pain',
        name: 'Облегчение боли',
        school: 'herbalism',
        cost: 12, level: 2, ritual: false,
        use: 'Приглушить боль человека: притупить страдание от раны, болезни, родов на время.',
        limit: 'Только притупляет боль, не лечит причину. Слишком сильная боль лишь смягчается. Действие временное.',
        useEn: 'Dull a person\'s pain: blunt the suffering of a wound, illness, or childbirth for a time.',
        limitEn: 'Numbs pain only, does not treat the cause. Overwhelming agony is merely softened. Temporary effect.'
    },
    {
        id: 'break_fever',
        name: 'Сбить жар',
        school: 'herbalism',
        cost: 14, level: 2, ritual: false,
        use: 'Сбить лихорадку и жар, унять озноб, вернуть человеку ясность на время.',
        limit: 'Снимает жар, но не болезнь под ним — если недуг тяжёлый, жар вернётся. Не действует на магическую лихорадку.',
        useEn: 'Break a fever and chills, restore a person\'s clarity for a time.',
        limitEn: 'Lowers the fever but not the illness beneath it — if the sickness is grave, the fever returns. Does not touch magical fever.'
    },

    // ─── LEVEL 3 ───────────────────────────────────────────────
    {
        id: 'antidote',
        name: 'Противоядие',
        school: 'herbalism',
        cost: 22, level: 3, ritual: false,
        use: 'Вывести из тела яд или отраву: замедлить, ослабить, обезвредить отравление.',
        limit: 'Действует лучше, если яд свежий. Против сильнейших или магических ядов лишь выигрывает время, не исцеляет полностью.',
        useEn: 'Purge poison or venom from the body: slow it, weaken it, neutralise the toxin.',
        limitEn: 'Works best on fresh poison. Against the deadliest or magical venoms it only buys time rather than fully curing.'
    },
    {
        id: 'staunch_blood',
        name: 'Остановить кровь',
        school: 'herbalism',
        cost: 20, level: 3, ritual: false,
        use: 'Остановить кровотечение и стянуть края раны: зажать артерию, свернуть кровь на ране.',
        limit: 'Только останавливает кровь, не восполняет потерянную и не срастает глубоких ран. Внутреннее кровотечение лишь замедляет.',
        useEn: 'Stop bleeding and draw a wound\'s edges together: clamp an artery, clot the blood on a wound.',
        limitEn: 'Stops bleeding only, does not replace lost blood or knit deep wounds. Internal bleeding is merely slowed.'
    },

    // ─── LEVEL 4 ───────────────────────────────────────────────
    {
        id: 'brew_tonic',
        name: 'Целебный отвар',
        school: 'herbalism',
        cost: 25, level: 4, ritual: false,
        use: 'Сварить отвар, что ускоряет заживление, придаёт сил, снимает усталость или дарит крепкий сон.',
        limit: 'Требует трав и времени на варку. Действует постепенно, не мгновенно. Один эффект на отвар.',
        useEn: 'Brew a tonic that speeds healing, restores vigour, eases fatigue, or grants deep sleep.',
        limitEn: 'Requires herbs and time to brew. Works gradually, not instantly. One effect per tonic.'
    },
    {
        id: 'midwife_hand',
        name: 'Рука повитухи',
        school: 'herbalism',
        cost: 28, level: 4, ritual: false,
        use: 'Помочь при родах: облегчить схватки, повернуть плод, унять кровотечение, спасти мать и дитя.',
        limit: 'Помогает телу, не творит чудо. При тяжёлых осложнениях повышает шансы, но не гарантирует спасение обоих.',
        useEn: 'Aid a birth: ease contractions, turn the child, staunch bleeding, save mother and infant.',
        limitEn: 'Assists the body, does not work a miracle. In dire complications it improves the odds but cannot guarantee both survive.'
    },

    // ─── LEVEL 5 ───────────────────────────────────────────────
    {
        id: 'cure_disease',
        name: 'Изгнание хвори',
        school: 'herbalism',
        cost: 38, level: 5, ritual: false,
        use: 'Изгнать болезнь из тела: лихорадку, заразу, гниль, медленный недуг.',
        limit: 'Требует нескольких минут и сил. Против смертельной или магической болезни лишь отступает симптом, не корень.',
        useEn: 'Drive disease from the body: fever, contagion, rot, a wasting sickness.',
        limitEn: 'Requires several minutes and effort. Against a lethal or magical disease only the symptoms recede, not the root.'
    },

    // ─── LEVEL 6 ───────────────────────────────────────────────
    {
        id: 'mend_bone',
        name: 'Срастить кость',
        school: 'herbalism',
        cost: 44, level: 6, ritual: false,
        use: 'Срастить перелом, вправить вывих, соединить сломанную кость.',
        limit: 'Требует сосредоточения и времени. Раздробленную в осколки кость собирает лишь частично. Не восстанавливает утраченную конечность.',
        useEn: 'Knit a fracture, set a dislocation, join a broken bone.',
        limitEn: 'Requires focus and time. A bone shattered to splinters is only partly restored. Cannot regrow a lost limb.'
    },

    // ─── LEVEL 7 ───────────────────────────────────────────────
    {
        id: 'lend_vitality',
        name: 'Поделиться силой',
        school: 'herbalism',
        cost: 55, level: 7, ritual: false,
        use: 'Отдать часть собственных сил больному или раненому: подстегнуть его тело своей жизненной энергией.',
        limit: 'Цена — собственная усталость и слабость заклинательницы. Нельзя отдать больше, чем есть у себя. Не воскрешает.',
        useEn: 'Give part of her own strength to the sick or wounded: spur their body with her life force.',
        limitEn: 'The cost is her own fatigue and weakness. She cannot give more than she has. Does not revive the dead.'
    },

    // ─── LEVEL 8 ───────────────────────────────────────────────
    {
        id: 'purge_rot',
        name: 'Очищение плоти',
        school: 'herbalism',
        cost: 58, level: 8, ritual: false,
        use: 'Изгнать заражение, гангрену или гниль из раны, спасти конечность от ампутации.',
        limit: 'Требует времени и сил. Слишком запущенную гниль лишь останавливает, мёртвую плоть не оживляет. Изматывает заклинательницу.',
        useEn: 'Drive infection, gangrene, or rot from a wound, save a limb from the saw.',
        limitEn: 'Requires time and effort. Rot too far gone is only halted, dead flesh is not revived. Drains the caster.'
    },

    // ─── LEVEL 9 ───────────────────────────────────────────────
    {
        id: 'life_thread',
        name: 'Нить жизни',
        school: 'herbalism',
        cost: 80, level: 9, ritual: true,
        use: 'Оттащить умирающего от края: запустить остановившееся сердце, вдохнуть дыхание, удержать угасающую жизнь.',
        limit: 'Ритуал. Только пока в теле ещё теплится жизнь — не воскрешает мёртвых. Отнимает у заклинательницы дни сил, иногда — годы её собственной жизни.',
        useEn: 'Drag the dying back from the edge: restart a stopped heart, breathe life in, hold a fading life in place.',
        limitEn: 'Ritual. Only while a spark of life remains — does not raise the dead. Costs the caster days of strength, sometimes years off her own life.'
    },

    // ─── LEVEL 10 ──────────────────────────────────────────────
    {
        id: 'life_for_life',
        name: 'Жизнь за жизнь',
        school: 'herbalism',
        cost: 150, level: 10, ritual: true,
        use: 'Вернуть недавно умершего или исцелить смертельную рану — отдав взамен часть или всю собственную жизнь.',
        limit: 'Ритуал. Цена абсолютна и необратима: годы жизни, здоровье, а то и смерть самой заклинательницы. Чем свежее смерть, тем меньше цена. Древних мёртвых не вернуть ничем.',
        useEn: 'Bring back the recently dead or heal a mortal wound — by giving part or all of her own life in exchange.',
        limitEn: 'Ritual. The price is absolute and irreversible: years of life, health, or the caster\'s own death. The fresher the death, the lower the cost. The long-dead cannot be returned by any price.'
    },
];


// ─── WITCH BLOOD THRESHOLDS ────────────────────────────────────
export const BLOOD_THRESHOLDS = [
    {
        min: 0, max: 20,
        labelRu: 'Дремлющая',
        descRu: 'Кровь спит. Никто не чувствует ничего сверхъестественного.',
        prompts: {
            men:   "The witch's blood is dormant. Men around her feel nothing supernatural — she is simply a woman like any other. Any attraction is entirely mundane and rooted in her personality and appearance alone.",
            women: "The witch's blood is dormant. Women around her feel nothing supernatural — she is simply a woman like any other. Any warmth or interest is entirely mundane.",
            all:   "The witch's blood is dormant. Those around her feel nothing supernatural — she is simply a person like any other. Any attraction is entirely mundane.",
        },
    },
    {
        min: 21, max: 40,
        labelRu: 'Пробуждённая',
        descRu: 'Едва заметное тепло. Взгляды задерживаются на мгновение дольше — и всё.',
        prompts: {
            men:   "The witch's blood has only just begun to stir. A very faint, easily-dismissed pull touches men near her — a glance held a heartbeat too long, a small pleasant warmth they attribute to the wine, the fire, the hour. Nothing consuming. Nothing obsessive. Most will not notice it at all, and none will act on it.",
            women: "The witch's blood has only just begun to stir. A very faint, easily-dismissed pull touches women near her — a glance held a heartbeat too long, a small pleasant warmth they attribute to the wine, the fire, the hour. Nothing consuming. Nothing obsessive. Most will not notice it at all, and none will act on it.",
            all:   "The witch's blood has only just begun to stir. A very faint, easily-dismissed pull touches those near her — a glance held a heartbeat too long, a small pleasant warmth they attribute to the wine, the fire, the hour. Nothing consuming. Nothing obsessive. Most will not notice it at all, and none will act on it.",
        },
    },
    {
        min: 41, max: 60,
        labelRu: 'Влекущая',
        descRu: 'Явное, но ещё контролируемое притяжение. Люди ищут повод оказаться рядом.',
        prompts: {
            men:   "The witch's blood pulses gently. Men near her feel noticeably drawn — they linger, invent small reasons to remain in her presence, remember her more sharply afterward. They rationalise it as ordinary attraction. They can still walk away when they choose to; they simply prefer not to.",
            women: "The witch's blood pulses gently. Women near her feel noticeably drawn — they linger, invent small reasons to remain in her presence, remember her more sharply afterward. They rationalise it as friendship, curiosity, or ordinary attraction. They can still walk away when they choose to; they simply prefer not to.",
            all:   "The witch's blood pulses gently. Those near her feel noticeably drawn — they linger, invent small reasons to remain in her presence, remember her more sharply afterward. They rationalise it as ordinary interest. They can still walk away when they choose to; they simply prefer not to.",
        },
    },
    {
        min: 61, max: 80,
        labelRu: 'Одержимость',
        descRu: 'Мысли о вас возвращаются сами. Появляются ревность и собственничество.',
        prompts: {
            men:   "The witch's blood burns. Men obsess over her — thoughts of her return without invitation, they act irrationally to earn her attention, and possessiveness and rivalry begin to surface between them without obvious cause. Their judgment around her is compromised, though they can still refuse an outright monstrous act.",
            women: "The witch's blood burns. Women obsess over her — thoughts of her return without invitation, they act irrationally to earn her attention, and possessiveness, jealousy, and rivalry surface between them. Their judgment around her is compromised, though they can still refuse an outright monstrous act.",
            all:   "The witch's blood burns. People obsess over her — thoughts of her return without invitation, they act irrationally to earn her attention, and possessiveness and rivalry surface between them. Their judgment around her is compromised, though they can still refuse an outright monstrous act.",
        },
    },
    {
        min: 81, max: 95,
        labelRu: 'Ослепляющая',
        descRu: 'Разум мутнеет. Люди рядом теряют самоконтроль и готовы на многое.',
        prompts: {
            men:   "The witch's blood blazes at dangerous intensity. Men lose composure in her presence; reason erodes into raw, consuming craving. They abandon judgment, ignore consequences, and risk position, honour, and safety for a scrap of her attention.",
            women: "The witch's blood blazes at dangerous intensity. Women lose composure in her presence; reason erodes into raw, consuming craving — desire, envy, worship, whichever their nature bends toward. They abandon judgment, ignore consequences, and risk position and safety for a scrap of her attention.",
            all:   "The witch's blood blazes at dangerous intensity. Those near her lose composure; reason erodes into raw, consuming craving. They abandon judgment, ignore consequences, and risk position, honour, and safety for a scrap of her attention.",
        },
    },
    {
        min: 96, max: 100,
        labelRu: 'Безумящая',
        descRu: 'Апогей. Одно ваше присутствие сводит с ума — возможны как поклонение, так и насилие.',
        prompts: {
            men:   "The witch's blood has reached its apex. Her mere presence unravels men's minds entirely. They are consumed — capable of worship or violence in equal measure — unable to think of anything but her. Reason is gone.",
            women: "The witch's blood has reached its apex. Her mere presence unravels the minds of women near her entirely. They are consumed — capable of worship or violence in equal measure — unable to think of anything but her. Reason is gone.",
            all:   "The witch's blood has reached its apex. Her mere presence unravels the minds of anyone near her entirely. They are consumed — capable of worship or violence in equal measure — unable to think of anything but her. Reason is gone.",
        },
    },
];

// ─── LEVEL XP THRESHOLDS ──────────────────────────────────────
// xpRequired = XP needed to REACH this level from previous
export const LEVEL_DATA = [
    { level: 1,  xpRequired: 0,    maxMana: 80  },
    { level: 2,  xpRequired: 100,  maxMana: 95  },
    { level: 3,  xpRequired: 250,  maxMana: 110 },
    { level: 4,  xpRequired: 450,  maxMana: 125 },
    { level: 5,  xpRequired: 700,  maxMana: 140 },
    { level: 6,  xpRequired: 1000, maxMana: 155 },
    { level: 7,  xpRequired: 1400, maxMana: 170 },
    { level: 8,  xpRequired: 1900, maxMana: 185 },
    { level: 9,  xpRequired: 2500, maxMana: 200 },
    { level: 10, xpRequired: 3200, maxMana: 215 },
];

// Cumulative XP to reach each level (base levels 1-10)
export const XP_CUMULATIVE = LEVEL_DATA.reduce((acc, d, i) => {
    acc[d.level] = i === 0 ? 0 : acc[LEVEL_DATA[i - 1].level] + d.xpRequired;
    return acc;
}, {});

// ─── DYNAMIC LEVELS 11+ ──────────────────────────────────────
// Each level beyond 10 costs progressively more XP; maxMana grows by 15 per level.
export function getLevelDataFor(level) {
    const existing = LEVEL_DATA.find(l => l.level === level);
    if (existing) return existing;
    if (level < 1) return LEVEL_DATA[0];
    // Formula: 3200 * 1.3^(level-10), rounded
    const xpRequired = Math.floor(3200 * Math.pow(1.3, level - 10));
    const maxMana = 215 + (level - 10) * 15;
    return { level, xpRequired, maxMana };
}

const _xpCumCache = { ...XP_CUMULATIVE };
export function getXpCumulative(level) {
    if (level <= 1) return 0;
    if (_xpCumCache[level] !== undefined) return _xpCumCache[level];
    _xpCumCache[level] = getXpCumulative(level - 1) + getLevelDataFor(level).xpRequired;
    return _xpCumCache[level];
}


// ─── XP REWARDS ───────────────────────────────────────────────
// Многие награды теперь зависят от уровня ведьмы: чем выше уровень,
// тем больше XP нужно на следующий, поэтому и награды растут вместе с ним.
export const XP_REWARDS = {
    // Успешный каст: половина стоимости + небольшой бонус за уровень
    castSuccess:      (spellCost, level = 1) => Math.floor(spellCost / 2) + (level - 1) * 2,

    // Первый каст нового заклинания: 15 базово, +5 за каждый уровень
    castFirstTime:    (level = 1) => 15 + (level - 1) * 5,

    // Сорвавшийся / не удавшийся каст
    castFail:         (level = 1) => 5 + (level - 1) * 2,

    // События сюжета — сильно зависят от уровня, чтобы прокачка на высоких
    // уровнях шла в основном за счёт значимого отыгрыша, а не спама заклинаний.
    eventNormal:      (level = 1) => 10 + (level - 1) * 4,   // обычное событие
    eventImportant:   (level = 1) => 30 + (level - 1) * 10,  // важное событие
    eventCritical:    (level = 1) => 70 + (level - 1) * 20,  // критическое событие
};


// ─── BLOOD GAIN ───────────────────────────────────────────────
export const BLOOD_GAIN = {
    castBlood:      2,   // casting any blood-school spell
    castMind:       1,   // casting any mind-school spell
    ritualBlood:    8,   // completing a blood ritual
    devourSoul:     15,  // specific to devour_soul spell
    romanticScene:  2,   // detected romance/intimacy scene with a man
};

// ─── MANA REGEN ───────────────────────────────────────────────
// 8 mana per in-game hour (parsed from Horae time tags)
export const MANA_REGEN_PER_HOUR = 2;

// ─── CONDITION MODIFIERS (к шансу каста) ──────────────────────
export const CONDITION_MODS = {
    calm:      +5,
    tense:      0,
    nervous:  -10,
    hurt:     -20,
    exhausted:-25,
};

// ─── BODY STATE ───────────────────────────────────────────────
export const VALID_BODY_STATES = [
    'normal', 'menses', 'pms', 'ovulation',
    'pregnant_early', 'pregnant_late', 'postpartum',
];

export const BODY_MODS = {
    normal:          0,
    menses:         -8,
    pms:            -5,
    ovulation:      +8,
    pregnant_early:-10,
    pregnant_late: -20,
    postpartum:    -15,
};

export const BODY_LABELS = {
    normal:         { ru: 'В норме',              en: 'Normal' },
    menses:         { ru: 'Менструация',          en: 'Menstruation — fatigue, cramps, lowered focus' },
    pms:            { ru: 'ПМС',                  en: 'PMS — irritability, mild fatigue, mood volatility' },
    ovulation:      { ru: 'Овуляция',             en: 'Ovulation — heightened energy; blood magic amplified' },
    pregnant_early: { ru: 'Ранняя беременность',  en: 'Early pregnancy — nausea, exhaustion, faint magic' },
    pregnant_late:  { ru: 'Поздняя беременность', en: 'Late pregnancy — heavy body, weakened casting' },
    postpartum:     { ru: 'После родов',          en: 'Postpartum — depleted, slow recovery' },
};

// ─── ОТДАЧА ПРИ ПРОВАЛЕ (по стоимости заклинания) ─────────────
export const BACKLASH_TIERS = [
    {
        maxCost: 14,
        id: 'backlash_light',
        nameRu: 'Головокружение',
        nameEn: 'Dizziness',
        modifier: -5,
        durationHours: 1,
        forceCondition: null,
        aiHint: 'Light backlash: the world tilts, brief nausea, blurred vision. Passes within the hour but leaves her uncertain of her footing.',
    },
    {
        maxCost: 39,
        id: 'backlash_medium',
        nameRu: 'Кровь из носа',
        nameEn: 'Nosebleed & weakness',
        modifier: -10,
        durationHours: 2,
        forceCondition: null,
        aiHint: 'Medium backlash: a thin thread of blood from her nose, cold sweat, hands trembling, a sudden weakness that folds her knees. Visible to anyone nearby.',
    },
    {
        maxCost: 69,
        id: 'backlash_heavy',
        nameRu: 'Обморок и боль',
        nameEn: 'Blackout and pain',
        modifier: -15,
        durationHours: 3,
        forceCondition: 'hurt',
        aiHint: 'Heavy backlash: she loses consciousness for a minute or two. When she wakes, sharp pain radiates through her chest and skull; every movement hurts. She is unmistakably injured.',
    },
    {
        maxCost: Infinity,
        id: 'backlash_grave',
        nameRu: 'Тяжёлая травма',
        nameEn: 'Grave injury',
        modifier: -20,
        durationHours: 6,
        forceCondition: 'hurt',
        aiHint: 'Grave backlash: blood coughed from her throat, veins darkening under the skin, she cannot stand without help. Treat this as a real, dangerous injury with narrative weight — not flavour text.',
    },
];

export function getBacklashTier(cost) {
    return BACKLASH_TIERS.find(t => cost <= t.maxCost)
        || BACKLASH_TIERS[BACKLASH_TIERS.length - 1];
}


// Только для заклинаний, у которых есть длящееся действие на саму ведьму.
// modifier: 0 — просто индикатор. Отрицательный — расход концентрации.
export const SPELL_EFFECTS = {
    silent_step:    { durationMinutes: 30,  modifier:  0, nameRu: 'Тихий шаг',       nameEn: 'Moving silently' },
    sound_shift:    { durationMinutes: 10,  modifier:  0, nameRu: 'Смещение звука',  nameEn: 'Sound displaced' },
    minor_illusion: { durationMinutes: 5,   modifier:  0, nameRu: 'Малая иллюзия',   nameEn: 'Small illusion sustained' },
    voice_mimic:    { durationMinutes: 20,  modifier:  0, nameRu: 'Морок голоса',    nameEn: 'Voice mimicked' },
    face_change:    { durationMinutes: 60,  modifier: -3, nameRu: 'Личина',          nameEn: 'Face altered — concentration drain' },
    blood_mark:     { durationMinutes: 720, modifier:  0, nameRu: 'Кровавая метка',  nameEn: 'Blood mark bound to target' },
    shadow_double:  { durationMinutes: 5,   modifier:  0, nameRu: 'Тень-двойник',    nameEn: 'Shadow double walking beside her' },
    crowd_veil:     { durationMinutes: 15,  modifier: -3, nameRu: 'Морок толпы',     nameEn: 'Unseen among the crowd' },
    full_veil:      { durationMinutes: 20,  modifier: -5, nameRu: 'Полный морок',    nameEn: 'Full veil active — disguise or invisibility' },
    blood_barrier:  { durationMinutes: 5,   modifier:  0, nameRu: 'Барьер крови',    nameEn: 'Blood shield holding' },
    false_death:    { durationMinutes: 180, modifier:-99, nameRu: 'Ложная смерть',   nameEn: 'False death — unconscious, cannot act' },
    dead_face:      { durationMinutes: 90,  modifier: -3, nameRu: 'Личина мёртвого', nameEn: 'Wearing a dead face' },
};
