// 1. Importações das bibliotecas específicas
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

// 4. Escuta do Evento de Submissão
document.getElementById("formFuncionario").addEventListener("submit", async (e) => {
    e.preventDefault(); // Bloqueia o refresh da página

    const btn = document.getElementById("btnGravar");
    btn.disabled = true; // Evita cliques duplos
    btn.innerText = "A guardar...";

    // 5. Mapeamento dos dados para o formato NoSQL
    const novoFuncionario = {
        nome: document.getElementById("nome").value,
        morada: document.getElementById("morada").value,
        contacto: {
            email: document.getElementById("email").value,
            telemovelPessoal: document.getElementById("telemovelPessoal").value,
            telefoneFixo: document.getElementById("telefoneFixo").value,
            telemovelTrabalho: document.getElementById("telemovelTrabalho").value
        },
        dataRegisto: new Date()
    };

    try {
        // 6. Envio para a Coleção "funcionarios"
        const docRef = await addDoc(collection(db, "funcionarios"), novoFuncionario);
        alert("Sucesso! Funcionário registado com o ID: " + docRef.id);
        window.location.href = "index.html"; // Redireciona para a lista
    } catch (error) {
        console.error("Erro ao gravar:", error);
        alert("Erro ao guardar dados. Verifica a consola.");
        btn.disabled = false;
        btn.innerText = "Gravar na Cloud";
    }
});
