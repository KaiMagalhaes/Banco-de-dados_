import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

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

async function apagarFuncionario(id) {
  if (confirm("Tens a certeza que queres eliminar este funcionário?")) {
    try {
      await deleteDoc(doc(bd, "funcion.", id));
      listaF();
    } catch (err) {
      console.log("Erro ao eliminar:", err);
    }
  }
}

async function listaF() {
  try {
    const snap = await getDocs(collection(bd, "funcion."));
    const lista = document.getElementById('lista-funcionarios');
    lista.innerHTML = '';

    if (snap.empty) {
        lista.innerHTML = '<li>Nenhum funcionário encontrado.</li>';
        return;
    }

    snap.forEach((elemento) => {
      const f = elemento.data();
      const c = f.contacto || {};
      const id = elemento.id;
      const li = document.createElement('li');
      
      li.innerHTML = `
        <p><strong>${f.nome || 'Sem nome'}</strong></p>
        <p>${f.morada || 'Sem morada'}</p>
        <div style="font-size: 12px;">
          <span> ${c.email || '---'}</span> | <span> ${c.telemovelPessoal || '---'}</span>
        </div>
        <button id="btn-${id}" style="margin-top:10px; color:white; cursor:pointer;">Eliminar</button>`;
      
      lista.appendChild(li);

      document.getElementById(`btn-${id}`).addEventListener('click', () => apagarFuncionario(id));
    });
  } catch (err) {
    console.log("Erro:", err);
    document.getElementById('lista-funcionarios').innerHTML = '<li>Erro ao carregar dados.</li>';
  }
}
listaF();