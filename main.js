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
  if (confirm("Tem certeza que deseja excluir este funcionario?")) {
    try {
      await deleteDoc(doc(bd, "funcion.", id));
      listaFuncion();
    } catch (err) {
      console.log("Erro ao excluir:", err);
    }
  }
}

async function listaFuncion() {
  try {
    const snap = await getDocs(collection(bd, "funcion."));
    const elementoLista = document.getElementById('lista-funcionarios');
    elementoLista.innerHTML = '';

    if (snap.empty) {
      elementoLista.innerHTML = '<li>Nenhum funcionario encontrado.</li>';
      return;
    }

    snap.forEach((elemento) => {
      const funcionario = elemento.data();
      const contato = funcionario.contacto || {};
      const id = elemento.id;
      const lista = document.createElement('li');
      
      lista.className = 'item-lista';
      
      lista.innerHTML = `
        <p><strong>${funcionario.nome || 'Sem nome'}</strong></p>
        <p>${funcionario.morada || 'Sem endereco'}</p>
        <div class="contato-info">
          <span>Email: ${contato.email || '---'}</span> | <span>Cel: ${contato.telemovelPessoal || '---'}</span>
        </div>
        <div class="botoes-bloco">
          <a href="edit.html?id=${id}" class="btn-edit">Editar</a>
          <button id="del-${id}" class="btn-excluir">Excluir</button>
        </div>`;

      elementoLista.appendChild(lista);
      document.getElementById(`del-${id}`).addEventListener('click', () => apagarFuncionario(id));
    });
  } catch (err) {
    console.log("Erro:", err);
  }
}
listaFuncion();