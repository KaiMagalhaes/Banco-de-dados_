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

async function apagar(id) {
  if (confirm("Quer eliminar?")) {
    await deleteDoc(doc(bd, "funcion.", id));
    lista();
  }
}

async function lista() {
  const snap = await getDocs(collection(bd, "funcion."));
  const elemento = document.getElementById('lista-funcionarios');
  elemento.innerHTML = '';

  snap.forEach((d) => {
    const funcionario = d.data();
    const id = d.id;
    const lista = document.createElement('li');
    lista.innerHTML = `
      <p><strong>${funcionario.nome || 'Sem nome'}</strong></p>
      <div class="botoes-bloco">
        <a href="edit.html?id=${id}" class="btn-edit">Editar</a>
        <button id="del-${id}" class="btn-excluir">Excluir</button>
      </div>`;
    elemento.appendChild(lista);
    document.getElementById(`del-${id}`).addEventListener('click', () => apagar(id));
  });
}
lista();