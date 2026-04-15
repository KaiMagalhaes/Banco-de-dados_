import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    getDocs, 
    doc, 
    deleteDoc, 
    query, 
    where, 
    orderBy, 
    limit, 
    onSnapshot 
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

function renderItem(id, funcionario) {
    const ctt = funcionario.contacto || {};
    const dep = funcionario.departamento?.nome || "—";
    const cargo = funcionario.cargo || "—";
    
    return `
        <p><strong>${funcionario.nome || 'Sem nome'}</strong> <span class="badge-dep">${dep}</span></p>
        <p class="cargo">${cargo}</p>
        <p>${funcionario.morada || ""}</p>
        <div class="contactos">
            <span> ${ctt.email || "—"}</span> |
            <span> ${ctt.telefonePessoal || "—"}</span>
        </div>
        <div class="botoes-bloco">
            <a href="edit.html?id=${id}" class="btn-edit">Editar</a>
            <button id="del-${id}" class="btn-excluir">Excluir</button>
        </div>`;
}

async function apagar(id) {
    if (confirm("Quer eliminar?")) {
        await deleteDoc(doc(bd, "funcion.", id));
        lerDados();
    }
}

function vincularBotoes(snapshot) {
    snapshot.forEach((d) => {
        const btn = document.getElementById(`del-${d.id}`);
        if (btn) {
            btn.addEventListener('click', () => apagar(d.id));
        }
    });
}

async function lerDados() {
    try {
        const q = query(
            collection(bd, "funcion."),
            orderBy("nome"),
            limit(20)
        );
        const snapshot = await getDocs(q);
        const elemento = document.getElementById("lista-funcionarios");
        elemento.innerHTML = "";

        if (snapshot.empty) {
            elemento.innerHTML = "<li>Sem funcionários registados.</li>";
            return;
        }

        snapshot.forEach((d) => {
            const li = document.createElement("li");
            li.innerHTML = renderItem(d.id, d.data());
            elemento.appendChild(li);
        });
        vincularBotoes(snapshot);
    } catch (e) {
        console.error(e);
    }
}

async function pesquisarPorNome(prefixo) {
    if (!prefixo.trim()) {
        lerDados(); 
        return;
    }

    const inicio = prefixo;
    const fim = prefixo + "\uf8ff";

    try {
        const q = query(
            collection(bd, "funcion."),
            where("nome", ">=", inicio),
            where("nome", "<", fim),
            orderBy("nome"),
            limit(20)
        );
        const snapshot = await getDocs(q);
        const elemento = document.getElementById("lista-funcionarios");
        elemento.innerHTML = "";

        snapshot.forEach((d) => {
            const li = document.createElement("li");
            li.innerHTML = renderItem(d.id, d.data());
            elemento.appendChild(li);
        });
        vincularBotoes(snapshot);
    } catch (e) {
        console.error(e);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    lerDados();

    const inputPesquisa = document.getElementById("searchBar");
    if (inputPesquisa) {
        inputPesquisa.addEventListener("input", (e) => {
            pesquisarPorNome(e.target.value);
        });
    }
});