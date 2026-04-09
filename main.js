import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

const conf = {
    apiKey: "AIzaSyAzEUAvgalAp7CaWL789aFO8WP9heR6hXM",
    authDomain: "teste-firebase-f4e71.firebaseapp.com",
    projectId: "teste-firebase-f4e71",
    storageBucket: "teste-firebase-f4e71.firebasestorage.app",
    messagingSenderId: "914804237483",
    appId: "1:914804237483:web:f019d2bf3f0f57b47703ee"
};

const app = initializeApp(conf);
const db = getFirestore(app);

async function carregarDados() {
    try {
        const snap = await getDocs(collection(db, "funcionarios"));
        const lista = document.getElementById('lista-funcionarios');
        lista.innerHTML = '';

        snap.forEach((doc) => {
            const f = doc.data();
            const c = f.contacto || {};
            const li = document.createElement('li');
            li.innerHTML = `
                <p><strong>${f.nome}</strong></p>
                <p style="font-size: 13px; color: #666;">${f.morada}</p>
                <div style="font-size: 12px; margin-top: 5px;">
                    <span>📧 ${c.email}</span> | <span>📱 ${c.telemovelPessoal}</span>
                </div>
            `;
            lista.appendChild(li);
        });
    } catch (err) {
        console.log("Erro:", err);
    }
}
carregarDados();