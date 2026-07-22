// nell-witchcraft/index.js — PART 1/3
import {
    SPELL_LIST, BLOOD_THRESHOLDS, LEVEL_DATA, XP_CUMULATIVE,
    XP_REWARDS, BLOOD_GAIN, MANA_REGEN_PER_HOUR,
    CONDITION_MODS, VALID_BODY_STATES, BODY_MODS, BODY_LABELS,
    BACKLASH_TIERS, getBacklashTier, SPELL_EFFECTS,
    getLevelDataFor, getXpCumulative,
} from './spells.js';



import {
    chat, chat_metadata, this_chid, characters,
    setExtensionPrompt, extension_prompt_types, extension_prompt_roles,
    saveChatDebounced, name1,
} from '../../../../script.js';

import { eventSource, event_types } from '../../../../scripts/events.js';


const MODULE = 'nellWitchcraft';
const PROMPT_KEY = 'nell_witch_state';
const META_KEY = 'nellWitchState';

// ─── ТРАНСЛИТЕРАЦИЯ RU → EN (для автогенерации английских названий) ──
const TRANSLIT_MAP = {
    'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'yo','ж':'zh',
    'з':'z','и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o',
    'п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'kh','ц':'ts',
    'ч':'ch','ш':'sh','щ':'shch','ъ':'','ы':'y','ь':'','э':'e','ю':'yu','я':'ya',
};

function transliterate(text) {
    return text.split('').map(ch => {
        const lower = ch.toLowerCase();
        if (TRANSLIT_MAP[lower] !== undefined) {
            const mapped = TRANSLIT_MAP[lower];
            return ch === lower ? mapped : mapped.charAt(0).toUpperCase() + mapped.slice(1);
        }
        return ch;
    }).join('');
}

function autoNameEn(ruName) {
    // Транслитерируем и капитализируем каждое слово
    return transliterate(ruName)
        .split(/\s+/)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
}

function autoDescEn(ruText) {
    // Простая транслитерация всего текста
    return transliterate(ruText);
}

// ─── CUSTOM SPELLS HELPER ─────────────────────────────────────
function getAllSpells() {
    const custom = (state && Array.isArray(state.customSpells)) ? state.customSpells : [];
    return [...SPELL_LIST, ...custom];
}

// ─── КАСТОМНЫЕ УВЕДОМЛЕНИЯ ────────────────────────────────────
const NW_NOTIFY_ICONS = {
    info: '✦', success: '✧', warning: '⚠', error: '✘',
    xp: '★', level: '⚝', blood: '🩸', spell: '✨', effect: '⌛',
};

function showNotify(text, type = 'info', duration = 4000) {
    const root = document.getElementById('nw-root');
    let container = document.getElementById('nw-notify-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'nw-notify-container';
        (root || document.body).appendChild(container);
    } else if (root && container.parentElement !== root) {
        // если контейнер уже висел на body — переносим внутрь темы
        root.appendChild(container);
    }
    const el = document.createElement('div');
    el.className = `nw-notify nw-notify-${type}`;
    el.innerHTML = `
        <span class="nw-notify-ico">${NW_NOTIFY_ICONS[type] || '✦'}</span>
        <span class="nw-notify-text">${text}</span>`;
    container.appendChild(el);
    requestAnimationFrame(() => el.classList.add('nw-notify-show'));
    const t = setTimeout(() => {
        el.classList.remove('nw-notify-show');
        el.classList.add('nw-notify-hide');
        setTimeout(() => el.remove(), 400);
    }, duration);
    el.addEventListener('click', () => {
        clearTimeout(t);
        el.classList.remove('nw-notify-show');
        el.classList.add('nw-notify-hide');
        setTimeout(() => el.remove(), 400);
    });
}


// ─── ENABLE / DISABLE ─────────────────────────────────────────
const ENABLED_LS_KEY = 'nellWitchcraft_enabled';

const THEME_LS_KEY = 'nellWitchcraft_theme';
const VALID_THEMES = ['purple', 'dark', 'light', 'adaptive'];

function getTheme() {
    const saved = localStorage.getItem(THEME_LS_KEY);
    return VALID_THEMES.includes(saved) ? saved : 'purple';
}

function setTheme(theme) {
    if (!VALID_THEMES.includes(theme)) theme = 'purple';
    localStorage.setItem(THEME_LS_KEY, theme);
    const root = document.getElementById('nw-root');
    if (root) root.dataset.nwTheme = theme;
    const sel = document.getElementById('nw-select-theme');
    if (sel) sel.value = theme;
}


function isEnabled() {
    return localStorage.getItem(ENABLED_LS_KEY) !== 'false';
}

function setEnabled(val) {
    localStorage.setItem(ENABLED_LS_KEY, val ? 'true' : 'false');

    // Синхронизируем кружок в гримуаре
    const indicator = document.getElementById('nw-power-dot');
    if (indicator) indicator.classList.toggle('nw-power-off', !val);
    const powerBtn = document.getElementById('nw-power-btn');
    if (powerBtn) powerBtn.title = val ? 'Гримуар включен' : 'Гримуар выключен';

    // Синхронизируем галочку в настройках
    const chkEnabled = document.getElementById('nw-chk-enabled');
    if (chkEnabled) chkEnabled.checked = val;

    // Управляем промптом
    if (!val) {
        setExtensionPrompt(PROMPT_KEY, '', extension_prompt_types.IN_CHAT, 2, true, extension_prompt_roles.SYSTEM);
    } else {
        injectPrompt();
    }
    updateSettingsDisplay();
    renderSidebar();
}


// Default state for a brand-new chat
function defaultState() {
    return {
        level: 1,
        xp: 0,
        blood: 20,
        mana: 80,
        maxMana: 80,
        knownSpellIds: getSpellsUpToLevel(1).map(s => s.id),
        lastGameTime: null,
        lastProcessedMsgId: null, // номер последнего обработанного ответа ИИ (защита от свайпов)
        castHistory: [],
        quickSlots: [null, null, null, null, null],
        condition: 'calm',
        bodyState: 'normal',
        bloodTarget: 'men',  // на кого влияет ведьмовская кровь: 'men' | 'women' | 'all'
        activeEffects: [],   // [{id, sourceId, sourceType, nameRu, nameEn, type, modifier, remainingMinutes}]
        customSpells: [],    // [{id, name, nameEn, school, cost, level, ritual, use, useEn, limit, limitEn, iconData}]
        version: 3,
    };
}



// ─── STATE ACCESS (per-chat, stored in chat_metadata) ─────────
let state = null;

// Когда true — addXp/addBlood/level-up считаются молча (без всплывашек).
// Накопленные уведомления показываются позже, после ответа бота.
let silentMode = false;
let pendingSilentNotices = []; // [{text, type, duration}]

function queueNotice(text, type = 'info', duration = 4000) {
    if (silentMode) {
        pendingSilentNotices.push({ text, type, duration });
    } else {
        showNotify(text, type, duration);
    }
}

// Показать все накопленные «тихие» уведомления (вызывается после ответа бота)
function flushSilentNotices() {
    for (const n of pendingSilentNotices) {
        showNotify(n.text, n.type, n.duration);
    }
    pendingSilentNotices = [];
}

function loadState() {
    if (!chat_metadata[META_KEY]) {
        chat_metadata[META_KEY] = defaultState();
    }
    state = chat_metadata[META_KEY];
    // Migration safety: ensure all fields exist
    const def = defaultState();
    for (const k of Object.keys(def)) {
        if (state[k] === undefined) state[k] = def[k];
    }
    // Миграция v2 → v3: единицы игрового времени сменились (календарная
    // арифметика вместо приближённой). Старый lastGameTime несовместим —
    // сбрасываем; точка отсчёта восстановится из первого ответа ИИ.
    if (state.version < 3) {
        state.lastGameTime = null;
        state.version = 3;
    }
    recalcDerived();
}


function saveState({ silentUI = false } = {}) {
    chat_metadata[META_KEY] = state;
    saveChatDebounced();
    if (!silentUI) {
        renderPanel();
        updateSettingsDisplay();
    }
}


// Recalculate maxMana / known spells from current level
function recalcDerived() {
    const levelData = getLevelDataFor(state.level);
    state.maxMana = levelData.maxMana;
    if (state.mana > state.maxMana) state.mana = state.maxMana;

    const known = new Set(state.knownSpellIds);
    for (const s of getSpellsUpToLevel(state.level)) known.add(s.id);
    state.knownSpellIds = [...known];
}

// ─── SPELL HELPERS ────────────────────────────────────────────
function getSpellsUpToLevel(level) {
    return getAllSpells().filter(s => s.level <= level);
}


function getSpellById(id) {
    return getAllSpells().find(s => s.id === id) || null;
}


function isSpellKnown(id) {
    const spell = getSpellById(id);
    if (!spell) return false;
    return spell.level <= state.level;
}

function getBloodTier(value) {
    return BLOOD_THRESHOLDS.find(t => value >= t.min && value <= t.max)
        || BLOOD_THRESHOLDS[0];
}

// ─── XP / LEVEL ───────────────────────────────────────────────
function addXp(amount) {
    if (amount <= 0) return;
    state.xp += amount;
    queueNotice(`+${amount} опыта`, 'xp', 2500);
    let leveledUp = false;
    // No hard cap — levels grow infinitely beyond 10
    while (true) {
        const nextLevel = state.level + 1;
        const needed = getXpCumulative(nextLevel);
        if (state.xp >= needed) {
            state.level = nextLevel;
            leveledUp = true;
        } else break;
    }
    if (leveledUp) {
        recalcDerived();
        const lvlName = name1 || 'Ведьма';
        if (state.level <= 10) {
            const newSpells = SPELL_LIST.filter(s => s.level === state.level);
            if (newSpells.length > 0) {
                queueNotice(
                    `${lvlName} достигла ${state.level} уровня — новые заклинания: ${newSpells.map(s => s.name).join(', ')}`,
                    'level', 7000
                );
            } else {
                queueNotice(
                    `${lvlName} достигла ${state.level} уровня!`,
                    'level', 5000
                );
            }
        } else {
            const slots = state.level - 9;
            queueNotice(
                `${lvlName} достигла ${state.level} уровня! Слотов для заклинаний: ${slots}`,
                'level', 6000
            );
        }
    }
}

function addBlood(amount) {
    if (amount <= 0) return;
    const before = getBloodTier(state.blood);
    state.blood = Math.min(100, state.blood + amount);
    const after = getBloodTier(state.blood);
    if (after.labelRu !== before.labelRu) {
        queueNotice(`Ведьмовская кровь: ${after.labelRu}`, 'blood', 5500);
    }
}

// ─── MANA ─────────────────────────────────────────────────────
function spendMana(amount) {
    state.mana = Math.max(0, state.mana - amount);
}

function regenMana(hours) {
    if (hours <= 0) return;
    const gain = Math.floor(hours * MANA_REGEN_PER_HOUR);
    if (gain > 0) {
        state.mana = Math.min(state.maxMana, state.mana + gain);
    }
}
// nell-witchcraft/index.js — PART 2/3

// ─── HORAE TIME PARSING ───────────────────────────────────────
const HORAE_TIME_RE = /time:\s*(\d{1,4})[\/\-](\d{1,2})[\/\-](\d{1,2})\s+(\d{1,2}):(\d{2})/i;
const HORAE_DATE_RE = /(?:date|time):\s*(\d{1,4})[\/\-](\d{1,2})[\/\-](\d{1,2})/i;

// Минуты по реальному календарю: границы месяцев и високосные годы
// считаются честно. Date.UTC — чистая функция от цифр даты.
function calendarMinutes(y, mo, d, h = 0, min = 0) {
    return Date.UTC(y, mo - 1, d, h, min) / 60000;
}

function parseHoraeTime(text) {
    if (!text) return null;
    const mFull = text.match(HORAE_TIME_RE);
    if (mFull) {
        return {
            y: +mFull[1], mo: +mFull[2], d: +mFull[3],
            h: +mFull[4], min: +mFull[5],
            totalMinutes: calendarMinutes(+mFull[1], +mFull[2], +mFull[3], +mFull[4], +mFull[5]),
        };
    }
    const mDate = text.match(HORAE_DATE_RE);
    if (mDate) {
        return {
            y: +mDate[1], mo: +mDate[2], d: +mDate[3],
            h: 0, min: 0,
            totalMinutes: calendarMinutes(+mDate[1], +mDate[2], +mDate[3]),
        };
    }
    return null;
}


function findLastHoraeTime(scanDepth = 15) {
    const startIdx = Math.max(0, chat.length - scanDepth);
    for (let i = chat.length - 1; i >= startIdx; i--) {
        const t = parseHoraeTime(chat[i]?.mes);
        if (t) return t;
    }
    return null;
}

// Определяем, активен ли Horae — ищем его теги в последних сообщениях чата
function isHoraeActive(scanDepth = 12) {
    const startIdx = Math.max(0, chat.length - scanDepth);
    for (let i = chat.length - 1; i >= startIdx; i--) {
        const mes = chat[i]?.mes || '';
        if (/<horae>|<horaeevent>/i.test(mes)) return true;
    }
    return false;
}

// ─── МЕХАНИЧЕСКИЙ ТЕГ ОТ ИИ: [nw: tp=2.5 | cond=nervous] ─────
const NW_TAG_RE = /<!--\s*NW\s+([^>]+?)\s*-->/i;
const RP_DATE_RE = /\[RP_DATE:\s*(\d{1,2})\.(\d{1,2})\.(\d{1,4})\]/i;
const VALID_CONDITIONS = ['calm', 'tense', 'nervous', 'exhausted', 'hurt'];

const VALID_EVENT_TIERS = ['normal', 'important', 'critical'];

function parseNwTag(text) {
    if (!text) return null;
    const m = text.match(NW_TAG_RE);
    if (!m) return null;
    console.log('[NW] Сырой тег:', m[0]);
    const inner = m[1];
    const result = { tp: null, cond: null, body: null, event: null, mana: null };

    const tpMatch = inner.match(/tp\s*[=:]\s*([\d.,]+)/i);
    if (tpMatch) {
        const num = parseFloat(tpMatch[1].replace(',', '.'));
        if (!isNaN(num)) result.tp = Math.max(0, Math.min(num, 720));
    }
    const condMatch = inner.match(/cond\s*[=:]\s*([a-z_]+)/i);
    if (condMatch && VALID_CONDITIONS.includes(condMatch[1].toLowerCase())) {
        result.cond = condMatch[1].toLowerCase();
    }
    const bodyMatch = inner.match(/body\s*[=:]\s*([a-z_]+)/i);
    if (bodyMatch && VALID_BODY_STATES.includes(bodyMatch[1].toLowerCase())) {
        result.body = bodyMatch[1].toLowerCase();
    }
    const eventMatch = inner.match(/event\s*[=:]\s*([a-z]+)/i);
    if (eventMatch && VALID_EVENT_TIERS.includes(eventMatch[1].toLowerCase())) {
        result.event = eventMatch[1].toLowerCase();
    }
    const manaMatch = inner.match(/mana\s*[=:]\s*(\d{1,3})/i);
    if (manaMatch) {
        const num = parseInt(manaMatch[1], 10);
        if (!isNaN(num)) result.mana = Math.max(0, Math.min(num, 300));
    }
    return result;
}



function parseRpDate(text) {
    if (!text) return null;
    const m = text.match(RP_DATE_RE);
    if (!m) return null;
    // формат [RP_DATE: ДД.ММ.ГГГГ] — день.месяц.год
    return {
        totalMinutes: calendarMinutes(+m[3], +m[2], +m[1]),
    };
}


function processManaRegen(aiMessageText, msg, messageId) {
    const tag = parseNwTag(aiMessageText);
    console.log('[NW] Тег от ИИ:', tag ? JSON.stringify(tag) : 'НЕ НАЙДЕН');

    if (tag?.cond) state.condition = tag.cond;
    if (tag?.body) {
        if (state.bodyState !== tag.body) {
            const label = BODY_LABELS[tag.body]?.ru || tag.body;
            showNotify(`Состояние тела: ${label}`, 'info', 5000);
        }
        state.bodyState = tag.body;
    }

    // Корректировка стоимости каста тегом mana= — ТОЛЬКО для успешных кастов.
    // При провале базой считается уже сгоревшая половина, и «шаблонное»
    // значение от ИИ (полная стоимость) досписывало бы вторую половину.
    if (tag?.mana != null && pendingCastResult && pendingCastResult.success) {
        const templateCost = pendingCastResult.spellCost ?? pendingCastResult.manaSpent;

        // Коридор допустимой коррекции: не ниже половины и не выше
        // двойной базовой цены.
        const minCost = Math.max(1, Math.floor(templateCost * 0.5));
        const maxCost = Math.ceil(templateCost * 2);

        const rawCost = tag.mana;
        const sane = rawCost >= minCost && rawCost <= maxCost;

        if (sane) {
            const realCost = rawCost;
            const diff = realCost - templateCost;
            if (diff !== 0) {
                if (diff > 0) {
                    // Каст обошёлся дороже — досписываем разницу.
                    spendMana(diff);
                } else {
                    // Каст обошёлся дешевле — возвращаем разницу, но не выше потолка.
                    state.mana = Math.min(state.maxMana, state.mana - diff);
                }
                pendingCastResult.manaSpent = realCost;
                pendingCastResult.manaAdjusted = true;
                console.log(`[NW] Корректировка маны: шаблон=${templateCost}, реально=${realCost}, дельта=${diff}`);
            }
        } else {
            console.log(`[NW] Значение mana=${rawCost} от ИИ проигнорировано (вне коридора ${minCost}–${maxCost})`);
        }
    }

    const manaBefore = state.mana;

    let hoursFromTag = (tag?.tp != null) ? tag.tp : 0;

    let hoursFromDate = 0;
    // Реальное игровое время: сначала пробуем Horae (с часами), затем RP_DATE (полночь).
    const dateNow = parseHoraeTime(aiMessageText) || parseRpDate(aiMessageText);
    if (dateNow && state.lastGameTime != null) {
        const diffMinutes = dateNow.totalMinutes - state.lastGameTime;
        if (diffMinutes > 0) {
            hoursFromDate = diffMinutes / 60;
        }
        // diffMinutes <= 0 — время не сдвинулось или «откатилось» назад.
        // Тогда реген берём из tp, а точку отсчёта НЕ трогаем (см. ниже).
    }

    const hours = Math.max(hoursFromTag, hoursFromDate);
    console.log(`[NW] Часы: тег=${hoursFromTag}, дата=${hoursFromDate.toFixed(1)}, применено=${hours.toFixed(1)}`);

    // ФИКС: регенерация теперь идёт ВСЕГДА, включая ход с успешным кастом.
    // Старый пропуск («чтобы реген не компенсировал расход») выкидывал ВСЕ
    // прошедшие часы: каст + ночной таймскип в одном ходу = потеря 16 маны
    // регена. Расход за каст игрок и так видит в уведомлении об исходе.
    if (hours > 0) {
        regenMana(hours);
        tickEffects(hours * 60);
    }

    // Двигаем игровое время только ВПЕРЁД, назад не откатываем — иначе смесь
    // форматов Horae (с часами) и RP_DATE (полночь) постоянно сбрасывала бы
    // точку отсчёта и глушила регенерацию на много ходов вперёд.
    if (dateNow && (state.lastGameTime == null || dateNow.totalMinutes > state.lastGameTime)) {
        state.lastGameTime = dateNow.totalMinutes;
    }

    console.log(`[NW] Мана: ${manaBefore} → ${state.mana} (cond=${state.condition}, body=${state.bodyState}, эффектов=${state.activeEffects.length})`);
}


// ─── СИСТЕМА ЭФФЕКТОВ ────────────────────────────────────────
function applyEffect(effect, silent = false) {
    if (!Array.isArray(state.activeEffects)) state.activeEffects = [];
    // fresh: эффект наложен в текущем ходу — первый тик времени его не старит,
    // иначе tp от ответа ИИ съедал бы короткие бафы в момент появления.
    const withFlag = { ...effect, fresh: true };
    const existing = state.activeEffects.findIndex(e => e.sourceId === effect.sourceId);
    if (existing !== -1) {
        state.activeEffects[existing] = { ...state.activeEffects[existing], ...withFlag };
    } else {
        state.activeEffects.push(withFlag);
    }
    if (!silent) {
        const kind = effect.type === 'buff' ? 'Баф' : 'Дебаф';
        queueNotice(`${kind}: ${effect.nameRu}`, effect.type === 'buff' ? 'success' : 'warning', 4000);
    }
}

function applySpellSuccessEffect(spell, silent = false) {
    // Сначала проверяем стандартные эффекты из SPELL_EFFECTS
    const eff = SPELL_EFFECTS[spell.id];
    if (eff) {
        applyEffect({
            id: `spell_${spell.id}`,
            sourceId: `spell_${spell.id}`,
            sourceType: 'spell',
            nameRu: eff.nameRu,
            nameEn: eff.nameEn,
            type: 'buff',
            modifier: eff.modifier,
            remainingMinutes: eff.durationMinutes,
        }, silent);
        return;
    }

    // Затем проверяем кастомные заклинания с effectData
    if (spell.effectData) {
        const ed = spell.effectData;
        applyEffect({
            id: `spell_${spell.id}`,
            sourceId: `spell_${spell.id}`,
            sourceType: 'spell',
            nameRu: ed.nameRu,
            nameEn: ed.nameEn,
            type: ed.type,
            modifier: ed.modifier,
            remainingMinutes: ed.durationMinutes,
        }, silent);
    }
}

function applyBacklash(spell, silent = true) {
    const tier = getBacklashTier(spell.cost);
    applyEffect({
        id: tier.id,
        sourceId: tier.id,
        sourceType: 'backlash',
        nameRu: tier.nameRu,
        nameEn: tier.nameEn,
        type: 'debuff',
        modifier: tier.modifier,
        remainingMinutes: tier.durationHours * 60,
    }, silent);
    if (tier.forceCondition) state.condition = tier.forceCondition;
    return tier;
}

function tickEffects(minutes) {
    if (!Array.isArray(state.activeEffects) || !minutes) return;
    const expired = [];
    state.activeEffects = state.activeEffects.map(e => {
        // Свежий эффект (наложен в этом ходу) не тратит длительность
        // в этот же ход — только снимаем пометку. Стареть начнёт со следующего.
        if (e.fresh) {
            const { fresh, ...rest } = e;
            return rest;
        }
        return { ...e, remainingMinutes: e.remainingMinutes - minutes };
    }).filter(e => {
        if (e.remainingMinutes <= 0) { expired.push(e); return false; }
        return true;
    });
    for (const e of expired) {
        showNotify(`Эффект «${e.nameRu}» истёк`, 'effect', 3500);
        pendingEffectExpirations.push(
            `The effect "${e.nameEn}" has JUST ended on ${name1 || 'her'}. If the scene is on-screen, briefly show the moment it fades (a silent step becoming audible, an illusion collapsing, a blood mark severing, a disguise slipping, etc.). Do NOT continue narrating as if the effect were still active.`
        );
    }
    if (expired.length) renderEffects();
}



function formatRemaining(min) {
    if (min >= 60) {
        const h = Math.floor(min / 60);
        const m = Math.round(min % 60);
        return m > 0 ? `${h}ч ${m}м` : `${h}ч`;
    }
    return `${Math.max(1, Math.round(min))}м`;
}

function sumEffectModifiers() {
    if (!Array.isArray(state.activeEffects)) return 0;
    return state.activeEffects.reduce((s, e) => s + (e.modifier || 0), 0);
}


// ─── SPELL CAST DETECTION ─────────────────────────────────────
// Patterns the player might use (Russian + transliteration)
const CAST_PATTERNS = [
    /(?:каст(?:ую|ую|ует)|применяю|использую|читаю|произношу|активирую)\s+[«"']?([^«"'\n]{3,40})[»"']?/gi,
    /\*(?:кастует|применяет|использует|читает)\s+([^*\n]{3,40})\*/gi,
    /\[(?:каст|spell|cast):\s*([^\]\n]{3,40})\]/gi,
];

// Find all spell-like mentions in a message
function extractCastAttempts(text) {
    const found = [];
    for (const pattern of CAST_PATTERNS) {
        pattern.lastIndex = 0;
        let match;
        while ((match = pattern.exec(text)) !== null) {
            found.push(match[1].trim().toLowerCase());
        }
    }
    return found;
}

// Match a raw string to a known spell by name similarity
function matchSpell(rawName) {
    const norm = (s) => s.toLowerCase()
        .replace(/[ёе]/g, 'е')
        .replace(/[^а-яa-z0-9\s]/g, '')
        .trim();

    const target = norm(rawName);
    if (target.length < 3) return null; // слишком короткое — не считаем

    const all = getAllSpells();

    // 1) Точное совпадение (высший приоритет)
    let found = all.find(s => norm(s.name) === target);
    if (found) return found;

    // 2) Название заклинания НАЧИНАЕТСЯ с того, что ввёл игрок
    //    (например «кровав» → «Кровавая метка»)
    found = all.find(s => norm(s.name).startsWith(target));
    if (found) return found;

    // 3) То, что ввёл игрок, НАЧИНАЕТСЯ с названия заклинания
    //    (например «тихий шаг на врага» → «Тихий шаг»)
    found = all.find(s => target.startsWith(norm(s.name)));
    if (found) return found;

    // 4) Partial match — но только если совпадающая часть достаточно длинная
    //    (минимум 5 символов или полное название заклинания)
    const candidates = all.filter(s => {
        const spellNorm = norm(s.name);
        if (spellNorm.includes(target) && target.length >= 5) return true;
        if (target.includes(spellNorm) && spellNorm.length >= 5) return true;
        return false;
    });

    if (candidates.length === 1) return candidates[0];

    // Если несколько кандидатов — выбираем того, чьё название ближе по длине
    if (candidates.length > 1) {
        candidates.sort((a, b) =>
            Math.abs(norm(a.name).length - target.length) -
            Math.abs(norm(b.name).length - target.length)
        );
        return candidates[0];
    }

    return null;
}


// ─── CAST VALIDATION & PROCESSING ────────────────────────────

function validateAndCast(spell) {
    // Not learned (level gate)
    if (!isSpellKnown(spell.id)) {
        return {
            ok: false,
            reason: 'not_learned',
            promptInstruction: `The player attempted to cast "${spell.nameEn || spell.name}" but ${name1 || 'she'} does not know this spell yet (requires level ${spell.level}, current level ${state.level}). Show the attempt failing from the outside: the words dying on her lips, her hand faltering, magic refusing to answer. No speech from her, no inner thoughts, no game mechanics mentioned.`,
        };
    }
    // Not enough mana
    if (state.mana < spell.cost) {
        return {
            ok: false,
            reason: 'no_mana',
            promptInstruction: `The player cast "${spell.nameEn || spell.name}" but ${name1 || 'she'} is out of mana (has ${state.mana}, needs ${spell.cost}). Show magical exhaustion from the outside: she sways, pales, the spell collapses before forming. No dialogue from her, no inner monologue, no numbers.`,
        };
    }
    // Valid — apply costs
    return { ok: true };
}

function processCastSuccess(spell) {
    spendMana(spell.cost);
    const lvl = state.level;
    const isFirstTime = !state.castHistory.includes(spell.id);
    if (isFirstTime) {
        state.castHistory.push(spell.id);
        addXp(XP_REWARDS.castFirstTime(lvl));
    }
    addXp(XP_REWARDS.castSuccess(spell.cost, lvl));

    if (spell.school === 'blood') {
        addBlood(spell.ritual ? BLOOD_GAIN.ritualBlood : BLOOD_GAIN.castBlood);
        if (spell.id === 'devour_soul') addBlood(BLOOD_GAIN.devourSoul);
    } else if (spell.school === 'mind') {
        addBlood(BLOOD_GAIN.castMind);
    }

    applySpellSuccessEffect(spell, /* silent */ true);
}



// ─── MANUAL CAST (отложенное разрешение) ─────────────────────
let selectedSpellId = null;
let queuedManualCast = null; // { spellId } — ждёт отправки сообщения
let castLocked = false;      // true пока не пришёл ответ ИИ
let pendingCastResult = null; // { name, success, manaSpent, backlash?, effect? }

function calcCastChance(spell) {
    const condMod = CONDITION_MODS[state.condition] ?? 0;
    const bodyMod = BODY_MODS[state.bodyState] ?? 0;
    const effMod  = sumEffectModifiers();
    const diff = Math.max(0, spell.level - state.level);

    let base = spell.level <= state.level ? 95 : 95 - diff * 20;
    base += Math.floor(state.blood / 10);
    base += condMod + bodyMod + effMod;

    const floor = spell.level <= state.level ? 15 : 5;
    const ceil  = spell.level <= state.level ? 99 : 90;
    return Math.max(floor, Math.min(ceil, base));
}

function castSelectedSpell() {
    if (!isEnabled()) {
        showNotify('Гримуар отключён', 'warning');
        return;
    }
    if (castLocked || queuedManualCast) {
        showNotify('Ты уже читаешь заклинание — дождись ответа или отмени', 'warning');
        return;
    }
    const spell = getSpellById(selectedSpellId);
    if (!spell || !state) return;
    if (state.mana < spell.cost) {
        showNotify('Недостаточно маны', 'warning');
        return;
    }
    queuedManualCast = { spellId: spell.id };
    castLocked = true;
    showNotify(`${name1 || 'Ведьма'} читает заклинание «${spell.name}»…`, 'spell', 4500);
    renderEffects();
    renderDetail();
    setPanel(false);
}

function cancelQueuedCast() {
    queuedManualCast = null;
    castLocked = false;
    pendingCastResult = null;
    pendingCastInstruction = null;
    showNotify('Заклинание отменено', 'info', 2500);
    renderEffects();
    renderDetail();
}

// разрешение каста происходит здесь — молча, до отправки в ИИ
function resolveQueuedCast() {
    if (!queuedManualCast) return null;
    const spell = getSpellById(queuedManualCast.spellId);
    queuedManualCast = null;
    if (!spell || state.mana < spell.cost) return null;
    return resolveCast(spell);
}

function resolveCast(spell) {
    const chance = calcCastChance(spell);
    const success = Math.random() * 100 < chance;

    if (success) {
        processCastSuccess(spell); // тратит ману, XP, кровь, эффекты — молча
        pendingCastResult = {
            name: spell.name,
            success: true,
            manaSpent: spell.cost,
            spellCost: spell.cost,          // шаблонная стоимость (для корректировки)
            spellId: spell.id,              // чтобы знать, чью ману корректировать
            effectName: SPELL_EFFECTS[spell.id]?.nameRu || spell.effectData?.nameRu || null,
        };
        return `${name1 || 'She'} casts "${spell.nameEn}" (${spell.school} school). The cast SUCCEEDS COMPLETELY — mechanics have already resolved this as a full, clean success. Do NOT describe the spell faltering, failing, weakening, backfiring, or partially working. Do NOT describe pallor, tremor, cold sweat, blood, or magical strain — those belong to failures only. Show the external, visible effect landing exactly as intended and how the world and targets react to it. A brief focused breath as she channels is fine; weakness is not. No dialogue or thoughts in her voice. USE: ${spell.useEn}`;
    } else {
        const before = state.mana;
        spendMana(Math.ceil(spell.cost / 2));
        const spent = before - state.mana;
        addXp(XP_REWARDS.castFail(state.level));
        const tier = applyBacklash(spell); // тихо
        pendingCastResult = {
            name: spell.name,
            success: false,
            manaSpent: spent,
            spellCost: spent,               // при провале базой считаем реально сгоревшее
            spellId: spell.id,
            backlashName: tier.nameRu,
            backlashMod: tier.modifier,
        };
        return `${name1 || 'She'} attempts to cast "${spell.nameEn}" but the cast FAILS — mechanics resolved this. BACKLASH: ${tier.aiHint} Show the backlash on her body from the outside — what a witness sees and hears. No speech from her, no inner monologue, no decisions on her behalf.`;
    }
}


// объявляем — используется в buildSystemPrompt (оставлено для совместимости)
let pendingCastInstruction = null;


// ─── PROMPT INJECTION ─────────────────────────────────────────
function buildSystemPrompt(failInstructions = []) {
    const bloodTier = getBloodTier(state.blood);
    const activeName = name1 || 'the witch';


    const allSpells = getAllSpells();
    const knownSpells = state.knownSpellIds
        .map(id => allSpells.find(s => s.id === id))
        .filter(Boolean);
    const knownSpellLines = knownSpells
        .map(s => `- ${s.nameEn} [${s.school}, ${s.cost}m]: ${s.useEn}`)
        .join('\n');

    const bodyLabel = BODY_LABELS[state.bodyState]?.en || state.bodyState;

    const effectsBlock = (Array.isArray(state.activeEffects) && state.activeEffects.length)
        ? state.activeEffects.map(e => {
            const kind = e.type === 'buff' ? 'BUFF' : 'DEBUFF';
            return `- [${kind}] ${e.nameEn} — ~${formatRemaining(e.remainingMinutes)} left`;
        }).join('\n')
        : '(none)';

    // tp запрашиваем ВСЕГДА, даже при активном Horae. Он идёт запасным
    // каналом: если игровая дата в этот ход не сдвинулась (статичная сцена),
    // реген возьмётся из tp. При этом двойного счёта нет — ниже берётся
    // Math.max(tp, разница_дат), а не сумма.
    const tpField = 'tp=VALUE; ';
    const tpMeaning =
        '  tp    = a NUMBER: in-world hours elapsed since the previous message (sleep/travel/skips included; a night = 8, a short scene = 0.5). ALWAYS include.\n';
    const tpEx1 = '; tp=0.5';
    const tpEx2 = '; tp=8';
    const tpEx3 = '; tp=0.5';


    let prompt = `[${activeName}'S WITCH STATE — live context. Weave naturally, never quote numbers verbatim.]
Level: ${state.level}/10 | Mana: ${state.mana}/${state.maxMana} | Witch Blood: ${state.blood}/100
Condition: ${state.condition} | Body: ${bodyLabel}

NARRATOR ROLE — ABSOLUTE:
- ${activeName} is the PLAYER'S character. You are the narrator and voice of the world, NOT of ${activeName}.
- NEVER write dialogue spoken by ${activeName}. NEVER write her inner thoughts, feelings, decisions, or intentions in her voice.
- You may describe her body from the outside: posture, breath, tremor, visible expression, involuntary reactions. This is external observation only.
- If a spell instruction below says "describe it working" — describe only what an outside witness would SEE and HEAR: the visual effect, the reaction of the world and other characters, her body's involuntary tells. NO speech from her, NO internal monologue, NO choices made on her behalf.
- Let the player fill in what ${activeName} says, thinks, and decides. Leave space for that.

BLOOD INFLUENCE — ${bloodTier.labelRu.toUpperCase()}:
${bloodTier.prompts?.[state.bloodTarget || 'men'] || bloodTier.prompts?.men || ''}


ACTIVE EFFECTS ON HER (must colour her body and the world's reaction, never announced as stats):
${effectsBlock}

KNOWN SPELLS:
${knownSpellLines}

RULES:
- Spells work only within their stated purpose. Any spell NOT listed above is beyond her — attempts fail.
- Failures manifest as physical sensation: magic dissolving, blood running cold, will breaking. Never mention game rules.
- Low mana = visibly strained, pale, exhausted. No numbers.
- Body state (menses, pregnancy, ovulation, etc.) must shape her stamina, mood and magical control naturally, without ever being announced as a stat.
- Active effects are real: if Silent Step is up she moves without sound; if a nosebleed debuff is on, blood keeps running.
- Blood influence on men surfaces through their behaviour and subtext only — never state it directly.
- Any character able to sense magic (mages, witches, spirits, mystical beasts, magically-aware teachers) perceives ${activeName}'s mana ACCURATELY. Her reserve is currently ${state.mana}/${state.maxMana} (${Math.round((state.mana / state.maxMana) * 100)}% full). If such a character senses it, comments on it, or teaches her about her own energy, their words MUST match this reading — never claim she is empty when she has reserves, nor full when she is drained. Ordinary people with no magical sense perceive none of this.


MECHANICAL — REQUIRED at the very END of every reply. On its own line, append ONE line in EXACTLY this format (this is a separate, simple line — do NOT merge it with any other system's tags):
<!-- NW cond=VALUE; ${tpField}mana=VALUE; body=VALUE; event=VALUE -->

Fill in REAL values. Include ONLY the fields that apply. cond is ALWAYS included. Remove any field you are not using (do not leave empty ones, do not write the word VALUE).

Field meanings:
  cond  = ONE word: her current state — calm / tense / nervous / exhausted / hurt. ALWAYS include.
${tpMeaning}  mana  = a NUMBER. Include ONLY if a spell was cast THIS turn AND it cost noticeably more or less than usual (forced through resistance, sustained long, fought a ward, or unusually easy). It is the total mana the spell ended up costing. Otherwise OMIT.
  body  = ONE word (normal / menses / pms / ovulation / pregnant_early / pregnant_late / postpartum). Include ONLY when her body state actually changed this turn. Otherwise OMIT.
  event = important / critical. Include ONLY for MAJOR narrative turning points: a revelation that changes everything, an irreversible choice, a death, a betrayal, a first kiss, a catastrophic failure, a power shift. Do NOT include for routine scenes, normal dialogue, travel, or anything that could happen in any chapter without consequence. Most messages should NOT have this field at all. Overusing it is a mistake — treat it as rare.
    · important = a significant scene beat that will shape the story going forward
    · critical  = a once-in-a-story moment: something irreversible, catastrophic, or transformative

Correct examples (yours will differ — use the truth of THIS turn):
<!-- NW cond=calm${tpEx1} -->
<!-- NW cond=hurt${tpEx2}; body=menses; mana=30 -->
<!-- NW cond=tense${tpEx3}; event=important -->

This line is an HTML comment, invisible to the reader. Never skip it, never leave placeholder words like VALUE in it.`;

    const allInstructions = [...failInstructions];
    if (pendingCastInstruction) allInstructions.push(pendingCastInstruction);
    if (allInstructions.length > 0) {
        prompt += `\n\nSPELL OUTCOMES THIS TURN — mechanics already resolved. Narrate ONLY the external, visible outcome (what a witness would see and hear, plus her body's involuntary reactions). Do NOT write speech from ${activeName}, do NOT write her thoughts, do NOT decide what she says or does next. Leave those to the player:\n`
            + allInstructions.map(i => `- ${i}`).join('\n');
    }

    return prompt;
}





function injectPrompt(failInstructions = []) {
    if (!isEnabled()) {
        setExtensionPrompt(PROMPT_KEY, '', extension_prompt_types.IN_CHAT, 2, true, extension_prompt_roles.SYSTEM);
        return;
    }
    setExtensionPrompt(
        PROMPT_KEY,
        buildSystemPrompt(failInstructions),
        extension_prompt_types.IN_CHAT,
        2,
        true,
        extension_prompt_roles.SYSTEM
    );
}


// ─── EVENT XP (работает С Horae и БЕЗ него) ──────────────────
const HORAE_BLOCK_RE = /<horaeevent>([\s\S]*?)<\/horaeevent>/i;
const HORAE_EVENT_RE = /event:\s*(normal|important|critical)\s*\|/gi;

// Достаём важность события из блока Horae (если Horae установлен)
function detectHoraeEventTier(text) {
    if (!text) return null;
    const block = text.match(HORAE_BLOCK_RE);
    if (!block) return null;
    const inner = block[1];

    HORAE_EVENT_RE.lastIndex = 0;
    let match;
    let bestTier = null;
    while ((match = HORAE_EVENT_RE.exec(inner)) !== null) {
        const tier = match[1].toLowerCase();
        if (tier === 'critical') return 'critical';
        if (tier === 'important' && bestTier !== 'critical') bestTier = 'important';
        // 'normal' намеренно игнорируется — слишком частый тег
    }
    return bestTier;
}

// Начисляем опыт ТОЛЬКО за important и critical события.
// normal — слишком часто проставляется ИИ автоматически, XP за него не даём.
function checkHoraeEvents(text, tag = null) {
    if (!text) return;

    // 1) Пробуем Horae
    let tier = detectHoraeEventTier(text);

    // 2) Если Horae не дал события — берём наш тег <!-- NW ... event=... -->
    //    Но и здесь normal игнорируем
    if (!tier && tag?.event && tag.event !== 'normal') {
        tier = tag.event;
    }

    if (!tier) return;

    const lvl = state.level;
    if (tier === 'critical') {
        addXp(XP_REWARDS.eventCritical(lvl));
        queueNotice('Критическое событие! Опыт начислен', 'xp', 3500);
    } else if (tier === 'important') {
        addXp(XP_REWARDS.eventImportant(lvl));
        queueNotice('Важное событие! Опыт начислен', 'xp', 3000);
    }
    // tier === 'normal' → XP не начисляется
}


// ─── ROMANCE DETECTION ────────────────────────────────────────


// ─── ROMANCE DETECTION ────────────────────────────────────────
// Loose heuristic — quiet, no interruptions to flow
const ROMANCE_RE = /(?:целует|обнимает|прижимает|ласкает|касается|поцелуй|объятия|постель|близость|страсть|kiss|embrace|caress|touch|bed\b|passion)/i;

function checkRomanceBlood(text) {
    if (ROMANCE_RE.test(text)) {
        addBlood(BLOOD_GAIN.romanticScene);
    }
}

let pendingFailInstructions = [];
let pendingEffectExpirations = [];


// Показывает уведомление об итоге каста (успех/провал) и очищает результат.
// Вынесено отдельно, чтобы вызывать из нескольких мест без дублирования.
function announcePendingCastResult() {
    if (!pendingCastResult) return;
    const r = pendingCastResult;
    if (r.success) {
        const extra = r.effectName ? ` · эффект: ${r.effectName}` : '';
        const adj = r.manaAdjusted ? ' (расход изменён сюжетом)' : '';
        showNotify(
            `«${r.name}» — удалось! Потрачено ${r.manaSpent} маны${adj}${extra}`,
            'success', 5500
        );
    } else {
        const adj = r.manaAdjusted ? ' (расход изменён сюжетом)' : '';
        showNotify(
            `«${r.name}» — сорвалось! Сгорело ${r.manaSpent} маны${adj} · ${r.backlashName}${r.backlashMod ? ` (${r.backlashMod}% к кастам)` : ''}`,
            'error', 6500
        );
    }
    pendingCastResult = null;
    pendingCastInstruction = null;
}


// GENERATION_STARTED — inject prompt before AI responds
// (нужен для свайпов/регенераций, когда MESSAGE_SENT не срабатывает)
function onGenerationStarted(type, params, dryRun) {
    if (!isEnabled()) return;
    // «Сухие» прогоны (подсчёт токенов и т.п.) не должны трогать состояние
    if (dryRun) return;
    const merged = [...pendingFailInstructions, ...pendingEffectExpirations];
    injectPrompt(merged);
    // ВАЖНО: pendingEffectExpirations здесь больше НЕ очищаем —
    // иначе onMessageSent, срабатывающий позже, перезапишет промпт
    // уже без них. Очистка перенесена в onMessageReceived.
}


// GENERATION_STOPPED — генерацию оборвали (кнопка «стоп», ошибка, таймаут).
function onGenerationStopped() {
    if (!isEnabled()) return;

    // Каст, который ещё не был разрешён (стоял в очереди) — просто отменяем.
    queuedManualCast = null;

    // Каст уже разрешён (мана списана), но ответ ИИ не пришёл —
    // показываем итог, чтобы игрок видел, что произошло.
    announcePendingCastResult();
    flushSilentNotices();

    silentMode = false;
    castLocked = false;
    pendingCastInstruction = null;
    // pendingFailInstructions НЕ очищаем: если игрок перезапустит генерацию,
    // инструкция об исходе каста должна снова попасть в промпт.

    renderEffects();
    renderDetail();
    saveState();
}


// MESSAGE_SENT — player message, detect cast attempts
async function onMessageSent(messageId) {
    if (!isEnabled()) return;
    if (!state) loadState();
    const msg = chat[messageId];
    if (!msg || !msg.is_user) return;

    // ── Подчистка «залипшего» состояния прошлого хода ──
    if (pendingCastResult) announcePendingCastResult();
    flushSilentNotices();
    if (!queuedManualCast) castLocked = false; // не трогаем каст, поставленный кнопкой в этот ход

    pendingFailInstructions = [];

    // Тихий режим: начисления считаются молча,
    // уведомления покажутся ПОСЛЕ ответа бота.
    silentMode = true;

    // 1) Приоритет: каст из панели (queuedManualCast)
    if (queuedManualCast) {
        const instr = resolveQueuedCast();
        if (instr) pendingFailInstructions.push(instr);
    } else {
        // 2) Текстовый каст — только ОДИН за сообщение
        const attempts = extractCastAttempts(msg.mes);
        for (const raw of attempts) {
            const spell = matchSpell(raw);
            if (!spell) continue;

            if (castLocked) {
                showNotify('Только одно заклинание за ход — дождись ответа', 'warning');
                break;
            }

            const check = validateAndCast(spell);
            if (check.ok) {
                castLocked = true;
                const instr = resolveCast(spell);
                pendingFailInstructions.push(instr);
            } else {
                addXp(XP_REWARDS.castFail(state.level));
                pendingFailInstructions.push(check.promptInstruction);
            }
            break; // только первое совпадение
        }
    }

    silentMode = false;

    // ── ГЛАВНЫЙ ФИКС ──
    // MESSAGE_SENT срабатывает ПОСЛЕ GENERATION_STARTED, поэтому промпт,
    // внедрённый там, ещё не содержит исход каста этого хода. Обновляем
    // промпт повторно — теперь инструкция «успех/провал» гарантированно
    // попадёт в ТЕКУЩИЙ ответ ИИ, а не в следующий.
    injectPrompt([...pendingFailInstructions, ...pendingEffectExpirations]);

    saveState({ silentUI: true }); // сохранить, но НЕ перерисовывать колбу
}


// MESSAGE_RECEIVED — AI response came in, update time + regen + events
async function onMessageReceived(messageId) {
    if (!isEnabled()) return;
    if (!state) loadState();
    const msg = chat[messageId];
    if (!msg || msg.is_user) return;

    // Уведомления об истёкших эффектах прошлого хода уже доставлены
    // в промпт этой генерации — очищаем ДО tickEffects, который может
    // добавить новые (для следующего хода).
    pendingEffectExpirations = [];

    // Защита от свайпов и регенераций: время, XP и кровь за этот ход
    // начисляются только один раз — при первом ответе ИИ.
    const msgIdNum = Number(messageId);
    if (state.lastProcessedMsgId !== msgIdNum) {
        processManaRegen(msg.mes, msg, messageId);
        checkHoraeEvents(msg.mes, parseNwTag(msg.mes));
        checkRomanceBlood(msg.mes);
        state.lastProcessedMsgId = msgIdNum;
    } else {
        console.log('[NW] Свайп/регенерация — начисления за этот ход уже сделаны, пропускаем');
    }

    // pendingFailInstructions здесь НЕ очищаем: при свайпе/регенерации
    // GENERATION_STARTED сработает снова, и инструкция об исходе каста
    // должна попасть в промпт повторно. Очистка происходит в onMessageSent.

    // Сначала — исход каста (главное уведомление идёт первым)
    announcePendingCastResult();

    // Теперь — накопленные «тихие» уведомления (опыт, уровень, кровь, эффекты)
    flushSilentNotices();

    castLocked = false;
    queuedManualCast = null;
    saveState(); // здесь колбу МОЖНО перерисовать — ответ бота уже пришёл
}


// CHAT_CHANGED — reload state for the new chat
function onChatChanged() {
    queuedManualCast = null;
    castLocked = false;
    pendingCastResult = null;
    pendingCastInstruction = null;
    // ФИКС: очищаем инструкции прошлого чата, иначе исход каста
    // из чужого чата утёк бы в промпт нового.
    pendingFailInstructions = [];
    pendingEffectExpirations = [];
    silentMode = false;
    pendingSilentNotices = [];
    loadState();
    injectPrompt();
    renderPanel();
}

// Humanise spell id into English name for prompts: 'blood_mark' -> 'Blood Mark'
function spellNameEn(spell) {
    return spell.id
        .split('_')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
}

// Patch SPELL_LIST once so buildSystemPrompt's `s.nameEn` resolves
SPELL_LIST.forEach(s => { if (!s.nameEn) s.nameEn = spellNameEn(s); });
// Custom spells will get nameEn on creation


// ─── SCHOOL META (labels + colours for UI) ────────────────────
const SCHOOLS = {
    illusion:  { ru: 'Иллюзия' },
    flesh:     { ru: 'Плоть' },
    blood:     { ru: 'Кровь' },
    mind:      { ru: 'Разум' },
    herbalism: { ru: 'Знахарство' },
};


// (colour typo guard below in CSS; JS uses safe values)
const SCHOOL_COLORS = {
    illusion:  '#8a7fb3',
    flesh:     '#c98a7a',
    blood:     '#c0392b',
    mind:      '#6ab0a3',
    herbalism: '#7aa86a',
};


const CONDITION_LABELS_RU = {
    calm:      'спокойна',
    tense:     'напряжена',
    nervous:   'взволнована',
    hurt:      'ранена',
    exhausted: 'истощена',
};

// ─── ИКОНКИ ЗАКЛИНАНИЙ ────────────────────────────────────────
const SPELL_ICON_BASE = new URL('./icons/spells/', import.meta.url).href;
const CUSTOM_ICON_BASE = new URL('./icons/custom/', import.meta.url).href;
const CUSTOM_ICON_PACK = Array.from({length: 50}, (_, i) => `${i + 1}.png`);

function spellIconUrl(spell) {
    // Кастомное заклинание с загруженной иконкой (data-URL)
    if (spell.id.startsWith('custom_') && spell.iconData) {
        return spell.iconData;
    }
    // Кастомное заклинание с выбранной иконкой из пака
    if (spell.id.startsWith('custom_') && spell.iconPack) {
        return `${CUSTOM_ICON_BASE}${spell.iconPack}`;
    }
    // Обычное заклинание
    return `${SPELL_ICON_BASE}${spell.id}.png`;
}



let activeTab = 'all'; // all | illusion | flesh | blood | mind
let activeLevel = 'all'; // all | 1..10 — выбранный уровень в левой рейке
let panelOpen = false;
const POS_LS_KEY = 'nellWitchcraft_bookPos';

function saveBookPos(el) {
    if (window.innerWidth < 760) return;
    const rect = el.getBoundingClientRect();
    localStorage.setItem(POS_LS_KEY, JSON.stringify({ left: rect.left, top: rect.top }));
}

function restoreBookPos(el) {
    if (window.innerWidth <= 760) {
        el.style.left = ''; el.style.top = '';
        el.style.right = ''; el.style.bottom = '';
        el.style.transform = '';
        el.classList.remove('nw-book-moved');
        return;
    }
    const saved = localStorage.getItem(POS_LS_KEY);
    if (!saved) return;
    try {
        const { left, top } = JSON.parse(saved);
        const nx = Math.max(0, Math.min(window.innerWidth  - 200, left));
        const ny = Math.max(0, Math.min(window.innerHeight - 200, top));
        el.style.left = nx + 'px';
        el.style.top  = ny + 'px';
        el.style.right = 'auto';
        el.style.bottom = 'auto';
        el.style.transform = 'none';
        el.classList.add('nw-book-moved');
    } catch {}
}

// ─── ICON (грузится из файла icon.svg в папке расширения) ─────
const ICON_URL = new URL('./icons/grimoire.png', import.meta.url).href;
const GRIMOIRE_SVG = `<img src="${ICON_URL}" class="nw-book-svg" alt="Гримуар" draggable="false">`;



// ─── PANEL DOM BUILD ──────────────────────────────────────────
function buildPanelSkeleton() {
    if (document.getElementById('nw-root')) return;

    // Книга — в body
    const root = document.createElement('div');
    root.id = 'nw-root';
        root.innerHTML = `
        <div id="nw-book" class="nw-hidden" role="dialog" aria-label="Гримуар">
            <button id="nw-power-btn" class="nw-power-btn" title="Расширение активно (нажми чтобы отключить)"><span id="nw-power-dot" class="nw-power-dot"></span></button>
            <button id="nw-close" aria-label="Закрыть">✕</button>
            <div id="nw-drag-handle" title="Перетащить книгу">⁙</div>


<div class="nw-page nw-page-left">
    <div class="nw-page-title" id="nw-title">Книга заклинаний</div>
    <div class="nw-page-sub">Справочник по выживанию среди мужчин (и прочей нечисти)</div>
    <div class="nw-left-body">
        <div class="nw-level-rail" id="nw-level-rail"></div>
        <div class="nw-left-main">
            <div class="nw-tabs" id="nw-tabs">
                <button class="nw-tab nw-tab-active" data-tab="all">Все</button>
                <button class="nw-tab" data-tab="illusion">Иллюзия</button>
                <button class="nw-tab" data-tab="flesh">Плоть</button>
                <button class="nw-tab" data-tab="blood">Кровь</button>
                <button class="nw-tab" data-tab="mind">Разум</button>
                <button class="nw-tab" data-tab="herbalism">Знахарство</button>
                <button class="nw-tab" data-tab="levels">Уровни</button>
                <button class="nw-tab" data-tab="path" id="nw-tab-path" style="display:none">🌙 Путь</button>
                <button class="nw-tab" data-tab="custom" id="nw-tab-custom" style="display:none">✨ Создать</button>
            </div>
            <div class="nw-detail nw-hidden" id="nw-detail"></div>
            <div class="nw-spells" id="nw-spells"></div>
        </div>
    </div>
</div>


            <div class="nw-spine"></div>
            
<div class="nw-deco-crystal">
    <div class="nw-deco-chain"></div>
    <div class="nw-deco-gem"></div>
</div>

            <div class="nw-page nw-page-right">
                <div class="nw-page-title">Магическая сила</div>
                <div class="nw-page-sub">Следи за наполненностью своего сосуда</div>
                <div class="nw-right-body">
                    <div class="nw-right-top">

<div class="nw-vessel-wrap" title="Мана">
    <div class="nw-flask">
        <div class="nw-flask-cork"></div>
        <div class="nw-flask-neck"></div>
        <div class="nw-flask-body">
            <div class="nw-liquid" id="nw-mana-liquid">
                <div class="nw-wave"></div>
                <div class="nw-wave nw-wave2"></div>
                <div class="nw-bubble nw-b1"></div>
                <div class="nw-bubble nw-b2"></div>
                <div class="nw-bubble nw-b3"></div>
            </div>
            <div class="nw-flask-glass"></div>
            <div class="nw-flask-text">
                <span class="nw-flask-cap">МАНА</span>
                <span class="nw-flask-num" id="nw-mana-label">80/80</span>
            </div>
        </div>
    </div>
</div>


                        <div class="nw-right-col">
                            <div class="nw-panel">
                                <div class="nw-panel-title">Восстановление маны</div>
                                <div class="nw-panel-text">Каждые <b>30 минут</b> игрового времени — <b>+1 мана</b><br>(за час — <b>+2 ед.</b>)</div>
                            </div>
                            <div class="nw-panel">
                                <div class="nw-panel-title">Ведьмовская кровь</div>
                                <div id="nw-blood-panel"></div>
                            </div>
                        </div>
                    </div>
                    <div class="nw-bars">
                        <div class="nw-bar-block">
                            <div class="nw-bar-top">
                                <span>Уровень <b id="nw-level">1</b></span>
                                <span id="nw-xp-text" class="nw-xp-text">0 / 100</span>
                            </div>
                            <div class="nw-progress nw-xp">
                                <div class="nw-progress-fill" id="nw-xp-fill"></div>
                            </div>
                        </div>
                        <div class="nw-bar-block">
                            <div class="nw-bar-top">
                                <span>Ведьмовская кровь</span>
                                <span id="nw-blood-tier">Дремлющая</span>
                            </div>
                            <div class="nw-progress nw-blood">
                                <div class="nw-progress-fill nw-blood-fill" id="nw-blood-fill"></div>
                            </div>
                        </div>
                    </div>
                    <div class="nw-panel nw-quick">
                        <div class="nw-panel-title">Быстрый доступ</div>
                        <div class="nw-quick-slots" id="nw-quick-slots"></div>
                    </div>
                    <div class="nw-panel nw-status-panel">
                        <div class="nw-panel-title">Тело, состояние и эффекты</div>
                        <div class="nw-status-grid" id="nw-effects"></div>
                    </div>
                </div>
            </div>
            <div id="nw-mobile-dots">
                <span class="nw-dot nw-dot-active" data-page="right"></span>
                <span class="nw-dot" data-page="left"></span>
            </div>
        </div>
    `;


    root.dataset.nwTheme = getTheme();
    document.body.appendChild(root);

    // Кнопка — СПРАВА от кнопки отправки
const toggleBtn = document.createElement('button');
toggleBtn.id = 'nw-toggle';
toggleBtn.title = 'Гримуар';
toggleBtn.innerHTML = `
    <div class="nw-mini-flask">
        <div class="nw-mini-neck"></div>
        <div class="nw-mini-body">
            <div class="nw-mini-liquid" id="nw-mini-liquid"></div>
            <span class="nw-mini-num" id="nw-mini-num">—</span>
        </div>
    </div>`;


const sendBut = document.getElementById('send_but');
if (sendBut) {
    sendBut.insertAdjacentElement('afterend', toggleBtn);
} else {
    (document.getElementById('rightSendForm') ?? document.body).appendChild(toggleBtn);
}



    // Обработчики — все ПОСЛЕ того как элементы добавлены в DOM
    toggleBtn.addEventListener('click', togglePanel);

    document.getElementById('nw-close').addEventListener('click', () => setPanel(false));
    document.getElementById('nw-power-btn').addEventListener('click', () => {
        setEnabled(!isEnabled());
        showNotify(isEnabled() ? 'Гримуар включен' : 'Гримуар отключен', 'info');
    });
    // Отображаем начальное состояние
    if (!isEnabled()) {
        document.getElementById('nw-power-dot')?.classList.add('nw-power-off');
        document.getElementById('nw-power-btn').title = 'Расширение отключено (нажми чтобы включить)';
    }

    document.querySelectorAll('.nw-tab').forEach(btn => {
        btn.addEventListener('click', () => {
            activeTab = btn.dataset.tab;
            document.querySelectorAll('.nw-tab').forEach(b => b.classList.remove('nw-tab-active'));
            btn.classList.add('nw-tab-active');
            renderSpells();
        });
    });

    // Мобильное переключение страниц (точки + свайп)
    const bookEl = document.getElementById('nw-book');
    bookEl.dataset.mobilePage = 'right';

    function switchMobilePage(page) {
        if (page !== 'left' && page !== 'right') return;
        bookEl.dataset.mobilePage = page;
        document.querySelectorAll('#nw-mobile-dots .nw-dot').forEach(d => {
            d.classList.toggle('nw-dot-active', d.dataset.page === page);
        });
    }

    // Клик по точкам
    document.querySelectorAll('#nw-mobile-dots .nw-dot').forEach(dot => {
        dot.addEventListener('click', () => switchMobilePage(dot.dataset.page));
    });

    // Свайп влево/вправо по книге
    let swipeStartX = 0, swipeStartY = 0, swiping = false;
    bookEl.addEventListener('touchstart', (e) => {
        if (window.innerWidth > 760) return;
        swipeStartX = e.touches[0].clientX;
        swipeStartY = e.touches[0].clientY;
        swiping = true;
    }, { passive: true });
    bookEl.addEventListener('touchend', (e) => {
        if (!swiping || window.innerWidth > 760) return;
        swiping = false;
        const dx = e.changedTouches[0].clientX - swipeStartX;
        const dy = e.changedTouches[0].clientY - swipeStartY;
        // свайп считается только если горизонтальный сдвиг заметно больше вертикального
        if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
            if (dx < 0) switchMobilePage('left');   // свайп влево → заклинания
            else switchMobilePage('right');          // свайп вправо → сила
        }
    }, { passive: true });

    // Перетаскивание — только за ручку в правом нижнем углу
    makeDraggable(bookEl, document.getElementById('nw-drag-handle'));
}





// ─── DRAG (перетаскивание кнопки и книги) ─────────────────────
function makeDraggable(el, handle, isToggle = false) {
    if (!el || !handle) return;
    let startX, startY, origX, origY, dragging = false, moved = false;

    handle.style.touchAction = 'none';

    handle.addEventListener('pointerdown', (e) => {
        if (!isToggle && e.target.closest('#nw-close, .nw-tab, .nw-spell-cell, .nw-quick-slot, .nw-detail, button, input, a')) return;
        dragging = true;
        moved = false;
        const rect = el.getBoundingClientRect();
        el.style.transform = 'none';
        el.style.left = rect.left + 'px';
        el.style.top = rect.top + 'px';
        el.style.right = 'auto';
        el.style.bottom = 'auto';
        origX = rect.left;
        origY = rect.top;
        startX = e.clientX;
        startY = e.clientY;
        handle.setPointerCapture(e.pointerId);
        e.preventDefault();
    });

    handle.addEventListener('pointermove', (e) => {
        if (!dragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        if (Math.abs(dx) > 4 || Math.abs(dy) > 4) moved = true;
        let nx = origX + dx;
        let ny = origY + dy;
        nx = Math.max(0, Math.min(window.innerWidth  - el.offsetWidth,  nx));
        ny = Math.max(0, Math.min(window.innerHeight - el.offsetHeight, ny));
        el.style.left = nx + 'px';
        el.style.top  = ny + 'px';
    });

    handle.addEventListener('pointerup', (e) => {
        if (!dragging) return;
        dragging = false;
        handle.releasePointerCapture(e.pointerId);

        if (moved && el.id === 'nw-book') {
            saveBookPos(el);
            el.classList.add('nw-book-moved');
        }

        if (isToggle && moved) {
            const supp = (ev) => {
                ev.stopPropagation();
                ev.preventDefault();
                handle.removeEventListener('click', supp, true);
            };
            handle.addEventListener('click', supp, true);
        }
    });

}


function togglePanel() { setPanel(!panelOpen); }
function setPanel(open) {
    panelOpen = open;
    const book = document.getElementById('nw-book');
    if (!book) return;
    if (open) {
        restoreBookPos(book);
        book.classList.remove('nw-hidden');
        renderPanel();
    } else {
        book.classList.add('nw-hidden');
    }
}

function renderCustomSpellForm(container) {
    if (!state || state.level < 10) {
        container.innerHTML = '';
        return;
    }

    const existingCustom = state.customSpells || [];
    const allowedCount = Math.max(0, state.level - 9);
    const canCreate = existingCustom.length < allowedCount;

    // Сетка иконок из пака
    const iconGrid = CUSTOM_ICON_PACK.map(file => `
        <div class="nw-icon-pick" data-file="${file}">
            <img src="${CUSTOM_ICON_BASE}${file}" alt="${file}" draggable="false"
                 onerror="this.parentElement.style.display='none'">
        </div>
    `).join('');

    container.innerHTML = `
        <div class="nw-custom-intro">
            <div class="nw-panel-title">Создание заклинания</div>
            <p style="font-size:0.78rem;color:var(--nw-text-dim);text-align:center;margin:4px 0 0;">
                Доступно слотов: <b style="color:var(--nw-accent)">${allowedCount - existingCustom.length}</b> из ${allowedCount}
            </p>
        </div>

        ${existingCustom.length > 0 ? `
            <div class="nw-custom-limit">
                <p style="font-size:0.74rem;color:var(--nw-accent);margin-bottom:8px;">Твои заклинания:</p>
                <div class="nw-custom-list">
                    ${existingCustom.map(s => {
                        const effInfo = s.effectData
                            ? ` · ${s.effectData.type === 'buff' ? 'баф' : 'дебаф'}: ${s.effectData.nameRu} (${s.effectData.modifier > 0 ? '+' : ''}${s.effectData.modifier}%, ${s.effectData.durationMinutes}м)`
                            : '';
                        return `
                        <div class="nw-custom-item" style="--school:${SCHOOL_COLORS[s.school]}">
                            <div class="nw-custom-item-icon">
                                ${s.iconData || s.iconPack
                                    ? `<img src="${spellIconUrl(s)}" alt="">`
                                    : '✨'}
                            </div>
                            <div class="nw-custom-item-info">
                                <b>${s.name}</b> · ${s.cost} маны · ${SCHOOLS[s.school]?.ru || s.school}${effInfo}
                                <div class="nw-custom-item-desc">${s.use}</div>
                            </div>
                            <button class="nw-custom-delete" data-id="${s.id}" title="Удалить">✕</button>
                        </div>`;
                    }).join('')}
                </div>
            </div>
        ` : ''}

        ${canCreate ? `
            <form id="nw-custom-form" class="nw-custom-form">
                <div class="nw-custom-row">
                    <label>Название <span class="nw-req">*</span></label>
                    <input type="text" id="nw-custom-name" maxlength="40" placeholder="Кровавая лоза">
                </div>
                <div class="nw-custom-row">
                    <label>Что заклинание делает <span class="nw-req">*</span></label>
                    <textarea id="nw-custom-use" rows="2" maxlength="200" placeholder="Описание действия заклинания..."></textarea>
                </div>
                <div class="nw-custom-row">
                    <label>Чего заклинание НЕ может <span class="nw-req">*</span></label>
                    <textarea id="nw-custom-limit" rows="2" maxlength="200" placeholder="Ограничения и пределы..."></textarea>
                </div>
                <div class="nw-custom-row" style="flex-direction:row;gap:16px;flex-wrap:wrap;">
                    <div style="display:flex;flex-direction:column;gap:4px;">
                        <label>Школа <span class="nw-req">*</span></label>
                        <select id="nw-custom-school">
                            <option value="illusion">Иллюзия</option>
                            <option value="flesh">Плоть</option>
                            <option value="blood">Кровь</option>
                            <option value="mind">Разум</option>
                            <option value="herbalism">Знахарство</option>
                        </select>
                    </div>
                    <div style="display:flex;flex-direction:column;gap:4px;">
                        <label>Стоимость маны <span class="nw-req">*</span></label>
                        <input type="number" id="nw-custom-cost" min="10" max="150" value="40" style="width:80px;">
                    </div>
                </div>

                <div class="nw-custom-row nw-custom-effect-section">
                    <label style="display:flex;align-items:center;gap:8px;">
                        <input type="checkbox" id="nw-custom-has-effect">
                        Заклинание даёт длящийся эффект (баф или дебаф)
                    </label>
                </div>

                <div id="nw-custom-effect-fields" class="nw-custom-effect-fields nw-hidden">
                    <div class="nw-custom-row">
                        <label>Название эффекта <span class="nw-req">*</span></label>
                        <input type="text" id="nw-custom-eff-name" maxlength="40" placeholder="Невидимая броня">
                    </div>
                    <div class="nw-custom-row" style="flex-direction:row;gap:16px;flex-wrap:wrap;">
                        <div style="display:flex;flex-direction:column;gap:4px;">
                            <label>Тип эффекта</label>
                            <select id="nw-custom-eff-type">
                                <option value="buff">Баф (положительный)</option>
                                <option value="debuff">Дебаф (отрицательный)</option>
                            </select>
                        </div>
                        <div style="display:flex;flex-direction:column;gap:4px;">
                            <label>Модификатор к кастам (%)</label>
                            <input type="number" id="nw-custom-eff-mod" min="-30" max="30" value="0" style="width:80px;">
                            <small>+ усиливает касты, − ослабляет</small>
                        </div>
                        <div style="display:flex;flex-direction:column;gap:4px;">
                            <label>Длительность (минуты)</label>
                            <input type="number" id="nw-custom-eff-dur" min="1" max="1440" value="30" style="width:90px;">
                            <small>60 = 1 час, 1440 = сутки</small>
                        </div>
                    </div>
                </div>

                <div class="nw-custom-row">
                    <label>Иконка — выбери из набора:</label>
                    <div class="nw-icon-grid" id="nw-icon-grid">${iconGrid}</div>
                    <input type="hidden" id="nw-custom-icon-pick" value="">
                </div>
                <div class="nw-custom-row">
                    <label>...или загрузи свою (png, до 200 КБ):</label>
                    <input type="file" id="nw-custom-icon" accept="image/png,image/webp,image/jpeg">
                </div>
                <div class="nw-custom-btns">
                    <button type="submit" class="nw-cast-btn">Создать заклинание</button>
                    <button type="button" id="nw-custom-cancel" class="nw-quick-btn">Назад</button>
                </div>
            </form>
        ` : `
            <p style="font-size:0.78rem;color:var(--nw-text-dim);text-align:center;margin-top:12px;">
                Все слоты заняты. Следующий откроется на ${state.level + 1} уровне.
            </p>
        `}
    `;

    // Обработчики
    if (canCreate) {
        document.getElementById('nw-custom-form').addEventListener('submit', handleCustomSpellSubmit);
        document.getElementById('nw-custom-cancel').addEventListener('click', () => {
            activeTab = 'all';
            renderSpells();
        });

        // Чекбокс «есть эффект» — показать/скрыть поля
        const chkEffect = document.getElementById('nw-custom-has-effect');
        const effFields = document.getElementById('nw-custom-effect-fields');
        chkEffect.addEventListener('change', () => {
            effFields.classList.toggle('nw-hidden', !chkEffect.checked);
        });

        // Сетка иконок — выбор кликом
        const grid = document.getElementById('nw-icon-grid');
        grid.addEventListener('click', (e) => {
            const pick = e.target.closest('.nw-icon-pick');
            if (!pick) return;
            grid.querySelectorAll('.nw-icon-pick').forEach(el => el.classList.remove('nw-icon-selected'));
            pick.classList.add('nw-icon-selected');
            document.getElementById('nw-custom-icon-pick').value = pick.dataset.file;
            document.getElementById('nw-custom-icon').value = '';
        });
    }

    container.querySelectorAll('.nw-custom-delete').forEach(btn => {
        btn.addEventListener('click', () => {
            if (!confirm('Удалить это заклинание? Действие необратимо.')) return;
            state.customSpells = state.customSpells.filter(s => s.id !== btn.dataset.id);
            state.knownSpellIds = state.knownSpellIds.filter(id => id !== btn.dataset.id);
            saveState();
            renderCustomSpellForm(container);
        });
    });
}


function handleCustomSpellSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('nw-custom-name').value.trim();
    const school = document.getElementById('nw-custom-school').value;
    const cost = parseInt(document.getElementById('nw-custom-cost').value);
    const use = document.getElementById('nw-custom-use').value.trim();
    const limit = document.getElementById('nw-custom-limit').value.trim();
    const iconPackFile = document.getElementById('nw-custom-icon-pick').value;
    const iconFile = document.getElementById('nw-custom-icon').files[0];

    // Чекбокс эффекта
    const hasEffect = document.getElementById('nw-custom-has-effect').checked;
    let effectData = null;

    if (hasEffect) {
        const effName = document.getElementById('nw-custom-eff-name').value.trim();
        const effType = document.getElementById('nw-custom-eff-type').value;
        const effMod = parseInt(document.getElementById('nw-custom-eff-mod').value) || 0;
        const effDur = parseInt(document.getElementById('nw-custom-eff-dur').value) || 30;

        if (!effName) {
            showNotify('Укажи название эффекта', 'warning');
            return;
        }
        if (effDur < 1 || effDur > 1440) {
            showNotify('Длительность эффекта — от 1 до 1440 минут', 'warning');
            return;
        }

        effectData = {
            nameRu: effName,
            nameEn: autoNameEn(effName),
            type: effType,
            modifier: Math.max(-30, Math.min(30, effMod)),
            durationMinutes: effDur,
        };
    }

    // Валидация основных полей
    if (!name || !use || !limit) {
        showNotify('Заполни все обязательные поля', 'warning');
        return;
    }
    if (isNaN(cost) || cost < 10 || cost > 150) {
        showNotify('Стоимость маны — от 10 до 150', 'warning');
        return;
    }

    // Автогенерация английских текстов
    const nameEn = autoNameEn(name);
    const useEn = autoDescEn(use);
    const limitEn = autoDescEn(limit);

    const id = `custom_${Date.now()}`;

    // Если есть загруженный файл — приоритет ему
    if (iconFile) {
        if (iconFile.size > 200 * 1024) {
            showNotify('Иконка слишком большая — максимум 200 КБ', 'warning');
            return;
        }
        const reader = new FileReader();
        reader.onload = (ev) => {
            createCustomSpell({
                id, name, nameEn, school, cost, use, useEn, limit, limitEn,
                level: 10, ritual: false,
                iconData: ev.target.result,
                iconPack: null,
                effectData,
            });
        };
        reader.onerror = () => showNotify('Ошибка чтения файла', 'error');
        reader.readAsDataURL(iconFile);
    } else {
        createCustomSpell({
            id, name, nameEn, school, cost, use, useEn, limit, limitEn,
            level: 10, ritual: false,
            iconData: null,
            iconPack: iconPackFile || null,
            effectData,
        });
    }
}


function createCustomSpell(spell) {
    if (!Array.isArray(state.customSpells)) state.customSpells = [];
    state.customSpells.push(spell);
    state.knownSpellIds.push(spell.id); // автоматом добавляем в известные
    saveState();
    showNotify(`Заклинание «${spell.name}» создано!`, 'success', 5000);
    activeTab = 'all';
    renderPanel();
}

// ─── RENDER ───────────────────────────────────────────────────
function renderPanel() {
    if (!state || !document.getElementById('nw-book')) return;
    const pName = name1 || '';
    const toggleEl = document.getElementById('nw-toggle');
    if (toggleEl) toggleEl.title = pName ? `Гримуар ${pName}` : 'Гримуар';


    // Mana vessel
    const manaPct = Math.max(0, Math.min(100, (state.mana / state.maxMana) * 100));
    const liquid = document.getElementById('nw-mana-liquid');
    if (liquid) liquid.style.height = manaPct + '%';
    const manaLabel = document.getElementById('nw-mana-label');
    if (manaLabel) manaLabel.textContent = `${state.mana}/${state.maxMana}`;

    // Мини-колба на кнопке
    const miniLiquid = document.getElementById('nw-mini-liquid');
    if (miniLiquid) miniLiquid.style.height = manaPct + '%';
    const miniNum = document.getElementById('nw-mini-num');
    if (miniNum) miniNum.textContent = state.mana;


    // Level + XP
    document.getElementById('nw-level').textContent = state.level;
    const xpText = document.getElementById('nw-xp-text');
    const xpFill = document.getElementById('nw-xp-fill');
    const curBase = getXpCumulative(state.level);
    const nextReq = getXpCumulative(state.level + 1);
    const into = state.xp - curBase;
    const span = nextReq - curBase;
    const pct = Math.max(0, Math.min(100, (into / span) * 100));
    xpText.textContent = `${into} / ${span}`;
    xpFill.style.width = pct + '%';


    // Blood
    const tier = getBloodTier(state.blood);
    document.getElementById('nw-blood-tier').textContent = tier.labelRu;
    document.getElementById('nw-blood-fill').style.width = state.blood + '%';

    renderLevelRail();
    renderEffects();
    renderQuickSlots();
    renderSpells();

    // Показать кнопку создания кастомных заклинаний с 10 уровня
    const customTab = document.getElementById('nw-tab-custom');
    if (customTab) customTab.style.display = (state.level >= 10) ? '' : 'none';

    // Вкладка «Путь Ведьмы» — открывается с 11 уровня
    const pathTab = document.getElementById('nw-tab-path');
    if (pathTab) pathTab.style.display = (state.level > 10) ? '' : 'none';

    renderSidebar();
}



function renderSpells() {
    const container = document.getElementById('nw-spells');
    if (!container || !state) return;

    if (activeTab === 'levels') {
        container.classList.add('nw-levels-mode');
        renderLevelsTab(container);
        return;
    }
    if (activeTab === 'path') {
        container.classList.add('nw-levels-mode');
        renderPathTab(container);
        return;
    }
    if (activeTab === 'custom') {
        container.classList.add('nw-levels-mode');
        renderCustomSpellForm(container);
        return;
    }
    container.classList.remove('nw-levels-mode');


const list = getAllSpells().filter(s =>
    (activeTab === 'all' || s.school === activeTab)
    && (activeLevel === 'all' || s.level === activeLevel)
).sort((a, b) => {
    if (a.level !== b.level) return a.level - b.level;
    return a.name.localeCompare(b.name, 'ru');
});

    container.innerHTML = list.map(spell => {
        const known = spell.level <= state.level;
        const color = SCHOOL_COLORS[spell.school];
        const cls = [
            known ? '' : 'nw-cell-locked',
            state.mana < spell.cost ? 'nw-nomana' : '',
            spell.id === selectedSpellId ? 'nw-selected' : '',
        ].join(' ');

        return `
        <div class="nw-spell-cell ${cls}" data-spell="${spell.id}"
             style="--school:${color}" title="${spell.name} — ${spell.cost} маны">
            <div class="nw-cell-frame">
                <img src="${spellIconUrl(spell)}" class="nw-cell-icon" alt="" draggable="false"
                     onerror="this.classList.add('nw-icon-missing')">
                ${known ? '' : '<span class="nw-cell-lock">🔒</span>'}
                <span class="nw-cell-cost">${spell.cost}</span>
            </div>
            <div class="nw-cell-name">${spell.name}</div>
        </div>`;
    }).join('');

    container.querySelectorAll('.nw-spell-cell').forEach(el => {
        el.addEventListener('click', () => {
            selectedSpellId = el.dataset.spell;
            renderSpells();
        });
    });

    renderDetail();
}

function renderLevelsTab(container) {
    const allSpells = getAllSpells();

    // Show levels 1-10 + any achieved beyond 10 + next one
    const maxShown = Math.max(10, state.level + 1);
    const levels = [];
    for (let i = 1; i <= maxShown; i++) levels.push(getLevelDataFor(i));

    const rows = levels.map(ld => {
        const reached = state.level >= ld.level;
        const isNext = ld.level === state.level + 1;
        const spells = allSpells.filter(s => s.level === ld.level);
        const cum = getXpCumulative(ld.level);
        const cls = reached ? 'nw-lvl-done' : (isNext ? 'nw-lvl-next' : 'nw-lvl-locked');

        const spellsLine = spells.length > 0
            ? `<div class="nw-lvl-spells">${spells.map(s => s.name).join(' · ')}</div>`
            : (ld.level > 10
                ? `<div class="nw-lvl-spells">+${ld.level - 9} слот${ld.level - 9 > 1 ? (ld.level - 9 < 5 ? 'а' : 'ов') : ''} для кастомных заклинаний</div>`
                : '');

        return `
        <div class="nw-lvl-row ${cls}">
            <div class="nw-lvl-head">
                <b>Уровень ${ld.level}</b>
                <span class="nw-lvl-xp">${cum} XP · ${ld.maxMana} маны</span>
                <span>${reached ? '✦' : '🔒'}</span>
            </div>
            ${spellsLine}
        </div>`;
    }).join('');

    const lvl = state.level;
    container.innerHTML = `
        <div class="nw-xp-info">
            <div class="nw-xp-info-title">Как копится опыт (растёт с уровнем)</div>
            <div class="nw-xp-info-list">
                Успешный каст — половина стоимости заклинания + бонус за уровень<br>
                Первый каст нового заклинания — +${XP_REWARDS.castFirstTime(lvl)} XP<br>
                Сорвавшийся каст — +${XP_REWARDS.castFail(lvl)} XP<br>
                Обычное событие сюжета — +${XP_REWARDS.eventNormal(lvl)} XP<br>
                Важное событие сюжета — +${XP_REWARDS.eventImportant(lvl)} XP<br>
                Критическое событие сюжета — +${XP_REWARDS.eventCritical(lvl)} XP
            </div>
        </div>
        ${rows}`;
}
// ─── ВКЛАДКА «ПУТЬ ВЕДЬМЫ» (уровни 11+) ──────────────────────
function renderPathTab(container) {
    const totalXp = state.xp;
    const curBase = getXpCumulative(state.level);
    const nextReq = getXpCumulative(state.level + 1);
    const into = totalXp - curBase;
    const span = nextReq - curBase;
    const pct = Math.max(0, Math.min(100, (into / span) * 100));

    // Сколько кастомных слотов открыто и занято
    const customUsed = Array.isArray(state.customSpells) ? state.customSpells.length : 0;
    const customMax = Math.max(0, state.level - 9);

    // Строки по уровням выше 10 — «вехи пути»
    const startFrom = 11;
    const rows = [];
    for (let lvl = startFrom; lvl <= state.level; lvl++) {
        const ld = getLevelDataFor(lvl);
        const cum = getXpCumulative(lvl);
        const slots = lvl - 9;
        rows.push(`
        <div class="nw-path-row nw-path-done">
            <div class="nw-path-node">✦</div>
            <div class="nw-path-body">
                <div class="nw-path-head">
                    <b>Уровень ${lvl}</b>
                    <span class="nw-path-xp">${cum} XP · ${ld.maxMana} маны</span>
                </div>
                <div class="nw-path-note">Открыт слот для своего заклинания (всего ${slots})</div>
            </div>
        </div>`);
    }

    // Следующая веха — куда идём
    const nextLvl = state.level + 1;
    const nextLd = getLevelDataFor(nextLvl);
    const nextCum = getXpCumulative(nextLvl);
    rows.push(`
        <div class="nw-path-row nw-path-next">
            <div class="nw-path-node">◇</div>
            <div class="nw-path-body">
                <div class="nw-path-head">
                    <b>Уровень ${nextLvl}</b>
                    <span class="nw-path-xp">${nextCum} XP · ${nextLd.maxMana} маны</span>
                </div>
                <div class="nw-path-note">Ещё <b>${nextReq - totalXp}</b> опыта — и новый слот заклинания</div>
            </div>
        </div>`);

    container.innerHTML = `
        <div class="nw-path-hero">
            <div class="nw-path-moon">🌙</div>
            <div class="nw-path-hero-title">Путь Ведьмы</div>
            <div class="nw-path-hero-sub">За пределами десятого круга магия больше не даёт готовых заклинаний —
            только силу. Дальше ${name1 || 'ведьма'} творит свои.</div>

            <div class="nw-path-stats">
                <div class="nw-path-stat">
                    <span class="nw-path-stat-num">${state.level}</span>
                    <span class="nw-path-stat-cap">уровень</span>
                </div>
                <div class="nw-path-stat">
                    <span class="nw-path-stat-num">${totalXp}</span>
                    <span class="nw-path-stat-cap">всего опыта</span>
                </div>
                <div class="nw-path-stat">
                    <span class="nw-path-stat-num">${customUsed}/${customMax}</span>
                    <span class="nw-path-stat-cap">своих заклинаний</span>
                </div>
                <div class="nw-path-stat">
                    <span class="nw-path-stat-num">${state.maxMana}</span>
                    <span class="nw-path-stat-cap">потолок маны</span>
                </div>
            </div>

            <div class="nw-path-progress-wrap">
                <div class="nw-path-progress-top">
                    <span>До ${nextLvl} уровня</span>
                    <span>${into} / ${span}</span>
                </div>
                <div class="nw-progress nw-xp">
                    <div class="nw-progress-fill" style="width:${pct}%"></div>
                </div>
            </div>
        </div>

        <div class="nw-path-timeline-title">Пройденные вехи</div>
        <div class="nw-path-timeline">
            ${rows.join('')}
        </div>

        <div class="nw-xp-info" style="margin-top:8px;">
            <div class="nw-xp-info-title">Как растёт сила дальше</div>
            <div class="nw-xp-info-list">
                Каждый уровень выше 10-го открывает <b>+1 слот</b> для своего заклинания<br>
                Потолок маны растёт на <b>+15</b> за уровень<br>
                Каждый следующий уровень требует всё больше опыта<br>
                Создавай свои заклинания во вкладке <b>✨ Создать</b>
            </div>
        </div>`;
}

function renderLevelRail() {
    const rail = document.getElementById('nw-level-rail');
    if (!rail || !state) return;

    // Показываем 1-10 всегда + все достигнутые уровни выше 10
    const maxLevel = Math.max(10, state.level);

    let html = `<button class="nw-lvl-btn ${activeLevel === 'all' ? 'nw-lvl-btn-active' : ''}" data-lvl="all"><span>Все ур.</span></button>`;
    for (let lvl = 1; lvl <= maxLevel; lvl++) {
        const locked = lvl > state.level;
        const active = activeLevel === lvl;
        const beyond = lvl > 10 ? 'nw-lvl-btn-beyond' : '';
        html += `<button class="nw-lvl-btn ${active ? 'nw-lvl-btn-active' : ''} ${locked ? 'nw-lvl-btn-locked' : ''} ${beyond}" data-lvl="${lvl}">
            <span>Уровень ${lvl}${lvl > 10 ? ' ✦' : ''}</span>${locked ? '<span class="nw-lvl-lock">🔒</span>' : ''}
        </button>`;
    }
    rail.innerHTML = html;

    rail.querySelectorAll('.nw-lvl-btn').forEach(b => {
        b.addEventListener('click', () => {
            activeLevel = b.dataset.lvl === 'all' ? 'all' : +b.dataset.lvl;
            renderLevelRail();
            renderSpells();
        });
    });
}

function renderEffects() {
    if (!state) return;
    const tier = getBloodTier(state.blood);
    const bodyLabel = BODY_LABELS[state.bodyState]?.ru || state.bodyState;

    const bloodTargetLabels = { men: 'мужчин', women: 'женщин', all: 'всех рядом' };
    const bloodTargetTxt = bloodTargetLabels[state.bloodTarget || 'men'];

    // ── ВЕРХНИЙ БЛОК: только ведьмовская кровь ──
    const bloodBox = document.getElementById('nw-blood-panel');
    if (bloodBox) {
        bloodBox.innerHTML = `
            <div class="nw-effect-row nw-effect-neutral">
                <span class="nw-effect-ico">🩸</span>
                <div><b>${tier.labelRu} (${state.blood}/100)</b>
                <div class="nw-effect-desc">${tier.descRu || ''}</div>
                <div class="nw-effect-desc" style="margin-top:4px;opacity:0.8;">Влияет на: <b>${bloodTargetTxt}</b> · меняется в настройках</div>
                <div class="nw-effect-desc" style="margin-top:3px;opacity:0.7;font-size:0.6rem;">Копится: каст крови +${BLOOD_GAIN.castBlood} · ритуал крови +${BLOOD_GAIN.ritualBlood} · каст разума +${BLOOD_GAIN.castMind} · романтическая сцена +${BLOOD_GAIN.romanticScene}</div>
                </div>
            </div>`;
    }

    // ── НИЖНИЙ БЛОК: тело, состояние, временные эффекты (горизонтально) ──
    const box = document.getElementById('nw-effects');
    if (!box) return;

    let rows = `
        <div class="nw-effect-row nw-effect-neutral">
            <span class="nw-effect-ico">🌙</span>
            <div><b>Тело: ${bodyLabel}</b>
            <div class="nw-effect-desc">Долгосрочное состояние — влияет на самочувствие и магию</div></div>
        </div>
        <div class="nw-effect-row nw-effect-neutral">
            <span class="nw-effect-ico">✧</span>
            <div><b>Состояние: ${CONDITION_LABELS_RU[state.condition] || state.condition}</b>
            <div class="nw-effect-desc">Краткосрочное — меняется от событий сцены</div></div>
        </div>`;

    if (Array.isArray(state.activeEffects) && state.activeEffects.length) {
        rows += state.activeEffects.map(e => {
            const cls = e.type === 'buff' ? 'nw-effect-buff' : 'nw-effect-debuff';
            const ico = e.type === 'buff' ? '✦' : '☠';
            const modText = e.modifier ? ` (${e.modifier > 0 ? '+' : ''}${e.modifier}% к кастам)` : '';
            return `
            <div class="nw-effect-row ${cls}">
                <span class="nw-effect-ico">${ico}</span>
                <div><b>${e.nameRu}</b>${modText}
                <div class="nw-effect-desc">Осталось: ${formatRemaining(e.remainingMinutes)}</div></div>
            </div>`;
        }).join('');
    }

    if (queuedManualCast) {
        const spell = getSpellById(queuedManualCast.spellId);
        if (spell) {
            rows += `
            <div class="nw-effect-row nw-effect-reading">
                <span class="nw-effect-ico">✨</span>
                <div><b>Читается: «${spell.name}»</b>
                <div class="nw-effect-desc">Исход раскроется в следующем ответе</div>
                <button id="nw-cancel-cast" class="nw-cancel-btn">Отменить</button></div>
            </div>`;
        }
    }

    box.innerHTML = rows;
    document.getElementById('nw-cancel-cast')?.addEventListener('click', cancelQueuedCast);
    renderSidebar();
}




function renderQuickSlots() {
    const box = document.getElementById('nw-quick-slots');
    if (!box || !state) return;
    if (!Array.isArray(state.quickSlots)) state.quickSlots = [null, null, null, null, null];

    box.innerHTML = state.quickSlots.map((spellId, i) => {
        const spell = spellId ? getSpellById(spellId) : null;
        if (!spell) {
            return `<div class="nw-quick-slot nw-quick-empty" data-slot="${i}">
                <span class="nw-quick-lock">🔒</span>
                <span class="nw-quick-num">${i + 1}</span>
            </div>`;
        }
        const color = SCHOOL_COLORS[spell.school];
        return `<div class="nw-quick-slot nw-quick-filled" data-slot="${i}" data-spell="${spell.id}"
                     style="--school:${color}" title="${spell.name} (${spell.cost} маны)">
            <img class="nw-quick-icon" src="${spellIconUrl(spell)}" alt=""
                 onerror="this.classList.add('nw-icon-missing')">
            <span class="nw-quick-cost">${spell.cost}</span>
            <span class="nw-quick-num">${i + 1}</span>
        </div>`;
    }).join('');

    box.querySelectorAll('.nw-quick-slot').forEach(el => {
        el.addEventListener('click', () => {
            const spellId = el.dataset.spell;
            if (!spellId) return;
            selectedSpellId = spellId;
            activeTab = 'all';
            activeLevel = 'all';
            renderPanel();
        });
    });
}


function renderDetail() {
    const box = document.getElementById('nw-detail');
    if (!box || !state) return;
    const spell = getSpellById(selectedSpellId);
    if (!spell) { box.classList.add('nw-hidden'); return; }
    box.classList.remove('nw-hidden');

    const chance = calcCastChance(spell);
    const risky = spell.level > state.level;
    const noMana = state.mana < spell.cost;
    const locked = castLocked || !!queuedManualCast;
    const color = SCHOOL_COLORS[spell.school];

    box.innerHTML = `
        <button class="nw-detail-close" id="nw-detail-close" title="Закрыть">✕</button>
        <div class="nw-detail-top">
            <div class="nw-detail-iconbox" style="--school:${color}">
                <img src="${spellIconUrl(spell)}" class="nw-detail-icon" alt="" draggable="false"
                     onerror="this.classList.add('nw-icon-missing')">
            </div>
            <div class="nw-detail-info">
                <div class="nw-detail-name" style="color:${color}">${spell.name}</div>
                <div class="nw-detail-desc">${spell.use}</div>
                <div class="nw-detail-limit">Предел: ${spell.limit}</div>
            </div>
        </div>
        <div class="nw-detail-params">
            <div class="nw-param"><span class="nw-param-ico">✦</span> Расход маны: <b>${spell.cost}</b></div>
            <div class="nw-param"><span class="nw-param-ico">★</span> Требуемый уровень: <b>${spell.level}</b></div>
            <div class="nw-param ${risky ? 'nw-chance-risky' : ''}"><span class="nw-param-ico">☄</span> Шанс успеха: <b>${chance}%</b></div>
            ${spell.ritual ? '<div class="nw-param"><span class="nw-param-ico">⧗</span> Тип: <b>ритуал — требует времени и условий</b></div>' : ''}
        </div>
        ${risky ? `<div class="nw-detail-warning">⚠ Выше твоего уровня — при неудаче сгорит половина маны</div>` : ''}
        <div class="nw-detail-btns">
            <button id="nw-cast-btn" class="nw-cast-btn ${risky ? 'nw-cast-risky' : ''}" ${noMana || locked ? 'disabled' : ''}>
                ${locked ? 'Уже читаешь заклинание' : (noMana ? 'Недостаточно маны' : 'Наложить заклинание')}
            </button>
            <button id="nw-quick-btn" class="nw-quick-btn">${state.quickSlots?.includes(spell.id) ? 'Убрать из быстрого доступа' : 'В быстрый доступ'}</button>
        </div>
    `;
    document.getElementById('nw-detail-close')?.addEventListener('click', () => {
        selectedSpellId = null;
        renderSpells();
    });
    document.getElementById('nw-cast-btn')?.addEventListener('click', castSelectedSpell);
    document.getElementById('nw-quick-btn')?.addEventListener('click', () => {
        if (!Array.isArray(state.quickSlots)) state.quickSlots = [null, null, null, null, null];
        const existing = state.quickSlots.indexOf(spell.id);
        if (existing !== -1) {
            state.quickSlots[existing] = null; // убрать
        } else {
            const free = state.quickSlots.indexOf(null);
            if (free === -1) {
                showNotify('Все слоты заняты — сначала освободи один', 'warning');
                return;
            }
            state.quickSlots[free] = spell.id;
        }
        saveState();
    });

}

// ═══════════════════════════════════════════════════════════
// ─── БОКОВАЯ ПАНЕЛЬ БЫСТРОГО КАСТА ─────────────────────────
// ═══════════════════════════════════════════════════════════
const SIDEBAR_SIDE_KEY = 'nellWitchcraft_sidebarSide';
const SIDEBAR_ON_KEY = 'nellWitchcraft_sidebarOn';
const SIDEBAR_COLLAPSED_KEY = 'nellWitchcraft_sidebarCollapsed';

function getSidebarSide() {
    const s = localStorage.getItem(SIDEBAR_SIDE_KEY);
    return (s === 'left' || s === 'right') ? s : 'right';
}
function setSidebarSide(side) {
    localStorage.setItem(SIDEBAR_SIDE_KEY, side === 'left' ? 'left' : 'right');
    renderSidebar();
}
function isSidebarOn() {
    return localStorage.getItem(SIDEBAR_ON_KEY) !== 'false';
}
function setSidebarOn(on) {
    localStorage.setItem(SIDEBAR_ON_KEY, on ? 'true' : 'false');
    renderSidebar();
}
function isSidebarCollapsed() {
    return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true';
}
function setSidebarCollapsed(collapsed) {
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, collapsed ? 'true' : 'false');
    const bar = document.getElementById('nw-sidebar');
    if (bar) bar.classList.toggle('nw-sb-collapsed', collapsed);
}

function buildSidebar() {
    if (document.getElementById('nw-sidebar')) return;
    const root = document.getElementById('nw-root') || document.body;
    const bar = document.createElement('div');
    bar.id = 'nw-sidebar';
    bar.dataset.side = getSidebarSide();
    if (isSidebarCollapsed()) bar.classList.add('nw-sb-collapsed');
    root.appendChild(bar);
}


function renderSidebar() {
    const bar = document.getElementById('nw-sidebar');
    if (!bar || !state) return;

    if (!isEnabled() || !isSidebarOn()) {
        bar.classList.add('nw-hidden');
        return;
    }
    bar.classList.remove('nw-hidden');
    bar.dataset.side = getSidebarSide();
    bar.classList.toggle('nw-sb-collapsed', isSidebarCollapsed());

    if (!Array.isArray(state.quickSlots)) state.quickSlots = [null, null, null, null, null];

    // Стрелка-язычок для сворачивания (закладка)
    const collapsed = isSidebarCollapsed();
    const arrowGlyph = () => {
        const side = getSidebarSide();
        if (collapsed) return side === 'right' ? '‹' : '›';
        return side === 'right' ? '›' : '‹';
    };
    const tabHtml = `
        <button class="nw-sb-handle" title="${collapsed ? 'Показать заклинания' : 'Спрятать за край'}">
            <span class="nw-sb-handle-arrow">${arrowGlyph()}</span>
        </button>`;

    const filled = state.quickSlots.filter(Boolean);

    let slotsHtml = '';
    if (filled.length === 0) {
        slotsHtml = `<div class="nw-sb-empty" title="Забинди заклинания в гримуаре">✦</div>`;
    } else {
        const busy = castLocked || !!queuedManualCast;
        slotsHtml = state.quickSlots.map((id, i) => {
            if (!id) return '';
            const spell = getSpellById(id);
            if (!spell) return '';
            const color = SCHOOL_COLORS[spell.school];
            const noMana = state.mana < spell.cost;
            const cls = [
                'nw-sb-btn',
                noMana ? 'nw-sb-nomana' : '',
                busy ? 'nw-sb-busy' : '',
            ].join(' ');
            return `
            <button class="${cls}" data-spell="${spell.id}" style="--school:${color}"
                    title="${spell.name} · ${spell.cost} маны (клик — скастовать)">
                <img class="nw-sb-icon" src="${spellIconUrl(spell)}" alt=""
                     onerror="this.classList.add('nw-icon-missing')">
                <span class="nw-sb-cost">${spell.cost}</span>
                <span class="nw-sb-key">${i + 1}</span>
            </button>`;
        }).join('');
    }

    bar.innerHTML = `${tabHtml}<div class="nw-sb-inner">${slotsHtml}</div>`;

    // Клик по язычку — свернуть / развернуть
    bar.querySelector('.nw-sb-handle')?.addEventListener('click', () => {
        setSidebarCollapsed(!isSidebarCollapsed());
        renderSidebar();
    });

    // Клик по заклинанию — каст
    bar.querySelectorAll('.nw-sb-btn').forEach(el => {
        el.addEventListener('click', () => {
            const spell = getSpellById(el.dataset.spell);
            if (!spell) return;
            if (castLocked || queuedManualCast) {
                showNotify('Ты уже читаешь заклинание — дождись ответа', 'warning');
                return;
            }
            if (state.mana < spell.cost) {
                showNotify('Недостаточно маны', 'warning');
                return;
            }
            selectedSpellId = spell.id;
            castSelectedSpell();
            renderSidebar();
        });
    });
}

// ─── INIT ─────────────────────────────────────────────────────
function init() {
    console.log('[Nell Witchcraft] init');
    buildPanelSkeleton();
    buildSidebar();
    injectSettingsPanel();
    loadState();
    renderPanel();

    eventSource.on(event_types.GENERATION_STARTED, onGenerationStarted);
    eventSource.on(event_types.GENERATION_STOPPED, onGenerationStopped);
    eventSource.on(event_types.MESSAGE_SENT, onMessageSent);
    eventSource.on(event_types.MESSAGE_RECEIVED, onMessageReceived);
    eventSource.on(event_types.CHAT_CHANGED, onChatChanged);
}


// ─── SETTINGS PANEL (Extensions tab) ─────────────────────────
function injectSettingsPanel() {
    let attempts = 0;
    const interval = setInterval(() => {
        attempts++;
        const container = document.querySelector('#extensions_settings2')
                       || document.querySelector('#extensions_settings');
        if (container) {
            clearInterval(interval);
            container.insertAdjacentHTML('beforeend', `
                <div class="inline-drawer" id="nw-settings-drawer">
                    <div class="inline-drawer-toggle inline-drawer-header">
                        <b>Nell's Witchcraft</b>
                        <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
                    </div>
                    <div class="inline-drawer-content" id="nw-settings-content">

                        <div class="nw-set-status">
                            <span>Уровень: <b id="nw-si-level">—</b></span>
                            <span>Мана: <b id="nw-si-mana">—</b></span>
                            <span>Кровь: <b id="nw-si-blood">—</b></span>
                            <span>XP: <b id="nw-si-xp">—</b></span>
                        </div>

                        <hr class="nw-set-divider">
                        <div class="nw-set-row">
                            <label for="nw-chk-enabled">Включить/отключить расширение:</label>
                            <input type="checkbox" id="nw-chk-enabled" checked>
                        </div>

                        <div class="nw-set-row">
                            <label for="nw-select-theme">Тема гримуара:</label>
                            <select id="nw-select-theme" class="text_pole nw-set-input" style="width:130px!important">
                                <option value="purple">Фиолетовая</option>
                                <option value="dark">Чёрная</option>
                                <option value="light">Белая</option>
                                <option value="adaptive">Адаптивная (тема ST)</option>
                            </select>
                        </div>

                        <div class="nw-set-row">
                            <label for="nw-chk-sidebar">Боковые кнопки каста:</label>
                            <input type="checkbox" id="nw-chk-sidebar" checked>
                        </div>

                        <div class="nw-set-row">
                            <label for="nw-select-side">Сторона панели:</label>
                            <select id="nw-select-side" class="text_pole nw-set-input" style="width:auto;">
                                <option value="right">Справа</option>
                                <option value="left">Слева</option>
                            </select>
                        </div>


                        <div class="nw-set-row">
                            <label for="nw-select-bloodtarget">Кровь влияет на:</label>
                            <select id="nw-select-bloodtarget" class="text_pole nw-set-input" style="width:auto;">
                                <option value="men">Мужчин</option>
                                <option value="women">Женщин</option>
                                <option value="all">Всех</option>
                            </select>
                        </div>

                        <hr class="nw-set-divider">

                        <div class="nw-set-row">
                            <label for="nw-input-addxp">Добавить XP вручную:</label>
                            <input id="nw-input-addxp" type="number" min="0" max="9999"
                                   value="50" class="text_pole nw-set-input">
                            <button id="nw-btn-addxp" class="menu_button menu_button_icon">
                                <i class="fa-solid fa-plus"></i> XP
                            </button>
                        </div>

                        <div class="nw-set-row">
                            <label for="nw-input-setblood">Установить кровь (0–100):</label>
                            <input id="nw-input-setblood" type="number" min="0" max="100"
                                   value="" class="text_pole nw-set-input">
                            <button id="nw-btn-setblood" class="menu_button menu_button_icon">
                                <i class="fa-solid fa-droplet"></i> Применить
                            </button>
                        </div>

                        <div class="nw-set-row">
                            <label for="nw-input-setmana">Установить ману (0–макс):</label>
                            <input id="nw-input-setmana" type="number" min="0" max="215"
                                   value="" class="text_pole nw-set-input">
                            <button id="nw-btn-setmana" class="menu_button menu_button_icon">
                                <i class="fa-solid fa-flask"></i> Применить
                            </button>
                        </div>

                        <hr class="nw-set-divider">

                        <div class="nw-set-row">
                            <button id="nw-btn-fullmana" class="menu_button menu_button_icon">
                                <i class="fa-solid fa-heart-pulse"></i> Заполнить ману
                            </button>
                            <button id="nw-btn-reset" class="menu_button menu_button_icon nw-btn-danger">
                                <i class="fa-solid fa-rotate-left"></i> Сбросить прогресс чата
                            </button>
                        </div>

                    </div>
                </div>
            `);
            bindSettingsEvents();
            updateSettingsDisplay();
        }
        if (attempts >= 40) clearInterval(interval);
    }, 250);
}

function bindSettingsEvents() {
    // ── выключатель ──
    const chkEnabled = document.getElementById('nw-chk-enabled');
    if (chkEnabled) {
        chkEnabled.checked = isEnabled();
        chkEnabled.addEventListener('change', () => {
            setEnabled(chkEnabled.checked);
            showNotify(chkEnabled.checked ? 'Гримуар включен' : 'Гримуар отключен', 'info');
        });
    }
    
    // ── тема ──
    const selTheme = document.getElementById('nw-select-theme');
    if (selTheme) {
        selTheme.value = getTheme();
        selTheme.addEventListener('change', () => {
            setTheme(selTheme.value);
            showNotify(`Тема: ${selTheme.selectedOptions[0]?.textContent || selTheme.value}`, 'info');
        });
    }

    // ── боковые кнопки каста ──
    const chkSidebar = document.getElementById('nw-chk-sidebar');
    if (chkSidebar) {
        chkSidebar.checked = isSidebarOn();
        chkSidebar.addEventListener('change', () => {
            setSidebarOn(chkSidebar.checked);
            showNotify(chkSidebar.checked ? 'Боковые кнопки включены' : 'Боковые кнопки выключены', 'info');
        });
    }
    const selSide = document.getElementById('nw-select-side');
    if (selSide) {
        selSide.value = getSidebarSide();
        selSide.addEventListener('change', () => {
            setSidebarSide(selSide.value);
            showNotify(`Панель теперь ${selSide.value === 'left' ? 'слева' : 'справа'}`, 'info');
        });
    }


    // ── на кого влияет кровь ──
    const selBlood = document.getElementById('nw-select-bloodtarget');
    if (selBlood) {
        selBlood.value = state?.bloodTarget || 'men';
        selBlood.addEventListener('change', () => {
            if (!state) return;
            state.bloodTarget = selBlood.value;
            saveState();
            const labels = { men: 'мужчин', women: 'женщин', all: 'всех' };
            showNotify(`Кровь теперь влияет на ${labels[selBlood.value]}`, 'info');
        });
    }


    document.getElementById('nw-btn-addxp')?.addEventListener('click', () => {
        if (!state) return;
        const val = parseInt(document.getElementById('nw-input-addxp')?.value) || 0;
        if (val > 0) { addXp(val); saveState(); }
    });

    document.getElementById('nw-btn-setblood')?.addEventListener('click', () => {
        if (!state) return;
        const val = parseInt(document.getElementById('nw-input-setblood')?.value);
        if (!isNaN(val)) {
            state.blood = Math.max(0, Math.min(100, val));
            saveState();
        }
    });

    document.getElementById('nw-btn-setmana')?.addEventListener('click', () => {
        if (!state) return;
        const val = parseInt(document.getElementById('nw-input-setmana')?.value);
        if (!isNaN(val)) {
            state.mana = Math.max(0, Math.min(state.maxMana, val));
            saveState();
        }
    });

    document.getElementById('nw-btn-fullmana')?.addEventListener('click', () => {
        if (!state) return;
        state.mana = state.maxMana;
        saveState();
        showNotify('Мана восстановлена', 'success');
    });

    document.getElementById('nw-btn-reset')?.addEventListener('click', () => {
        if (!confirm('Сбросить весь прогресс текущего чата?')) return;
        chat_metadata[META_KEY] = defaultState();
        loadState();
        saveState();
        showNotify('Прогресс сброшен', 'info');
    });
}


function updateSettingsDisplay() {
    if (!state) return;
    const set = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    };
    const curBase = getXpCumulative(state.level);
    const nextReq = getXpCumulative(state.level + 1);
    const xpToNext = `${state.xp - curBase} / ${nextReq - curBase}`;

    set('nw-si-level', state.level);
    set('nw-si-mana',  `${state.mana}/${state.maxMana}`);
    set('nw-si-blood', `${state.blood} (${getBloodTier(state.blood).labelRu})`);
    set('nw-si-xp',    xpToNext);

    const selBlood = document.getElementById('nw-select-bloodtarget');
    if (selBlood && state.bloodTarget) selBlood.value = state.bloodTarget;
}

// SillyTavern third-party extensions run on import; call init when DOM ready
jQuery(() => init());

export { init };
