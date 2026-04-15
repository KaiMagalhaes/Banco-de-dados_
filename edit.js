import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

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

const urlParams = new URLSearchParams(window.location.search);
const idFunc = urlParams.get("id");

async function carregar() {
  if (!idFunc) return;

  try {
    const ref = doc(bd, "funcion.", idFunc);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const f = snap.data();
      
      document.getElementById("nome").value = f.nome || "";
      document.getElementById("morada").value = f.morada || "";
      document.getElementById("cargo").value = f.cargo || "";
      
      if (f.departamento && f.departamento.id) {
        document.getElementById("departamento").value = f.departamento.id;
      }

      const c = f.contacto || {};
      document.getElementById("email").value = c.email || "";
      document.getElementById("telefonePessoal").value = c.telefonePessoal || "";
      document.getElementById("telefoneFixo").value = c.telefoneFixo || "";
      document.getElementById("telefoneTrabalho").value = c.telefoneTrabalho || "";
    }
  } catch (err) {
    console.log(err);
  }
}

document.getElementById("formFuncionario").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const selectDep = document.getElementById("departamento");
  const ref = doc(bd, "funcion.", idFunc);
  
  await updateDoc(ref, {
    nome: document.getElementById("nome").value,
    morada: document.getElementById("morada").value,
    cargo: document.getElementById("cargo").value,
    departamento: {
      id: selectDep.value,
      nome: selectDep.options[selectDep.selectedIndex].text
    },
    contato: {
      email: document.getElementById("email").value,
      telefonePessoal: document.getElementById("telefonePessoal").value,
      telefoneFixo: document.getElementById("telefoneFixo").value,
      telefoneTrabalho: document.getElementById("telefoneTrabalho").value
    },
    atualizadoEm: serverTimestamp()
  });
  
  window.location.href = "index.html";
});

carregar();