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
        <p><small>Depto: ${f.departamento?.nome || "N/A"}</small></p>
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

function carregarLista(termo = "", real = false, ordem = "desc", depto = "") {
    if (stop) {
        stop();
        stop = null;
    }

    let q;
    const ref = collection(bd, "funcion.");
    const f = termo.trim();
    let cond = [];

    if (depto) {
        cond.push(where("departamento.nome", "==", depto));
    }

    if (f) {
        cond.push(where("nome", ">=", f));
        cond.push(where("nome", "<=", f + "\uf8ff"));
        q = query(ref, ...cond, orderBy("nome"));
    } else {
        q = query(ref, ...cond, orderBy("criadoEm", ordem));
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

    const falha = (err) => {
        console.error("Erro na busca:", err);
    };

    if (real) {
        stop = onSnapshot(q, desenhar, falha);
    } else {
        getDocs(q).then(desenhar).catch(falha);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const barra = document.getElementById("searchBar");
    const selOrdem = document.getElementById("ordenarTempo");
    const selDepto = document.getElementById("filtroDepartamento");
    const btn = document.getElementById("btn-tempo-real");

    const atualizar = () => {
        const t = barra ? barra.value : "";
        const o = selOrdem ? selOrdem.value : "desc";
        const d = selDepto ? selDepto.value : "";
        carregarLista(t, stop !== null, o, d);
    };

    carregarLista();

    if (barra) barra.addEventListener("input", atualizar);
    if (selOrdem) selOrdem.addEventListener("change", atualizar);
    if (selDepto) selDepto.addEventListener("change", atualizar);

    if (btn) {
        btn.onclick = () => {
            if (stop) {
                btn.textContent = "Ativar Tempo Real";
                carregarLista(barra.value, false, selOrdem.value, selDepto.value);
            } else {
                btn.textContent = "Parar Tempo Real";
                carregarLista(barra.value, true, selOrdem.value, selDepto.value);
            }
        };
    }
});