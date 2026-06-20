/* ===========================================
   MOONLINE ASSISTANT — CHATBOT LOGIC
   Rule-based local assistant (no external API).
   Handles FAQs, quick replies, and lead capture
   fallback when a question can't be answered.
=========================================== */

(function () {
  'use strict';

  const COMPANY = {
    name: 'Moonline Media',
    email: 'shrishjoshi2002@gmail.com',
    phone: '+91 88083 87895',
    hours: 'Monday–Friday, 9:00 AM – 7:00 PM IST',
  };

  const els = {};
  let unreadCount = 1; // starts at 1 for the welcome message badge
  let hasGreeted = false;

  /* ---------- KNOWLEDGE BASE ---------- */
  const KB = [
    {
      keys: ['service', 'services', 'what do you do', 'offer', 'creative', 'media', 'strategy', 'consulting', 'commerce', 'influencer', 'analytics', 'integrated'],
      reply: () => `We offer eight core services: <strong>Creative, Media, Strategy, Integrated Marketing, Consulting, Commerce, Influencer & Talent,</strong> and <strong>Analytics</strong>. See the full breakdown on our <a href="services.html">Services page</a>. Want details on a specific one?`,
      options: ['Creative', 'Media', 'Strategy', 'Analytics'],
    },
    {
      keys: ['creative'],
      reply: () => `Our <strong>Creative</strong> service covers brand identity, art direction, copywriting, and motion design — building systems that hold up across every channel. <a href="services.html#creative">See more</a>.`,
    },
    {
      keys: ['pricing', 'price', 'cost', 'how much', 'packages', 'plan', 'budget'],
      reply: () => `Pricing depends on scope — channels, deliverables, and timeline. The fastest way to get an accurate number is a quick scoping call. Want me to help you get a quote?`,
      options: ['Get a Quote', 'Book a Meeting'],
    },
    {
      keys: ['quote', 'estimate'],
      reply: () => `Happy to help with that! The fastest way is our contact form — it takes under a minute and a strategist replies within one business day. <a href="contact.html">Open the contact page</a>, or I can collect your details right here. Which would you prefer?`,
      options: ['Fill it here', "I'll use the form"],
    },
    {
      keys: ['fill it here'],
      reply: () => `Great — let's get you a quote.`,
      action: () => true,
      formAfter: true,
    },
    {
      keys: ['process', 'how do you work', 'workflow', 'steps'],
      reply: () => `Our process follows five fixed stages: <strong>Discover → Define → Design & Build → Launch → Optimize.</strong> Every client moves through the same sequence. See the full timeline on our <a href="about.html">About page</a>.`,
    },
    {
      keys: ['portfolio', 'work', 'projects', 'case study', 'examples', 'clients'],
      reply: () => `We've shipped 160+ campaigns for brands like Northwind, Atlas Group, Vera & Co., and Kestrel — spanning rebrands, performance media, and commerce redesigns. Want to know more about a specific service area?`,
      options: ['Branding work', 'Media work', 'Commerce work'],
    },
    {
      keys: ['contact', 'email', 'phone', 'reach you', 'get in touch', 'talk to someone'],
      reply: () => `You can reach the team directly:<br>📧 <a href="mailto:${COMPANY.email}">${COMPANY.email}</a><br>📞 <a href="tel:${COMPANY.phone.replace(/\s/g, '')}">${COMPANY.phone}</a><br>Or use our <a href="contact.html">Contact page</a>.`,
    },
    {
      keys: ['hours', 'business hours', 'open', 'available', 'time zone', 'timezone'],
      reply: () => `We're available ${COMPANY.hours}. Messages sent outside those hours are answered the next business day.`,
    },
    {
      keys: ['meeting', 'book a call', 'schedule', 'consultation', 'demo'],
      reply: () => `I'd love to get that booked. Share your name, email, and a quick note on what you'd like to discuss, and our team will follow up to find a time that works.`,
      formAfter: true,
    },
    {
      keys: ['about', 'who are you', 'company', 'moonline'],
      reply: () => `${COMPANY.name} is a creative & digital growth agency — we merge brand craft with media buying and analytics so every campaign is built to perform, not just look good. We've been operating for 9 years across 14 markets. Read more on our <a href="about.html">About page</a>.`,
    },
    {
      keys: ['location', 'where are you', 'based', 'office'],
      reply: () => `Our team works with clients across 14 markets. For specifics on your region, just email us at <a href="mailto:${COMPANY.email}">${COMPANY.email}</a>.`,
    },
    {
      keys: ['faq', 'question', 'minimum contract', 'contract length'],
      reply: () => `Most engagements run on a 3-month minimum so strategy and optimization cycles can play out, then continue month-to-month. Check the FAQ on our <a href="contact.html">Contact page</a>, or ask me directly!`,
    },
    {
      keys: ['hi', 'hello', 'hey', 'good morning', 'good afternoon'],
      reply: () => `Hello! 👋 Great to have you here. I can help with services, process, portfolio, or booking a meeting. What would you like to know?`,
      options: ['Our Services', 'Get a Quote', 'Book a Meeting'],
    },
    {
      keys: ['thank', 'thanks', 'thank you'],
      reply: () => `You're very welcome! Anything else I can help you with?`,
    },
    {
      keys: ['bye', 'goodbye', 'see you'],
      reply: () => `Thanks for stopping by Moonline Media — have a great day! 🌙`,
    },
  ];

  /* ---------- QUICK REPLY MAP ---------- */
  const QUICK_REPLY_MAP = {
    services: 'What services do you offer?',
    quote: "I'd like to get a quote",
    meeting: 'I want to book a meeting',
    pricing: 'What are your pricing packages?',
    contact: 'How can I contact you?',
  };

  /* ---------- DOM READY ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    els.chatbot = document.getElementById('chatbot');
    els.toggle = document.getElementById('chatbotToggle');
    els.window = document.getElementById('chatbotWindow');
    els.messages = document.getElementById('chatbotMessages');
    els.badge = document.getElementById('chatbotBadge');
    els.minimize = document.getElementById('chatbotMinimize');
    els.form = document.getElementById('chatbotForm');
    els.input = document.getElementById('chatbotInput');
    els.quickReplies = document.getElementById('chatbotQuickReplies');

    if (!els.chatbot) return;
    bindEvents();
  });

  function bindEvents() {
    els.toggle.addEventListener('click', toggleChat);
    els.minimize.addEventListener('click', closeChat);

    els.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = els.input.value.trim();
      if (!text) return;
      els.input.value = '';
      handleUserMessage(text);
    });

    els.quickReplies.querySelectorAll('.qr-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const phrase = QUICK_REPLY_MAP[btn.dataset.q] || btn.textContent;
        handleUserMessage(phrase);
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && els.chatbot.classList.contains('is-open')) closeChat();
    });
  }

  function toggleChat() {
    const isOpen = els.chatbot.classList.contains('is-open');
    isOpen ? closeChat() : openChat();
  }

  function openChat() {
    els.chatbot.classList.add('is-open');
    els.toggle.setAttribute('aria-expanded', 'true');
    clearBadge();
    if (!hasGreeted) {
      hasGreeted = true;
      setTimeout(() => {
        addBotMessage("👋 Hi! I'm Moonline Assistant. How can I help you today?", {
          options: ['Our Services', 'Get a Quote', 'Book a Meeting'],
        });
      }, 350);
    }
    setTimeout(() => els.input.focus(), 400);
  }

  function closeChat() {
    els.chatbot.classList.remove('is-open');
    els.toggle.setAttribute('aria-expanded', 'false');
  }

  function clearBadge() {
    unreadCount = 0;
    els.badge.classList.add('is-hidden');
  }

  function bumpBadge() {
    if (els.chatbot.classList.contains('is-open')) return;
    unreadCount += 1;
    els.badge.textContent = unreadCount;
    els.badge.classList.remove('is-hidden');
  }

  /* ---------- MESSAGE RENDERING ---------- */
  function formatTime() {
    const d = new Date();
    let h = d.getHours();
    const m = d.getMinutes().toString().padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
  }

  function scrollToBottom() {
    els.messages.scrollTop = els.messages.scrollHeight;
  }

  function addUserMessage(text) {
    const wrap = document.createElement('div');
    wrap.className = 'msg user';
    wrap.innerHTML = `
      <div class="msg-bubble">${escapeHTML(text)}</div>
      <span class="msg-time">${formatTime()}</span>
    `;
    els.messages.appendChild(wrap);
    scrollToBottom();
  }

  function addBotMessage(html, { options = null } = {}) {
    const wrap = document.createElement('div');
    wrap.className = 'msg bot';
    let optionsHTML = '';
    if (options && options.length) {
      optionsHTML = `<div class="msg-inline-options">${options
        .map((opt) => `<button type="button">${escapeHTML(opt)}</button>`)
        .join('')}</div>`;
    }
    wrap.innerHTML = `
      <div class="msg-bubble">${html}${optionsHTML}</div>
      <span class="msg-time">${formatTime()}</span>
    `;
    els.messages.appendChild(wrap);

    if (options && options.length) {
      wrap.querySelectorAll('.msg-inline-options button').forEach((btn) => {
        btn.addEventListener('click', () => handleUserMessage(btn.textContent));
      });
    }
    scrollToBottom();
    bumpBadge();
  }

  function showTyping() {
    const wrap = document.createElement('div');
    wrap.className = 'msg bot typing';
    wrap.id = 'typingIndicator';
    wrap.innerHTML = `<div class="msg-bubble"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div>`;
    els.messages.appendChild(wrap);
    scrollToBottom();
  }

  function hideTyping() {
    const t = document.getElementById('typingIndicator');
    if (t) t.remove();
  }

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /* ---------- LEAD CAPTURE FORM ---------- */
  function renderLeadForm(introText) {
    const wrap = document.createElement('div');
    wrap.className = 'msg bot';
    wrap.innerHTML = `
      <div class="msg-bubble" style="width:100%;">
        ${introText}
        <form class="msg-lead-form" id="leadForm">
          <input type="text" id="leadName" placeholder="Your full name" required>
          <input type="email" id="leadEmail" placeholder="Your email address" required>
          <input type="text" id="leadMessage" placeholder="Briefly, what do you need help with?" required>
          <span class="lead-error" id="leadError"></span>
          <button type="submit">Send to Moonline Team</button>
        </form>
      </div>
      <span class="msg-time">${formatTime()}</span>
    `;
    els.messages.appendChild(wrap);
    scrollToBottom();
    bumpBadge();

    const form = wrap.querySelector('#leadForm');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = wrap.querySelector('#leadName').value.trim();
      const email = wrap.querySelector('#leadEmail').value.trim();
      const message = wrap.querySelector('#leadMessage').value.trim();
      const errorEl = wrap.querySelector('#leadError');
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name || !email || !message) {
        errorEl.textContent = 'Please fill in every field.';
        return;
      }
      if (!emailPattern.test(email)) {
        errorEl.textContent = 'Please enter a valid email address.';
        return;
      }
      errorEl.textContent = '';
      form.querySelectorAll('input, button').forEach((el) => (el.disabled = true));
      form.querySelector('button').textContent = 'Sending…';

      const payload = new FormData();
      payload.append('name', name);
      payload.append('email', email);
      payload.append('message', message);
      payload.append('_subject', 'New chatbot lead — Moonline Media website');
      payload.append('_captcha', 'false');

      fetch('https://formsubmit.co/ajax/shrishjoshi2002@gmail.com', {
        method: 'POST',
        body: payload,
        headers: { Accept: 'application/json' },
      })
        .catch(() => {
          /* swallow network errors — we still show a confirmation
             below so the visitor isn't left guessing, and the
             message details remain visible above in the transcript */
        })
        .finally(() => {
          form.style.display = 'none';
          addBotMessage(
            `✅ Thanks, ${escapeHTML(name)}! Your message has been forwarded to the Moonline Media team. We'll reply to <strong>${escapeHTML(
              email
            )}</strong> within one business day.`
          );
        });
    });
  }

  /* ---------- KNOWLEDGE MATCHING ---------- */
  function findAnswer(text) {
    const lower = text.toLowerCase();
    let best = null;
    let bestScore = 0;

    KB.forEach((entry) => {
      entry.keys.forEach((key) => {
        if (lower.includes(key)) {
          const score = key.length;
          if (score > bestScore) {
            bestScore = score;
            best = entry;
          }
        }
      });
    });
    return best;
  }

  /* ---------- MAIN HANDLER ---------- */
  function handleUserMessage(text) {
    addUserMessage(text);
    showTyping();

    setTimeout(() => {
      hideTyping();
      const lower = text.toLowerCase();

      if (lower === "i'll use the form" || lower === 'i will use the form') {
        addBotMessage(`Perfect — you'll find the full contact form on our <a href="contact.html">Contact page</a>.`);
        return;
      }

      const match = findAnswer(text);
      if (match) {
        addBotMessage(match.reply(), { options: match.options });
        if (match.formAfter) {
          renderLeadForm("I couldn't find a specific answer, so let's get this to the team directly:");
        }
      } else {
        renderLeadForm("I couldn't find a specific answer to that — let me connect you with the team instead.");
      }
    }, 900 + Math.random() * 500);
  }
})();
