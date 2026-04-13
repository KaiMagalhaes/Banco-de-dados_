import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

const conf = {
    apiKey: "AIzaSyByK7sas0s_vJRVsogSKkzimOYH-oKEAhE",
    authDomain: "batata-69.firebaseapp.com",
    projectId: "batata-69",
    storageBucket: "batata-69.firebasestorage.app",
    messagingSenderId: "1041017537298",
    appId: "1:1041017537298:web:b9d7ff1db5f983ef1569cb"
};

const app = initializeApp(conf);
const bd = getFirestore(app);

async function guardaF(e) {
    e.preventDefault();

    // Captura do select para obter o texto visível e o valor técnico
    const selectDep = document.getElementById("departamento");
    const idDep = selectDep.value;
    const nomeDep = selectDep.options[selectDep.selectedIndex].text;

    const novoF = {
        nome: document.getElementById("nome").value,
        morada: document.getElementById("morada").value,
        cargo: document.getElementById("cargo").value, // Referência simples (string)
        departamento: {
            id: idDep,    // Referência para consultas complexas
            nome: nomeDep // Dados embutidos para performance no carregamento da lista
        },
        contacto: {
            email: document.getElementById("email").value,
            telefonePessoal: document.getElementById("telefonePessoal").value,
            telefoneFixo: document.getElementById("telefoneFixo").value,
            telefoneTrabalho: document.getElementById("telefoneTrabalho").value
        },
        atualizadoEm: new Date()
    };

    try {
        await addDoc(collection(bd, "funcion."), novoF);
        alert("Funcionário registado com sucesso no departamento " + nomeDep);
        window.location.href = "index.html";
    } catch (err) {
        console.error(err);
    }
}

document.getElementById("formFuncionario").addEventListener("submit", guardaF);
