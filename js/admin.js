// js/admin.js - VERSÃO CORRIGIDA
let portfolioData = {};
let isAuthenticated = false;

// Credenciais de acesso
const ADMIN_CREDENTIALS = {
    username: "bruno",
    password: "100588"
};

// Função principal quando o documento carrega
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Admin carregando...');
    setupLoginForm();
    loadNavigation();
    
    // Verificar se já está autenticado
    checkAuthentication();
});

// CONFIGURAR LOGIN
function setupLoginForm() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if (authenticate(username, password)) {
                loginSuccess();
            } else {
                showLoginError();
            }
        });
    }
}

// AUTENTICAÇÃO
function authenticate(username, password) {
    return username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password;
}

function checkAuthentication() {
    const auth = localStorage.getItem('adminAuthenticated');
    if (auth === 'true') {
        loginSuccess();
    }
}

function loginSuccess() {
    isAuthenticated = true;
    localStorage.setItem('adminAuthenticated', 'true');
    
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('admin-content').style.display = 'block';
    
    loadPortfolioData();
    console.log('✅ Login realizado com sucesso!');
}

function showLoginError() {
    const errorElement = document.getElementById('login-error');
    if (errorElement) {
        errorElement.style.display = 'block';
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 3000);
    }
}

function logout() {
    isAuthenticated = false;
    localStorage.removeItem('adminAuthenticated');
    location.reload();
}

function requireAuth() {
    if (!isAuthenticated) {
        alert('Você precisa estar logado para executar esta ação!');
        return false;
    }
    return true;
}

// CARREGAR DADOS - FUNÇÃO CORRIGIDA
function loadPortfolioData() {
    console.log('📥 Carregando dados para o admin...');
    
    try {
        const savedData = localStorage.getItem('portfolioData');
        
        if (savedData) {
            portfolioData = JSON.parse(savedData);
            console.log('✅ Dados carregados no admin:', portfolioData);
            updateAdminContent();
        } else {
            console.log('ℹ️ Nenhum dado salvo, carregando padrão...');
            loadDefaultData();
        }
    } catch (error) {
        console.error('❌ Erro ao carregar dados:', error);
        loadDefaultData();
    }
}

function loadDefaultData() {
    portfolioData = {
        home: {
            title: "Olá, eu sou Bruno Degrandi",
            subtitle: "Especialista em Suporte Técnico",
            profileImage: "assets/images/profile.png" 
        },
        about: {
            text: "Sou um profissional apaixonado por tecnologia com experiência em suporte técnico e consultoria."
        },
        skills: [
            { name: "Suporte Técnico", icon: "fas fa-headset" },
            { name: "Consultoria IT", icon: "fas fa-laptop-code" },
            { name: "Resolução de Problemas", icon: "fas fa-tools" }
        ],
        trabalhos: [
            { 
                title: "Analista de Suporte - Empresa XYZ", 
                description: "Atendimento e suporte técnico para clientes corporativos.", 
                image: "assets/images/trabalho1.jpg"
            }
        ],
        contact: {
            linkedin: "https://linkedin.com/in/bruno-degrandi",
            whatsapp: "https://wa.me/5511997503821"
        }
    };
    
    updateAdminContent();
}

// ATUALIZAR CONTEÚDO DO ADMIN - FUNÇÃO CORRIGIDA
function updateAdminContent() {
    console.log('🔄 Atualizando conteúdo do admin...');
    
    if (!portfolioData) {
        console.error('❌ Dados do portfólio não carregados');
        return;
    }
    
    // Preencher seção Home
    if (portfolioData.home) {
        document.getElementById('home-title').value = portfolioData.home.title;
        document.getElementById('home-subtitle').value = portfolioData.home.subtitle;
    }
    
    // Preencher seção About
    if (portfolioData.about) {
        document.getElementById('about-text').value = portfolioData.about.text;
    }
    
    // Preencher seção Contact
    if (portfolioData.contact) {
        document.getElementById('linkedin-url').value = portfolioData.contact.linkedin || "https://linkedin.com/in/seu-perfil";
        document.getElementById('whatsapp-url').value = portfolioData.contact.whatsapp || "https://wa.me/5511997503821";
    }
    
    // Renderizar habilidades
    renderSkillsList();
    
    // Renderizar trabalhos
    renderTrabalhosList();
    
    console.log('✅ Admin atualizado com sucesso');
}

// NAVEGAÇÃO
function loadNavigation() {
    const navItems = document.querySelectorAll('.list-group-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remover active de todos
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Adicionar active ao clicado
            this.classList.add('active');
            
            // Mostrar seção correspondente
            const target = this.getAttribute('href').substring(1);
            showSection(target);
        });
    });
}

function showSection(sectionId) {
    // Ocultar todas as seções
    document.querySelectorAll('.admin-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Mostrar seção selecionada
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
    }
}

// SEÇÃO HOME
function saveHomeSection() {
    if (!requireAuth()) return;
    
    portfolioData.home = {
        title: document.getElementById('home-title').value,
        subtitle: document.getElementById('home-subtitle').value,
        profileImage: portfolioData.home?.profileImage || "assets/images/profile.png"
    };
    
    // Processar upload de imagem se existir
    const imageInput = document.getElementById('profile-image-input');
    if (imageInput.files.length > 0) {
        const file = imageInput.files[0];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            portfolioData.home.profileImage = e.target.result;
            saveToLocalStorage();
        };
        
        reader.readAsDataURL(file);
    } else {
        saveToLocalStorage();
    }
}

// SEÇÃO ABOUT
function saveAboutSection() {
    if (!requireAuth()) return;
    
    portfolioData.about = {
        text: document.getElementById('about-text').value
    };
    
    saveToLocalStorage();
}

// SEÇÃO HABILIDADES
function renderSkillsList() {
    if (!requireAuth()) return;
    
    const skillsList = document.getElementById('skills-list');
    if (!skillsList) return;
    
    skillsList.innerHTML = '';
    
    if (!portfolioData.skills || portfolioData.skills.length === 0) {
        skillsList.innerHTML = '<p class="text-muted">Nenhuma habilidade cadastrada.</p>';
        return;
    }
    
    portfolioData.skills.forEach((skill, index) => {
        const skillItem = document.createElement('div');
        skillItem.className = 'list-item mb-3 p-3 border rounded';
        skillItem.innerHTML = `
            <h5>Habilidade #${index + 1}</h5>
            <div class="row">
                <div class="col-md-6">
                    <label class="form-label">Nome da Habilidade</label>
                    <input type="text" class="form-control" value="${skill.name}" 
                           onchange="updateSkill(${index}, 'name', this.value)">
                </div>
                <div class="col-md-6">
                    <label class="form-label">Ícone (Font Awesome)</label>
                    <input type="text" class="form-control" value="${skill.icon}" 
                           onchange="updateSkill(${index}, 'icon', this.value)">
                    <small class="form-text text-muted">Ex: fas fa-code, fas fa-laptop</small>
                </div>
            </div>
            <button class="btn btn-danger btn-sm mt-2" onclick="removeSkill(${index})">
                <i class="fas fa-trash"></i> Remover
            </button>
            <hr>
        `;
        skillsList.appendChild(skillItem);
    });
}

function addNewSkill() {
    if (!requireAuth()) return;
    
    if (!portfolioData.skills) portfolioData.skills = [];
    portfolioData.skills.push({
        name: "Nova Habilidade",
        icon: "fas fa-star"
    });
    
    renderSkillsList();
}

function updateSkill(index, field, value) {
    if (!requireAuth()) return;
    if (portfolioData.skills && portfolioData.skills[index]) {
        portfolioData.skills[index][field] = value;
    }
}

function removeSkill(index) {
    if (!requireAuth()) return;
    if (confirm('Tem certeza que deseja remover esta habilidade?')) {
        portfolioData.skills.splice(index, 1);
        renderSkillsList();
    }
}

function saveSkillsSection() {
    if (!requireAuth()) return;
    saveToLocalStorage();
    showSuccessMessage('Habilidades salvas com sucesso!');
}

// SEÇÃO TRABALHOS - FUNÇÕES CORRIGIDAS (SEM LINK E SEM CÓDIGO DA IMAGEM)
function renderTrabalhosList() {
    if (!requireAuth()) return;
    
    const trabalhosList = document.getElementById('trabalhos-list');
    if (!trabalhosList) return;
    
    trabalhosList.innerHTML = '';
    
    if (!portfolioData.trabalhos || portfolioData.trabalhos.length === 0) {
        trabalhosList.innerHTML = '<p class="text-muted">Nenhum trabalho cadastrado.</p>';
        return;
    }
    
    portfolioData.trabalhos.forEach((trabalho, index) => {
        const trabalhoItem = document.createElement('div');
        trabalhoItem.className = 'list-item mb-4 p-3 border rounded';
        
        // Determinar se a imagem é base64 ou URL normal
        const isBase64Image = trabalho.image && trabalho.image.startsWith('data:image');
        const imageInfo = isBase64Image ? 'Imagem carregada (Base64)' : trabalho.image;
        
        trabalhoItem.innerHTML = `
            <h5>Trabalho #${index + 1}</h5>
            <div class="mb-3">
                <label class="form-label">Título do Trabalho</label>
                <input type="text" class="form-control" value="${trabalho.title}" 
                       onchange="updateTrabalho(${index}, 'title', this.value)">
            </div>
            <div class="mb-3">
                <label class="form-label">Descrição</label>
                <textarea class="form-control" rows="3" 
                          onchange="updateTrabalho(${index}, 'description', this.value)">${trabalho.description}</textarea>
            </div>
            <div class="mb-3">
                <label class="form-label">Imagem</label>
                <input type="file" class="form-control" accept="image/*" 
                       onchange="updateTrabalhoImage(${index}, this)">
                <small class="form-text text-muted">${imageInfo}</small>
            </div>
            <button class="btn btn-danger btn-sm" onclick="removeTrabalho(${index})">
                <i class="fas fa-trash"></i> Remover Trabalho
            </button>
            <hr>
        `;
        trabalhosList.appendChild(trabalhoItem);
    });
}

function addNewTrabalho() {
    if (!requireAuth()) return;
    
    if (!portfolioData.trabalhos) portfolioData.trabalhos = [];
    portfolioData.trabalhos.push({
        title: "Novo Trabalho",
        description: "Descrição do trabalho realizado",
        image: "assets/images/trabalho-default.jpg"
        // REMOVIDO: link: "#"
    });
    
    renderTrabalhosList();
}

function updateTrabalho(index, field, value) {
    if (!requireAuth()) return;
    if (portfolioData.trabalhos && portfolioData.trabalhos[index]) {
        portfolioData.trabalhos[index][field] = value;
    }
}

function updateTrabalhoImage(index, input) {
    if (!requireAuth()) return;
    if (input.files.length > 0) {
        const file = input.files[0];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            portfolioData.trabalhos[index].image = e.target.result;
        };
        
        reader.readAsDataURL(file);
    }
}

function removeTrabalho(index) {
    if (!requireAuth()) return;
    if (confirm('Tem certeza que deseja remover este trabalho?')) {
        portfolioData.trabalhos.splice(index, 1);
        renderTrabalhosList();
    }
}

function saveTrabalhosSection() {
    if (!requireAuth()) return;
    saveToLocalStorage();
    showSuccessMessage('Trabalhos salvos com sucesso!');
}

// SEÇÃO CONTATO - VERSÃO CORRIGIDA
function saveContactSection() {
    if (!requireAuth()) return;
    
    const linkedinUrl = document.getElementById('linkedin-url').value;
    const whatsappUrl = document.getElementById('whatsapp-url').value;
    
    // Validar e formatar URLs
    portfolioData.contact = {
        linkedin: linkedinUrl || "https://linkedin.com",
        whatsapp: whatsappUrl || "https://wa.me/5511997503821"
    };
    
    saveToLocalStorage();
    showSuccessMessage('Links de contato salvos com sucesso!');
}

// SALVAR DADOS - VERSÃO MELHORADA
function saveToLocalStorage() {
    try {
        // Garante que todos os dados estejam consistentes
        if (!portfolioData.skills) portfolioData.skills = [];
        if (!portfolioData.trabalhos) portfolioData.trabalhos = [];
        if (!portfolioData.home) portfolioData.home = {};
        if (!portfolioData.about) portfolioData.about = {};
        if (!portfolioData.contact) portfolioData.contact = {};
        
        localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
        localStorage.setItem('portfolioUpdated', Date.now().toString());
        
        console.log('💾 Dados salvos com sucesso!', portfolioData);
        showSuccessMessage('Alterações salvas com sucesso! O site será atualizado automaticamente.');
        
        return true;
    } catch (error) {
        console.error('❌ Erro ao salvar dados:', error);
        alert('Erro ao salvar dados! Verifique o console para mais detalhes.');
        return false;
    }
}

function showSuccessMessage(message) {
    alert(message); // Você pode substituir por um toast mais elegante
}

// Inicializar mostrando a primeira seção
setTimeout(() => {
    showSection('home-section');
}, 100);