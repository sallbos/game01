/* ============================================================
   SALEH GAMING — script.js
   Main navigation, game launcher, PWA, filtering
   ============================================================ */

'use strict';

// ── Game Data ──────────────────────────────────────────────────
const GAMES = [
  // ── Original 10 Games ──────────────────────────────────────
  {
    id: 'snake',
    title: 'Snake',
    emoji: '🐍',
    tags: ['classic'],
    desc: 'Classic snake game. Eat food, grow longer, avoid walls and yourself!',
    instructions: '🎮 Desktop: Arrow Keys / WASD to move. 📱 Mobile: Swipe to change direction. Eat the food to grow. Avoid hitting walls and your own tail!',
    bg: 'game-bg-snake'
  },
  {
    id: '2048',
    title: '2048',
    emoji: '🔢',
    tags: ['puzzle'],
    desc: 'Slide tiles, combine matching numbers, and reach 2048!',
    instructions: '🎮 Desktop: Arrow Keys to slide tiles. 📱 Mobile: Swipe to slide. Combine equal numbers to double them. Reach 2048 to win!',
    bg: 'game-bg-2048'
  },
  {
    id: 'tictactoe',
    title: 'Tic Tac Toe',
    emoji: '❌',
    tags: ['classic', 'strategy'],
    desc: 'Play against a smart AI opponent. Get 3 in a row to win!',
    instructions: '🎮 Click / Tap any empty cell to place your X. The AI plays O. Get 3 in a row — horizontal, vertical, or diagonal — to win! You go first.',
    bg: 'game-bg-tictactoe'
  },
  {
    id: 'memory',
    title: 'Memory Cards',
    emoji: '🃏',
    tags: ['puzzle'],
    desc: 'Flip cards and find matching pairs. Test your memory!',
    instructions: '🎮 Click / Tap cards to flip them. Find all matching pairs. Try to complete the board in as few moves as possible! Cards hide again after a brief delay if they don\'t match.',
    bg: 'game-bg-memory'
  },
  {
    id: 'space-shooter',
    title: 'Space Shooter',
    emoji: '🚀',
    tags: ['arcade', 'action'],
    desc: 'Defend Earth! Shoot enemy ships in this arcade space shooter.',
    instructions: '🎮 Desktop: ← → Arrow Keys / A D to move. Space to shoot. 📱 Mobile: Tap left/right side to move, tap center to shoot. Destroy enemies before they reach you!',
    bg: 'game-bg-spaceshooter'
  },
  {
    id: 'flappy',
    title: 'Flappy Wing',
    emoji: '🐦',
    tags: ['arcade'],
    desc: 'Tap to fly! Navigate through endless pipes in this reflex game.',
    instructions: '🎮 Desktop: Press Space / Click to flap. 📱 Mobile: Tap anywhere to flap wings. Fly through the gaps between pipes. Don\'t hit the pipes or ground!',
    bg: 'game-bg-flappy'
  },
  {
    id: 'racing',
    title: 'Car Racing',
    emoji: '🏎️',
    tags: ['arcade', 'action'],
    desc: 'Dodge traffic at high speed on an infinite highway!',
    instructions: '🎮 Desktop: ← → Arrow Keys / A D to steer. 📱 Mobile: Tap left/right buttons. Dodge incoming cars and trucks. Your speed increases over time!',
    bg: 'game-bg-racing'
  },
  {
    id: 'zombie',
    title: 'Zombie Survival',
    emoji: '🧟',
    tags: ['action', 'arcade'],
    desc: '2D zombie survival! Survive endless waves of the undead.',
    instructions: '🎮 Desktop: WASD to move. Mouse to aim and shoot. 📱 Mobile: Joystick buttons to move, tap enemies to shoot. Survive as many waves as possible!',
    bg: 'game-bg-zombie'
  },
  {
    id: 'chess',
    title: 'Chess',
    emoji: '♟️',
    tags: ['strategy'],
    desc: 'Play a full chess game against a smart computer opponent.',
    instructions: '🎮 Click a piece to select it, then click a highlighted square to move. Play as White against the computer (Black). Standard chess rules apply!',
    bg: 'game-bg-chess'
  },
  {
    id: 'bubble',
    title: 'Bubble Shooter',
    emoji: '🫧',
    tags: ['puzzle', 'arcade'],
    desc: 'Aim and shoot bubbles to pop clusters of matching colors!',
    instructions: '🎮 Desktop: Move mouse to aim, click to shoot. 📱 Mobile: Tap to aim and shoot. Match 3 or more bubbles of the same color to pop them. Clear the board to win!',
    bg: 'game-bg-bubble'
  },
  // ── New 10 Games (11–20) ────────────────────────────────────
  {
    id: 'super-platformer',
    title: 'Super Platformer',
    emoji: '🦸',
    tags: ['action', 'adventure'],
    desc: 'Run, jump, defeat enemies and collect coins across multiple levels!',
    instructions: '🎮 Desktop: Arrow Keys / WASD to move, Space / Up to jump. 📱 Mobile: On-screen buttons. Collect all coins, dodge enemies and reach the flag!',
    bg: 'game-bg-platformer'
  },
  {
    id: 'zombie-survival',
    title: 'Zombie Survival',
    emoji: '🔫',
    tags: ['action', 'arcade'],
    desc: 'Top-down zombie shooter with weapons, ammo, and endless waves!',
    instructions: '🎮 Desktop: WASD to move, mouse aim, click/Space to shoot, R to reload. 📱 Mobile: Left joystick to move, right side to aim and fire. Survive all waves!',
    bg: 'game-bg-zombie-survival'
  },
  {
    id: 'street-racing',
    title: 'Street Racing',
    emoji: '🏁',
    tags: ['arcade', 'action'],
    desc: 'Nitro-boosted street racing with traffic, drifting and speed thrills!',
    instructions: '🎮 Desktop: ← → Arrows to steer, Up/W to accelerate, Space for nitro. 📱 Mobile: Touch buttons. Overtake traffic and beat your distance record!',
    bg: 'game-bg-street-racing'
  },
  {
    id: 'shadow-fighter',
    title: 'Shadow Fighter',
    emoji: '👊',
    tags: ['action', 'fighting'],
    desc: '2D fighting game with punches, kicks, combos and special moves!',
    instructions: '🎮 Desktop: WASD move/jump, J=Punch, K=Kick, L=Special. AI opponent. 📱 Mobile: On-screen fighter buttons. Win 3 rounds to become champion!',
    bg: 'game-bg-shadow-fighter'
  },
  {
    id: 'tower-defense',
    title: 'Tower Defense',
    emoji: '🗼',
    tags: ['strategy', 'puzzle'],
    desc: 'Build towers, stop enemy waves, upgrade defenses and protect your base!',
    instructions: '🎮 Click / Tap empty tiles to build towers. Use gold to build and upgrade. Different tower types target different enemies. Don\'t let enemies reach the end!',
    bg: 'game-bg-tower-defense'
  },
  {
    id: 'galaxy-attack',
    title: 'Galaxy Attack',
    emoji: '🌌',
    tags: ['arcade', 'action'],
    desc: 'Epic space shooter with boss battles, power-ups and laser storms!',
    instructions: '🎮 Desktop: ← → Arrows / A D to move, Space to shoot, collect power-ups. 📱 Mobile: Touch left/right to move, tap shoot button. Defeat the alien boss!',
    bg: 'game-bg-galaxy'
  },
  {
    id: 'football-stars',
    title: 'Football Stars',
    emoji: '⚽',
    tags: ['sports', 'arcade'],
    desc: 'Penalty shootout — aim, power up and score past the goalkeeper!',
    instructions: '🎮 Desktop: Move mouse to aim, hold/release Space or click to control power. 📱 Mobile: Drag to aim, tap shoot button. Score 5 out of 7 to win the tournament!',
    bg: 'game-bg-football'
  },
  {
    id: 'dungeon-quest',
    title: 'Dungeon Quest',
    emoji: '⚔️',
    tags: ['adventure', 'action'],
    desc: 'Explore procedural dungeons, battle monsters, loot treasure, fight bosses!',
    instructions: '🎮 Desktop: WASD / Arrow Keys to move, Space to attack, E to interact. 📱 Mobile: D-pad + attack button. Find the exit key and reach the stairs!',
    bg: 'game-bg-dungeon'
  },
  {
    id: 'jewel-match',
    title: 'Jewel Match',
    emoji: '💎',
    tags: ['puzzle'],
    desc: 'Match 3 glittering jewels! Combos, power-ups and 20 dazzling levels!',
    instructions: '🎮 Click / Tap a gem then click/tap an adjacent gem to swap. Match 3 or more in a row to clear them. Use special gems for chain reactions! Complete the target to advance.',
    bg: 'game-bg-jewel'
  },
  {
    id: 'basketball-challenge',
    title: 'Basketball Challenge',
    emoji: '🏀',
    tags: ['sports', 'arcade'],
    desc: 'Shoot hoops with realistic ball physics. Beat the clock and score big!',
    instructions: '🎮 Desktop: Hold mouse button to aim arc, release to shoot. 📱 Mobile: Touch and drag to aim, release to shoot. The basket moves — time your shot perfectly!',
    bg: 'game-bg-basketball'
  }
];

// ── State ──────────────────────────────────────────────────────
let currentGame = null;
let currentFilter = 'all';
let deferredInstallPrompt = null;

// ── PWA Install ────────────────────────────────────────────────
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  const btn = document.getElementById('installBtn');
  if (btn) btn.style.display = 'inline-flex';
});

function installPWA() {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  deferredInstallPrompt.userChoice.then(() => {
    deferredInstallPrompt = null;
    const btn = document.getElementById('installBtn');
    if (btn) btn.style.display = 'none';
  });
}

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js').catch(() => {});
  });
}

// ── Navigation ─────────────────────────────────────────────────
function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
  const target = document.getElementById(id);
  if (target) {
    target.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  if (id === 'games') renderGamesGrid();
}

function closeMobileMenu() {
  document.getElementById('nav-links').classList.remove('open');
}

// Hamburger
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('nav-links').classList.toggle('open');
});

// ── Render Games Grid ──────────────────────────────────────────
function renderGamesGrid() {
  const query  = (document.getElementById('searchInput').value || '').toLowerCase();
  const grid   = document.getElementById('gamesGrid');
  const noRes  = document.getElementById('noResults');

  const filtered = GAMES.filter(g => {
    const matchSearch = g.title.toLowerCase().includes(query) || g.desc.toLowerCase().includes(query);
    const matchFilter = currentFilter === 'all' || g.tags.includes(currentFilter);
    return matchSearch && matchFilter;
  });

  if (filtered.length === 0) {
    grid.innerHTML = '';
    noRes.classList.remove('hidden');
    return;
  }
  noRes.classList.add('hidden');
  grid.innerHTML = filtered.map(g => gameCardHTML(g)).join('');
}

function gameCardHTML(g) {
  const tagsHTML = g.tags.map(t => `<span class="tag tag-${t}">${t}</span>`).join('');
  return `
    <div class="game-card" onclick="launchGame('${g.id}')">
      <div class="game-card-thumb ${g.bg}">
        <span style="position:relative;z-index:1;font-size:4rem">${g.emoji}</span>
      </div>
      <div class="game-card-body">
        <div class="game-card-tags">${tagsHTML}</div>
        <h3>${g.title}</h3>
        <p>${g.desc}</p>
        <button class="game-card-play">🎮 PLAY NOW</button>
      </div>
    </div>`;
}

function filterGames() { renderGamesGrid(); }

function setFilter(filter, btn) {
  currentFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderGamesGrid();
}

// ── Fullscreen Controls ─────────────────────────────────────────
function getFullscreenElement() {
  return document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
}

function updateFullscreenIcon() {
  const btn = document.getElementById('gameFullscreenBtn');
  if (!btn) return;
  const isFs = !!getFullscreenElement();
  const enterIcon = btn.querySelector('.fs-icon-enter');
  const exitIcon = btn.querySelector('.fs-icon-exit');
  if (isFs) {
    if (enterIcon) enterIcon.classList.add('hidden');
    if (exitIcon) exitIcon.classList.remove('hidden');
    btn.setAttribute('title', 'Exit Fullscreen (Esc)');
    btn.setAttribute('aria-label', 'Exit Fullscreen');
  } else {
    if (enterIcon) enterIcon.classList.remove('hidden');
    if (exitIcon) exitIcon.classList.add('hidden');
    btn.setAttribute('title', 'Enter Fullscreen');
    btn.setAttribute('aria-label', 'Enter Fullscreen');
  }
}

// Track native fullscreen changes (Esc, browser controls, Android back/gestures)
document.addEventListener('fullscreenchange', updateFullscreenIcon);
document.addEventListener('webkitfullscreenchange', updateFullscreenIcon);
document.addEventListener('mozfullscreenchange', updateFullscreenIcon);
document.addEventListener('MSFullscreenChange', updateFullscreenIcon);

function togglePlayerFullscreen() {
  const container = document.getElementById('playerFrameWrapper') || document.getElementById('playerFrame');
  if (!container) return;

  if (!getFullscreenElement()) {
    try {
      if (container.requestFullscreen) {
        container.requestFullscreen().catch(() => {});
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      } else if (container.webkitRequestFullScreen) {
        container.webkitRequestFullScreen();
      } else if (container.mozRequestFullScreen) {
        container.mozRequestFullScreen();
      } else if (container.msRequestFullscreen) {
        container.msRequestFullscreen();
      }
    } catch (err) {}
  } else {
    exitFullscreenSafely();
  }
}

function exitFullscreenSafely() {
  try {
    if (getFullscreenElement()) {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  } catch (err) {}
  updateFullscreenIcon();
}

// ── Game Launcher ──────────────────────────────────────────────
function launchGame(gameId) {
  const game = GAMES.find(g => g.id === gameId);
  if (!game) return;
  currentGame = gameId;

  document.getElementById('playerTitle').textContent = `${game.emoji} ${game.title}`;
  document.getElementById('playerInstructions').innerHTML = `<strong>How to Play:</strong> ${game.instructions}`;

  const frame = document.getElementById('playerFrame');
  frame.className = `player-frame ${game.bg}`;
  frame.innerHTML = '';

  // Load the game in an iframe
  const iframe = document.createElement('iframe');
  iframe.src = `games/${gameId}.html`;
  iframe.title = game.title;
  iframe.allow = 'fullscreen';
  iframe.setAttribute('allowfullscreen', 'true');
  iframe.setAttribute('webkitallowfullscreen', 'true');
  iframe.setAttribute('mozallowfullscreen', 'true');
  iframe.style.cssText = 'width:100%;height:100%;border:none;min-height:560px;display:block;';
  frame.appendChild(iframe);

  showSection('player');
  updateFullscreenIcon();
}

function exitGame() {
  exitFullscreenSafely();
  currentGame = null;
  const frame = document.getElementById('playerFrame');
  frame.innerHTML = '';
  showSection('games');
}

function restartCurrentGame() {
  if (!currentGame) return;
  const iframe = document.querySelector('#playerFrame iframe');
  if (iframe) {
    iframe.src = iframe.src; // reload
  }
}

// Listen for Escape key to exit fullscreen smoothly
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' || e.code === 'Escape') {
    exitFullscreenSafely();
  }
});

// ── Contact Form ───────────────────────────────────────────────
function handleContact(e) {
  e.preventDefault();
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');

  // Basic validation
  const name    = document.getElementById('cName').value.trim();
  const email   = document.getElementById('cEmail').value.trim();
  const subject = document.getElementById('cSubject').value.trim();
  const message = document.getElementById('cMessage').value.trim();

  if (!name || !email || !subject || !message) {
    showToast('⚠️ Please fill in all fields.');
    return;
  }
  if (!email.includes('@')) {
    showToast('⚠️ Please enter a valid email.');
    return;
  }

  // In local dev, show success. On Netlify, the form action handles it.
  form.classList.add('hidden');
  success.classList.remove('hidden');
}

function resetContactForm() {
  document.getElementById('contactForm').reset();
  document.getElementById('contactForm').classList.remove('hidden');
  document.getElementById('formSuccess').classList.add('hidden');
}

// ── Toast ──────────────────────────────────────────────────────
function showToast(msg, duration = 3000) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

// ── Init ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  showSection('home');
  renderGamesGrid();

  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 20) {
      nav.style.background = 'rgba(10,10,15,0.98)';
    } else {
      nav.style.background = 'rgba(10,10,15,0.92)';
    }
  });
});
