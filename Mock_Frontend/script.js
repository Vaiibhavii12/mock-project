
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top = mouseY + 'px';
});

// Smooth cursor ring animation
function animateCursor() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top = ringY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Cursor states
document.querySelectorAll('button, a, .chip, .domain-card, .feat-card, input, select, textarea').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorDot.style.transform = 'translate(-50%,-50%) scale(1.5)';
    cursorRing.style.transform = 'translate(-50%,-50%) scale(1.4)';
    cursorRing.style.borderColor = 'var(--teal)';
    cursorDot.style.background = 'var(--teal)';
  });
  el.addEventListener('mouseleave', () => {
    cursorDot.style.transform = 'translate(-50%,-50%) scale(1)';
    cursorRing.style.transform = 'translate(-50%,-50%) scale(1)';
    cursorRing.style.borderColor = 'rgba(245,166,35,0.6)';
    cursorDot.style.background = 'var(--gold)';
  });
});

/* ===== NAVBAR SCROLL ===== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

/* ===== HAMBURGER MENU ===== */
const hamburger = document.getElementById('hamburger');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  // Simple mobile menu toggle
  const navLinks = document.querySelector('.nav-links');
  const navCta = document.querySelector('.nav-cta');
  if (hamburger.classList.contains('active')) {
    navLinks.style.cssText = `
      display: flex; flex-direction: column; position: fixed;
      top: 70px; left: 0; right: 0;
      background: rgba(8,12,20,0.98); backdrop-filter: blur(20px);
      padding: 2rem; gap: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.07);
      z-index: 999;
    `;
    navCta.style.cssText = `
      display: flex; flex-direction: column; position: fixed;
      top: 300px; left: 0; right: 0;
      background: rgba(8,12,20,0.98); backdrop-filter: blur(20px);
      padding: 1.5rem 2rem; gap: 0.5rem; z-index: 999;
    `;
  } else {
    navLinks.removeAttribute('style');
    navCta.removeAttribute('style');
  }
});

/* ===== SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Close mobile menu if open
      hamburger.classList.remove('active');
      document.querySelector('.nav-links').removeAttribute('style');
      document.querySelector('.nav-cta').removeAttribute('style');
    }
  });
});

/* ===== ANIMATED COUNTER ===== */
function formatNumber(num, target) {
  if (target >= 1000) {
    return num >= 1000 ? (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + 'K' : num.toString();
  }
  return Math.floor(num).toString();
}

function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4); // easeOutQuart
    const current = eased * target;
    el.textContent = target >= 1000 ? formatNumber(current, target) : Math.floor(current).toString();
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target >= 1000 ? formatNumber(target, target) : target.toString();
  }

  requestAnimationFrame(update);
}

/* ===== INTERSECTION OBSERVER ===== */
const observers = new Map();

function observeOnce(el, callback) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  obs.observe(el);
  observers.set(el, obs);
}

// Counters
document.querySelectorAll('.stat-number').forEach(el => {
  observeOnce(el, (target) => animateCounter(target));
});

// Stat bars
document.querySelectorAll('.stat-fill').forEach(el => {
  observeOnce(el, (target) => {
    setTimeout(() => { target.style.transform = 'scaleX(1)'; }, 100);
  });
});

// Section fade-in
document.querySelectorAll('.feat-card, .domain-card, .step, .stat-card, .testi-card').forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = `opacity 0.6s ease ${i % 4 * 0.1}s, transform 0.6s ease ${i % 4 * 0.1}s`;

  observeOnce(el, (target) => {
    target.style.opacity = '1';
    target.style.transform = 'translateY(0)';
  });
});

/* ===== MODAL SYSTEM ===== */
function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// Close on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
});

// ESC to close
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(m => {
      m.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
});

/* ===== INTERVIEW SETUP ===== */
function openInterviewSetup() {
  openModal('interviewSetupModal');
}

function toggleChip(chip) {
  const parent = chip.closest('.chip-select');
  // Allow multiple selections per group
  chip.classList.toggle('active');
}

function updateDiff(val) {
  const labels = {
    '1': 'Easy <i class="fa-solid fa-circle-check"></i>',
    '2': 'Medium <i class="fa-solid fa-gauge-high"></i>',
    '3': 'Hard <i class="fa-solid fa-fire"></i>'
  };
  document.getElementById('diffLabel').innerHTML = labels[val];
}

/* ===== INTERVIEW TIMER ===== */
let timerInterval = null;
let totalSeconds = 0;
let currentQuestionIndex = 0;
let interviewAnswers = [];

const interviewQuestions = {
  'Software Engineer': [
    'Tell me about yourself and your experience as a software engineer.',
    'Explain the difference between a stack and a queue, and when would you use each?',
    'What is time complexity and why does it matter? Give an example.',
    'Describe a challenging technical problem you solved. What was your approach?',
    'How would you design a URL shortening service like bit.ly?',
    'Explain the concept of SOLID principles with examples.',
    'What is the difference between REST and GraphQL?',
    'How do you handle concurrency issues in multi-threaded programming?'
  ],
  'Frontend Developer': [
    'What is the Virtual DOM and how does React use it?',
    'Explain the CSS box model in detail.',
    'How does JavaScript event bubbling work?',
    'What are React Hooks and why were they introduced?',
    'Explain the difference between null and undefined in JavaScript.',
    'How do you optimize the performance of a React application?',
    'What is CORS and how do you handle it?',
    'Describe your approach to responsive design.'
  ],
  'Backend Developer': [
    'Explain the difference between SQL and NoSQL databases.',
    'What is REST and what are its key principles?',
    'How would you design a rate limiting system?',
    'What is a microservices architecture and its pros/cons?',
    'How do you handle database transactions?',
    'Explain JWT authentication.',
    'What is caching and when would you use Redis vs Memcached?',
    'How do you ensure API security?'
  ],
  'System Design': [
    'Design a messaging system like WhatsApp.',
    'How would you design YouTube\'s video upload and streaming system?',
    'Design a distributed cache system.',
    'How would you design Uber\'s real-time location tracking?',
    'Design a notification system for 10 million users.',
    'How would you build a search autocomplete feature?'
  ],
  'DSA': [
    'Reverse a linked list both iteratively and recursively.',
    'Find the longest palindromic substring in a string.',
    'Implement a binary search tree with insert and search operations.',
    'Solve the 0/1 Knapsack problem using dynamic programming.',
    'Find all connected components in an undirected graph.',
    'Implement LRU cache with O(1) get and put operations.'
  ],
  'HR': [
    'Tell me about yourself.',
    'What is your greatest strength and weakness?',
    'Describe a time you handled a conflict with a team member.',
    'Where do you see yourself in 5 years?',
    'Why do you want to work at our company?',
    'Tell me about a time you failed and what you learned from it.'
  ],
  'ML': [
    'Explain the bias-variance tradeoff.',
    'What is gradient descent and how does it work?',
    'Explain overfitting and how to prevent it.',
    'What is the difference between supervised and unsupervised learning?',
    'How does a neural network learn?',
    'Explain precision, recall, and F1 score.'
  ],
  'default': [
    'Tell me about yourself and your technical background.',
    'What is your strongest skill in software development?',
    'Describe a project you are most proud of.',
    'How do you keep yourself updated with the latest technology trends?',
    'What motivates you as a developer?'
  ]
};

function startInterview(domain) {
  closeModal('interviewSetupModal');
  document.getElementById('roomRole').textContent = domain + ' Interview';
  openModal('interviewRoomModal');
  startTimer(30 * 60);
  loadQuestion(domain);
}

function launchInterview() {
  const role = document.getElementById('roleSelect').value;
  closeModal('interviewSetupModal');
  document.getElementById('roomRole').textContent = role + ' Interview';
  openModal('interviewRoomModal');
  startTimer(30 * 60);
  loadQuestion(role);
}

function loadQuestion(domain) {
  const questions = interviewQuestions[domain] || interviewQuestions['default'];
  const q = questions[currentQuestionIndex % questions.length];
  const display = document.getElementById('currentQuestion');

  display.innerHTML = '<div class="q-loading"><span></span><span></span><span></span></div>';

  setTimeout(() => {
    display.innerHTML = `
      <div style="text-align:left;">
        <div style="font-size:0.72rem; font-family:'JetBrains Mono',monospace; color:var(--gold); margin-bottom:8px; display:flex; align-items:center; gap:5px;">
          <i class="fa-solid fa-circle-question"></i> Question ${currentQuestionIndex + 1}
        </div>
        <p style="font-size:0.95rem; line-height:1.7;">${q}</p>
      </div>
    `;
    // Start live metrics animation
    animateLiveMetrics();
  }, 1200);
}

function startTimer(seconds) {
  totalSeconds = seconds;
  clearInterval(timerInterval);
  updateTimerDisplay();

  timerInterval = setInterval(() => {
    totalSeconds--;
    updateTimerDisplay();
    if (totalSeconds <= 0) {
      clearInterval(timerInterval);
      endInterview();
    }
    // Warning at 5 min
    if (totalSeconds === 300) {
      showToast('⚡ 5 minutes remaining!');
    }
  }, 1000);
}

function updateTimerDisplay() {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const s = (totalSeconds % 60).toString().padStart(2, '0');
  const display = document.getElementById('timerDisplay');
  if (display) {
    display.textContent = `${m}:${s}`;
    if (totalSeconds <= 300) display.style.color = 'var(--red)';
    else display.style.color = 'var(--gold)';
  }
}

function animateLiveMetrics() {
  const bars = ['confBar', 'clarBar', 'relBar'];
  const values = [
    Math.floor(70 + Math.random() * 25),
    Math.floor(60 + Math.random() * 30),
    Math.floor(65 + Math.random() * 30)
  ];

  bars.forEach((id, i) => {
    setTimeout(() => {
      const bar = document.getElementById(id);
      if (bar) bar.style.width = values[i] + '%';
    }, 500 + i * 300);
  });
}

/* ===== MIC TOGGLE ===== */
let micActive = false;
function toggleMic() {
  micActive = !micActive;
  const btn = document.getElementById('micBtn');
  if (micActive) {
    btn.innerHTML = '<i class="fa-solid fa-microphone-slash"></i> Stop';
    btn.classList.add('active');
    showToast('🎤 Microphone active — speak your answer!');
    // Simulate listening animation on waveform
    startMicAnimation();
  } else {
    btn.innerHTML = '<i class="fa-solid fa-microphone"></i> Speak';
    btn.classList.remove('active');
    stopMicAnimation();
  }
}

let micAnimInterval = null;
function startMicAnimation() {
  const ta = document.getElementById('answerText');
  if (ta && !ta.value) ta.placeholder = '🔴 Listening... speak clearly';
}

function stopMicAnimation() {
  const ta = document.getElementById('answerText');
  if (ta) ta.placeholder = 'Type or speak your answer here... 🎤';
}

/* ===== SUBMIT ANSWER ===== */
function submitAnswer() {
  const answer = document.getElementById('answerText').value.trim();
  if (!answer) {
    showToast('Please type or speak your answer first!');
    return;
  }

  interviewAnswers.push({ question: currentQuestionIndex, answer });
  document.getElementById('answerText').value = '';

  if (micActive) toggleMic();

  currentQuestionIndex++;
  showToast('✅ Answer submitted! Next question loading...');
  animateLiveMetrics();
  loadQuestion(document.getElementById('roomRole').textContent.replace(' Interview', ''));
}

/* ===== END INTERVIEW ===== */
function endInterview() {
  clearInterval(timerInterval);
  closeModal('interviewRoomModal');
  currentQuestionIndex = 0;

  // Generate random scores
  const tech = Math.floor(65 + Math.random() * 30);
  const comm = Math.floor(60 + Math.random() * 35);
  const prob = Math.floor(55 + Math.random() * 40);
  const conf = Math.floor(70 + Math.random() * 25);
  const overall = Math.floor((tech + comm + prob + conf) / 4);

  // Show results
  openModal('resultsModal');

  // Animate scores
  setTimeout(() => {
    document.getElementById('overallScore').textContent = overall + '/100';
    animateScoreBar('techScore', 'techScoreVal', tech);
    animateScoreBar('commScore', 'commScoreVal', comm);
    animateScoreBar('probScore', 'probScoreVal', prob);
    animateScoreBar('confScore', 'confScoreVal', conf);
    generateAIFeedback(overall, tech, comm, prob, conf);
  }, 300);

  // Confetti for good scores
  if (overall >= 75) launchConfetti();
}

function animateScoreBar(barId, valId, score) {
  const bar = document.getElementById(barId);
  const val = document.getElementById(valId);
  if (bar && val) {
    setTimeout(() => {
      bar.style.width = score + '%';
      val.textContent = score + '%';
    }, 300);
  }
}

function generateAIFeedback(overall, tech, comm, prob, conf) {
  const feedbackOptions = {
    excellent: [
      `Outstanding performance! Your ${overall}% score places you in the top 10% of candidates. Your technical depth was impressive, and your communication was clear and structured. Keep this consistency!`,
      `Excellent interview! You demonstrated strong problem-solving skills with a score of ${overall}/100. Your confidence and clarity set you apart. Focus on maintaining this level in real interviews.`
    ],
    good: [
      `Good performance with ${overall}/100! Your communication scored ${comm}% which shows clarity. Work on strengthening your technical answers — practice more system design and DSA problems.`,
      `Solid interview at ${overall}/100. You showed good foundational knowledge. To improve, focus on structuring answers using the STAR method and deepening your technical concepts.`
    ],
    improve: [
      `Room for improvement at ${overall}/100. Your confidence score of ${conf}% suggests nervousness — practice more to build confidence. Focus on fundamental concepts and give more structured answers.`,
      `With ${overall}/100, you need more practice. Spend more time on DSA problems (LeetCode medium/hard), practice speaking answers aloud, and review system design fundamentals.`
    ]
  };

  const category = overall >= 80 ? 'excellent' : overall >= 60 ? 'good' : 'improve';
  const options = feedbackOptions[category];
  const feedback = options[Math.floor(Math.random() * options.length)];

  const feedbackEl = document.getElementById('aiFeedbackText');
  if (feedbackEl) {
    feedbackEl.textContent = '';
    // Typewriter effect
    let i = 0;
    const typeWriter = setInterval(() => {
      if (i < feedback.length) {
        feedbackEl.textContent += feedback[i];
        i++;
      } else {
        clearInterval(typeWriter);
      }
    }, 18);
  }
}

/* ===== CONFETTI ===== */
function launchConfetti() {
  const colors = ['#f5a623', '#2dd4bf', '#a855f7', '#22c55e', '#fbbf24'];
  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden;';
  document.body.appendChild(container);

  for (let i = 0; i < 80; i++) {
    const piece = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 10 + 5;
    const x = Math.random() * 100;
    const delay = Math.random() * 2;
    const duration = Math.random() * 2 + 2;

    piece.style.cssText = `
      position: absolute;
      width: ${size}px; height: ${size}px;
      background: ${color};
      left: ${x}%;
      top: -20px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      animation: confettiFall ${duration}s ${delay}s ease-in forwards;
      transform: rotate(${Math.random() * 360}deg);
    `;
    container.appendChild(piece);
  }

  const style = document.createElement('style');
  style.textContent = `
    @keyframes confettiFall {
      to {
        transform: translateY(110vh) rotate(${Math.random() * 720}deg);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  setTimeout(() => {
    container.remove();
    style.remove();
  }, 5000);
}

/* ===== TESTIMONIALS SLIDER ===== */
let testiOffset = 0;

function scrollTestis(dir) {
  const track = document.getElementById('testimonialsTrack');
  const cardWidth = 376; // 360 + 16 gap
  const maxOffset = (track.children.length - 1) * cardWidth;

  testiOffset = Math.max(0, Math.min(maxOffset, testiOffset + dir * cardWidth));
  track.style.transform = `translateX(-${testiOffset}px)`;
}

/* ===== TOAST NOTIFICATIONS ===== */
let toastTimeout = null;

function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');

  toastMsg.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ===== KEYBOARD SHORTCUTS ===== */
document.addEventListener('keydown', (e) => {
  // Only when not typing
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;

  switch (e.key) {
    case 'i':
    case 'I':
      openInterviewSetup();
      break;
    case 'h':
    case 'H':
      document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
      break;
    case 'f':
    case 'F':
      document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
      break;
  }
});

// Show keyboard shortcuts hint once
setTimeout(() => {
  showToast('💡 Tip: Press [I] to instantly start an interview!');
}, 3000);

/* ===== TYPEWRITER HERO ===== */
const heroTitle = document.querySelector('.hero-title');
// The hero title animates via CSS already, this adds a subtle shimmer periodically
setInterval(() => {
  const gradientEl = document.querySelector('.gradient-text');
  if (gradientEl) {
    gradientEl.style.backgroundPosition = '100%';
    setTimeout(() => { gradientEl.style.backgroundPosition = '0%'; }, 500);
  }
}, 4000);

/* ===== PARALLAX ORBS ===== */
document.addEventListener('mousemove', (e) => {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const dx = (e.clientX - cx) / cx;
  const dy = (e.clientY - cy) / cy;

  const orbs = document.querySelectorAll('.hero-orb');
  orbs.forEach((orb, i) => {
    const speed = (i + 1) * 12;
    orb.style.transform = `translate(${dx * speed}px, ${dy * speed}px)`;
  });
});

/* ===== FEAT CARD TILT ===== */
document.querySelectorAll('.feat-card, .domain-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -5;
    const rotateY = ((x - cx) / cx) * 5;
    card.style.transform = `translateY(-6px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ===== SCROLL PROGRESS BAR ===== */
const progressBar = document.createElement('div');
progressBar.style.cssText = `
  position: fixed; top: 0; left: 0; height: 2px; width: 0%;
  background: linear-gradient(90deg, var(--gold), var(--teal), var(--purple));
  z-index: 10001; transition: width 0.1s;
  box-shadow: 0 0 10px rgba(245,166,35,0.5);
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollTop / docHeight) * 100;
  progressBar.style.width = progress + '%';
});

/* ===== NAVBAR ACTIVE LINKS ===== */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) current = section.getAttribute('id');
  });

  navItems.forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href') === '#' + current) {
      link.style.color = 'var(--gold)';
    }
  });
});

/* ===== GLITCH EFFECT ON BRAND NAME ===== */
const brandNames = document.querySelectorAll('.brand-name');
brandNames.forEach(brand => {
  brand.addEventListener('mouseenter', () => {
    brand.style.animation = 'glitch 0.3s steps(1) 3';
  });
  brand.addEventListener('animationend', () => {
    brand.style.animation = '';
  });
});

// Add glitch keyframes
const glitchStyle = document.createElement('style');
glitchStyle.textContent = `
  @keyframes glitch {
    0% { transform: translate(0); }
    20% { transform: translate(-2px, 1px); color: var(--teal); }
    40% { transform: translate(2px, -1px); color: var(--gold); }
    60% { transform: translate(-1px, 2px); color: var(--purple); }
    80% { transform: translate(1px, -2px); }
    100% { transform: translate(0); }
  }
`;
document.head.appendChild(glitchStyle);

/* ===== DOMAIN CARD QUICK START ===== */
function startInterview(domain) {
  closeModal('interviewSetupModal');
  document.getElementById('roomRole').textContent = domain + ' Interview';
  currentQuestionIndex = 0;
  interviewAnswers = [];

  openModal('interviewRoomModal');
  startTimer(30 * 60);
  loadQuestion(domain);
  showToast('🚀 Interview started! Good luck!');
}

/* ===== LIVE METRICS AUTO-UPDATE (simulate real-time) ===== */
let metricsInterval = null;

function startMetricsSimulation() {
  metricsInterval = setInterval(() => {
    if (document.getElementById('interviewRoomModal').classList.contains('active')) {
      animateLiveMetrics();
    }
  }, 5000);
}

startMetricsSimulation();

/* ===== EASTER EGG ===== */
let konamiCode = [];
const konamiSequence = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];

document.addEventListener('keydown', (e) => {
  konamiCode.push(e.key);
  konamiCode = konamiCode.slice(-10);
  if (konamiCode.join(',') === konamiSequence.join(',')) {
    showToast('🎉 KONAMI CODE! You unlocked legend mode!');
    launchConfetti();
    document.body.style.animation = 'rainbow 0.5s steps(1) 6';
    const rainbowStyle = document.createElement('style');
    rainbowStyle.textContent = `
      @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
      }
    `;
    document.head.appendChild(rainbowStyle);
    setTimeout(() => {
      document.body.style.animation = '';
    }, 3000);
  }
});

/* ===== SMOOTH REVEAL ANIMATION FOR SECTIONS ===== */
const revealEls = document.querySelectorAll('.section-title, .section-label, .section-sub, .steps-container, .leaderboard-table, .cta-content');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => {
  el.style.cssText += 'opacity:0; transform:translateY(24px); transition: opacity 0.7s ease, transform 0.7s ease;';
  revealObserver.observe(el);
});

/* ===== INIT ===== */
console.log(`
%c⚡ InterviewForge Loaded!
%cGOD LEVEL Mock Interview Platform
%cPress [I] to start | [F] for features | [H] for home
%cKonami Code for surprise! 🎮
`, 
'font-size:18px; font-weight:bold; color:#f5a623;',
'font-size:12px; color:#2dd4bf;',
'font-size:11px; color:#94a3b8;',
'font-size:11px; color:#a855f7;'
);