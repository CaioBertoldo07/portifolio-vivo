# app.py - Backend principal do Portfólio Vivo V4.0
from flask import Flask, render_template, jsonify, send_file, request
import requests
from datetime import datetime, timedelta
from collections import Counter
import io
import json
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np

# Inicializa a aplicação Flask
app = Flask(__name__)

# ========================================
# CONFIGURAÇÕES
# ========================================

GITHUB_USERNAME = "CaioBertoldo07"  # ALTERE para seu usuário

# Configurações padrão do usuário (V4.0)
DEFAULT_CONFIG = {
    'theme': {
        'primary': '#38BDF8',
        'secondary': '#818CF8',
        'accent': '#0EA5E9'
    },
    'bio': '',
    'featured_repos': [],
    'show_sections': {
        'perfil': True,
        'estatisticas': True,
        'heatmap': True,
        'comparacao': True,
        'favoritos': True,
        'projetos': True,
        'sobre': True
    }
}

# ========================================
# FUNÇÕES AUXILIARES (mantidas da V3.0)
# ========================================

def fetch_github_user():
    """Busca informações do perfil do usuário no GitHub"""
    try:
        url = f"https://api.github.com/users/{GITHUB_USERNAME}"
        response = requests.get(url, timeout=10)
        
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Erro ao buscar usuário: Status {response.status_code}")
            return None
    except Exception as e:
        print(f"Erro na requisição: {e}")
        return None


def fetch_github_repos():
    """Busca todos os repositórios públicos do usuário"""
    try:
        url = f"https://api.github.com/users/{GITHUB_USERNAME}/repos"
        params = {"sort": "updated", "per_page": 100}
        response = requests.get(url, params=params, timeout=10)
        
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Erro ao buscar repositórios: Status {response.status_code}")
            return []
    except Exception as e:
        print(f"Erro na requisição: {e}")
        return []


def calculate_language_stats(repos):
    """Calcula estatísticas de linguagens usadas"""
    language_counter = Counter()
    
    for repo in repos:
        if repo.get('language'):
            language_counter[repo['language']] += 1
    
    total = sum(language_counter.values())
    
    if total == 0:
        return {}
    
    language_stats = {
        lang: round((count / total) * 100, 1)
        for lang, count in language_counter.most_common(5)
    }
    
    return language_stats


def get_commit_activity(repos):
    """Gera dados simulados de atividade de commits"""
    recent_repos = sorted(repos, key=lambda x: x['updated_at'], reverse=True)[:5]
    
    labels = []
    data = []
    
    for i in range(7):
        date = datetime.now() - timedelta(days=6-i)
        labels.append(date.strftime("%d/%m"))
        data.append(len([r for r in recent_repos if r['updated_at'][:10] >= date.strftime("%Y-%m-%d")]))
    
    return {"labels": labels, "data": data}


def get_featured_projects(repos):
    """Seleciona os 5 projetos em destaque"""
    own_repos = [repo for repo in repos if not repo.get('fork')]
    sorted_repos = sorted(own_repos, key=lambda x: x['updated_at'], reverse=True)
    
    featured = []
    for repo in sorted_repos[:5]:
        featured.append({
            'name': repo['name'],
            'description': repo['description'] or 'Sem descrição disponível',
            'language': repo['language'] or 'N/A',
            'updated_at': format_date(repo['updated_at']),
            'html_url': repo['html_url'],
            'stars': repo['stargazers_count']
        })
    
    return featured


def format_date(date_string):
    """Formata data ISO para formato brasileiro"""
    try:
        date_obj = datetime.strptime(date_string, "%Y-%m-%dT%H:%M:%SZ")
        return date_obj.strftime("%d/%m/%Y")
    except:
        return "Data indisponível"


def fetch_commit_heatmap_data():
    """Gera dados para o mapa de calor de commits"""
    try:
        url = f"https://api.github.com/users/{GITHUB_USERNAME}/events"
        response = requests.get(url, timeout=10)
        
        if response.status_code != 200:
            return generate_mock_heatmap()
        
        events = response.json()
        commit_counts = Counter()
        
        for event in events:
            if event['type'] == 'PushEvent':
                date = event['created_at'][:10]
                commit_counts[date] += len(event.get('payload', {}).get('commits', []))
        
        heatmap_data = []
        for i in range(365):
            date = datetime.now() - timedelta(days=365-i)
            date_str = date.strftime("%Y-%m-%d")
            count = commit_counts.get(date_str, 0)
            heatmap_data.append({
                'date': date_str,
                'count': count,
                'level': get_commit_level(count)
            })
        
        return heatmap_data
        
    except Exception as e:
        print(f"Erro ao buscar heatmap: {e}")
        return generate_mock_heatmap()


def generate_mock_heatmap():
    """Gera dados simulados para o heatmap"""
    heatmap_data = []
    for i in range(365):
        date = datetime.now() - timedelta(days=365-i)
        count = np.random.choice([0, 0, 0, 1, 2, 3, 5, 8], p=[0.3, 0.2, 0.15, 0.15, 0.1, 0.05, 0.03, 0.02])
        heatmap_data.append({
            'date': date.strftime("%Y-%m-%d"),
            'count': count,
            'level': get_commit_level(count)
        })
    return heatmap_data


def get_commit_level(count):
    """Determina o nível de cor baseado na quantidade de commits"""
    if count == 0:
        return 0
    elif count <= 2:
        return 1
    elif count <= 5:
        return 2
    elif count <= 10:
        return 3
    else:
        return 4


def compare_with_developers(user_data, repos_data):
    """Compara estatísticas do usuário com médias"""
    averages = {
        'repos': 15,
        'followers': 10,
        'stars_total': 30,
        'languages_count': 3
    }
    
    total_stars = sum(repo.get('stargazers_count', 0) for repo in repos_data)
    languages_count = len(calculate_language_stats(repos_data))
    
    user_stats = {
        'repos': user_data.get('public_repos', 0),
        'followers': user_data.get('followers', 0),
        'stars_total': total_stars,
        'languages_count': languages_count
    }
    
    comparison = {}
    for key in averages:
        user_val = user_stats[key]
        avg_val = averages[key]
        
        if avg_val > 0:
            diff_percent = round(((user_val - avg_val) / avg_val) * 100, 1)
        else:
            diff_percent = 0
        
        comparison[key] = {
            'user': user_val,
            'average': avg_val,
            'diff_percent': diff_percent,
            'status': 'acima' if diff_percent > 0 else 'abaixo' if diff_percent < 0 else 'média'
        }
    
    return comparison


def generate_pdf_portfolio(user_data, repos_data, language_stats):
    """Gera PDF do portfólio"""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    story = []
    
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#38BDF8'),
        spaceAfter=30,
        alignment=TA_CENTER
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=16,
        textColor=colors.HexColor('#38BDF8'),
        spaceAfter=12,
        spaceBefore=12
    )
    
    story.append(Paragraph(f"Portfólio - {user_data.get('name', 'Desenvolvedor')}", title_style))
    story.append(Spacer(1, 0.3*inch))
    
    story.append(Paragraph("Perfil GitHub", heading_style))
    
    profile_data = [
        ['Nome:', user_data.get('name', 'N/A')],
        ['Usuário:', user_data.get('login', 'N/A')],
        ['Bio:', user_data.get('bio', 'N/A')],
        ['Repositórios:', str(user_data.get('public_repos', 0))],
        ['Seguidores:', str(user_data.get('followers', 0))],
        ['Localização:', user_data.get('location', 'N/A')],
    ]
    
    profile_table = Table(profile_data, colWidths=[2*inch, 4*inch])
    profile_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#E5E7EB')),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey)
    ]))
    
    story.append(profile_table)
    story.append(Spacer(1, 0.3*inch))
    
    if language_stats:
        story.append(Paragraph("Linguagens Mais Usadas", heading_style))
        
        lang_data = [['Linguagem', 'Uso (%)']]
        for lang, percent in language_stats.items():
            lang_data.append([lang, f"{percent}%"])
        
        lang_table = Table(lang_data, colWidths=[3*inch, 2*inch])
        lang_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#38BDF8')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('GRID', (0, 0), (-1, -1), 1, colors.grey)
        ]))
        
        story.append(lang_table)
        story.append(Spacer(1, 0.3*inch))
    
    story.append(Paragraph("Projetos em Destaque", heading_style))
    
    featured = get_featured_projects(repos_data)
    for i, project in enumerate(featured[:5], 1):
        project_text = f"<b>{i}. {project['name']}</b><br/>"
        project_text += f"Descrição: {project['description']}<br/>"
        project_text += f"Linguagem: {project['language']} | Stars: {project['stars']}<br/>"
        project_text += f"Atualizado: {project['updated_at']}"
        
        story.append(Paragraph(project_text, styles['Normal']))
        story.append(Spacer(1, 0.15*inch))
    
    story.append(Spacer(1, 0.5*inch))
    footer_text = f"Gerado automaticamente em {datetime.now().strftime('%d/%m/%Y %H:%M')}"
    story.append(Paragraph(footer_text, ParagraphStyle('Footer', parent=styles['Normal'], fontSize=8, textColor=colors.grey, alignment=TA_CENTER)))
    
    doc.build(story)
    buffer.seek(0)
    
    return buffer


# ========================================
# ROTAS EXISTENTES
# ========================================

@app.route('/')
def index():
    """Rota principal"""
    user_data = fetch_github_user()
    repos_data = fetch_github_repos()
    
    if not user_data:
        user_data = {
            'login': GITHUB_USERNAME,
            'name': 'Capitão Caio',
            'bio': 'Desenvolvedor em construção',
            'avatar_url': '',
            'public_repos': 0,
            'followers': 0,
            'location': 'Brasil',
            'html_url': f'https://github.com/{GITHUB_USERNAME}'
        }
    
    language_stats = calculate_language_stats(repos_data)
    commit_activity = get_commit_activity(repos_data)
    featured_projects = get_featured_projects(repos_data)
    heatmap_data = fetch_commit_heatmap_data()
    comparison_data = compare_with_developers(user_data, repos_data)
    
    # V4.0: Lista completa de repos para seleção
    all_repos = []
    for repo in repos_data:
        all_repos.append({
            'name': repo['name'],
            'description': repo['description'] or 'Sem descrição',
            'language': repo['language'] or 'N/A',
            'stars': repo['stargazers_count'],
            'html_url': repo['html_url']
        })
    
    context = {
        'user': user_data,
        'languages': language_stats,
        'commits': commit_activity,
        'projects': featured_projects,
        'total_repos': len(repos_data),
        'heatmap': heatmap_data,
        'comparison': comparison_data,
        'all_repos': all_repos,  # V4.0
        'default_config': DEFAULT_CONFIG  # V4.0
    }
    
    return render_template('index.html', **context)


@app.route('/api/github')
def api_github():
    """Rota API"""
    user_data = fetch_github_user()
    repos_data = fetch_github_repos()
    
    return jsonify({
        'user': user_data,
        'stats': {
            'languages': calculate_language_stats(repos_data),
            'total_repos': len(repos_data)
        },
        'featured_projects': get_featured_projects(repos_data)
    })


@app.route('/download-pdf')
def download_pdf():
    """Download PDF"""
    user_data = fetch_github_user()
    repos_data = fetch_github_repos()
    language_stats = calculate_language_stats(repos_data)
    
    if not user_data:
        return "Erro ao gerar PDF", 500
    
    pdf_buffer = generate_pdf_portfolio(user_data, repos_data, language_stats)
    
    filename = f"portfolio_{GITHUB_USERNAME}_{datetime.now().strftime('%Y%m%d')}.pdf"
    
    return send_file(
        pdf_buffer,
        mimetype='application/pdf',
        as_attachment=True,
        download_name=filename
    )


@app.route('/api/heatmap')
def api_heatmap():
    """API Heatmap"""
    heatmap_data = fetch_commit_heatmap_data()
    return jsonify(heatmap_data)


@app.route('/api/comparison')
def api_comparison():
    """API Comparação"""
    user_data = fetch_github_user()
    repos_data = fetch_github_repos()
    comparison = compare_with_developers(user_data, repos_data)
    
    return jsonify(comparison)


# ========================================
# NOVAS ROTAS V4.0 - PERSONALIZAÇÃO
# ========================================

@app.route('/api/save-config', methods=['POST'])
def save_config():
    """
    V4.0: Salva configurações do usuário
    (Na versão real, salvaria em banco de dados)
    """
    try:
        config = request.get_json()
        
        # Validação básica
        if not config:
            return jsonify({'success': False, 'error': 'Configuração vazia'}), 400
        
        # Em produção, salvaria no banco de dados
        # Por enquanto, apenas retorna sucesso
        
        return jsonify({
            'success': True,
            'message': 'Configurações salvas com sucesso!'
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/get-repos')
def get_all_repos():
    """
    V4.0: Retorna lista de todos os repositórios para seleção
    """
    repos_data = fetch_github_repos()
    
    repos_list = []
    for repo in repos_data:
        repos_list.append({
            'name': repo['name'],
            'description': repo['description'] or 'Sem descrição',
            'language': repo['language'] or 'N/A',
            'stars': repo['stargazers_count'],
            'updated_at': format_date(repo['updated_at'])
        })
    
    return jsonify(repos_list)


# ========================================
# EXECUÇÃO
# ========================================

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)