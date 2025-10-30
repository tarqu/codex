document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const scrollButtons = document.querySelectorAll('[data-scroll-to]');
  const statNumbers = document.querySelectorAll('.stat-number');
  const budgetRange = document.querySelector('#budgetRange');
  const budgetValue = document.querySelector('#budgetValue');
  const plannerRoas = document.querySelector('#plannerRoas');
  const plannerRevenue = document.querySelector('#plannerRevenue');
  const plannerLeads = document.querySelector('#plannerLeads');
  const consultForm = document.querySelector('#consultForm');
  const formStatus = document.querySelector('.form-status');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const caseCards = document.querySelectorAll('.case-card');
  const caseToggles = document.querySelectorAll('.case-toggle');
  const slides = Array.from(document.querySelectorAll('.slide'));
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');
  const accordionItems = document.querySelectorAll('.accordion-item');
  const year = document.querySelector('#year');
  const assistantToggle = document.querySelector('.assistant-toggle');
  const assistantPanel = document.querySelector('.assistant-panel');
  const assistantForm = document.querySelector('#assistantForm');
  const assistantInput = document.querySelector('#assistantInput');
  const assistantChat = document.querySelector('.assistant-chat');
  const assistantSuggestions = document.querySelectorAll('.assistant-suggestions button');

  /* Navigasyon */
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  /* Smooth scroll */
  scrollButtons.forEach(button => {
    button.addEventListener('click', () => {
      const target = document.querySelector(button.dataset.scrollTo);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* Stat counter */
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const targetValue = parseFloat(el.dataset.target);
          const isDecimal = !Number.isInteger(targetValue);
          const duration = 1800;
          const startTime = performance.now();

          const step = now => {
            const progress = Math.min((now - startTime) / duration, 1);
            const current = targetValue * progress;
            el.textContent = isDecimal ? current.toFixed(1) : Math.floor(current).toLocaleString('tr-TR');
            if (progress < 1) {
              requestAnimationFrame(step);
            }
          };

          requestAnimationFrame(step);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.6 });

    statNumbers.forEach(stat => observer.observe(stat));
  }

  /* Bütçe simülatörü */
  const formatCurrency = value => new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0
  }).format(value);

  const updatePlanner = value => {
    const numericValue = Number(value);
    const efficiencyBoost = Math.min(1.4, 1 + (numericValue / 250000) * 0.4);
    const roas = (4.2 * efficiencyBoost).toFixed(1);
    const revenue = numericValue * roas;
    const leads = Math.round((numericValue / 125) * efficiencyBoost);

    budgetValue.textContent = formatCurrency(numericValue);
    plannerRoas.textContent = `${roas}x`;
    plannerRevenue.textContent = formatCurrency(revenue);
    plannerLeads.textContent = leads.toLocaleString('tr-TR');
  };

  if (budgetRange) {
    updatePlanner(budgetRange.value);
    budgetRange.addEventListener('input', event => updatePlanner(event.target.value));
  }

  /* Form */
  if (consultForm) {
    consultForm.addEventListener('submit', event => {
      event.preventDefault();
      const formData = new FormData(consultForm);
      const name = formData.get('name');
      formStatus.textContent = `${name}, takvim bağlantısını e-posta ile paylaşıyorum. Görüşmek üzere!`;
      consultForm.reset();
      updatePlanner(budgetRange.value);
    });
  }

  /* Filtreler */
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      caseCards.forEach(card => {
        const isVisible = filter === 'all' || card.dataset.category === filter;
        card.style.display = isVisible ? 'grid' : 'none';
      });
    });
  });

  /* Case toggle */
  caseToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const details = toggle.nextElementSibling;
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      if (details) {
        details.hidden = expanded;
      }
    });
  });

  /* Testimonials slider */
  let slideIndex = 0;
  const showSlide = index => {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
      slide.setAttribute('aria-hidden', String(i !== index));
    });
  };

  const nextSlide = () => {
    slideIndex = (slideIndex + 1) % slides.length;
    showSlide(slideIndex);
  };

  const prevSlide = () => {
    slideIndex = (slideIndex - 1 + slides.length) % slides.length;
    showSlide(slideIndex);
  };

  if (nextBtn && prevBtn && slides.length) {
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    setInterval(nextSlide, 6000);
    showSlide(slideIndex);
  }

  /* Accordion */
  accordionItems.forEach(item => {
    item.addEventListener('click', () => {
      const expanded = item.getAttribute('aria-expanded') === 'true';
      accordionItems.forEach(other => {
        if (other !== item) {
          other.setAttribute('aria-expanded', 'false');
          const otherContent = other.querySelector('.accordion-content');
          if (otherContent) {
            otherContent.hidden = true;
          }
        }
      });

      const content = item.querySelector('.accordion-content');
      item.setAttribute('aria-expanded', String(!expanded));
      if (content) {
        content.hidden = expanded;
      }
    });
  });

  /* Footer yıl */
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  /* AI Asistanı */
  const knowledgeBase = [
    {
      keywords: ['meta', 'facebook', 'instagram'],
      response: 'Meta kampanyalarında dönüşüm sorunları genellikle pixel/CAPI entegrasyonundan kaynaklanır. Veri akışını doğrulayıp, kreatifleri Advantage+ katalog kampanyasıyla test edin. İlk 72 saat öğrenme sürecine müdahale etmeyin.'
    },
    {
      keywords: ['google', 'ads', 'search', 'display'],
      response: 'Google Ads bütçenizi %60 arama, %25 remarketing ve %15 deney bütçesi olarak bölebilirsiniz. Negatif anahtar kelimeleri haftalık güncelleyin ve hedef CPA stratejisini dönüşüm verisi 30\'u geçtiğinde aktive edin.'
    },
    {
      keywords: ['metrik', 'roas', 'cpa', 'kpi'],
      response: 'ROAS, CPA ve müşteriye özgü LTV metriklerini haftalık dashboard üzerinden takip edin. Huninin üst segmentlerinde CTR ve scroll derinliği gibi erken sinyaller kritik.'
    },
    {
      keywords: ['lead', 'form', 'crm'],
      response: 'Lead topluyorsanız Meta lead form cevaplarını CRM\'inize webhooks ile aktarın. Lead kalite skorunu AI ile belirleyip, satış ekibine sıcak lead bildirimi gönderin.'
    }
  ];

  const defaultResponse = 'Sorunuzu biraz daha detaylandırabilir misiniz? Kampanya hedefiniz, bütçeniz ve mevcut performans metrikleriniz üzerinden özel öneriler sunabilirim.';

  const createMessage = (text, author) => {
    const bubble = document.createElement('div');
    bubble.className = `message ${author}`;
    bubble.textContent = text;
    assistantChat.appendChild(bubble);
    assistantChat.scrollTop = assistantChat.scrollHeight;
  };

  const getAIResponse = prompt => {
    const normalized = prompt.toLowerCase();
    for (const item of knowledgeBase) {
      if (item.keywords.some(keyword => normalized.includes(keyword))) {
        return item.response;
      }
    }
    return defaultResponse;
  };

  const handleAssistantSubmission = value => {
    const question = value.trim();
    if (!question) return;
    createMessage(question, 'user');
    assistantInput.value = '';
    setTimeout(() => {
      createMessage(getAIResponse(question), 'ai');
    }, 450);
  };

  if (assistantToggle && assistantPanel) {
    assistantToggle.addEventListener('click', () => {
      const expanded = assistantToggle.getAttribute('aria-expanded') === 'true';
      assistantToggle.setAttribute('aria-expanded', String(!expanded));
      assistantPanel.hidden = expanded;
      if (!expanded && assistantChat.children.length === 0) {
        createMessage('Merhaba, Semih Bayındır\'ın AI asistanıyım. Kampanyalarınızla ilgili her türlü soruyu sorabilirsiniz.', 'ai');
      }
    });
  }

  if (assistantForm) {
    assistantForm.addEventListener('submit', event => {
      event.preventDefault();
      handleAssistantSubmission(assistantInput.value);
    });
  }

  assistantSuggestions.forEach(button => {
    button.addEventListener('click', () => {
      handleAssistantSubmission(button.dataset.question || button.textContent);
    });
  });

  /* Nav scroll highlight */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  const highlightNav = () => {
    const fromTop = window.scrollY + 120;
    let activeId = '';
    sections.forEach(section => {
      if (section.offsetTop <= fromTop && section.offsetTop + section.offsetHeight > fromTop) {
        activeId = section.id;
      }
    });
    navAnchors.forEach(link => {
      const targetId = (link.getAttribute('href') || '').replace('#', '');
      link.classList.toggle('active', targetId === activeId);
    });
  };

  highlightNav();
  window.addEventListener('scroll', highlightNav);
});
