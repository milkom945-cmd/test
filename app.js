/* eslint-disable no-alert */
(() => {
  const $ = (id) => document.getElementById(id);

  const els = {
    goal: $("goal"),
    format: $("format"),
    season: $("season"),
    tone: $("tone"),
    level: $("level"),
    generateBtn: $("generateBtn"),
    surpriseBtn: $("surpriseBtn"),
    result: $("result"),
    copyBtn: $("copyBtn"),
    favBtn: $("favBtn"),
    favorites: $("favorites"),
    favCount: $("favCount"),
    copyLastBtn: $("copyLastBtn"),
    clearFavBtn: $("clearFavBtn"),
    toast: $("toast"),
  };

  const STORAGE_KEY = "banya_smm_ideas_v1";

  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const uniq = (arr) => [...new Set(arr)];
  const chance = (p) => Math.random() < p;

  const normalize = (s) =>
    String(s || "")
      .toLowerCase()
      .replaceAll("ё", "е")
      .trim()
      .replaceAll(/\s+/g, " ");

  function toast(message) {
    els.toast.textContent = message;
    els.toast.classList.add("show");
    window.clearTimeout(toast._t);
    toast._t = window.setTimeout(() => els.toast.classList.remove("show"), 1600);
  }

  const taxonomy = {
    goal: [
      "Продажи (запись/бронь)",
      "Доверие (экспертность)",
      "Прогрев",
      "Вовлечение",
      "Узнаваемость",
      "Повторные визиты",
      "Партнёрства",
      "Отзывы/UGC",
    ],
    format: ["Пост", "Сторис", "Рилс/Shorts", "Карусель", "Прямой эфир", "Гайд (PDF/пост)", "Чек‑лист", "Оффер/акция"],
    season: [
      "Зима",
      "Весна",
      "Лето",
      "Осень",
      "Праздники (НГ/23/8 марта)",
      "Выходные",
      "День рождения",
      "После тренировки",
      "После тяжёлой недели",
      "Похолодало/первый снег",
    ],
    tone: ["Тёплый", "Премиальный", "Ироничный", "Сдержанный", "Дружеский", "Смелый"],
    level: ["Новичок", "Опытный", "Профи/пар‑мастер", "Семья", "Компания друзей", "Пары"],
  };

  const buildingBlocks = {
    niches: [
      "баня на дровах",
      "сауна",
      "хаммам",
      "банный комплекс",
      "аренда бани",
      "парение с пар‑мастером",
      "SPA‑зона",
      "купель/чан",
      "баня‑бочка",
      "баня у воды",
    ],
    offers: [
      "2+1 час в подарок",
      "скидка в будни до 17:00",
      "семейный пакет",
      "комплект веников в подарок",
      "чайная церемония",
      "парение “Классика”",
      "парение “Детокс”",
      "аренда беседки/мангала",
      "сертификат в подарок",
      "комбо: баня + чан",
    ],
    objections: [
      "дорого",
      "не люблю жару",
      "стыдно/некомфортно",
      "не знаю, как правильно париться",
      "нет времени",
      "не с кем пойти",
      "боюсь простудиться",
      "непонятно, что брать с собой",
      "не уверен(а) в чистоте",
      "не люблю общественные места",
    ],
    triggers: [
      "до/после",
      "ошибка/миф",
      "экономия времени",
      "простая инструкция",
      "закулисье",
      "сравнение вариантов",
      "личный опыт",
      "чек‑лист",
      "история клиента",
      "психология выбора",
    ],
    hooks: [
      "3 ошибки, из‑за которых баня “не заходит” (и как исправить)",
      "Если вы выходите из бани без сил — сделайте вот это",
      "Секрет мягкого пара: что меняет ощущение за 2 минуты",
      "Миф: “в бане надо терпеть”. Нет. Вот безопасная схема",
      "Что взять с собой в баню, чтобы отдых стал в 2 раза комфортнее",
      "Как выбрать веник под ваш запрос: сон/стресс/спина",
      "Почему в будни лучше, чем в выходные (и кому это выгодно)",
      "Вы не обязаны “париться правильно”. Но есть 1 лайфхак…",
      "5 минут подготовки — и вы не выйдете с головной болью",
      "Цена vs ценность: за что вы реально платите в банном комплексе",
      "Чем отличается баня на дровах от сауны по ощущениям",
      "Сценарий идеального вечера: баня + чай + купель",
      "Мы сделали мини‑эксперимент: какой режим пара нравится всем",
      "Топ‑3 вопроса, которые стесняются задать перед первым визитом",
      "Как не простудиться после бани: простая последовательность",
      "“Я не люблю баню” — чаще всего причина вот в этом",
      "Один вопрос, который поможет выбрать правильное парение",
      "Сколько стоит “перезагрузка” на самом деле? Посчитаем",
      "Сравнили 3 способа восстановиться после тренировки",
      "Подарок, который точно используют: банный сертификат",
    ],
    angles: [
      { id: "edu", name: "Обучение/польза", templates: ["инструкция", "чек‑лист", "разбор мифа", "FAQ", "ошибка → решение"] },
      { id: "trust", name: "Доверие/экспертность", templates: ["закулисье", "процесс", "почему так делаем", "стандарты чистоты", "команда"] },
      { id: "sale", name: "Продажа/оффер", templates: ["пакет", "ограничение по времени", "выгода в цифрах", "сравнение", "бронь без лишних шагов"] },
      { id: "emotion", name: "Эмоция/лайфстайл", templates: ["сценарий вечера", "атмосфера", "ритуал", "ассоциации", "релакс"] },
      { id: "ugc", name: "Отзывы/соцдоказательство", templates: ["история гостя", "до/после", "скрин отзыва", "топ вопросов из Директа", "реакции"] },
      { id: "engage", name: "Вовлечение", templates: ["опрос", "игра 'выбери'", "тест", "батл", "комментарии"] },
      { id: "local", name: "Локальность/комьюнити", templates: ["маршрут", "как добраться", "что рядом", "партнёрство", "местные поводы"] },
    ],
    topics: [
      "Первый визит: как подготовиться",
      "Режимы: температура/влажность/перерывы",
      "Веники: выбор, замачивание, хранение",
      "Чай/вода/соль: что и когда пить",
      "Купель/чан: кому подходит и как безопасно",
      "Парение: виды и чем отличаются",
      "Оздоровление спины/суставов (без обещаний лечения)",
      "Антистресс и сон",
      "Девичник/мальчишник/день рождения",
      "Семейный отдых",
      "Баня после тренировки",
      "Гигиена и чистота: как поддерживаем",
      "Атмосфера: свет, музыка, ароматы",
      "Сервис: что входит в аренду",
      "Цены: из чего складывается стоимость",
      "Правила безопасности",
      "Ошибки новичков",
      "Баня vs сауна vs хаммам",
      "Сезонные ритуалы",
      "Подарочные сертификаты",
      "Топ вопросов из Директа",
      "Экономный визит: как получить максимум",
      "Премиальный визит: что добавить к базовому",
      "Путь гостя: от брони до “хочу ещё”",
      "Истории: курьёзы/наблюдения (этично)",
    ],
    ctas: [
      "Напишите “ПАР” — подберём формат под ваш запрос.",
      "Слово “ВЕНИК” в Директ — отправим чек‑лист подготовки.",
      "Хотите такой сценарий? Напишите дату — проверим свободные окна.",
      "Сохраните, чтобы не забыть перед визитом.",
      "Проголосуйте: какой режим вам ближе — мягкий или жаркий?",
      "Задайте вопрос в комментариях — ответим в сторис.",
      "Нужен подарок? Напишите “СЕРТИФИКАТ” — расскажем варианты.",
      "Хотите в будни дешевле? Напишите “БУДНИ” — пришлём условия.",
      "Скинуть прайс и свободные даты? Напишите “БРОНЬ”.",
      "Отправить другу, с кем пойдёте в баню.",
    ],
    titles: [
      "Тема + 3 тезиса + CTA",
      "Проблема → причина → решение",
      "Миф → правда → как сделать",
      "Сценарий: до → во время → после",
      "Сравнение 2 вариантов",
      "Топ‑5/7/10",
      "FAQ из 5 вопросов",
      "История гостя: запрос → процесс → результат",
    ],
  };

  function seedSelect(selectEl, values) {
    const existing = new Set([...selectEl.options].map((o) => o.value));
    values.forEach((v) => {
      const value = normalize(v);
      if (existing.has(value)) return;
      const opt = document.createElement("option");
      opt.value = value;
      opt.textContent = v;
      selectEl.appendChild(opt);
    });
  }

  function getFilters() {
    const val = (el) => (el.value === "any" ? null : el.value);
    return {
      goal: val(els.goal),
      format: val(els.format),
      season: val(els.season),
      tone: val(els.tone),
      level: val(els.level),
    };
  }

  function matchesFilter(label, filterValue) {
    if (!filterValue) return true;
    return normalize(label) === filterValue;
  }

  function formatIdeaText(idea) {
    const lines = [];
    lines.push(`Заголовок/хук: ${idea.hook}`);
    lines.push(`Тема: ${idea.topic}`);
    lines.push(`Угол: ${idea.angleName}`);
    lines.push(`Формат: ${idea.format}`);
    lines.push(`Цель: ${idea.goal}`);
    if (idea.season) lines.push(`Повод: ${idea.season}`);
    if (idea.level) lines.push(`Аудитория: ${idea.level}`);
    if (idea.tone) lines.push(`Тон: ${idea.tone}`);
    lines.push("");
    lines.push("Структура:");
    idea.structure.forEach((s, i) => lines.push(`${i + 1}. ${s}`));
    if (idea.shots?.length) {
      lines.push("");
      lines.push("Кадры/сцены:");
      idea.shots.forEach((s, i) => lines.push(`${i + 1}. ${s}`));
    }
    if (idea.captions?.length) {
      lines.push("");
      lines.push("Подписи/фразы:");
      idea.captions.forEach((s, i) => lines.push(`${i + 1}. ${s}`));
    }
    lines.push("");
    lines.push(`CTA: ${idea.cta}`);
    return lines.join("\n");
  }

  function buildStructure(format) {
    const base = [
      "Открытие: проблема/желание гостя (1–2 строки)",
      "Коротко объяснить “почему так” (без медицинских обещаний)",
      "Показать решение/схему (3 шага)",
      "Пример на практике/мини‑сценарий визита",
      "CTA (вопрос/слово в Директ/бронь)",
    ];

    if (normalize(format).includes("сторис")) {
      return [
        "Сторис 1: хук (вопрос/ошибка/миф)",
        "Сторис 2: причина (почему так происходит)",
        "Сторис 3: решение (1–2 правила)",
        "Сторис 4: пример (как это выглядит у нас)",
        "Сторис 5: CTA (опрос/свайп/Директ)",
      ];
    }

    if (normalize(format).includes("рилс")) {
      return [
        "0–2 сек: хук (текст на экране)",
        "2–7 сек: показать ситуацию/ошибку",
        "7–15 сек: решение (3 пункта быстрыми титрами)",
        "15–20 сек: “как у нас” (атмосфера/деталь сервиса)",
        "Финал: CTA (вопрос или слово в Директ)",
      ];
    }

    if (normalize(format).includes("карус")) {
      return [
        "Слайд 1: хук + обещание пользы",
        "Слайд 2: проблема/типичная ошибка",
        "Слайды 3–5: решение по шагам",
        "Слайд 6: пример/сценарий (до/во время/после)",
        "Слайд 7: оффер/приглашение + CTA",
      ];
    }

    if (normalize(format).includes("эфир")) {
      return [
        "Вступление: кто вы + что разберём",
        "Блок 1: мифы/ошибки (3 пункта)",
        "Блок 2: правильная схема (по шагам)",
        "Блок 3: вопросы аудитории",
        "Завершение: оффер + CTA",
      ];
    }

    return base;
  }

  function buildShots(format, idea) {
    const place = pick([
      "парная",
      "предбанник",
      "чайная зона",
      "купель/чан",
      "дровник/печь",
      "зона отдыха",
      "душевая",
    ]);

    const detail = pick([
      "капли на камнях",
      "веник крупным планом",
      "чайник и травы",
      "термометр/гигрометр",
      "чистые полотенца",
      "дерево и свет",
      "пар в луче света",
      "камни печи",
    ]);

    const brandSafe = pick([
      "без лиц гостей (или с согласия)",
      "чистота/сервис",
      "атмосфера",
      "детали процесса",
    ]);

    const f = normalize(format);
    if (f.includes("сторис")) {
      return [
        `Кадр: ${detail} (текст: “${idea.hook}”)`,
        `Кадр: ${place} — показать “ошибку/ситуацию”`,
        "Кадр: 3 коротких пункта решения на экране",
        `Кадр: ${brandSafe} — как это выглядит у вас`,
        "Кадр: CTA (опрос/вопрос/слово в Директ)",
      ];
    }
    if (f.includes("рилс")) {
      return [
        `Титр‑хук + ${detail}`,
        `Ситуация: ${place} (быстро, 1–2 секунды)`,
        "Решение: 3 титра (по 0.5–1 сек)",
        "Деталь сервиса/оффер (пакет/подарок/условия)",
        "Финальный кадр: логотип/вход/чай + CTA",
      ];
    }
    return [
      `Фото/видео: ${detail}`,
      `Фото/видео: ${place}`,
      "Фото/видео: шаги/чек‑лист на фоне атмосферы",
      "Фото/видео: оффер/пакет/сервис",
    ];
  }

  function buildCaptions(format, idea) {
    const f = normalize(format);
    const captions = [];
    const soft = [
      "Сохраните, чтобы не забыть.",
      "Если хотите — подберём режим под вас.",
      "Без героизма: в бане должно быть комфортно.",
      "Пишите ваш вопрос — отвечу.",
    ];
    const spicy = [
      "Терпеть — не равно “правильно париться”.",
      "Главная ошибка новичков — делать всё наоборот.",
      "В бане решает не температура, а режим.",
      "Секунда — и вы почувствуете разницу.",
    ];

    if (f.includes("рилс") || f.includes("сторис")) {
      captions.push(chance(0.5) ? pick(spicy) : pick(soft));
      captions.push(`Сегодня разберём: ${idea.topic.toLowerCase()}.`);
      captions.push("Схема: 1) подготовка 2) пар 3) восстановление.");
      captions.push(pick(soft));
      return captions;
    }

    captions.push(`Коротко и по делу про ${idea.topic.toLowerCase()}.`);
    captions.push(pick(soft));
    return captions;
  }

  function generateIdea({ surprise = false } = {}) {
    const filters = getFilters();

    const goal = filters.goal
      ? taxonomy.goal.find((g) => normalize(g) === filters.goal) || pick(taxonomy.goal)
      : pick(taxonomy.goal);

    const format = filters.format
      ? taxonomy.format.find((g) => normalize(g) === filters.format) || pick(taxonomy.format)
      : pick(taxonomy.format);

    const season = filters.season
      ? taxonomy.season.find((g) => normalize(g) === filters.season) || pick(taxonomy.season)
      : chance(0.75)
        ? pick(taxonomy.season)
        : null;

    const tone = filters.tone
      ? taxonomy.tone.find((g) => normalize(g) === filters.tone) || pick(taxonomy.tone)
      : chance(0.8)
        ? pick(taxonomy.tone)
        : null;

    const level = filters.level
      ? taxonomy.level.find((g) => normalize(g) === filters.level) || pick(taxonomy.level)
      : chance(0.8)
        ? pick(taxonomy.level)
        : null;

    const topic = pick(buildingBlocks.topics);
    const angle = pick(buildingBlocks.angles);
    const niche = pick(buildingBlocks.niches);
    const offer = pick(buildingBlocks.offers);
    const objection = pick(buildingBlocks.objections);
    const trigger = pick(buildingBlocks.triggers);

    const hookBase = pick(buildingBlocks.hooks);
    const hook =
      surprise && chance(0.7)
        ? pick([
            `${hookBase} — на примере: ${niche}`,
            `Мы проверили: “${objection}” — как отвечать правильно`,
            `Сравнение: ${niche} vs другой формат — что выбрать`,
            `Честно про ${offer}: кому подходит и кому нет`,
            `До/после: как меняется состояние после правильного режима`,
          ])
        : hookBase;

    const angleName = angle.name;

    const structure = buildStructure(format);

    const safetyLine = pick([
      "Важно: если есть противопоказания — ориентируйтесь на рекомендации врача.",
      "Безопасность важнее рекордов: слушайте самочувствие.",
      "Не медицинский совет: делимся практикой комфортного отдыха.",
    ]);

    const twist = surprise
      ? pick([
          `Неожиданный поворот: дело не в “жаре”, а в ${pick(["влажности", "перерывах", "подготовке", "гидратации", "ритме"])}`,
          `Мини‑челлендж: попробуйте 1 раз — и сравните ощущения`,
          `Сделайте скрин: чек‑лист перед визитом`,
          `Покажем закулисье: как готовим ${pick(["парную", "веники", "чайную зону", "купель"])}`,
        ])
      : null;

    const cta = pick(buildingBlocks.ctas);

    const subtitleBits = uniq(
      [
        niche,
        goal,
        format,
        season,
        tone,
        level,
        `триггер: ${trigger}`,
        `возражение: ${objection}`,
        surprise ? "сюрприз‑микс" : null,
      ].filter(Boolean),
    );

    return {
      id: crypto?.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
      createdAt: Date.now(),
      goal,
      format,
      season,
      tone,
      level,
      topic,
      angleName,
      hook,
      offer,
      objection,
      trigger,
      safetyLine,
      twist,
      cta,
      subtitleBits,
      structure: [
        ...structure,
        twist ? `Усиление: ${twist}` : null,
        `Деталь оффера: ${offer}`,
        safetyLine,
      ].filter(Boolean),
      shots: buildShots(format, { hook }),
      captions: buildCaptions(format, { topic }),
    };
  }

  function renderIdea(idea) {
    els.result.innerHTML = "";

    const title = document.createElement("div");
    title.className = "ideaTitle";
    title.textContent = idea.hook;

    const meta = document.createElement("div");
    meta.className = "ideaMeta";

    const tags = [
      { text: idea.format, accent: true },
      { text: idea.goal },
      { text: idea.angleName },
      idea.season ? { text: idea.season } : null,
      idea.tone ? { text: idea.tone } : null,
      idea.level ? { text: idea.level } : null,
    ].filter(Boolean);

    tags.forEach((t) => {
      const tag = document.createElement("div");
      tag.className = `tag${t.accent ? " tagAccent" : ""}`;
      tag.textContent = t.text;
      meta.appendChild(tag);
    });

    const body = document.createElement("div");
    body.className = "ideaBody";
    body.innerHTML = `<b>Тема:</b> ${idea.topic}<br/><b>Оффер‑деталь:</b> ${idea.offer}<br/><b>Возражение:</b> ${idea.objection}`;

    const extras = document.createElement("div");
    extras.className = "ideaExtras";

    const structureTitle = document.createElement("div");
    structureTitle.innerHTML = "<b>Структура:</b>";
    const structureList = document.createElement("ul");
    idea.structure.forEach((s) => {
      const li = document.createElement("li");
      li.textContent = s;
      structureList.appendChild(li);
    });

    const shotsTitle = document.createElement("div");
    shotsTitle.innerHTML = "<b>Кадры/сцены:</b>";
    const shotsList = document.createElement("ul");
    idea.shots.forEach((s) => {
      const li = document.createElement("li");
      li.textContent = s;
      shotsList.appendChild(li);
    });

    extras.appendChild(structureTitle);
    extras.appendChild(structureList);
    extras.appendChild(shotsTitle);
    extras.appendChild(shotsList);

    const cta = document.createElement("div");
    cta.className = "ideaBody";
    cta.innerHTML = `<b>CTA:</b> ${idea.cta}`;

    els.result.appendChild(title);
    els.result.appendChild(meta);
    els.result.appendChild(body);
    els.result.appendChild(extras);
    els.result.appendChild(cta);

    els.copyBtn.disabled = false;
    els.favBtn.disabled = false;
    els.copyLastBtn.disabled = false;

    els.copyBtn.onclick = () => copyText(formatIdeaText(idea));
    els.copyLastBtn.onclick = () => copyText(formatIdeaText(idea));
    els.favBtn.onclick = () => addFavorite(idea);
  }

  function copyText(text) {
    const doToast = () => toast("Скопировано в буфер обмена");
    if (navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(doToast)
        .catch(() => fallbackCopy(text));
      return;
    }
    fallbackCopy(text);
  }

  function fallbackCopy(text) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      document.execCommand("copy");
      toast("Скопировано в буфер обмена");
    } catch {
      alert("Не удалось скопировать автоматически. Выделите и скопируйте вручную.");
    } finally {
      document.body.removeChild(ta);
    }
  }

  function loadFavorites() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveFavorites(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  function addFavorite(idea) {
    const items = loadFavorites();
    const exists = items.some((x) => x.id === idea.id);
    if (exists) {
      toast("Уже в избранном");
      return;
    }
    items.unshift(idea);
    saveFavorites(items.slice(0, 60));
    renderFavorites();
    toast("Добавлено в избранное");
  }

  function removeFavorite(id) {
    const items = loadFavorites().filter((x) => x.id !== id);
    saveFavorites(items);
    renderFavorites();
    toast("Удалено");
  }

  function renderFavorites() {
    const items = loadFavorites();
    els.favCount.textContent = String(items.length);
    els.favorites.innerHTML = "";

    if (!items.length) {
      const empty = document.createElement("div");
      empty.className = "muted";
      empty.textContent = "Пока пусто. Добавьте идеи кнопкой “В избранное”.";
      els.favorites.appendChild(empty);
      return;
    }

    items.forEach((idea) => {
      const wrap = document.createElement("div");
      wrap.className = "favItem";

      const top = document.createElement("div");
      top.className = "favTop";

      const t = document.createElement("div");
      t.className = "favTitle";
      t.textContent = idea.hook;

      const actions = document.createElement("div");
      actions.className = "favActions";

      const copy = document.createElement("button");
      copy.className = "iconBtn";
      copy.type = "button";
      copy.textContent = "Копировать";
      copy.onclick = () => copyText(formatIdeaText(idea));

      const del = document.createElement("button");
      del.className = "iconBtn";
      del.type = "button";
      del.textContent = "Удалить";
      del.onclick = () => removeFavorite(idea.id);

      actions.appendChild(copy);
      actions.appendChild(del);

      top.appendChild(t);
      top.appendChild(actions);

      const meta = document.createElement("div");
      meta.className = "ideaMeta";

      [idea.format, idea.goal, idea.angleName, idea.season].filter(Boolean).forEach((x, i) => {
        const tag = document.createElement("div");
        tag.className = `tag${i === 0 ? " tagAccent" : ""}`;
        tag.textContent = x;
        meta.appendChild(tag);
      });

      const body = document.createElement("div");
      body.className = "muted";
      body.textContent = `Тема: ${idea.topic}. CTA: ${idea.cta}`;

      wrap.appendChild(top);
      wrap.appendChild(meta);
      wrap.appendChild(body);
      els.favorites.appendChild(wrap);
    });
  }

  function clearFavorites() {
    saveFavorites([]);
    renderFavorites();
    toast("Избранное очищено");
  }

  function init() {
    seedSelect(els.goal, taxonomy.goal);
    seedSelect(els.format, taxonomy.format);
    seedSelect(els.season, taxonomy.season);
    seedSelect(els.tone, taxonomy.tone);
    seedSelect(els.level, taxonomy.level);

    els.generateBtn.addEventListener("click", () => {
      const idea = generateIdea({ surprise: false });
      renderIdea(idea);
    });

    els.surpriseBtn.addEventListener("click", () => {
      const idea = generateIdea({ surprise: true });
      renderIdea(idea);
      toast("Сюрприз‑режим: необычный микс");
    });

    els.clearFavBtn.addEventListener("click", clearFavorites);
    renderFavorites();
  }

  init();
})();
