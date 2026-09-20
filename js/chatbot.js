(function () {
  // ---- CONFIGURATION: fill these in after creating a free EmailJS account (emailjs.com) ----
  // 1. Sign up free at emailjs.com and connect higirlskincare@gmail.com as an Email Service.
  // 2. Create an Email Template with variables: {{visitor_name}}, {{visitor_phone}}, {{visitor_query}}, {{transcript}}
  // 3. Paste your Public Key, Service ID and Template ID below.
  const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";
  const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
  const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";
  const CLINIC_EMAIL = "higirlskincare@gmail.com";
  const CLINIC_PHONE = "+919493079179";

  let emailjsReady = false;
  try {
    if (window.emailjs && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
      emailjs.init(EMAILJS_PUBLIC_KEY);
      emailjsReady = true;
    }
  } catch (e) { /* EmailJS not configured yet */ }

  // ---- FAQ KNOWLEDGE BASE (prefilled answers) ----
  const FAQS = [
    { keys: ["hour", "time", "open", "close", "timing"], a: "We're open daily from 10:00 AM to 8:00 PM. We'd recommend calling ahead on +91 94930 79179 to book your slot." },
    { keys: ["address", "location", "where", "direction", "map"], a: "We're located at 3rd Floor, Above KFC, Opposite Vaishaki Skyline, Yendada Main Road, Visakhapatnam, Andhra Pradesh – 530045. Here's the map: see the 'Location' section on this page!" },
    { keys: ["phone", "number", "contact", "call"], a: "You can reach us at +91 94930 79179, or tap the WhatsApp button in the corner for a quick chat." },
    { keys: ["doctor", "suresh", "naik", "dermatologist"], a: "Dr. Suresh Naik is our Clinical Dermatologist & Aesthetic Physician with 15+ years of experience, specialising in skin, hair and cosmetic procedures." },
    { keys: ["teja", "trichologist", "hair specialist", "hair fall doctor"], a: "Dr. Teja is our Trichologist, trained at the Indian Institute of Cosmetology, Trichology & Nutrition (IICTN), Mumbai — she leads all hair & scalp treatments." },
    { keys: ["hydrafacial", "hydra facial"], a: "HydraFacial (deep cleansing, exfoliation & hydration) ranges from ₹2,500 – ₹12,000 depending on the package. Want to book a consultation?" },
    { keys: ["laser hair", "hair reduction", "lhr"], a: "Laser Hair Reduction is priced ₹1,000 – ₹30,000 depending on the area treated. It's a permanent hair-reduction solution safe for most skin types." },
    { keys: ["botox"], a: "Botox is priced ₹250 – ₹600 per unit, based on the treatment area and units required — this is finalised after an in-person consultation." },
    { keys: ["prp", "hair fall", "hair loss", "hair growth", "gfc"], a: "For hair fall/regrowth we offer PRP and GFC therapy (₹4,000 – ₹20,000/session), plus hair growth boosters. Dr. Teja does a scalp analysis first to recommend the right plan." },
    { keys: ["acne", "pimple", "scar"], a: "We treat acne and acne scars with chemical peels, laser toning, microneedling and MNRF — pricing depends on severity, typically ₹1,500 – ₹50,000. Check our real before/after results in the 'Before & After' section!" },
    { keys: ["pigmentation", "melasma", "dark spot", "tan"], a: "Pigmentation & melasma are treated with Q-Switch laser toning, chemical peels and photofacials (₹1,500 – ₹15,000). Results vary — see real transformations in our Before & After gallery." },
    { keys: ["under eye", "dark circle", "eye bag"], a: "We treat dark circles and under-eye concerns with PRP/PRF and skin boosters. Book a consultation so Dr. Naik can recommend the right protocol for you." },
    { keys: ["weight", "fat", "slim", "cryolipolysis", "body contour"], a: "For body contouring we offer Cryolipolysis (fat freezing, ₹8,000 – ₹35,000/session) and Laser Lipolysis. See real transformation photos in our Before & After section." },
    { keys: ["double chin"], a: "Double Chin Reduction is priced ₹8,000 – ₹60,000 depending on sessions needed — we have a real client transformation in our Before & After gallery for this!" },
    { keys: ["bridal", "wedding", "bride"], a: "Yes! We offer a Bridal Glow Laser Toning package (₹10,000 – ₹50,000+) along with microblading, lip tinting and skin prep treatments — best booked 2-3 months before the big day." },
    { keys: ["price", "cost", "rate", "charge", "fee"], a: "Prices vary by treatment, area and number of sessions. Tap 'View Full Price Guide' in the Services section for our complete price list, or ask me about a specific treatment!" },
    { keys: ["book", "appointment", "consult", "slot", "schedule"], a: "You can book by calling +91 94930 79179, messaging us on WhatsApp, or filling the contact form on this page — we'll confirm your slot shortly." },
    { keys: ["safe", "hygien", "clean", "sterile"], a: "Absolutely — every treatment room is doctor-supervised with hygiene protocols, and we do a skin/scalp analysis before any procedure. Trust, transparency and transformation is our motto." },
    { keys: ["instagram", "social", "facebook"], a: "Follow us on Instagram @higirl_skin for real before/afters and offers!" },
    { keys: ["free", "consultation", "trial"], a: "Yes, we offer a free skin & hair consultation on your first visit! Call +91 94930 79179 or WhatsApp us to book yours." },
    { keys: ["service", "treatment", "offer", "what do you"], a: "We offer HydraFacial, laser hair reduction, PRP/GFC hair therapy, Botox, chemical peels, body contouring, bridal packages and more — check the 'Services' section above for the full list with pricing!" },
  ];

  const FALLBACK = "I don't have an exact answer for that yet — want me to pass this on to our team? They'll call you back shortly.";

  function findAnswer(text) {
    const t = text.toLowerCase();
    for (const faq of FAQS) {
      if (faq.keys.some(k => t.includes(k))) return faq.a;
    }
    return null;
  }

  // ---- UI wiring ----
  const chatbot = document.getElementById('chatbot');
  const launcher = document.getElementById('chatbotLauncher');
  const closeBtn = document.getElementById('chatbotClose');
  const messagesEl = document.getElementById('chatbotMessages');
  const quickRepliesEl = document.getElementById('chatbotQuickReplies');
  const form = document.getElementById('chatbotForm');
  const input = document.getElementById('chatbotInput');

  const transcript = [];

  function addMessage(text, sender) {
    transcript.push({ sender, text, time: new Date().toLocaleTimeString() });
    const div = document.createElement('div');
    div.className = `chat-msg ${sender}`;
    div.textContent = text;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function setQuickReplies(options) {
    quickRepliesEl.innerHTML = '';
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = opt.label;
      btn.addEventListener('click', () => opt.action());
      quickRepliesEl.appendChild(btn);
    });
  }

  const DEFAULT_QUICK_REPLIES = [
    { label: 'Our Treatments', action: () => handleUserText('What treatments do you offer?') },
    { label: 'Pricing', action: () => handleUserText('What are your prices?') },
    { label: 'Location & Timings', action: () => handleUserText('Where are you located and what are your timings?') },
    { label: 'Talk to a Specialist', action: () => startLeadCapture() },
  ];

  let leadState = null; // null | 'name' | 'phone' | 'message'
  let leadData = {};

  function startLeadCapture() {
    addMessage('Talk to a Specialist', 'user');
    leadState = 'name';
    leadData = {};
    addMessage("Sure! What's your name?", 'bot');
    setQuickReplies([]);
  }

  function finishLeadCapture() {
    const fullTranscript = transcript.map(m => `[${m.time}] ${m.sender === 'user' ? 'Visitor' : 'Bot'}: ${m.text}`).join('\n');
    addMessage(`Thanks ${leadData.name}! We've forwarded your details to our team — they'll call you at ${leadData.phone} shortly. You can also reach us directly at +91 94930 79179.`, 'bot');

    if (emailjsReady) {
      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        to_email: CLINIC_EMAIL,
        visitor_name: leadData.name,
        visitor_phone: leadData.phone,
        visitor_query: leadData.message || '(no message)',
        transcript: fullTranscript,
      }).catch(() => {
        openMailtoFallback(fullTranscript);
      });
    } else {
      openMailtoFallback(fullTranscript);
    }

    leadState = null;
    setQuickReplies(DEFAULT_QUICK_REPLIES);
  }

  function openMailtoFallback(fullTranscript) {
    const subject = encodeURIComponent(`Website chat enquiry from ${leadData.name}`);
    const body = encodeURIComponent(
      `Name: ${leadData.name}\nPhone: ${leadData.phone}\nMessage: ${leadData.message || '(no message)'}\n\n--- Full conversation ---\n${fullTranscript}`
    );
    // Only auto-open if EmailJS isn't configured, so the clinic still receives the enquiry via the visitor's own email client.
    window.open(`mailto:${CLINIC_EMAIL}?subject=${subject}&body=${body}`, '_blank');
  }

  function handleUserText(text) {
    addMessage(text, 'user');

    if (leadState === 'name') {
      leadData.name = text;
      leadState = 'phone';
      addMessage(`Nice to meet you, ${text}! What's the best phone number to reach you on?`, 'bot');
      return;
    }
    if (leadState === 'phone') {
      leadData.phone = text;
      leadState = 'message';
      addMessage("Great — anything specific you'd like us to know before we call you?", 'bot');
      return;
    }
    if (leadState === 'message') {
      leadData.message = text;
      finishLeadCapture();
      return;
    }

    const answer = findAnswer(text);
    if (answer) {
      addMessage(answer, 'bot');
      setQuickReplies(DEFAULT_QUICK_REPLIES);
    } else {
      addMessage(FALLBACK, 'bot');
      setQuickReplies([
        { label: 'Yes, connect me', action: () => startLeadCapture() },
        { label: 'Ask something else', action: () => setQuickReplies(DEFAULT_QUICK_REPLIES) },
      ]);
    }
  }

  function openChat() {
    chatbot.classList.add('open');
    if (messagesEl.childElementCount === 0) {
      addMessage("Hi! 👋 I'm the Hi Girl virtual assistant. Ask me about our treatments, pricing, timings or location — or tap a quick question below.", 'bot');
      setQuickReplies(DEFAULT_QUICK_REPLIES);
    }
  }

  launcher.addEventListener('click', () => {
    chatbot.classList.contains('open') ? chatbot.classList.remove('open') : openChat();
  });
  closeBtn.addEventListener('click', () => chatbot.classList.remove('open'));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    handleUserText(text);
  });
})();
