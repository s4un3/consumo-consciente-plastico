const formAdm = document.getElementById("formAdm");
const inputNome = document.getElementById("nome");
const inputEmail = document.getElementById("email");
const btnLimpar = document.getElementById("btnLimpar");
const btnExcluirTudo = document.getElementById("btnExcluirTudo");
const inputPesquisa = document.getElementById("inputPesquisa");
const listaUsuarios = document.getElementById("listaUsuarios");

const LOCAL_STORAGE_KEY = "consumo_plastico_usuarios";

function obterUsuarios() {
  const dados = localStorage.getItem(LOCAL_STORAGE_KEY);
  return dados ? JSON.parse(dados) : [];
}

function salvarUsuarios(usuarios) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(usuarios));
}

function renderizarLista(termoBusca = "") {
  listaUsuarios.innerHTML = "";
  const usuarios = obterUsuarios();

  const usuariosFiltrados = usuarios.filter((usuario) => {
    const termo = termoBusca.toLowerCase();
    return (
      usuario.nome.toLowerCase().includes(termo) ||
      usuario.email.toLowerCase().includes(termo)
    );
  });

  if (usuariosFiltrados.length === 0) {
    listaUsuarios.innerHTML = "<li>Nenhum usuário encontrado.</li>";
    return;
  }

  usuariosFiltrados.forEach((usuario) => {
    const li = document.createElement("li");

    li.classList.add("usuario-item");

    li.innerHTML = `
            <div>
                <strong>Data:</strong> ${usuario.dataEnvio} |
                <strong>Nome:</strong> ${usuario.nome} |
                <strong>E-mail:</strong> ${usuario.email}
            </div>
            <button class="btn-excluir">Excluir</button>
        `;

    const btnExcluir = li.querySelector(".btn-excluir");
    btnExcluir.addEventListener("click", () => {
      const confirmar = confirm(
        `Tem certeza que deseja excluir o usuário ${usuario.nome}?`,
      );
      if (confirmar) {
        excluirUsuario(usuario.id);
      }
    });

    listaUsuarios.appendChild(li);
  });
}

formAdm.addEventListener("submit", (e) => {
  e.preventDefault();

  const novoUsuario = {
    id: Date.now().toString(),
    nome: inputNome.value.trim(),
    email: inputEmail.value.trim(),
    dataEnvio:
      new Date().toLocaleDateString("pt-BR") +
      " " +
      new Date().toLocaleTimeString("pt-BR"),
  };

  const usuarios = obterUsuarios();
  usuarios.push(novoUsuario);
  salvarUsuarios(usuarios);

  formAdm.reset();
  renderizarLista();
});

function excluirUsuario(id) {
  let usuarios = obterUsuarios();
  usuarios = usuarios.filter((usuario) => usuario.id !== id);
  salvarUsuarios(usuarios);
  renderizarLista(inputPesquisa.value);
}

btnExcluirTudo.addEventListener("click", () => {
  const usuarios = obterUsuarios();
  if (usuarios.length === 0) {
    alert("A lista já está vazia!");
    return;
  }

  const confirmar = confirm(
    "Tem certeza absoluta que deseja excluir TODOS os usuários salvos?",
  );
  if (confirmar) {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    renderizarLista();
  }
});

btnLimpar.addEventListener("click", () => {
  formAdm.reset();
});

inputPesquisa.addEventListener("input", (e) => {
  renderizarLista(e.target.value);
});

document.addEventListener("DOMContentLoaded", () => {
  renderizarLista();
});
