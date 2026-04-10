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
    
    const novoF = {
        nome: document.getElementById("nome").value,
        morada: document.getElementById("morada").value,
        contacto: {
            email: document.getElementById("email").value,
            telemovelPessoal: document.getElementById("telemovelPessoal").value,
            telefoneFixo: document.getElementById("telefoneFixo").value,
            telemovelTrabalho: document.getElementById("telemovelTrabalho").value
        }
    };

    try {
        await addDoc(collection(bd, "funcion."), novoF);
        alert("Novo funcionário guardado");
        window.location.href = "index.html";
    } catch (err) {
        console.error(err);
    }
}

document.getElementById("formFuncionario").addEventListener("submit", guardaF);