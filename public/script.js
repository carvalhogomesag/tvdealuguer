// ** PASSO 1: IMPORTS (Sintaxe Moderna/Módulos) **
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";


// ** PASSO 2: CONFIGURAÇÕES DO PROJETO (Suas Credenciais) **
const firebaseConfig = {
    apiKey: "AIzaSyD-4BlWdsuWCObaKWpGvz3s4rzRR3fzZHw", 
    authDomain: "tvdealuguer.firebaseapp.com",
    projectId: "tvdealuguer", 
    storageBucket: "tvdealuguer.firebasestorage.app", 
    messagingSenderId: "810249232456", 
    appId: "1:810249232456:web:103a49f77bfd6155bfb87d"
};

// Inicializa o Firebase e o Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const carListingsContainer = document.getElementById('car-listings');


// ** PASSO 3: FUNÇÃO PARA GERAR O CARD HTML (WhatsApp Corrigido) **
function createCarCard(car) {
    const isAvailable = car.disponivel !== false; 
    const availabilityClass = isAvailable ? '' : 'indisponivel';
    
    // --- LÓGICA DO WHATSAPP ---
    const carName = `${car.marca} ${car.modelo}`;
    const whatsappNumber = "351914044836"; 
    const prefilledMessage = encodeURIComponent(`Olá, tenho interesse no aluguer do ${carName} que está anunciado no site. Poderiam me dar mais detalhes?`);
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${prefilledMessage}`;
    // -------------------------
    
    const getFeatureIcon = (value) => value 
        ? '<i class="fas fa-check-circle" style="color:green;"></i> Sim' 
        : '<i class="fas fa-times-circle" style="color:red;"></i> Não';

    const featuresList = `
        <ul class="features">
            <li><i class="fas fa-euro-sign"></i> ${car.precoSemana}€ / Semana</li>
            <li><i class="fas fa-gas-pump"></i> Cartão Combustível: ${getFeatureIcon(car.cartaoCombustivel)}</li>
            <li><i class="fas fa-route"></i> Via Verde: ${getFeatureIcon(car.viaVerde)}</li>
            <li><i class="fas fa-wrench"></i> Manutenção Incluída</li>
        </ul>
    `;

    return `
        <div class="car-card ${availabilityClass}">
            <img src="${car.fotoUrl || 'placeholder.jpg'}" alt="${car.marca} ${car.modelo} TVDE">
            <div class="car-info">
                <h3>${car.marca} ${car.modelo}</h3>
                <span class="price">${car.precoSemana}€ <small>por semana</small></span>
                ${featuresList}
                
                <a href="${whatsappLink}" target="_blank" class="contact-button whatsapp-button">
                    <i class="fab fa-whatsapp"></i> Falar com a TVDE Aluguer
                </a>
            </div>
        </div>
    `;
}

// ** PASSO 4: FUNÇÃO PARA CARREGAR DADOS DO FIRESTORE **
async function loadCars() {
    carListingsContainer.innerHTML = ''; 

    try {
        const q = query(
            collection(db, "vehicles"),
            orderBy("disponivel", "desc"), 
            orderBy("marca", "asc")
        );
        
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            carListingsContainer.innerHTML = '<p>De momento, não temos viaturas em stock. Contacte-nos para mais informações.</p>';
            return;
        }
        
        querySnapshot.forEach((doc) => {
            const carData = doc.data();
            const carHtml = createCarCard(carData);
            carListingsContainer.innerHTML += carHtml;
        });

    } catch (error) {
        console.error("Erro ao carregar a frota: ", error);
        carListingsContainer.innerHTML = '<p style="color: red;">Erro ao carregar a frota. Verifique a chave de API e a conexão do Firebase.</p>';
    }
}

// Inicia o carregamento
window.onload = loadCars;