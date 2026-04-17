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
import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";

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
const auth = getAuth(app);

let monitoramentoDados = null;
let utilizadorAtual = null; 


function atualizarUI(utilizador) {
    utilizadorAtual = utilizador;

    const btnLogin  = document.getElementById("btn-login");
    const btnLogout = document.getElementById("btn-logout");
    const infoUser  = document.getElementById("info-utilizador");
    const btnCriar  = document.getElementById("btn-criar");

    if (utilizador) {
        if (btnLogin)  btnLogin.style.display  = "none";
        if (btnLogout) btnLogout.style.display  = "inline-block";
        if (infoUser)  infoUser.textContent     = `Sessão: ${utilizador.email}`;
        if (btnCriar)  btnCriar.style.display   = "inline-block";
    } else {
        if (btnLogin)  btnLogin.style.display  = "inline-block";
        if (btnLogout) btnLogout.style.display  = "none";
        if (infoUser)  infoUser.textContent     = "Sessão não iniciada";
        if (btnCriar)  btnCriar.style.display   = "none";
    }

  
    carregarLista();
}


function criarLayoutItem(idDocumento, dadosFuncionario) {
    const contacto = dadosFuncionario.contacto || dadosFuncionario.contato || {};

    
    const botoesAdmin = utilizadorAtual ? `
        <a href="edit.html?id=${idDocumento}" class="btn-edit">Editar</a>
        <button id="del-${idDocumento}" class="btn-excluir">Excluir</button>
    ` : `<span class="aviso-login">🔒 Inicia sessão para editar</span>`;

    return `
        <p><strong>${dadosFuncionario.nome || 'Sem nome'}</strong></p>
        <p>${contacto.email || "—"}</p>
        <p><small>Depto: ${dadosFuncionario.departamento?.nome || "N/A"}</small></p>
        <div class="botoes-bloco">${botoesAdmin}</div>`;
}


async function removerFuncionario(idDocumento) {
    if (!utilizadorAtual) {
        alert("Precisas de iniciar sessão para apagar registos.");
        return;
    }

    if (confirm("Deseja eliminar este registo?")) {
        try {
            await deleteDoc(doc(bancoDados, "funcion.", idDocumento));
        } catch (erro) {
     
            if (erro.code === "permission-denied") {
                alert("❌ Acesso negado! Não tens permissão para apagar este registo.");
                console.error("permission-denied ao apagar:", erro);
            } else {
                console.error("Erro ao apagar:", erro);
            }
        }
    }
}

function ligarBotoesExcluir(listaSnap) {
    listaSnap.forEach((documento) => {
        const botao = document.getElementById(`del-${documento.id}`);
        if (botao) {
            botao.onclick = () => removerFuncionario(documento.id);
        }
    });
}

function carregarLista(textoBusca = "", modoTempoReal = false, direcaoOrdem = "desc", filtroDepto = "") {
    if (monitoramentoDados) {
        monitoramentoDados();
        monitoramentoDados = null;
    }

    const colecaoFuncionarios = collection(bancoDados, "funcion.");
    let filtrosFirebase = [];

    if (filtroDepto) {
        filtrosFirebase.push(where("departamento.nome", "==", filtroDepto));
    }

    const consultaBase = query(
        colecaoFuncionarios,
        ...filtrosFirebase,
        orderBy("criadoEm", direcaoOrdem)
    );

    const processarResultados = (resultado) => {
        const containerLista = document.getElementById('lista-funcionarios');
        if (!containerLista) return;

        containerLista.innerHTML = '';
        const termoLimpo = textoBusca.toLowerCase().trim();

        resultado.forEach((documento) => {
            const dados = documento.data();
            const nomeTexto = (dados.nome || "").toLowerCase();

            if (nomeTexto.includes(termoLimpo)) {
                const itemLista = document.createElement('li');
                itemLista.innerHTML = criarLayoutItem(documento.id, dados);
                containerLista.appendChild(itemLista);
            }
        });

        ligarBotoesExcluir(resultado);
    };

    const tratarErro = (erro) => {
      
        if (erro.code === "permission-denied") {
            const containerLista = document.getElementById('lista-funcionarios');
            if (containerLista) {
                containerLista.innerHTML = '<li>❌ Sem permissão para ler os dados. Verifica as regras do Firestore.</li>';
            }
            console.error("permission-denied ao ler lista:", erro);
        } else {
            console.error("Erro ao carregar lista:", erro);
        }
    };

    if (modoTempoReal) {
        monitoramentoDados = onSnapshot(consultaBase, processarResultados, tratarErro);
    } else {
        getDocs(consultaBase).then(processarResultados).catch(tratarErro);
    }
}


async function fazerLogin() {
    const email = prompt("Email:");
    const password = prompt("Password:");
    if (!email || !password) return;

    try {
        await signInWithEmailAndPassword(auth, email, password);
   
    } catch (erro) {
        alert(`Erro ao fazer login: ${erro.message}`);
        console.error(erro);
    }
}

async function fazerLogout() {
    try {
        await signOut(auth);
    } catch (erro) {
        console.error("Erro ao fazer logout:", erro);
    }
}


document.addEventListener("DOMContentLoaded", () => {
    const campoBusca    = document.getElementById("searchBar");
    const selectOrdem   = document.getElementById("ordenarTempo");
    const selectDepto   = document.getElementById("filtroDepartamento");
    const botaoTempoReal = document.getElementById("btn-tempo-real");
    const btnLogin      = document.getElementById("btn-login");
    const btnLogout     = document.getElementById("btn-logout");

   
    onAuthStateChanged(auth, atualizarUI);

    const atualizarTudo = () => {
        const texto       = campoBusca   ? campoBusca.value   : "";
        const ordem       = selectOrdem  ? selectOrdem.value  : "desc";
        const departamento = selectDepto ? selectDepto.value  : "";
        const ativo       = monitoramentoDados !== null;
        carregarLista(texto, ativo, ordem, departamento);
    };

    if (campoBusca)   campoBusca.addEventListener("input", atualizarTudo);
    if (selectOrdem)  selectOrdem.addEventListener("change", atualizarTudo);
    if (selectDepto)  selectDepto.addEventListener("change", atualizarTudo);
    if (btnLogin)     btnLogin.onclick  = fazerLogin;
    if (btnLogout)    btnLogout.onclick = fazerLogout;

    if (botaoTempoReal) {
        botaoTempoReal.onclick = () => {
            const texto        = campoBusca  ? campoBusca.value  : "";
            const ordem        = selectOrdem ? selectOrdem.value : "desc";
            const departamento = selectDepto ? selectDepto.value : "";

            if (monitoramentoDados) {
                botaoTempoReal.textContent = "Ativar Tempo Real";
                carregarLista(texto, false, ordem, departamento);
            } else {
                botaoTempoReal.textContent = "Parar Tempo Real";
                carregarLista(texto, true, ordem, departamento);
            }
        };
    }
});
