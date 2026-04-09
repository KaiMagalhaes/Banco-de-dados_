// 1. Importações (versão 10.8.0 — estável e correta)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// 2. Configuração do projeto Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAzEUAvgalAp7CaWL789aFO8WP9heR6hXM",
    authDomain: "teste-firebase-f4e71.firebaseapp.com",
    projectId: "teste-firebase-f4e71",
    storageBucket: "teste-firebase-f4e71.firebasestorage.app",
    messagingSenderId: "914804237483",
    appId: "1:914804237483:web:f019d2bf3f0f57b47703ee"
};

// 3. Inicialização dos Serviços
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 4. Função principal que carrega a lista de funcionários
async function init() {
    try {
        console.log('A ligar ao Firestore...');

        const querySnapshot = await getDocs(collection(db, "funcionarios"));
        const listaElement = document.getElementById('lista-funcionarios');

        if (querySnapshot.empty) {
            listaElement.innerHTML = '<li>Nenhum funcionário encontrado.</li>';
            return;
        }

        listaElement.innerHTML = '';

        querySnapshot.forEach((funcionario) => {
            const dados = funcionario.data();
            const contacto = dados.contacto || {};

            const liElement = document.createElement('li');
            liElement.innerHTML = `
                <p><strong>${dados.nome}</strong> <small><i>(ID: ${funcionario.id})</i></small></p>
                <p>📍 ${dados.morada || 'Sem morada'}</p>
                <ul>
                    <li>📧 ${contacto.email || '—'}</li>
                    <li>📱 Pessoal: ${contacto.telemovelPessoal || '—'}</li>
                    <li>📞 Fixo: ${contacto.telefoneFixo || '—'}</li>
                    <li>💼 Trabalho: ${contacto.telemovelTrabalho || '—'}</li>
                </ul>
            `;
            listaElement.appendChild(liElement);
        });

    } catch (error) {
        console.error('Erro ao procurar dados dos funcionários:', error);
        document.getElementById('lista-funcionarios').innerHTML =
            '<li>Erro ao carregar dados. Verifica a consola.</li>';
    }
}

init();
