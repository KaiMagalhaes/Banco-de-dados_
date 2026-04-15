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

let stop = null;

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
        try {
            await deleteDoc(doc(bd, "funcion.", id));
        } catch (err) {
            console.error(err);
        }
    }
}

function vincular(snap) {
    snap.forEach((d) => {
        const btn = document.getElementById(`del-${d.id}`);
        if (btn) btn.onclick = () => apagar(d.id);
    });
}

function carregarLista(termo = "", real = false, ordem = "desc") {
    if (stop) {
        stop();
        stop = null;
    }

    let q;
    const ref = collection(bd, "funcion.");
    const f = termo.trim();

    if (f) {
        q = query(ref, where("nome", ">=", f), where("nome", "<=", f + "\uf8ff"), orderBy("nome"));
    } else {
        q = query(ref, orderBy("criadoEm", ordem));
    }

    const desenhar = (snap) => {
        const elemento = document.getElementById('lista-funcionarios');
        if (!elemento) return;
        elemento.innerHTML = '';
        snap.forEach((d) => {
            const li = document.createElement('li');
            li.innerHTML = renderItem(d.id, d.data());
            elemento.appendChild(li);
        });
        vincular(snap);
    };

    if (real) {
        stop = onSnapshot(q, desenhar, (err) => console.error(err));
    } else {
        getDocs(q).then(desenhar).catch(err => console.error(err));
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const barra = document.getElementById("searchBar");
    const seletor = document.getElementById("ordenarTempo"); 

    const atualizar = () => {
        const t = barra ? barra.value : "";
        const o = seletor && seletor.value === "antigo" ? "asc" : "desc";
        carregarLista(t, stop !== null, o);
    };

    carregarLista();

    if (barra) barra.addEventListener("input", atualizar);
    if (seletor) seletor.addEventListener("change", atualizar);

    const btn = document.getElementById("btn-tempo-real");
    if (btn) {
        btn.onclick = () => {
            if (stop) {
                atualizar(); 
                btn.textContent = "Ativar tempo real";
            } else {
                const t = barra ? barra.value : "";
                const o = seletor && seletor.value === "antigo" ? "asc" : "desc";
                carregarLista(t, true, o);
                btn.textContent = "Parar tempo real";
            }
        };
    }
});