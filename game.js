'use strict';
/* 脑腐海湾 Brainrot Bay · 中文单机体验版
   玩法与数值照抄 Roblox 原版（src/shared/BrainrotCatalog.luau 与 GameConfig.luau），
   改成单人网页版：3 个 AI 邻居共用一条传送带。*/

// ---------- 稀有度：名字、权重、颜色（与原版一致） ----------
const RARITIES = [
  { en: 'Common',      cn: '普通',   weight: 380, color: '#78c85a' },
  { en: 'Rare',        cn: '稀有',   weight: 260, color: '#468cff' },
  { en: 'Epic',        cn: '史诗',   weight: 170, color: '#aa5aff' },
  { en: 'Legendary',   cn: '传说',   weight: 105, color: '#ffa028' },
  { en: 'Mythic',      cn: '神话',   weight: 55,  color: '#ff4678' },
  { en: 'Brainrot God', cn: '脑腐神', weight: 22,  color: '#3cdce6' },
  { en: 'Secret',      cn: '秘密',   weight: 8,   color: '#9a9ab8' },
];

// ---------- 变异：名字、权重、倍率、光晕色 ----------
const MUTATIONS = [
  { en: 'Normal',  cn: '普通', weight: 850, mult: 1,  tint: '#ffffff' },
  { en: 'Golden',  cn: '黄金', weight: 100, mult: 2,  tint: '#ffd700' },
  { en: 'Diamond', cn: '钻石', weight: 40,  mult: 5,  tint: '#8ce6ff' },
  { en: 'Rainbow', cn: '彩虹', weight: 10,  mult: 10, tint: '#ff78c8' },
];

// ---------- 角色：英文名、中文名、中文介绍、稀有度、价格、收入、身体/肚皮色、帽子 ----------
const CHARACTERS = [
  { id: 'noodle-nibbler',  en: 'Noodle Nibbler',     cn: '面条怪',     blurb: '吸溜面条，默默审判你。',       rarity: 'Common',      price: 50,     income: 2,    body: '#f0d278', belly: '#fff0be', hat: 'Bowl' },
  { id: 'sir-bananaphone', en: 'Sir Bananaphone',    cn: '香蕉爵士',   blurb: '接听每一个电话，永远是香蕉。',   rarity: 'Common',      price: 100,    income: 4,    body: '#fadc3c', belly: '#fff5aa', hat: 'Crown' },
  { id: 'capybara-ceo',    en: 'Capybara CEO',       cn: '水豚总裁',   blurb: '经营五百强池塘，从不眨眼。',     rarity: 'Rare',        price: 300,    income: 10,   body: '#aa7846', belly: '#d2aa78', hat: 'Tie' },
  { id: 'dj-pickle',       en: 'DJ Pickle',          cn: '腌黄瓜DJ',   blurb: '放下节拍，也放下盐水。',         rarity: 'Rare',        price: 500,    income: 15,   body: '#5ab446', belly: '#a0dc78', hat: 'Headphones' },
  { id: 'toilet-tornado',  en: 'Toilet Tornado',     cn: '马桶龙卷风', blurb: '它旋转，它冲水，它记得一切。',   rarity: 'Epic',        price: 1200,   income: 30,   body: '#e6f0f5', belly: '#78c8f0', hat: 'Swirl' },
  { id: 'grandmas-wifi',   en: "Grandma's WiFi",     cn: '奶奶的WiFi', blurb: "密码就是'password'，信号永恒。", rarity: 'Epic',        price: 2000,   income: 45,   body: '#c8a0dc', belly: '#ebd2f5', hat: 'Bun' },
  { id: 'shark-in-a-suit', en: 'Shark in a Suit',    cn: '西装鲨鱼',   blurb: '谈成交易，吃掉对手，字面意思。', rarity: 'Legendary',   price: 4500,   income: 80,   body: '#5a82b4', belly: '#dce6f0', hat: 'Tie' },
  { id: 'professor-pigeon',en: 'Professor Pigeon',   cn: '鸽子教授',   blurb: '三个博士学位，用拉丁语咕咕叫。', rarity: 'Legendary',   price: 7000,   income: 120,  body: '#8c8ca0', belly: '#c8c8d7', hat: 'Mortarboard' },
  { id: 'infinite-burrito',en: 'The Infinite Burrito', cn: '无限卷饼', blurb: '每咬一口都会长回来，科学无法解释。', rarity: 'Mythic',     price: 12000,  income: 200,  body: '#dcaa5a', belly: '#78c85a', hat: 'Foil' },
  { id: 'quantum-quokka',  en: 'Quantum Quokka',     cn: '量子短尾矮袋鼠', blurb: '同时出现在两个地方，两边都在笑。', rarity: 'Mythic',     price: 20000,  income: 320,  body: '#be8c64', belly: '#f0d2aa', hat: 'Antenna' },
  { id: 'lord-loo-roll',   en: 'Lord Loo Roll',      cn: '卷纸勋爵',   blurb: '他见过卷纸的尽头，他就是卷纸。', rarity: 'Brainrot God', price: 45000, income: 600,  body: '#f5f5f5', belly: '#b4dcfa', hat: 'Crown' },
  { id: 'the-algorithm',   en: 'The Algorithm',      cn: '算法',       blurb: '它知道你下一步要买什么，永远是对的。', rarity: 'Secret',    price: 100000, income: 1200, body: '#1e1e28', belly: '#50ffaa', hat: 'Halo' },
];

// ---------- 数值（与原版 GameConfig 一致） ----------
const CONFIG = {
  STARTING_CASH: 100,
  SPAWN_INTERVAL: 7,        // 秒
  MAX_ON_CONVEYOR: 8,
  CONVEYOR_SPEED: 36,       // px/秒（原版 6 studs/秒，约 21 秒走完传送带）
  BASE_SLOTS: 6,
  STEAL_COOLDOWN: 30,       // 秒
  LOCK_COST: 500,
  LOCK_DURATION: 60,        // 秒
  REBIRTH_BASE: 25000,
  REBIRTH_GROWTH: 6,
  REBIRTH_MULTIPLIER: 2,
  TSUNAMI_INTERVAL: 180,    // 秒
  TSUNAMI_WARNING: 15,      // 秒
  TSUNAMI_SWEEP_TIME: 10,   // 秒
  TSUNAMI_CASH_LOSS: 0.10,
};

// ---------- 画布布局 ----------
const W = 960, H = 640;
const BELT = { x0: 100, x1: 860, y: 322, h: 46 };
const BASES = [
  { name: '阿强', color: '#3273e6', cx: 200, cy: 150 },  // 左上 AI
  { name: '小美', color: '#f0cd28', cx: 760, cy: 150 },  // 右上 AI
  { name: '大壮', color: '#32b44b', cx: 760, cy: 500 },  // 右下 AI
  { name: '你',   color: '#dc3232', cx: 200, cy: 500 },  // 左下 玩家
];
const SLOT_DX = 72, SLOT_DY = 58;   // 基地内格子间距（3 列 × 2 行）

// ---------- 工具 ----------
const $ = (id) => document.getElementById(id);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rand = (a, b) => a + Math.random() * (b - a);
const randInt = (a, b) => Math.floor(rand(a, b + 1));
const fmtMoney = (n) => '$' + Math.floor(n).toLocaleString('en-US');
const fmtTime = (s) => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
const rarityOf = (name) => RARITIES.find((r) => r.en === name);
const mutationOf = (name) => MUTATIONS.find((m) => m.en === name);
const charOf = (id) => CHARACTERS.find((c) => c.id === id);
const rebirthCost = (n) => CONFIG.REBIRTH_BASE * Math.pow(CONFIG.REBIRTH_GROWTH, n);
const rebirthMult = (n) => Math.pow(CONFIG.REBIRTH_MULTIPLIER, n);

function pickWeighted(list) {
  let total = 0;
  for (const e of list) total += e.weight;
  let r = Math.random() * total;
  for (const e of list) { r -= e.weight; if (r <= 0) return e; }
  return list[0];
}
function rollCharacter() {
  const r = pickWeighted(RARITIES);
  const pool = CHARACTERS.filter((c) => c.rarity === r.en);
  return pool[Math.floor(Math.random() * pool.length)];
}

// ---------- 状态 ----------
let uidCounter = 0;
const state = {
  started: false,
  time: 0,
  belt: [],           // {uid, charId, mutation, price, income, x}
  spawnTimer: 2,      // 开局先放两个
  incomeAcc: 0,
  saveTimer: 0,
  tsunami: { next: CONFIG.TSUNAMI_INTERVAL, phase: 'idle', warnLeft: 0, wallY: 0, washedBelt: false, caught: {} },
  player: null,       // 见 makeOwner
  ai: [],
  muted: false,
};
function makeOwner(kind, baseIndex, name, color) {
  return {
    kind, baseIndex, name, color,
    cash: CONFIG.STARTING_CASH, rebirths: 0, owned: [], // owned: [{uid, charId, mutation, price, income}]
    lockUntil: 0, lastSteal: -CONFIG.STEAL_COOLDOWN,
    x: BASES[baseIndex].cx, y: BASES[baseIndex].cy,
    tx: BASES[baseIndex].cx, ty: BASES[baseIndex].cy,
    speed: kind === 'player' ? 215 : 150,
    stealTimer: rand(50, 80), buyTimer: rand(0, 2), lockTimer: rand(5, 10), rebirthTimer: rand(4, 8),
    wanderTimer: rand(3, 8),
  };
}
function resetState() {
  state.time = 0;
  state.belt = [];
  state.spawnTimer = 0;
  state.incomeAcc = 0;
  state.saveTimer = 0;
  state.tsunami = { next: CONFIG.TSUNAMI_INTERVAL, phase: 'idle', warnLeft: 0, wallY: 0, washedBelt: false, caught: {} };
  state.player = makeOwner('player', 3, '你', '#dc3232');
  state.ai = [
    makeOwner('ai', 0, '阿强', '#3273e6'),
    makeOwner('ai', 1, '小美', '#f0cd28'),
    makeOwner('ai', 2, '大壮', '#32b44b'),
  ];
  // 开局传送带上先放两个
  spawnBrainrot();
  spawnBrainrot();
}
function ownedIncome(owner) {
  let total = 0;
  for (const e of owner.owned) total += e.income;
  return total * rebirthMult(owner.rebirths);
}
function freeSlot(owner) {
  return owner.owned.length < CONFIG.BASE_SLOTS;
}
function slotPos(baseIndex, slotIndex) {
  const b = BASES[baseIndex];
  const col = slotIndex % 3, row = Math.floor(slotIndex / 3);
  return { x: b.cx + (col - 1) * SLOT_DX, y: b.cy - SLOT_DY / 2 + row * SLOT_DY };
}
function baseLocked(owner, now) { return owner.lockUntil > now; }
function baseRect(baseIndex) {
  const b = BASES[baseIndex];
  return { x0: b.cx - 120, x1: b.cx + 120, y0: b.cy - 82, y1: b.cy + 82 };
}
function insideBase(owner, x, y) {
  const r = baseRect(owner.baseIndex);
  return x >= r.x0 && x <= r.x1 && y >= r.y0 && y <= r.y1;
}

// ---------- 存档 ----------
const SAVE_KEY = 'brainrot-bay-cn-save-v1';
function saveGame() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      cash: state.player.cash,
      rebirths: state.player.rebirths,
      owned: state.player.owned.map((e) => ({ charId: e.charId, mutation: e.mutation })),
    }));
  } catch (e) { /* 存档失败不影响游戏 */ }
}
function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw);
    if (typeof d.cash !== 'number' || !Array.isArray(d.owned)) return null;
    return d;
  } catch (e) { return null; }
}
function applySave(d) {
  state.player.cash = d.cash;
  state.player.rebirths = d.rebirths || 0;
  state.player.owned = [];
  for (const o of d.owned.slice(0, CONFIG.BASE_SLOTS)) {
    const ch = charOf(o.charId);
    if (!ch) continue;
    const mut = mutationOf(o.mutation) || MUTATIONS[0];
    state.player.owned.push({
      uid: 'SAVE-' + (uidCounter++), charId: ch.id, mutation: mut.en,
      price: ch.price * mut.mult, income: ch.income * mut.mult,
    });
  }
}

// ---------- 提示气泡 ----------
function toast(text, kind) {
  const box = $('toasts');
  const el = document.createElement('div');
  el.className = 'toast ' + (kind || 'info');
  el.textContent = text;
  box.appendChild(el);
  while (box.children.length > 3) box.removeChild(box.firstChild);
  setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, 4500);
}

// ---------- 音效（WebAudio 合成，无外部文件） ----------
let audioCtx = null;
function beep(freq, dur, type, gain, delay) {
  if (state.muted) return;
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const t = audioCtx.currentTime + (delay || 0);
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.type = type || 'sine'; o.frequency.value = freq;
    g.gain.setValueAtTime(gain || 0.08, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(audioCtx.destination);
    o.start(t); o.stop(t + dur);
  } catch (e) { /* 音效失败不影响游戏 */ }
}
const sfxBuy = () => { beep(660, 0.1, 'sine', 0.09); beep(880, 0.14, 'sine', 0.09, 0.09); };
const sfxSteal = () => { beep(520, 0.1, 'square', 0.05); beep(320, 0.16, 'square', 0.05, 0.1); };
const sfxWarn = () => { beep(440, 0.25, 'sawtooth', 0.05); beep(440, 0.25, 'sawtooth', 0.05, 0.3); beep(440, 0.25, 'sawtooth', 0.05, 0.6); };
const sfxRebirth = () => { [523, 659, 784, 1046].forEach((f, i) => beep(f, 0.16, 'triangle', 0.09, i * 0.11)); };

// ---------- 传送带 ----------
function spawnBrainrot() {
  if (state.belt.length >= CONFIG.MAX_ON_CONVEYOR) return;
  const ch = rollCharacter();
  const mut = pickWeighted(MUTATIONS);
  state.belt.push({
    uid: 'BR-' + (uidCounter++),
    charId: ch.id, mutation: mut.en,
    price: ch.price * mut.mult, income: ch.income * mut.mult,
    x: BELT.x0, y: BELT.y,
  });
}
function updateBelt(dt) {
  state.spawnTimer -= dt;
  if (state.spawnTimer <= 0) { spawnBrainrot(); state.spawnTimer = CONFIG.SPAWN_INTERVAL; }
  for (let i = state.belt.length - 1; i >= 0; i--) {
    const b = state.belt[i];
    b.x += CONFIG.CONVEYOR_SPEED * dt;
    if (b.x >= BELT.x1) state.belt.splice(i, 1); // 走出传送带，消失
  }
}

// ---------- 购买 / 偷取 / 锁定 / 转生 ----------
function buyBrainrot(owner, entry) {
  if (!freeSlot(owner)) { if (owner.kind === 'player') toast('基地满了！你的基地只能放 6 个脑腐，先转生腾地方吧。', 'warn'); return false; }
  if (owner.cash < entry.price) { if (owner.kind === 'player') toast('钱不够！这个要 ' + fmtMoney(entry.price) + '。', 'warn'); return false; }
  const idx = state.belt.indexOf(entry);
  if (idx < 0) { if (owner.kind === 'player') toast('太慢了！它已经走下传送带了。', 'warn'); return false; }
  state.belt.splice(idx, 1);
  owner.cash -= entry.price;
  owner.owned.push({ uid: entry.uid, charId: entry.charId, mutation: entry.mutation, price: entry.price, income: entry.income });
  const ch = charOf(entry.charId);
  if (owner.kind === 'player') {
    toast('买到了！' + ch.cn + ' 开始为你赚钱，每秒 ' + fmtMoney(entry.income) + '。', 'success');
    sfxBuy();
  }
  saveGame();
  return true;
}
function stealBrainrot(thief, victim, entry) {
  if (!freeSlot(thief)) { if (thief.kind === 'player') toast('基地满了！先腾个位置再偷。', 'warn'); return false; }
  if (state.time - thief.lastSteal < CONFIG.STEAL_COOLDOWN) {
    if (thief.kind === 'player') toast('偷取冷却中，还要等 ' + Math.ceil(CONFIG.STEAL_COOLDOWN - (state.time - thief.lastSteal)) + ' 秒。', 'warn');
    return false;
  }
  if (baseLocked(victim, state.time)) {
    if (thief.kind === 'player') toast('🔒 ' + victim.name + ' 的基地锁着呢，偷不了！', 'warn');
    return false;
  }
  const idx = victim.owned.indexOf(entry);
  if (idx < 0) return false;
  victim.owned.splice(idx, 1);
  thief.lastSteal = state.time;
  thief.owned.push(entry);
  const ch = charOf(entry.charId);
  if (thief.kind === 'player') {
    toast('🥷 得手！你从 ' + victim.name + ' 家偷走了' + ch.cn + '！', 'success');
    sfxSteal();
  } else if (victim.kind === 'player') {
    toast('⚠️ ' + thief.name + ' 偷走了你的' + ch.cn + '！花 $500 锁基地防偷！', 'warn');
    sfxSteal();
  }
  saveGame();
  return true;
}
function buyLock(owner) {
  if (owner.cash < CONFIG.LOCK_COST) { if (owner.kind === 'player') toast('钱不够！锁定基地要 $500。', 'warn'); return false; }
  if (baseLocked(owner, state.time)) { if (owner.kind === 'player') toast('基地已经锁着呢，还剩 ' + Math.ceil(owner.lockUntil - state.time) + ' 秒。', 'info'); return false; }
  owner.cash -= CONFIG.LOCK_COST;
  owner.lockUntil = state.time + CONFIG.LOCK_DURATION;
  if (owner.kind === 'player') { toast('🔒 基地已锁定 60 秒，谁也偷不走你的角色！', 'success'); sfxBuy(); }
  saveGame();
  return true;
}
function buyRebirth(owner) {
  const cost = rebirthCost(owner.rebirths);
  if (owner.cash < cost) { if (owner.kind === 'player') toast('钱不够！第 ' + (owner.rebirths + 1) + ' 次转生要 ' + fmtMoney(cost) + '。', 'warn'); return false; }
  owner.owned = [];
  owner.cash = 0;
  owner.rebirths += 1;
  if (owner.kind === 'player') {
    toast('🔄 转生成功！收入永久 ×' + rebirthMult(owner.rebirths) + '，从头再来赚更多！', 'success');
    sfxRebirth();
  }
  saveGame();
  return true;
}

// ---------- AI 邻居 ----------
function aiDecide(ai, dt) {
  // 逛：没事就在自家基地附近走走
  ai.wanderTimer -= dt;
  if (ai.wanderTimer <= 0) {
    ai.wanderTimer = rand(4, 9);
    const b = BASES[ai.baseIndex];
    ai.tx = clamp(b.cx + rand(-110, 110), 40, W - 40);
    ai.ty = clamp(b.cy + rand(-70, 70), 40, H - 40);
  }
  // 买：每 2 秒看一次传送带，挑性价比最高的买得起的
  ai.buyTimer -= dt;
  if (ai.buyTimer <= 0) {
    ai.buyTimer = 2;
    if (freeSlot(ai) && state.belt.length) {
      let best = null, bestRatio = 0;
      for (const e of state.belt) {
        if (e.price > ai.cash) continue;
        const ratio = e.income / e.price;
        if (ratio > bestRatio) { bestRatio = ratio; best = e; }
      }
      if (best && bestRatio > 0.004 && Math.random() < 0.65) buyBrainrot(ai, best);
    }
  }
  // 偷：每 50~80 秒尝试一次，优先偷玩家（前 60 秒不偷玩家，留新手期）
  ai.stealTimer -= dt;
  if (ai.stealTimer <= 0) {
    ai.stealTimer = rand(50, 80);
    if (state.time - ai.lastSteal >= CONFIG.STEAL_COOLDOWN && freeSlot(ai)) {
      const victim = Math.random() < 0.55 ? state.player : state.ai[Math.floor(Math.random() * state.ai.length)];
      if (victim !== ai && victim.owned.length && !baseLocked(victim, state.time) && !(victim.kind === 'player' && state.time < 60)) {
        let best = victim.owned[0];
        for (const e of victim.owned) if (e.income > best.income) best = e;
        stealBrainrot(ai, victim, best);
      }
    }
  }
  // 锁：有值钱角色又有钱时，偶尔锁基地
  ai.lockTimer -= dt;
  if (ai.lockTimer <= 0) {
    ai.lockTimer = 10;
    const hasValuable = ai.owned.some((e) => ['Legendary', 'Mythic', 'Brainrot God', 'Secret'].includes(charOf(e.charId).rarity));
    if (!baseLocked(ai, state.time) && ai.cash > 600 && hasValuable && Math.random() < 0.15) buyLock(ai);
  }
  // 转生：钱够了偶尔转生
  ai.rebirthTimer -= dt;
  if (ai.rebirthTimer <= 0) {
    ai.rebirthTimer = 5;
    if (ai.cash >= rebirthCost(ai.rebirths) && Math.random() < 0.4) buyRebirth(ai);
  }
}

// ---------- 海啸 ----------
function startTsunamiWarning() {
  const t = state.tsunami;
  t.phase = 'warning';
  t.warnLeft = CONFIG.TSUNAMI_WARNING;
  $('wave-banner').classList.remove('hidden');
  toast('🌊 海啸要来了！快回自己的基地！', 'tsunami');
  sfxWarn();
}
function updateTsunami(dt) {
  const t = state.tsunami;
  if (t.phase === 'idle') {
    t.next -= dt;
    if (t.next <= 0) startTsunamiWarning();
    return;
  }
  if (t.phase === 'warning') {
    t.warnLeft -= dt;
    $('wave-count').textContent = Math.max(0, Math.ceil(t.warnLeft));
    // AI 邻居闻风回基地
    for (const ai of state.ai) { ai.tx = BASES[ai.baseIndex].cx; ai.ty = BASES[ai.baseIndex].cy; }
    if (t.warnLeft <= 0) {
      t.phase = 'sweep';
      t.wallY = 20;
      t.washedBelt = false;
      t.caught = {};
      $('wave-banner').classList.add('hidden');
      toast('🌊 巨浪来了！', 'tsunami');
    }
    return;
  }
  // sweep：巨浪从上往下扫过整张地图
  t.wallY += (H - 40) / CONFIG.TSUNAMI_SWEEP_TIME * dt;
  if (!t.washedBelt && t.wallY >= BELT.y) {
    t.washedBelt = true;
    const n = state.belt.length;
    state.belt = [];
    if (n) toast('🌊 巨浪冲过传送带，' + n + ' 个角色被冲走了！', 'warn');
  }
  const p = state.player;
  if (!t.caught.player && t.wallY >= p.y - 10) {
    if (!insideBase(p, p.x, p.y)) {
      t.caught.player = true;
      const lost = Math.floor(p.cash * CONFIG.TSUNAMI_CASH_LOSS);
      p.cash -= lost;
      p.x = BASES[p.baseIndex].cx; p.y = BASES[p.baseIndex].cy;
      p.tx = p.x; p.ty = p.y;
      toast('🌊 你被巨浪冲走了！丢了 ' + fmtMoney(lost) + '，下次警告一响就回基地！', 'warn');
      saveGame();
    } else {
      t.caught.player = true; // 安全通过，不再判定
    }
  }
  if (t.wallY >= H - 20) {
    t.phase = 'idle';
    t.next = CONFIG.TSUNAMI_INTERVAL;
    toast('🌊 海浪退去了，传送带又开始运转！', 'info');
  }
}

// ---------- 移动 ----------
const keys = {};
window.addEventListener('keydown', (e) => {
  keys[e.key.toLowerCase()] = true;
  if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(e.key.toLowerCase())) e.preventDefault();
});
window.addEventListener('keyup', (e) => { keys[e.key.toLowerCase()] = false; });
function moveOwner(owner, dt) {
  let dx = 0, dy = 0;
  if (owner.kind === 'player') {
    if (keys['w'] || keys['arrowup']) dy -= 1;
    if (keys['s'] || keys['arrowdown']) dy += 1;
    if (keys['a'] || keys['arrowleft']) dx -= 1;
    if (keys['d'] || keys['arrowright']) dx += 1;
  }
  if (dx || dy) {
    const len = Math.hypot(dx, dy);
    owner.x = clamp(owner.x + dx / len * owner.speed * dt, 36, W - 36);
    owner.y = clamp(owner.y + dy / len * owner.speed * dt, 36, H - 36);
    owner.tx = owner.x; owner.ty = owner.y;
    return;
  }
  const ddx = owner.tx - owner.x, ddy = owner.ty - owner.y;
  const dist = Math.hypot(ddx, ddy);
  if (dist > 3) {
    const step = Math.min(dist, owner.speed * dt);
    owner.x += ddx / dist * step;
    owner.y += ddy / dist * step;
  }
}

// ---------- 主循环 ----------
const canvas = $('game');
const ctx = canvas.getContext('2d');
let lastTs = 0;
function loop(ts) {
  const dt = Math.min(0.05, (ts - lastTs) / 1000 || 0.016);
  lastTs = ts;
  if (state.started) {
    state.time += dt;
    updateBelt(dt);
    // 收入：每秒结算一次
    state.incomeAcc += dt;
    if (state.incomeAcc >= 1) {
      const ticks = Math.floor(state.incomeAcc);
      state.incomeAcc -= ticks;
      for (const o of [state.player, ...state.ai]) o.cash += ownedIncome(o) * ticks;
    }
    for (const ai of state.ai) aiDecide(ai, dt);
    updateTsunami(dt);
    moveOwner(state.player, dt);
    for (const ai of state.ai) moveOwner(ai, dt);
    state.saveTimer += dt;
    if (state.saveTimer >= 5) { state.saveTimer = 0; saveGame(); }
    updateHUD();
  }
  render();
  requestAnimationFrame(loop);
}

// ---------- HUD ----------
function updateHUD() {
  const p = state.player;
  $('hud-cash').textContent = fmtMoney(p.cash);
  $('hud-income').textContent = fmtMoney(ownedIncome(p)) + '/s';
  $('hud-owned').textContent = p.owned.length + ' / ' + CONFIG.BASE_SLOTS;
  $('hud-rebirth').textContent = p.rebirths + ' 次 · 收入 ×' + rebirthMult(p.rebirths);
  const t = state.tsunami;
  $('hud-wave').textContent = t.phase === 'idle' ? fmtTime(Math.max(0, t.next)) : (t.phase === 'warning' ? '⚠️ ' + Math.ceil(t.warnLeft) + 's' : '🌊 来袭！');
  const stealLeft = Math.max(0, CONFIG.STEAL_COOLDOWN - (state.time - p.lastSteal));
  $('hud-steal').textContent = stealLeft > 0 ? '冷却 ' + Math.ceil(stealLeft) + 's' : '就绪';
  const lockBtn = $('btn-lock');
  if (baseLocked(p, state.time)) {
    lockBtn.textContent = '🔒 已锁定（剩 ' + Math.ceil(p.lockUntil - state.time) + 's）';
    lockBtn.disabled = true;
  } else {
    lockBtn.textContent = '🔒 锁定基地 ($500 · 60秒)';
    lockBtn.disabled = p.cash < CONFIG.LOCK_COST;
  }
  const rbBtn = $('btn-rebirth');
  const cost = rebirthCost(p.rebirths);
  rbBtn.textContent = '🔄 转生 (' + fmtMoney(cost) + ')';
  rbBtn.disabled = p.cash < cost;
}

// ---------- 画角色 ----------
function roundRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
function drawHat(hat, x, y, s) {
  // x,y 为头部中心，s 为缩放（身体宽约 30*s）
  ctx.fillStyle = '#222';
  switch (hat) {
    case 'Bowl': // 碗
      ctx.fillStyle = '#f2f2f2';
      ctx.beginPath(); ctx.ellipse(x, y - 13 * s, 13 * s, 4 * s, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#e0a050';
      ctx.fillRect(x - 8 * s, y - 16 * s, 16 * s, 3 * s);
      break;
    case 'Crown': // 皇冠
      ctx.fillStyle = '#ffd700';
      ctx.beginPath();
      ctx.moveTo(x - 11 * s, y - 6 * s); ctx.lineTo(x - 11 * s, y - 15 * s);
      ctx.lineTo(x - 5 * s, y - 9 * s); ctx.lineTo(x, y - 17 * s);
      ctx.lineTo(x + 5 * s, y - 9 * s); ctx.lineTo(x + 11 * s, y - 15 * s);
      ctx.lineTo(x + 11 * s, y - 6 * s); ctx.closePath(); ctx.fill();
      break;
    case 'Tie': // 领带（画在肚皮上）
      ctx.fillStyle = '#dc2828';
      ctx.beginPath();
      ctx.moveTo(x - 3 * s, y + 2 * s); ctx.lineTo(x + 3 * s, y + 2 * s);
      ctx.lineTo(x + 4 * s, y + 12 * s); ctx.lineTo(x, y + 16 * s);
      ctx.lineTo(x - 4 * s, y + 12 * s); ctx.closePath(); ctx.fill();
      break;
    case 'Headphones': // 耳机
      ctx.strokeStyle = '#282832'; ctx.lineWidth = 3 * s;
      ctx.beginPath(); ctx.arc(x, y - 4 * s, 12 * s, Math.PI, 0); ctx.stroke();
      ctx.fillStyle = '#282832';
      ctx.fillRect(x - 15 * s, y - 6 * s, 5 * s, 9 * s);
      ctx.fillRect(x + 10 * s, y - 6 * s, 5 * s, 9 * s);
      break;
    case 'Swirl': // 漩涡
      ctx.fillStyle = '#78c8f0';
      ctx.beginPath(); ctx.arc(x, y - 13 * s, 7 * s, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(x - 2 * s, y - 14 * s, 3 * s, 0, Math.PI * 2); ctx.fill();
      break;
    case 'Bun': // 发髻
      ctx.fillStyle = '#784628';
      ctx.beginPath(); ctx.arc(x, y - 13 * s, 6 * s, 0, Math.PI * 2); ctx.fill();
      break;
    case 'Mortarboard': // 学士帽
      ctx.fillStyle = '#19191e';
      ctx.fillRect(x - 13 * s, y - 16 * s, 26 * s, 4 * s);
      ctx.fillStyle = '#ffd700';
      ctx.fillRect(x + 11 * s, y - 16 * s, 2 * s, 8 * s);
      break;
    case 'Foil': // 锡纸
      ctx.fillStyle = '#d2d7dc';
      ctx.beginPath(); ctx.ellipse(x, y - 12 * s, 13 * s, 4 * s, 0, 0, Math.PI * 2); ctx.fill();
      break;
    case 'Antenna': // 天线
      ctx.strokeStyle = '#3c3c46'; ctx.lineWidth = 2 * s;
      ctx.beginPath(); ctx.moveTo(x, y - 10 * s); ctx.lineTo(x, y - 20 * s); ctx.stroke();
      ctx.fillStyle = '#ff5a5a';
      ctx.beginPath(); ctx.arc(x, y - 22 * s, 4 * s, 0, Math.PI * 2); ctx.fill();
      break;
    case 'Halo': // 光环
      ctx.strokeStyle = '#ffe678'; ctx.lineWidth = 3 * s;
      ctx.beginPath(); ctx.ellipse(x, y - 15 * s, 11 * s, 3.5 * s, 0, 0, Math.PI * 2); ctx.stroke();
      break;
  }
}
function drawCharacter(ch, mutation, x, y, s, label, labelDy) {
  const mut = mutationOf(mutation);
  // 影子
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.beginPath(); ctx.ellipse(x, y + 24 * s, 16 * s, 5 * s, 0, 0, Math.PI * 2); ctx.fill();
  // 变异光晕
  if (mut.en !== 'Normal') {
    ctx.save();
    ctx.globalAlpha = 0.55 + 0.25 * Math.sin(Date.now() / 300);
    ctx.strokeStyle = mut.en === 'Rainbow' ? `hsl(${(Date.now() / 12) % 360}, 90%, 65%)` : mut.tint;
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(x, y + 2 * s, 26 * s, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  }
  // 身体 + 肚皮
  ctx.fillStyle = ch.body;
  roundRect(x - 15 * s, y - 8 * s, 30 * s, 28 * s, 8 * s); ctx.fill();
  ctx.fillStyle = ch.belly;
  roundRect(x - 10 * s, y - 2 * s, 20 * s, 18 * s, 6 * s); ctx.fill();
  // 头 + 眼睛
  ctx.fillStyle = ch.body;
  ctx.beginPath(); ctx.arc(x, y - 14 * s, 12 * s, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#141414';
  ctx.beginPath(); ctx.arc(x - 5 * s, y - 15 * s, 2.2 * s, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 5 * s, y - 15 * s, 2.2 * s, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(x - 4.2 * s, y - 15.8 * s, 0.8 * s, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 5.8 * s, y - 15.8 * s, 0.8 * s, 0, Math.PI * 2); ctx.fill();
  // 帽子
  drawHat(ch.hat, x, y, s);
  // 标签（横向夹在画布内，避免贴边被切）
  if (label) {
    const ly = y - 52 * s + (labelDy || 0);
    ctx.font = 'bold 11px "PingFang SC", "Microsoft YaHei", sans-serif';
    const w = ctx.measureText(label).width + 12;
    const lx = clamp(x - w / 2, 4, W - w - 4);
    ctx.fillStyle = 'rgba(10,14,20,0.85)';
    roundRect(lx, ly, w, 17, 8); ctx.fill();
    ctx.fillStyle = rarityOf(ch.rarity).color;
    ctx.beginPath(); ctx.arc(lx + 7, ly + 8.5, 3.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText(label, lx + 13, ly + 9);
  }
}
function drawAvatar(owner, x, y) {
  // 玩家 / AI 的小人：彩色圆身 + 脸 + 名字
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.beginPath(); ctx.ellipse(x, y + 14, 12, 4, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = owner.color;
  ctx.beginPath(); ctx.arc(x, y, 13, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(x - 4.5, y - 2, 3.4, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 4.5, y - 2, 3.4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#141414';
  ctx.beginPath(); ctx.arc(x - 4.5, y - 2, 1.7, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 4.5, y - 2, 1.7, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#141414'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(x, y + 3, 4, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
  ctx.font = 'bold 11px "PingFang SC", "Microsoft YaHei", sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const w = ctx.measureText(owner.name).width + 10;
  ctx.fillStyle = 'rgba(10,14,20,0.8)';
  roundRect(x - w / 2, y - 30, w, 15, 7); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.fillText(owner.name, x, y - 22);
}
function drawPalm(x, y, s) {
  ctx.strokeStyle = '#8a6b3f'; ctx.lineWidth = 5 * s;
  ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 4 * s, y - 18 * s, x + 2 * s, y - 30 * s); ctx.stroke();
  ctx.fillStyle = '#2fae5f';
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + (i - 2) * 0.55;
    ctx.beginPath();
    ctx.ellipse(x + 2 * s + Math.cos(a) * 14 * s, y - 30 * s + Math.sin(a) * 9 * s, 13 * s, 4.5 * s, a, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#8a5a2b';
  ctx.beginPath(); ctx.arc(x - 4 * s, y - 26 * s, 3 * s, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 8 * s, y - 24 * s, 3 * s, 0, Math.PI * 2); ctx.fill();
}

// ---------- 渲染 ----------
function render() {
  // 海洋
  const ocean = ctx.createLinearGradient(0, 0, 0, H);
  ocean.addColorStop(0, '#1d7fc4'); ocean.addColorStop(0.5, '#2fa3d8'); ocean.addColorStop(1, '#1d7fc4');
  ctx.fillStyle = ocean; ctx.fillRect(0, 0, W, H);
  // 海浪纹
  ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 2;
  for (let i = 0; i < 6; i++) {
    const yy = 12 + i * 8 + Math.sin(Date.now() / 900 + i) * 2;
    ctx.beginPath();
    for (let x = 0; x <= W; x += 24) ctx.lineTo(x, yy + Math.sin(x / 60 + i * 2) * 2);
    ctx.stroke();
  }
  // 岛屿沙滩
  ctx.fillStyle = '#f2dc9e';
  roundRect(20, 20, W - 40, H - 40, 36); ctx.fill();
  ctx.fillStyle = 'rgba(190,160,90,0.35)';
  for (const [sx, sy, sr] of [[120, 260, 26], [840, 380, 30], [480, 120, 22], [480, 560, 24], [300, 420, 18], [680, 230, 20]]) {
    ctx.beginPath(); ctx.ellipse(sx, sy, sr, sr * 0.6, 0, 0, Math.PI * 2); ctx.fill();
  }
  // 棕榈树
  drawPalm(52, 96, 1); drawPalm(908, 96, 1); drawPalm(52, 560, 1); drawPalm(908, 560, 1);
  drawPalm(480, 52, 0.9); drawPalm(480, 600, 0.9);

  // 基地
  for (const owner of [state.ai[0], state.ai[1], state.ai[2], state.player]) {
    if (!owner) continue;
    const b = BASES[owner.baseIndex];
    const locked = baseLocked(owner, state.time);
    ctx.fillStyle = owner.color;
    ctx.globalAlpha = 0.92;
    roundRect(b.cx - 120, b.cy - 82, 240, 164, 14); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = 'rgba(255,255,255,0.75)'; ctx.lineWidth = 2;
    roundRect(b.cx - 120, b.cy - 82, 240, 164, 14); ctx.stroke();
    // 格子
    ctx.strokeStyle = 'rgba(255,255,255,0.45)';
    for (let s = 0; s < CONFIG.BASE_SLOTS; s++) {
      const p = slotPos(owner.baseIndex, s);
      ctx.strokeRect(p.x - 26, p.y - 24, 52, 48);
    }
    // 基地名 + 状态
    ctx.font = 'bold 14px "PingFang SC", "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fff';
    let title = owner.name + '的基地';
    if (owner.kind === 'player') title = '🏠 你的基地';
    if (locked) title += ' 🔒' + Math.ceil(owner.lockUntil - state.time) + 's';
    ctx.fillText(title, b.cx, b.cy - 68);
    // 基地里的角色（中间列的标签抬高 18px，避免相邻标签互相遮挡；只画前 6 个格子）
    owner.owned.slice(0, CONFIG.BASE_SLOTS).forEach((e, i) => {
      const p = slotPos(owner.baseIndex, i);
      const ch = charOf(e.charId);
      const label = ch.cn + ' ' + e.income + '/s';
      drawCharacter(ch, e.mutation, p.x, p.y, 0.85, label, (i % 3 === 1) ? -18 : 0);
    });
  }

  // 传送带
  ctx.fillStyle = '#3a3f4a';
  roundRect(BELT.x0 - 44, BELT.y - BELT.h / 2, BELT.x1 - BELT.x0 + 88, BELT.h, 10); ctx.fill();
  ctx.strokeStyle = '#222'; ctx.lineWidth = 2;
  roundRect(BELT.x0 - 44, BELT.y - BELT.h / 2, BELT.x1 - BELT.x0 + 88, BELT.h, 10); ctx.stroke();
  // 滚动箭头
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  const off = (Date.now() / 40) % 36;
  for (let x = BELT.x0 - 30 + off; x < BELT.x1 + 30; x += 36) {
    ctx.beginPath();
    ctx.moveTo(x, BELT.y - 8); ctx.lineTo(x + 10, BELT.y); ctx.lineTo(x, BELT.y + 8);
    ctx.lineTo(x + 4, BELT.y); ctx.closePath(); ctx.fill();
  }
  // 起点绿垫 / 终点红垫
  ctx.fillStyle = '#37c978'; roundRect(BELT.x0 - 44, BELT.y - BELT.h / 2, 40, BELT.h, 8); ctx.fill();
  ctx.fillStyle = '#e84c3d'; roundRect(BELT.x1 + 4, BELT.y - BELT.h / 2, 40, BELT.h, 8); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('入', BELT.x0 - 24, BELT.y + 1);
  ctx.fillText('出', BELT.x1 + 24, BELT.y + 1);
  // 传送带上的角色
  for (const e of state.belt) {
    const ch = charOf(e.charId);
    const mut = mutationOf(e.mutation);
    const label = (mut.en !== 'Normal' ? mut.cn + ' ' : '') + ch.cn + ' · ' + fmtMoney(e.price);
    drawCharacter(ch, e.mutation, e.x, e.y, 0.95, label);
  }

  // 小人
  for (const ai of state.ai) drawAvatar(ai, ai.x, ai.y);
  if (state.player) drawAvatar(state.player, state.player.x, state.player.y);
  // 玩家移动目标小圈
  const p = state.player;
  if (p && (Math.abs(p.tx - p.x) > 3 || Math.abs(p.ty - p.y) > 3)) {
    ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(p.tx, p.ty, 7, 0, Math.PI * 2); ctx.stroke();
  }

  // 海啸巨浪
  const t = state.tsunami;
  if (t.phase === 'sweep') {
    const g = ctx.createLinearGradient(0, t.wallY - 60, 0, t.wallY + 10);
    g.addColorStop(0, 'rgba(25,115,220,0.15)');
    g.addColorStop(0.75, 'rgba(25,115,220,0.75)');
    g.addColorStop(1, 'rgba(25,115,220,0.95)');
    ctx.fillStyle = g;
    ctx.fillRect(0, Math.max(0, t.wallY - 60), W, 70);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, t.wallY + 6, W, 5);
  }
}

// ---------- 点击 ----------
function canvasPos(e) {
  const r = canvas.getBoundingClientRect();
  return { x: (e.clientX - r.left) * (W / r.width), y: (e.clientY - r.top) * (H / r.height) };
}
canvas.addEventListener('click', (e) => {
  if (!state.started) return;
  const pos = canvasPos(e);
  // 1) 点传送带上的角色 → 购买
  for (const entry of state.belt) {
    if (Math.abs(pos.x - entry.x) < 32 && Math.abs(pos.y - entry.y) < 34) {
      buyBrainrot(state.player, entry);
      return;
    }
  }
  // 2) 点邻居基地里的角色 → 偷取
  for (const ai of state.ai) {
    for (const entry of ai.owned) {
      const idx = ai.owned.indexOf(entry);
      const sp = slotPos(ai.baseIndex, idx);
      if (Math.abs(pos.x - sp.x) < 30 && Math.abs(pos.y - sp.y) < 30) {
        stealBrainrot(state.player, ai, entry);
        return;
      }
    }
  }
  // 3) 否则：走过去
  state.player.tx = clamp(pos.x, 36, W - 36);
  state.player.ty = clamp(pos.y, 36, H - 36);
});

// ---------- 按钮与面板 ----------
$('btn-lock').addEventListener('click', () => { if (state.started) buyLock(state.player); });
$('btn-rebirth').addEventListener('click', () => {
  if (!state.started) return;
  const cost = rebirthCost(state.player.rebirths);
  if (state.player.cash >= cost && window.confirm('转生会清空基地和现金，换永久 ×' + rebirthMult(state.player.rebirths + 1) + ' 收入，确定吗？')) {
    buyRebirth(state.player);
  }
});
$('btn-mute').addEventListener('click', (e) => {
  state.muted = !state.muted;
  e.target.textContent = state.muted ? '🔇 静音' : '🔊 音效';
});
$('btn-help').addEventListener('click', () => $('help-modal').classList.remove('hidden'));
$('btn-close-help').addEventListener('click', () => $('help-modal').classList.add('hidden'));
$('btn-reset').addEventListener('click', () => {
  if (window.confirm('确定清除存档、从头开始吗？')) {
    try { localStorage.removeItem(SAVE_KEY); } catch (e) {}
    location.reload();
  }
});
$('start-btn').addEventListener('click', () => {
  $('start-screen').classList.add('hidden');
  state.started = true;
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  toast('欢迎来到脑腐海湾！点传送带上的角色，把它买回家赚钱吧！', 'info');
});

// 图鉴与稀有度（从数据生成）
(function buildHelp() {
  $('rarity-list').innerHTML = RARITIES.map((r) =>
    '<span class="rarity-chip" style="background:' + r.color + '">' + r.cn + '</span>').join('') +
    '<br><span style="color:#cfeaff">变异：普通 ×1、黄金 ×2、钻石 ×5、彩虹 ×10</span>';
  $('catalog-list').innerHTML = CHARACTERS.map((c) => {
    const r = rarityOf(c.rarity);
    return '<div class="catalog-item"><b>' + c.cn + '</b> <span class="en">' + c.en + '</span><br>' +
      '<span style="color:' + r.color + '">● ' + r.cn + '</span> · ' + fmtMoney(c.price) + ' · ' + fmtMoney(c.income) + '/s<br>' +
      '<span style="color:#cfeaff">' + c.blurb + '</span></div>';
  }).join('');
})();

// ---------- 启动 ----------
(function init() {
  const save = loadSave();
  resetState();
  if (save) {
    applySave(save);
    $('save-note').textContent = '已读取上次存档：现金 ' + fmtMoney(state.player.cash) + '，' + state.player.owned.length + ' 个角色，转生 ' + state.player.rebirths + ' 次。';
  }
  // 测试用：?wave=秒数 可缩短第一次海啸（默认 180 秒）
  const waveParam = new URLSearchParams(location.search).get('wave');
  if (waveParam) {
    const n = parseInt(waveParam, 10);
    if (n > 0) state.tsunami.next = n;
  }
  updateHUD();
  requestAnimationFrame(loop);
})();

// ---------- 调试图柄（供实测用） ----------
window.__brainrot = {
  state,
  addCash(n) { state.player.cash += n; updateHUD(); return state.player.cash; },
  spawn(charId, mutation) {
    const ch = charOf(charId) || CHARACTERS[0];
    const mut = mutationOf(mutation) || MUTATIONS[0];
    state.belt.push({ uid: 'DBG-' + (uidCounter++), charId: ch.id, mutation: mut.en,
      price: ch.price * mut.mult, income: ch.income * mut.mult, x: 300, y: BELT.y });
    return state.belt.length;
  },
  triggerTsunami() { state.tsunami.next = 0; },
  start() { $('start-screen').classList.add('hidden'); state.started = true; },
  stats() {
    return {
      started: state.started, time: Math.round(state.time),
      cash: Math.floor(state.player.cash), owned: state.player.owned.length,
      income: ownedIncome(state.player), belt: state.belt.length,
      aiOwned: state.ai.map((a) => a.owned.length),
      tsunamiPhase: state.tsunami.phase, waveIn: Math.round(state.tsunami.next),
    };
  },
};
