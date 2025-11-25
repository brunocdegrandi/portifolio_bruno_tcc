let portfolioData = {};


document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Site principal carregando...');
    loadPortfolioData();
    setupSmoothScroll();
    setupNavbarEffect();
    
});


function loadPortfolioData() {
    console.log('📥 Carregando dados para o site...');
    
    try {
        const savedData = localStorage.getItem('portfolioData');
        
        if (savedData) {
            portfolioData = JSON.parse(savedData);
            console.log('✅ Dados carregados no site:', portfolioData);
            updatePageContent();
        } else {
            console.log('ℹ️ Nenhum dado salvo, usando padrão');
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
    
    updatePageContent();
}


function updatePageContent() {
    console.log('🔄 Atualizando conteúdo da página...');
    
    updateHomeSection();
    updateAboutSection(); 
    renderSkills();
    renderTrabalhos();
    updateContactSection();
}


function updateHomeSection() {
    console.log('🏠 Atualizando seção Início...');
    
    const homeTitle = document.querySelector('#home h1');
    const homeSubtitle = document.getElementById('home-subtitle');
    const profileImage = document.getElementById('profile-image');
    
    if (homeTitle && portfolioData.home) {
        const fullTitle = portfolioData.home.title;
        const name = fullTitle.includes('Olá, eu sou') 
            ? fullTitle.replace('Olá, eu sou', '').trim()
            : fullTitle;
        homeTitle.innerHTML = `Olá, eu sou <span class="text-primary">${name}</span>`;
        console.log('✅ Título atualizado:', name);
    }
    
    if (homeSubtitle && portfolioData.home) {
        homeSubtitle.textContent = portfolioData.home.subtitle;
        console.log('✅ Subtítulo atualizado:', portfolioData.home.subtitle);
    }
    
    if (profileImage && portfolioData.home) {
        let imageUrl = portfolioData.home.profileImage;
        if (!imageUrl.startsWith('data:image')) {
            imageUrl += '?t=' + new Date().getTime();
        }
        
        profileImage.src = imageUrl;
        
        profileImage.onerror = function() {
            console.warn('🔄 Imagem não carregada, usando fallback...');
            this.src = 'assets/images/profile.jpg';
        };
        
        profileImage.onload = function() {
            console.log('✅ Imagem de perfil carregada com sucesso');
        };
    }
    
    console.log('✅ Seção Início totalmente atualizada');
}


function updateAboutSection() {
    const aboutText = document.getElementById('about-text');
    
    if (aboutText && portfolioData.about) {
        aboutText.textContent = portfolioData.about.text;
        console.log('✅ Seção Sobre atualizada');
    }
}


function renderSkills() {
    const skillsContainer = document.getElementById('skills-container');
    
    if (!skillsContainer) {
        console.error('❌ Container de habilidades não encontrado');
        return;
    }
    
    skillsContainer.innerHTML = '';
    
    if (!portfolioData.skills || portfolioData.skills.length === 0) {
        skillsContainer.innerHTML = '<div class="col-12 text-center"><p class="text-muted">Nenhuma habilidade cadastrada.</p></div>';
        return;
    }
    
    portfolioData.skills.forEach(skill => {
        const skillElement = document.createElement('div');
        skillElement.className = 'col-md-4 col-sm-6 mb-4';
        skillElement.innerHTML = `
            <div class="card skill-item h-100">
                <div class="card-body text-center">
                    <div class="skill-icon mb-3">
                        <i class="${skill.icon} fa-3x"></i>
                    </div>
                    <h5 class="card-title">${skill.name}</h5>
                </div>
            </div>
        `;
        skillsContainer.appendChild(skillElement);
    });
    
    console.log(`✅ ${portfolioData.skills.length} habilidades renderizadas`);
}


function renderTrabalhos() {
    const container = document.getElementById('trabalhos-container');
    
    if (!container) {
        console.warn('❌ Container de trabalhos não encontrado');
        return;
    }
    
    container.innerHTML = '';
    
    
    const trabalhos = portfolioData.trabalhos || portfolioData.projects || [];
    
    if (!trabalhos || trabalhos.length === 0) {
        container.innerHTML = '<div class="col-12 text-center"><p class="text-muted">Nenhum trabalho cadastrado.</p></div>';
        return;
    }
    
    trabalhos.forEach(trabalho => {
        const trabalhoElement = document.createElement('div');
        trabalhoElement.className = 'col-lg-4 col-md-6 mb-4';
        trabalhoElement.innerHTML = `
            <div class="card trabalho-card h-100">
                <img src="${trabalho.image}" class="card-img-top trabalho-image" alt="${trabalho.title}" 
                     onerror="this.src='assets/images/trabalho1.jpg'">
                <div class="card-body">
                    <h5 class="card-title">${trabalho.title}</h5>
                    <p class="card-text">${trabalho.description}</p>
                    
                </div>
            </div>
        `;
        container.appendChild(trabalhoElement);
    });
    
    console.log(`✅ ${trabalhos.length} trabalhos renderizados`);
}


function updateContactSection() {
    const linkedinLink = document.getElementById('linkedin-link');
    const whatsappLink = document.getElementById('whatsapp-link');
    
    
    if (linkedinLink && portfolioData.contact) {
        linkedinLink.href = portfolioData.contact.linkedin || "https://linkedin.com";
    }
    
     
    if (whatsappLink && portfolioData.contact) {
        let whatsappUrl = portfolioData.contact.whatsapp || "https://wa.me/5511997503821";
        if (!whatsappUrl.includes('wa.me/')) {
            whatsappUrl = 'https://wa.me/' + whatsappUrl.replace(/\D/g, '');
        }
        whatsappLink.href = whatsappUrl;
    }
    
    console.log('✅ Seção Contato atualizada');
}


function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function setupNavbarEffect() {
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.style.backgroundColor = 'rgba(15, 23, 42, 0.98)';
                navbar.style.padding = '10px 0';
            } else {
                navbar.style.backgroundColor = 'rgba(15, 23, 42, 0.95)';
                navbar.style.padding = '15px 0';
            }
        }
    });
}



function forceReloadContent() {
    console.log('🔄 Forçando atualização do conteúdo...');
    loadPortfolioData();
}

window.addEventListener('storage', function(e) {
    if (e.key === 'portfolioUpdated') {
        console.log('🔄 Atualização detectada, recarregando dados...');
        loadPortfolioData();
    }
});

setInterval(function() {
    const lastUpdate = localStorage.getItem('portfolioUpdated');
    if (lastUpdate && lastUpdate !== window.lastPortfolioUpdate) {
        window.lastPortfolioUpdate = lastUpdate;
        console.log('🔄 Atualização detectada (interval), recarregando dados...');
        loadPortfolioData();
    }
}, 3000);