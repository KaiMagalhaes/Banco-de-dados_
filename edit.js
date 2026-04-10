import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

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

const urlPrm = new URLSearchParams(window.location.search);
const idFunc = urlPrm.get("id");

async function carregar() {
  if (!idFunc) return;
  try {
    const ref = doc(bd, "funcion.", idFunc);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const f = snap.data();
      document.getElementById("nome").value = f.nome || "";
      document.getElementById("morada").value = f.morada || "";
      document.getElementById("email").value = f.contacto?.email || "";
      document.getElementById("telemovelPessoal").value = f.contacto?.telemovelPessoal || "";
    }
  } catch (err) {
    console.error(err);
  }
}

document.getElementById("formFuncionario")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const ref = doc(bd, "funcion.", idFunc);
    await updateDoc(ref, {
      nome: document.getElementById("nome").value,
      morada: document.getElementById("morada").value,
      contacto: {
        email: document.getElementById("email").value,
        telemovelPessoal: document.getElementById("telemovelPessoal").value
      }
    });
    window.location.href = "index.html";
  } catch (err) {
    console.error(err);
  }
});

carregar();