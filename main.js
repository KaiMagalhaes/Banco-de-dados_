import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    doc, 
    deleteDoc, 
    query, 
    where, 
    orderBy, 
    onSnapshot,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

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

function renderItem(id, f) {
    const c = f.contacto || f.contato || {};
    return `
        <p><strong>${f.nome || 'Sem nome'}</strong></p>
        <p>${c.email || "—"}</p>
        <div class="botoes-bloco">
            <a href="edit.html?id=${id}" class="btn-edit">Editar</a>
            <button id="del-${id}" class="btn-excluir">Excluir</button>
        </div>`;
}

async function apagar(id) {
    if (confirm("Quer eliminar?")) {
        await deleteDoc(doc(bd, "funcion.", id));
    }
}

function vincular(snap) {
    snap.forEach((d) => {
        const btn = document.getElementById(`del-${d.id}`);
        if (btn) btn.onclick = () => apagar(d.id);
    });
}

function carregarLista(termo = "") {
    let q;
    const ref = collection(bd, "funcion.");

    if (termo) {
        q = query(
            ref, 
            where("nome", ">=", termo), 
            where("nome", "<=", termo + "\uf8ff"),
            orderBy("nome")
        );
    } else {
        q = query(ref, orderBy("nome"));
    }

    onSnapshot(q, (snap) => {
        const elemento = document.getElementById('lista-funcionarios');
        elemento.innerHTML = '';
        snap.forEach((d) => {
            const li = document.createElement('li');
            li.innerHTML = renderItem(d.id, d.data());
            elemento.appendChild(li);
        });
        vincular(snap);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    carregarLista();
    
    const barra = document.getElementById("searchBar");
    if (barra) {
        barra.addEventListener("input", (e) => {
            carregarLista(e.target.value);
        });
    }
});