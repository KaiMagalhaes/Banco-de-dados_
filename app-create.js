// 1. Importações das bibliotecas específicas
import {
  getFirestore,
  collection,
  addDoc,
} 
from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-analytics.js";


// 2. Configuração do projeto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyByK7sas0s_vJRVsogSKkzimOYH-oKEAhE",
  authDomain: "batata-69.firebaseapp.com",
  projectId: "batata-69",
  storageBucket: "batata-69.firebasestorage.app",
  messagingSenderId: "1041017537298",
  appId: "1:1041017537298:web:b9d7ff1db5f983ef1569cb",
  measurementId: "G-KRCYY9LWNG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const bd = getFirestore(app);

// 4. Escuta do Evento de Submissão
document
  .getElementById("formFuncionario")
  .addEventListener("submit", async (e) => {
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
        telemovelTrabalho: document.getElementById("telemovelTrabalho").value,
      },
      dataRegisto: new Date(),
    };

    try {
      // 6. Envio para a Coleção "funcionarios"
      const docRef = await addDoc(collection(bd, "funcion."), novoFuncionario);
      alert("Sucesso! Funcionário registado com o ID: " + docRef.id);
      window.location.href = "index.html"; // Redireciona para a lista
    } catch (error) {
      console.error("Erro ao gravar:", error);
      alert("Erro ao guardar dados. Verifica a consola.");
      btn.disabled = false;
      btn.innerText = "Gravar na Cloud";
    }
  });
