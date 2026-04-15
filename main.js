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

const firebaseConfig = {
  apiKey: "AIzaSyByK7sas0s_vJRVsogSKkzimOYH-oKEAhE",
  authDomain: "batata-69.firebaseapp.com",
  projectId: "batata-69",
  storageBucket: "batata-69.firebasestorage.app",
  messagingSenderId: "1041017537298",
  appId: "1:1041017537298:web:b9d7ff1db5f983ef1569cb"
};

const app = initializeApp(firebaseConfig);
const bancoDados = getFirestore(app);

let monitoramentoDados = null;

function criarLayoutItem(idDocumento, dadosFuncionario) {
    const contacto = dadosFuncionario.contacto || dadosFuncionario.contato || {};
    return `
        <p><strong>${dadosFuncionario.nome || 'Sem nome'}</strong></p>
        <p>${contacto.email || "—"}</p>
        <p><small>Depto: ${dadosFuncionario.departamento?.nome || "N/A"}</small></p>
        <div class="botoes-bloco">
            <a href="edit.html?id=${idDocumento}" class="btn-edit">Editar</a>
            <button id="del-${idDocumento}" class="btn-excluir">Excluir</button>
        </div>`;
}

async function removerFuncionario(idDocumento) {
    if (confirm("Tens a certeza que queres eliminar?")) {
        try {
            await deleteDoc(doc(bancoDados, "funcion.", idDocumento));
        } catch (erro) {
            console.error("Erro ao apagar:", erro);
        }
    }
}

function ligarBotoesExcluir(listaSnap) {
    listaSnap.forEach((documento) => {
        const botao = document.getElementById(`del-${documento.id}`);
        if (botao) botao.onclick = () => removerFuncionario(documento.id);
    });
}

function carregarLista(textoBusca = "", modoTempoReal = false, direcaoOrdem = "desc", filtroDepto = "") {
    if (monitoramentoDados) {
        monitoramentoDados();
        monitoramentoDados = null;
    }

    let consultaFinal;
    const colecaoFuncionarios = collection(bancoDados, "funcion.");
    const termoPesquisa = textoBusca.trim();
    let listaFiltros = [];

    if (filtroDepto) {
        listaFiltros.push(where("departamento.nome", "==", filtroDepto));
    }

    if (termoPesquisa) {
        listaFiltros.push(where("nome", ">=", termoPesquisa));
        listaFiltros.push(where("nome", "<=", termoPesquisa + "\uf8ff"));
        consultaFinal = query(colecaoFuncionarios, ...listaFiltros, orderBy("nome"));
    } else {
        consultaFinal = query(colecaoFuncionarios, ...listaFiltros, orderBy("criadoEm", direcaoOrdem));
    }

    const desenharNaTela = (resultado) => {
        const containerLista = document.getElementById('lista-funcionarios');
        if (!containerLista) return;
        containerLista.innerHTML = '';
        resultado.forEach((documento) => {
            const itemLista = document.createElement('li');
            itemLista.innerHTML = criarLayoutItem(documento.id, documento.data());
            containerLista.appendChild(itemLista);
        });
        ligarBotoesExcluir(resultado);
    };

    const tratarErro = (erro) => {
        console.error("Erro na consulta:", erro);
    };

    if (modoTempoReal) {
        monitoramentoDados = onSnapshot(consultaFinal, desenharNaTela, tratarErro);
    } else {
        getDocs(consultaFinal).then(desenharNaTela).catch(tratarErro);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const campoBusca = document.getElementById("searchBar");
    const selectOrdem = document.getElementById("ordenarTempo");
    const selectDepto = document.getElementById("filtroDepartamento");
    const botaoTempoReal = document.getElementById("btn-tempo-real");

    const atualizarTudo = () => {
        const termo = campoBusca ? campoBusca.value : "";
        const ordem = selectOrdem ? selectOrdem.value : "desc";
        const departamento = selectDepto ? selectDepto.value : "";
        carregarLista(termo, monitoramentoDados !== null, ordem, departamento);
    };

    carregarLista();

    if (campoBusca) campoBusca.addEventListener("input", atualizarTudo);
    if (selectOrdem) selectOrdem.addEventListener("change", atualizarTudo);
    if (selectDepto) selectDepto.addEventListener("change", atualizarTudo);

    if (botaoTempoReal) {
        botaoTempoReal.onclick = () => {
            const termo = campoBusca ? campoBusca.value : "";
            const ordem = selectOrdem ? selectOrdem.value : "desc";
            const departamento = selectDepto ? selectDepto.value : "";
            if (monitoramentoDados) {
                botaoTempoReal.textContent = "Ativar Tempo Real";
                carregarLista(termo, false, ordem, departamento);
            } else {
                botaoTempoReal.textContent = "Parar Tempo Real";
                carregarLista(termo, true, ordem, departamento);
            }
        };
    }
});