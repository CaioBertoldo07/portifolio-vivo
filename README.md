# 🚀 **Portfólio Vivo — GitHub Powered**

## 📌 Visão Geral do Projeto

O **Portfólio Vivo** é uma aplicação web dinâmica que se atualiza automaticamente com base nos dados públicos do seu perfil do GitHub. O objetivo é criar um portfólio profissional, técnico e visualmente atraente que **reflete sua evolução como desenvolvedor em tempo real**.

Quanto mais você codar, mais o site evolui.

### 🎯 Objetivos Principais

* Criar um portfólio **automatizado e data-driven**
* Demonstrar capacidade de consumir APIs reais
* Integrar backend (Python) com frontend moderno
* Produzir um projeto forte para GitHub e LinkedIn
* Servir como base para futuras extensões pessoais

---

## 🌐 Funcionalidades (Versão 1.0 — MVP)

### ✅ Página Única — Home do Portfólio

A página principal conterá as seguintes seções:

### 1️⃣ Header (Apresentação)

* Nome: **Capitão Caio**
* Título: *“Desenvolvedor em construção | Python | Web | IoT”*
* Avatar ou foto de perfil
* Botão/link direto para GitHub

### 2️⃣ Perfil GitHub (Dados Automáticos)

Consumidos via **GitHub REST API**:

* Foto do perfil
* Nome e bio
* Quantidade de repositórios
* Número de seguidores
* Localização (se disponível)
* Link para perfil no GitHub

### 3️⃣ Estatísticas Dinâmicas

Dois gráficos principais (gerados no frontend):

#### 📊 Linguagens Mais Usadas

Gráfico de barras mostrando porcentagem aproximada de:

* Python
* JavaScript
* HTML/CSS
* Outras linguagens detectadas nos repositórios

#### 📈 Commits Recentes

Gráfico mostrando atividade de commits nas últimas semanas.

### 4️⃣ Projetos em Destaque (Dinâmico)

Lista automática dos **5 repositórios mais recentes ou mais ativos**, exibindo:

* Nome do projeto
* Descrição
* Linguagem principal
* Data do último commit
* Botão “Ver no GitHub”

### 5️⃣ Sobre Mim (Manual)

Texto editável diretamente no código, exemplo:

> “Sou estudante de Engenharia da Computação, apaixonado por Python, automação e sistemas inteligentes. Atualmente focado em desenvolvimento web e projetos de IoT.”

---

## 🛠️ Arquitetura e Tecnologias

### 🔹 Backend (Python)

**Flask**
Responsabilidades:

* Consumir GitHub API
* Processar dados
* Enviar informações estruturadas para o frontend
* Tratar erros (ex: API fora do ar)

Endpoints principais:

* `/` → Página principal do portfólio
* `/api/github` → (opcional no futuro) retorna dados tratados do GitHub

### 🔹 Frontend

* HTML5
* CSS3 (layout moderno e responsivo)
* JavaScript
* **Chart.js** para visualização de dados

### 🔹 APIs Utilizadas

* GitHub REST API:

  * `https://api.github.com/users/{usuario}`
  * `https://api.github.com/users/{usuario}/repos`

---

## 📂 Estrutura do Projeto

```
portfolio-vivo/
│
├── app.py
├── requirements.txt
│
├── templates/
│   └── index.html
│
└── static/
   ├── style.css
   └── script.js
```

---

## 📋 Plano de Desenvolvimento (Etapas)

### ✅ **Etapa 1 — Setup Inicial**

* Criar repositório no GitHub
* Estruturar pastas do projeto
* Instalar dependências (`Flask`, `requests`)

### ✅ **Etapa 2 — Backend Básico (Flask)**

* Criar `app.py`
* Implementar rota `/` renderizando `index.html`
* Testar servidor local (`flask run`)

### ✅ **Etapa 3 — Integração com GitHub API**

* Fazer requisição para:

  * Dados do usuário
  * Lista de repositórios
* Tratar respostas e erros
* Enviar dados para template HTML

### ✅ **Etapa 4 — Frontend Estruturado**

* Criar layout base em HTML
* Criar cards para:

  * Perfil
  * Estatísticas
  * Projetos

### ✅ **Etapa 5 — Visualização de Dados**

* Integrar Chart.js
* Criar:

  * Gráfico de linguagens
  * Gráfico de commits

### ✅ **Etapa 6 — Estilização Profissional**

* Aplicar design moderno com CSS:

  * Layout em grid
  * Cards com sombra
  * Tipografia limpa
  * Responsividade para mobile

---

## 🚀 Roadmap de Evoluções (Versões Futuras)

### 🔥 **Versão 2.0 — UX Melhorada**

* Modo claro / escuro 🌙☀️
* Animações suaves ao rolar a página
* Transições nos gráficos
* Seção “Projetos Favoritos” (selecionados manualmente)

### 🔥 **Versão 3.0 — Portfólio Inteligente**

* Gerar **PDF automático** do portfólio
* Comparar estatísticas com outros devs
* Mostrar “mapa de calor” de commits (estilo GitHub)

### 🔥 **Versão 4.0 — Personalização**

* Permitir que o usuário:

  * Escolha cores
  * Selecione quais projetos aparecem
  * Edite bio pelo próprio site

---

## 🎨 Identidade Visual (Design Guideline)

### 🎯 Tema Geral

* Estilo: Moderno, minimalista e tecnológico
* Público-alvo: Recrutadores, desenvolvedores e estudantes

### 🎨 Paleta de Cores (sugestão)

* Fundo principal: `#0F172A` (azul escuro quase preto)
* Cards: `#111827`
* Destaque principal: `#38BDF8` (azul claro)
* Texto primário: `#E5E7EB`
* Texto secundário: `#9CA3AF`

### 🖼️ Tipografia

* Fonte principal: **Inter** ou **Montserrat**
* Títulos: peso 600
* Corpo do texto: peso 400

### 📐 Layout

* Layout em **Grid**
* Cards arredondados (border-radius: 12px)
* Sombras leves para profundidade
* Responsivo (mobile-first)

---

## 📦 Dependências Principais

```
Flask==2.x
requests==2.x
```

---

## ▶️ Como Executar o Projeto (futuro)

```bash
git clone https://github.com/seu-usuario/portfolio-vivo.git
cd portfolio-vivo
pip install -r requirements.txt
flask run
```

Acesse: `http://127.0.0.1:5000`

---

## 🤝 Contribuição

Sugestões e melhorias são bem-vindas via Issues ou Pull Requests.

---

## 📄 Licença

MIT License


