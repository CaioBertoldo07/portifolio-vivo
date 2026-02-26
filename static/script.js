// ========================================
// PORTFÓLIO VIVO V2.0 - JAVASCRIPT
// ========================================

// Aguarda o carregamento completo do DOM
document.addEventListener("DOMContentLoaded", function () {
  console.log("🚀 Portfólio Vivo V4.0 carregado!");

  // Inicializa o tema salvo
  initTheme();

  // V4.0: Carrega customizações salvas
  loadSavedCustomization();

  setTimeout(() => {
    console.log("Inicializando componentes...");

    // V2.0
    initLanguagesChart();
    initCommitsChart();
    initScrollAnimations();

    // V3.0
    initCommitHeatmap();
    animateComparisonNumbers();
    setupPdfDownload();
    initScrollSpy();
    updateRealtimeStats();
    initEasterEggs();

    // V4.0 - NOVAS FUNCIONALIDADES
    initTabs();
    initColorPickers();
    initColorPresets();
    initBioEditor();
    initProjectsSelector();
    initSectionToggles();
    initKeyboardShortcuts();
    showFirstTimeTour();

    setTimeout(logPerformanceMetrics, 1000);
  }, 100);
});

// ========================================
// SISTEMA DE TEMA CLARO/ESCURO
// ========================================

function initTheme() {
  // Verifica se há tema salvo no localStorage
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme) {
    document.body.setAttribute("data-theme", savedTheme);
    updateThemeIcon(savedTheme);
  } else {
    // Detecta preferência do sistema
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const defaultTheme = prefersDark ? "dark" : "light";
    document.body.setAttribute("data-theme", defaultTheme);
    updateThemeIcon(defaultTheme);
  }
}

function toggleTheme() {
  const currentTheme = document.body.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  // Animação de transição suave
  document.body.style.transition =
    "background-color 0.3s ease, color 0.3s ease";

  document.body.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  updateThemeIcon(newTheme);

  // Atualiza cores dos gráficos
  updateChartColors(newTheme);

  console.log("Tema alterado para:", newTheme);
}

function updateThemeIcon(theme) {
  const themeBtn = document.getElementById("theme-toggle");
  const icon = themeBtn.querySelector("i");
  const text = themeBtn.querySelector("span");

  if (theme === "dark") {
    icon.className = "fas fa-sun";
    text.textContent = "Claro";
  } else {
    icon.className = "fas fa-moon";
    text.textContent = "Escuro";
  }
}

// ========================================
// GRÁFICO 1: LINGUAGENS MAIS USADAS
// ========================================

let languagesChartInstance = null;

function initLanguagesChart() {
  const ctx = document.getElementById("languagesChart");

  if (!ctx) {
    console.error("Canvas de linguagens não encontrado");
    return;
  }

  if (!languagesData || Object.keys(languagesData).length === 0) {
    ctx.parentElement.innerHTML =
      '<p style="text-align: center; color: var(--text-secondary);">Nenhum dado de linguagem disponível</p>';
    return;
  }

  const languages = Object.keys(languagesData);
  const percentages = Object.values(languagesData);

  console.log("Linguagens:", languages);
  console.log("Percentagens:", percentages);

  // Cores vibrantes para as linguagens
  const colors = [
    "#38BDF8", // Azul claro
    "#818CF8", // Índigo
    "#FB923C", // Laranja
    "#34D399", // Verde
    "#F472B6", // Rosa
  ];

  // Obtém cores do tema atual
  const currentTheme = document.body.getAttribute("data-theme") || "dark";
  const textColor = currentTheme === "dark" ? "#9CA3AF" : "#475569";
  const gridColor =
    currentTheme === "dark"
      ? "rgba(156, 163, 175, 0.1)"
      : "rgba(71, 85, 105, 0.1)";

  languagesChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: languages,
      datasets: [
        {
          label: "Uso (%)",
          data: percentages,
          backgroundColor: colors,
          borderColor: colors.map((color) => color + "CC"),
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor:
            currentTheme === "dark"
              ? "rgba(17, 24, 39, 0.95)"
              : "rgba(255, 255, 255, 0.95)",
          titleColor: currentTheme === "dark" ? "#E5E7EB" : "#1E293B",
          bodyColor: currentTheme === "dark" ? "#E5E7EB" : "#1E293B",
          borderColor: "#38BDF8",
          borderWidth: 1,
          padding: 12,
          displayColors: true,
          callbacks: {
            label: function (context) {
              return `${context.parsed.y}% dos repositórios`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            color: gridColor,
            drawBorder: false,
          },
          ticks: {
            color: textColor,
            font: {
              size: 12,
            },
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            color: gridColor,
            drawBorder: false,
          },
          ticks: {
            color: textColor,
            font: {
              size: 12,
            },
            callback: function (value) {
              return value + "%";
            },
          },
        },
      },
      animation: {
        duration: 2000, // Animação mais longa e suave
        easing: "easeInOutQuart",
        delay: (context) => {
          let delay = 0;
          if (context.type === "data" && context.mode === "default") {
            delay = context.dataIndex * 100; // Efeito cascata
          }
          return delay;
        },
      },
    },
  });
}

// ========================================
// GRÁFICO 2: ATIVIDADE DE COMMITS
// ========================================

let commitsChartInstance = null;

function initCommitsChart() {
  const ctx = document.getElementById("commitsChart");

  if (!ctx) {
    console.error("Canvas de commits não encontrado");
    return;
  }

  if (!commitsData || !commitsData.labels || !commitsData.data) {
    ctx.parentElement.innerHTML =
      '<p style="text-align: center; color: var(--text-secondary);">Nenhum dado de commit disponível</p>';
    return;
  }

  console.log("Commits Data:", commitsData);

  const currentTheme = document.body.getAttribute("data-theme") || "dark";
  const textColor = currentTheme === "dark" ? "#9CA3AF" : "#475569";
  const gridColor =
    currentTheme === "dark"
      ? "rgba(156, 163, 175, 0.1)"
      : "rgba(71, 85, 105, 0.1)";

  commitsChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: commitsData.labels,
      datasets: [
        {
          label: "Atividade",
          data: commitsData.data,
          backgroundColor: "rgba(56, 189, 248, 0.2)",
          borderColor: "#38BDF8",
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointBackgroundColor: "#38BDF8",
          pointBorderColor: currentTheme === "dark" ? "#0F172A" : "#FFFFFF",
          pointBorderWidth: 2,
          pointHoverRadius: 7,
          pointHoverBackgroundColor: "#38BDF8",
          pointHoverBorderColor:
            currentTheme === "dark" ? "#E5E7EB" : "#1E293B",
          pointHoverBorderWidth: 3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor:
            currentTheme === "dark"
              ? "rgba(17, 24, 39, 0.95)"
              : "rgba(255, 255, 255, 0.95)",
          titleColor: currentTheme === "dark" ? "#E5E7EB" : "#1E293B",
          bodyColor: currentTheme === "dark" ? "#E5E7EB" : "#1E293B",
          borderColor: "#38BDF8",
          borderWidth: 1,
          padding: 12,
          displayColors: false,
          callbacks: {
            label: function (context) {
              const value = context.parsed.y;
              return value === 1
                ? `${value} atualização`
                : `${value} atualizações`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            color: gridColor,
            drawBorder: false,
          },
          ticks: {
            color: textColor,
            font: {
              size: 11,
            },
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            color: gridColor,
            drawBorder: false,
          },
          ticks: {
            color: textColor,
            font: {
              size: 11,
            },
            stepSize: 1,
            precision: 0,
          },
        },
      },
      animation: {
        duration: 2500,
        easing: "easeInOutQuart",
        delay: (context) => {
          let delay = 0;
          if (context.type === "data" && context.mode === "default") {
            delay = context.dataIndex * 150;
          }
          return delay;
        },
      },
    },
  });
}

// ========================================
// ATUALIZAR CORES DOS GRÁFICOS NO TEMA
// ========================================

function updateChartColors(theme) {
  const textColor = theme === "dark" ? "#9CA3AF" : "#475569";
  const gridColor =
    theme === "dark" ? "rgba(156, 163, 175, 0.1)" : "rgba(71, 85, 105, 0.1)";
  const tooltipBg =
    theme === "dark" ? "rgba(17, 24, 39, 0.95)" : "rgba(255, 255, 255, 0.95)";
  const tooltipText = theme === "dark" ? "#E5E7EB" : "#1E293B";

  // Atualiza gráfico de linguagens
  if (languagesChartInstance) {
    languagesChartInstance.options.scales.x.ticks.color = textColor;
    languagesChartInstance.options.scales.y.ticks.color = textColor;
    languagesChartInstance.options.scales.x.grid.color = gridColor;
    languagesChartInstance.options.scales.y.grid.color = gridColor;
    languagesChartInstance.options.plugins.tooltip.backgroundColor = tooltipBg;
    languagesChartInstance.options.plugins.tooltip.titleColor = tooltipText;
    languagesChartInstance.options.plugins.tooltip.bodyColor = tooltipText;
    languagesChartInstance.update("none"); // Atualiza sem animação
  }

  // Atualiza gráfico de commits
  if (commitsChartInstance) {
    commitsChartInstance.options.scales.x.ticks.color = textColor;
    commitsChartInstance.options.scales.y.ticks.color = textColor;
    commitsChartInstance.options.scales.x.grid.color = gridColor;
    commitsChartInstance.options.scales.y.grid.color = gridColor;
    commitsChartInstance.options.plugins.tooltip.backgroundColor = tooltipBg;
    commitsChartInstance.options.plugins.tooltip.titleColor = tooltipText;
    commitsChartInstance.options.plugins.tooltip.bodyColor = tooltipText;
    commitsChartInstance.data.datasets[0].pointBorderColor =
      theme === "dark" ? "#0F172A" : "#FFFFFF";
    commitsChartInstance.data.datasets[0].pointHoverBorderColor =
      theme === "dark" ? "#E5E7EB" : "#1E293B";
    commitsChartInstance.update("none");
  }
}

// ========================================
// ANIMAÇÕES DE SCROLL APRIMORADAS
// ========================================

function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Adiciona animação com delay baseado no índice
        entry.target.style.animation = "fadeInUp 0.6s ease-out forwards";
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const elementsToAnimate = document.querySelectorAll(
    ".stat-card, .chart-card, .project-card, .about-card",
  );

  elementsToAnimate.forEach((element, index) => {
    element.style.opacity = "0";
    element.style.animationDelay = `${index * 0.1}s`;
    observer.observe(element);
  });
}

// ========================================
// SCROLL SUAVE PARA SEÇÕES
// ========================================

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}

// ========================================
// UTILITÁRIOS
// ========================================

function showError(message) {
  console.error(message);

  const toast = document.createElement("div");
  toast.className = "error-toast";
  toast.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
    `;
  toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #EF4444;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        animation: slideInRight 0.3s ease-out;
    `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "slideOutRight 0.3s ease-out";
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}

function showSuccess(message) {
  const toast = document.createElement("div");
  toast.className = "success-toast";
  toast.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
  toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #10B981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        animation: slideInRight 0.3s ease-out;
    `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "slideOutRight 0.3s ease-out";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  }
  return num.toString();
}

// ========================================
// ANIMAÇÕES CSS ADICIONAIS
// ========================================

// Adiciona keyframes dinamicamente
const style = document.createElement("style");
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);

// ========================================
// V3.0 - MAPA DE CALOR DE COMMITS
// ========================================

function initCommitHeatmap() {
    const container = document.getElementById('commitHeatmap');
    
    if (!container) {
        console.error('Container do heatmap não encontrado');
        return;
    }
    
    if (!heatmapData || heatmapData.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">Nenhum dado de commits disponível</p>';
        return;
    }
    
    console.log('Iniciando heatmap com', heatmapData.length, 'dias');
    
    // Limpa o container
    container.innerHTML = '';
    
    // Cria os quadradinhos do heatmap
    heatmapData.forEach((day, index) => {
        const dayElement = document.createElement('div');
        dayElement.className = `heatmap-day level-${day.level}`;
        dayElement.setAttribute('data-date', day.date);
        dayElement.setAttribute('data-count', day.count);
        dayElement.title = `${day.date}: ${day.count} commits`;
        
        // Adiciona animação com delay
        dayElement.style.animation = `scaleIn 0.3s ease-out ${index * 0.001}s backwards`;
        
        // Evento de hover para mostrar tooltip
        dayElement.addEventListener('mouseenter', function(e) {
            showHeatmapTooltip(e, day);
        });
        
        dayElement.addEventListener('mouseleave', function() {
            hideHeatmapTooltip();
        });
        
        container.appendChild(dayElement);
    });
    
    console.log('✓ Heatmap renderizado com sucesso!');
}

function showHeatmapTooltip(event, day) {
    // Remove tooltip existente
    hideHeatmapTooltip();
    
    const tooltip = document.createElement('div');
    tooltip.id = 'heatmap-tooltip';
    tooltip.className = 'heatmap-tooltip';
    
    const formattedDate = formatHeatmapDate(day.date);
    const commitText = day.count === 1 ? 'commit' : 'commits';
    
    tooltip.innerHTML = `
        <strong>${formattedDate}</strong><br>
        ${day.count} ${commitText}
    `;
    
    tooltip.style.cssText = `
        position: fixed;
        background-color: var(--bg-card);
        color: var(--text-primary);
        padding: 0.75rem 1rem;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        border: 1px solid var(--accent);
        z-index: 1000;
        pointer-events: none;
        font-size: 0.9rem;
        white-space: nowrap;
    `;
    
    document.body.appendChild(tooltip);
    
    // Posiciona o tooltip
    const rect = event.target.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
    
    // Ajusta se sair da tela
    if (parseInt(tooltip.style.top) < 0) {
        tooltip.style.top = rect.bottom + 10 + 'px';
    }
}

function hideHeatmapTooltip() {
    const tooltip = document.getElementById('heatmap-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

function formatHeatmapDate(dateString) {
    const date = new Date(dateString);
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return `${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
}

// ========================================
// V3.0 - ESTATÍSTICAS DE COMPARAÇÃO
// ========================================

function animateComparisonNumbers() {
    const valueNumbers = document.querySelectorAll('.value-number');
    
    valueNumbers.forEach((element, index) => {
        const targetValue = parseInt(element.textContent);
        
        if (isNaN(targetValue)) return;
        
        let currentValue = 0;
        const increment = targetValue / 30; // 30 frames
        const duration = 1000; // 1 segundo
        const frameTime = duration / 30;
        
        element.textContent = '0';
        
        const timer = setInterval(() => {
            currentValue += increment;
            
            if (currentValue >= targetValue) {
                element.textContent = targetValue;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(currentValue);
            }
        }, frameTime);
        
        // Delay baseado no índice para efeito cascata
        setTimeout(() => {
            // Inicia a animação
        }, index * 100);
    });
}

// ========================================
// V3.0 - DOWNLOAD PDF COM FEEDBACK
// ========================================

function setupPdfDownload() {
    const downloadBtn = document.querySelector('.btn-download');
    
    if (!downloadBtn) return;
    
    downloadBtn.addEventListener('click', function(e) {
        // Mostra feedback visual
        const originalText = this.innerHTML;
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gerando PDF...';
        this.style.pointerEvents = 'none';
        
        // Restaura após 3 segundos
        setTimeout(() => {
            this.innerHTML = originalText;
            this.style.pointerEvents = 'auto';
            showSuccess('PDF gerado com sucesso!');
        }, 3000);
    });
}

// ========================================
// V3.0 - SCROLL SPY (destaca seção ativa)
// ========================================

function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        // Pode ser usado para destacar links de navegação no futuro
        console.log('Seção ativa:', current);
    });
}

// ========================================
// V3.0 - ESTATÍSTICAS EM TEMPO REAL
// ========================================

function updateRealtimeStats() {
    // Atualiza timestamp
    const footerSubtitle = document.querySelector('.footer-subtitle');
    if (footerSubtitle) {
        const now = new Date();
        const timeString = now.toLocaleTimeString('pt-BR');
        
        // Adiciona badge de "ao vivo"
        const liveBadge = document.createElement('span');
        liveBadge.style.cssText = `
            display: inline-block;
            width: 8px;
            height: 8px;
            background-color: #10B981;
            border-radius: 50%;
            margin-left: 0.5rem;
            animation: pulse 2s infinite;
        `;
        
        // Animação de pulso
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.5; transform: scale(1.2); }
            }
        `;
        document.head.appendChild(style);
    }
}

// ========================================
// V3.0 - PERFORMANCE MONITOR
// ========================================

function logPerformanceMetrics() {
    if (window.performance) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        const connectTime = perfData.responseEnd - perfData.requestStart;
        const renderTime = perfData.domComplete - perfData.domLoading;
        
        console.log('📊 Performance Metrics:');
        console.log(`  ⏱️  Tempo total de carregamento: ${pageLoadTime}ms`);
        console.log(`  🌐 Tempo de conexão: ${connectTime}ms`);
        console.log(`  🎨 Tempo de renderização: ${renderTime}ms`);
    }
}

// ========================================
// V3.0 - EASTER EGGS
// ========================================

let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

function initEasterEggs() {
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.key);
        konamiCode = konamiCode.slice(-10);
        
        if (konamiCode.join(',') === konamiSequence.join(',')) {
            activateEasterEgg();
        }
    });
    
    // Duplo clique no avatar
    const avatar = document.querySelector('.avatar');
    if (avatar) {
        let clickCount = 0;
        avatar.addEventListener('click', () => {
            clickCount++;
            if (clickCount === 5) {
                avatar.style.animation = 'spin 1s ease-in-out';
                setTimeout(() => {
                    avatar.style.animation = '';
                    clickCount = 0;
                }, 1000);
            }
        });
    }
}

function activateEasterEgg() {
    // Efeito de confete
    showSuccess('🎉 Konami Code ativado! Você é um verdadeiro dev!');
    
    // Adiciona efeito arco-íris temporário
    document.body.style.animation = 'rainbow 3s linear';
    
    setTimeout(() => {
        document.body.style.animation = '';
    }, 3000);
    
    // Animação arco-íris
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}

// ========================================
// V4.0 - PAINEL DE PERSONALIZAÇÃO
// ========================================

// Estado global das customizações
let customizationState = {
    colors: {
        primary: '#38BDF8',
        secondary: '#818CF8',
        accent: '#0EA5E9'
    },
    bio: {
        text: '',
        interests: '',
        goal: ''
    },
    selectedProjects: [],
    sections: {
        perfil: true,
        estatisticas: true,
        heatmap: true,
        comparacao: true,
        favoritos: true,
        projetos: true,
        sobre: true
    }
};

// Carrega configurações salvas ao iniciar
function loadSavedCustomization() {
    const saved = localStorage.getItem('portfolio_customization');
    
    if (saved) {
        try {
            customizationState = JSON.parse(saved);
            applyCustomization();
            console.log('✓ Configurações carregadas do localStorage');
        } catch (e) {
            console.error('Erro ao carregar configurações:', e);
        }
    }
}

// Aplica customizações
function applyCustomization() {
    // Aplica cores
    applyCustomColors();
    
    // Aplica bio
    applyCustomBio();
    
    // Aplica visibilidade de seções
    applyVisibility();
    
    // Atualiza UI do painel
    updatePanelUI();
}

// ========================================
// FUNÇÕES DO PAINEL
// ========================================

function toggleCustomizePanel() {
    const panel = document.getElementById('customize-panel');
    const overlay = document.getElementById('customize-overlay');
    
    panel.classList.toggle('active');
    overlay.classList.toggle('active');
    
    if (panel.classList.contains('active')) {
        // Carrega estado atual no painel
        updatePanelUI();
    }
}

// Navegação entre abas
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active de todos
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Adiciona active no clicado
            button.classList.add('active');
            document.querySelector(`.tab-content[data-tab="${targetTab}"]`).classList.add('active');
        });
    });
}

function updatePanelUI() {
    // Atualiza color pickers
    document.getElementById('color-primary').value = customizationState.colors.primary;
    document.getElementById('color-primary-hex').value = customizationState.colors.primary;
    
    document.getElementById('color-secondary').value = customizationState.colors.secondary;
    document.getElementById('color-secondary-hex').value = customizationState.colors.secondary;
    
    document.getElementById('color-accent').value = customizationState.colors.accent;
    document.getElementById('color-accent-hex').value = customizationState.colors.accent;
    
    // Atualiza bio
    const bioText = document.getElementById('custom-bio');
    const interests = document.getElementById('custom-interests');
    const goal = document.getElementById('custom-goal');
    
    if (customizationState.bio.text) {
        bioText.value = customizationState.bio.text;
        interests.value = customizationState.bio.interests;
        goal.value = customizationState.bio.goal;
    }
    
    updateBioPreview();
    
    // Atualiza toggles de seções
    Object.keys(customizationState.sections).forEach(section => {
        const toggle = document.getElementById(`toggle-${section}`);
        if (toggle) {
            toggle.checked = customizationState.sections[section];
        }
    });
    
    // Atualiza contagem de projetos selecionados
    updateSelectedCount();
}

// ========================================
// ABA DE CORES
// ========================================

function initColorPickers() {
    const colorInputs = document.querySelectorAll('input[type="color"]');
    
    colorInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const hexInput = document.getElementById(e.target.id + '-hex');
            hexInput.value = e.target.value.toUpperCase();
            
            // Atualiza preview em tempo real
            applyColorPreview(e.target.id, e.target.value);
        });
    });
}

function applyColorPreview(colorId, value) {
    const root = document.documentElement;
    
    if (colorId === 'color-primary') {
        root.style.setProperty('--accent', value);
    } else if (colorId === 'color-secondary') {
        // Aplica cor secundária onde necessário
        document.querySelectorAll('.comparison-icon').forEach(icon => {
            icon.style.background = `linear-gradient(135deg, ${value}, ${customizationState.colors.primary})`;
        });
    } else if (colorId === 'color-accent') {
        root.style.setProperty('--accent-hover', value);
    }
}

function applyCustomColors() {
    const root = document.documentElement;
    
    root.style.setProperty('--accent', customizationState.colors.primary);
    root.style.setProperty('--accent-hover', customizationState.colors.accent);
    
    // Atualiza gráficos se existirem
    if (languagesChartInstance || commitsChartInstance) {
        updateChartColors(document.body.getAttribute('data-theme') || 'dark');
    }
}

function resetColors() {
    customizationState.colors = {
        primary: '#38BDF8',
        secondary: '#818CF8',
        accent: '#0EA5E9'
    };
    
    applyCustomColors();
    updatePanelUI();
    
    showSuccess('Cores resetadas para o padrão!');
}

// Presets de cores
function initColorPresets() {
    const presets = {
        blue: { primary: '#38BDF8', secondary: '#818CF8', accent: '#0EA5E9' },
        purple: { primary: '#A78BFA', secondary: '#C084FC', accent: '#9333EA' },
        green: { primary: '#34D399', secondary: '#10B981', accent: '#059669' },
        orange: { primary: '#FB923C', secondary: '#F97316', accent: '#EA580C' },
        pink: { primary: '#F472B6', secondary: '#EC4899', accent: '#DB2777' },
        red: { primary: '#EF4444', secondary: '#DC2626', accent: '#B91C1C' }
    };
    
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const preset = btn.getAttribute('data-preset');
            customizationState.colors = presets[preset];
            
            applyCustomColors();
            updatePanelUI();
            
            showSuccess(`Tema ${preset} aplicado!`);
        });
    });
}

// ========================================
// ABA DE BIO
// ========================================

function initBioEditor() {
    const bioText = document.getElementById('custom-bio');
    const interests = document.getElementById('custom-interests');
    const goal = document.getElementById('custom-goal');
    
    [bioText, interests, goal].forEach(input => {
        input.addEventListener('input', updateBioPreview);
    });
}

function updateBioPreview() {
    const bioText = document.getElementById('custom-bio').value;
    const interests = document.getElementById('custom-interests').value;
    const goal = document.getElementById('custom-goal').value;
    
    const preview = document.getElementById('bio-preview-text');
    
    let html = '';
    
    if (bioText) {
        html += `<p>${bioText}</p>`;
    }
    
    if (interests) {
        html += `<p><strong>Áreas de interesse:</strong> ${interests}</p>`;
    }
    
    if (goal) {
        html += `<p><strong>🎯 Objetivo atual:</strong> ${goal}</p>`;
    }
    
    preview.innerHTML = html || '<p style="color: var(--text-muted);">Digite algo para ver o preview...</p>';
}

function applyCustomBio() {
    if (!customizationState.bio.text) return;
    
    const aboutCard = document.querySelector('.about-card');
    if (!aboutCard) return;
    
    let html = `<p class="about-text">${customizationState.bio.text}</p>`;
    
    if (customizationState.bio.interests) {
        html += `<p class="about-text"><strong>Áreas de interesse:</strong> ${customizationState.bio.interests}</p>`;
    }
    
    if (customizationState.bio.goal) {
        html += `<p class="about-text"><strong>🎯 Objetivo atual:</strong> ${customizationState.bio.goal}</p>`;
    }
    
    aboutCard.innerHTML = html;
}

// ========================================
// ABA DE PROJETOS
// ========================================

function initProjectsSelector() {
    const checkboxes = document.querySelectorAll('.project-checkbox');
    const searchInput = document.getElementById('project-search');
    
    // Event listeners para checkboxes
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const projectName = e.target.value;
            
            if (e.target.checked) {
                // Limita a 3 projetos
                if (customizationState.selectedProjects.length >= 3) {
                    e.target.checked = false;
                    showError('Você pode selecionar no máximo 3 projetos favoritos!');
                    return;
                }
                customizationState.selectedProjects.push(projectName);
            } else {
                customizationState.selectedProjects = customizationState.selectedProjects.filter(
                    p => p !== projectName
                );
            }
            
            updateSelectedCount();
        });
    });
    
    // Busca de projetos
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const projectItems = document.querySelectorAll('.project-item');
            
            projectItems.forEach(item => {
                const projectName = item.querySelector('strong').textContent.toLowerCase();
                const projectDesc = item.querySelector('.project-desc').textContent.toLowerCase();
                
                if (projectName.includes(searchTerm) || projectDesc.includes(searchTerm)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
}

function updateSelectedCount() {
    const countElement = document.getElementById('selected-count');
    if (countElement) {
        countElement.textContent = customizationState.selectedProjects.length;
    }
    
    // Marca checkboxes salvos
    document.querySelectorAll('.project-checkbox').forEach(checkbox => {
        checkbox.checked = customizationState.selectedProjects.includes(checkbox.value);
    });
}

// ========================================
// ABA DE SEÇÕES
// ========================================

function initSectionToggles() {
    const toggles = document.querySelectorAll('.sections-toggle input[type="checkbox"]');
    
    toggles.forEach(toggle => {
        toggle.addEventListener('change', (e) => {
            const sectionId = e.target.id.replace('toggle-', '');
            customizationState.sections[sectionId] = e.target.checked;
            
            // Aplica imediatamente
            applyVisibility();
        });
    });
}

function applyVisibility() {
    Object.keys(customizationState.sections).forEach(sectionId => {
        const section = document.getElementById(sectionId);
        
        if (section) {
            if (customizationState.sections[sectionId]) {
                section.style.display = 'block';
                section.style.animation = 'fadeIn 0.5s ease-out';
            } else {
                section.style.display = 'none';
            }
        }
    });
}

// ========================================
// SALVAR E RESETAR
// ========================================

function saveCustomization() {
    // Salva cores
    customizationState.colors.primary = document.getElementById('color-primary').value;
    customizationState.colors.secondary = document.getElementById('color-secondary').value;
    customizationState.colors.accent = document.getElementById('color-accent').value;
    
    // Salva bio
    customizationState.bio.text = document.getElementById('custom-bio').value;
    customizationState.bio.interests = document.getElementById('custom-interests').value;
    customizationState.bio.goal = document.getElementById('custom-goal').value;
    
    // Salva no localStorage
    localStorage.setItem('portfolio_customization', JSON.stringify(customizationState));
    
    // Aplica mudanças
    applyCustomization();
    
    // Fecha painel
    toggleCustomizePanel();
    
    showSuccess('✓ Personalização salva com sucesso!');
    
    // Opcional: Envia para o backend
    sendToBackend();
}

function sendToBackend() {
    fetch('/api/save-config', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(customizationState)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('✓ Configurações salvas no servidor');
        }
    })
    .catch(error => {
        console.error('Erro ao salvar no servidor:', error);
    });
}

function resetAllCustomization() {
    if (!confirm('Tem certeza que deseja resetar TODAS as personalizações?')) {
        return;
    }
    
    // Reset completo
    customizationState = {
        colors: {
            primary: '#38BDF8',
            secondary: '#818CF8',
            accent: '#0EA5E9'
        },
        bio: {
            text: '',
            interests: '',
            goal: ''
        },
        selectedProjects: [],
        sections: {
            perfil: true,
            estatisticas: true,
            heatmap: true,
            comparacao: true,
            favoritos: true,
            projetos: true,
            sobre: true
        }
    };
    
    // Remove do localStorage
    localStorage.removeItem('portfolio_customization');
    
    // Recarrega a página para aplicar padrões
    location.reload();
}

// ========================================
// ATALHOS DE TECLADO
// ========================================

function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K = Abre painel
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            toggleCustomizePanel();
        }
        
        // ESC = Fecha painel
        if (e.key === 'Escape') {
            const panel = document.getElementById('customize-panel');
            if (panel.classList.contains('active')) {
                toggleCustomizePanel();
            }
        }
        
        // Ctrl/Cmd + S = Salva (quando painel aberto)
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            const panel = document.getElementById('customize-panel');
            if (panel.classList.contains('active')) {
                e.preventDefault();
                saveCustomization();
            }
        }
    });
}

// ========================================
// TOUR GUIADO (Primeira vez)
// ========================================

function showFirstTimeTour() {
    const hasSeenTour = localStorage.getItem('portfolio_tour_seen');
    
    if (!hasSeenTour) {
        setTimeout(() => {
            const tourMessage = `
                🎨 Bem-vindo ao Portfólio Vivo V4.0!
                
                Clique no botão "Personalizar" no canto superior direito
                para customizar cores, bio, projetos e muito mais!
                
                Atalhos úteis:
                • Ctrl/Cmd + K → Abre painel de personalização
                • ESC → Fecha painel
                • Ctrl/Cmd + S → Salva alterações
            `;
            
            if (confirm(tourMessage + '\n\nDeseja abrir o painel agora?')) {
                toggleCustomizePanel();
            }
            
            localStorage.setItem('portfolio_tour_seen', 'true');
        }, 2000);
    }
}

// ========================================
// EXPORTAR/IMPORTAR CONFIGURAÇÕES
// ========================================

function exportConfig() {
    const dataStr = JSON.stringify(customizationState, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'portfolio-config.json';
    link.click();
    
    showSuccess('Configurações exportadas!');
}

function importConfig(file) {
    const reader = new FileReader();
    
    reader.onload = (e) => {
        try {
            customizationState = JSON.parse(e.target.result);
            applyCustomization();
            localStorage.setItem('portfolio_customization', JSON.stringify(customizationState));
            showSuccess('Configurações importadas com sucesso!');
        } catch (error) {
            showError('Erro ao importar configurações!');
        }
    };
    
    reader.readAsText(file);
}

// ========================================
// LOG DE INICIALIZAÇÃO V4.0
// ========================================

console.log(`
╔════════════════════════════════════════╗
║   🚀 PORTFÓLIO VIVO V4.0 - ATIVO 🚀   ║
║                                        ║
║  ✨ Modo Claro/Escuro                  ║
║  🎨 Personalização completa            ║
║  🎨 Escolha de cores                   ║
║  ✍️  Edição de bio                     ║
║  📁 Seleção de projetos                ║
║  👁️  Controle de seções                ║
║  📊 Gráficos dinâmicos                 ║
║  🔥 Mapa de calor                      ║
║  📈 Comparações                        ║
║  📄 Export PDF                         ║
║                                        ║
║  ⌨️  Atalhos:                          ║
║  • Ctrl+K → Abre personalização        ║
║  • ESC → Fecha painel                  ║
║  • Ctrl+S → Salva alterações           ║
║                                        ║
║  Desenvolvido com ❤️ por Capitão Caio ║
╚════════════════════════════════════════╝
`);