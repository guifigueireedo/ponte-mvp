// esse arquivo cuida de tudo visual do cadastro:
// navegar entre as etapas, validar os campos, coletar os dados e montar o objeto
// que vai ser passado pro Enrico enviar pro backend


const TOTAL_STEPS = 4;
let stepAtual = 1;


// vai acumulando os dados conforme o usuário avança nas telas
let dadosFormulario = {
 nome:                   "",
 sobrenome:              "",
 _nascimento:            "", // usado internamente pra calcular a idade
 _cep:                   "", // usado internamente pra buscar o bairro
 experiencias_informais: "",
 instituicao:            "",
 cidade_curso:           "",
 tipo_curso:             "",
 data_inicio:            "",
 data_fim:               "",
 contato:                ""
};


// ─── NAVEGAÇÃO ───────────────────────────────────────────────


function irParaStep(numero) {
 document.getElementById(`step-${stepAtual}`)?.classList.add("hidden");
 stepAtual = numero;
 document.getElementById(`step-${stepAtual}`)?.classList.remove("hidden");


 document.getElementById("progress-fill").style.width = `${(stepAtual / TOTAL_STEPS) * 100}%`;
 document.getElementById("btn-anterior").style.display = stepAtual > 1 ? "block" : "none";
 document.getElementById("btn-proximo").textContent    = stepAtual === TOTAL_STEPS ? "Finalizar →" : "Próximo →";


 if (stepAtual === 4) preencherRevisao();
 window.scrollTo({ top: 0, behavior: "smooth" });
}


// ─── COLETA ──────────────────────────────────────────────────


function coletarDadosStep(numero) {
 if (numero === 1) {
   dadosFormulario.nome        = pegar("campo-nome");
   dadosFormulario.sobrenome   = pegar("campo-sobrenome");
   dadosFormulario._nascimento = pegar("campo-nascimento");
   dadosFormulario._cep        = pegar("campo-cep");
 }
 if (numero === 2) {
   dadosFormulario.contato = pegar("campo-email");
 }
 if (numero === 3) {
   dadosFormulario.instituicao  = pegar("campo-instituicao");
   dadosFormulario.cidade_curso = pegar("campo-cidade-curso");
   dadosFormulario.tipo_curso   = pegar("campo-tipo-curso");
   dadosFormulario.data_inicio  = pegar("campo-inicio");
   dadosFormulario.data_fim     = pegar("campo-fim");
 }
}


function pegar(id) {
 const el = document.getElementById(id);
 return el ? el.value.trim() : "";
}


// ─── VALIDAÇÃO ───────────────────────────────────────────────


function validarStep(numero) {
 limparErros();
 let valido = true;


 if (numero === 1) {
   if (!pegar("campo-nome"))       { marcarErro("erro-nome",       "campo-nome",       "Nome é obrigatório");               valido = false; }
   if (!pegar("campo-sobrenome"))  { marcarErro("erro-sobrenome",  "campo-sobrenome",  "Sobrenome é obrigatório");          valido = false; }
   if (!pegar("campo-nascimento")) { marcarErro("erro-nascimento", "campo-nascimento", "Data de nascimento é obrigatória"); valido = false; }
   if (!pegar("campo-cep"))        { marcarErro("erro-cep",        "campo-cep",        "CEP é obrigatório");                valido = false; }
 }


 if (numero === 2) {
   const email    = pegar("campo-email");
   const senha    = pegar("campo-senha");
   const confirma = pegar("campo-confirmar-senha");


   if (!email.includes("@")) { marcarErro("erro-email",           "campo-email",           "Email inválido");                           valido = false; }
   if (senha.length < 8)     { marcarErro("erro-senha",           "campo-senha",           "Senha precisa ter pelo menos 8 caracteres"); valido = false; }
   if (senha !== confirma)   { marcarErro("erro-confirmar-senha", "campo-confirmar-senha", "As senhas não batem");                      valido = false; }
 }


 // step 3 é opcional, não valida nada
 return valido;
}


function marcarErro(idErro, idCampo, mensagem) {
 const erroEl  = document.getElementById(idErro);
 const campoEl = document.getElementById(idCampo);
 if (erroEl)  { erroEl.textContent = mensagem; erroEl.classList.add("visivel"); }
 if (campoEl) campoEl.classList.add("erro");
}


function limparErros() {
 document.querySelectorAll(".mensagem-erro-campo").forEach(el => {
   el.textContent = ""; el.classList.remove("visivel");
 });
 document.querySelectorAll(".campo-input.erro").forEach(el => el.classList.remove("erro"));
}


// ─── REVISÃO ─────────────────────────────────────────────────


function preencherRevisao() {
 const container = document.getElementById("revisao-dados");
 if (!container) return;


 const itens = [
   { chave: "Nome",        valor: `${dadosFormulario.nome} ${dadosFormulario.sobrenome}` },
   { chave: "Email",       valor: dadosFormulario.contato },
   { chave: "Nascimento",  valor: dadosFormulario._nascimento || "—" },
   { chave: "CEP",         valor: dadosFormulario._cep        || "—" },
   { chave: "Instituição", valor: dadosFormulario.instituicao || "Não informado" },
   { chave: "Curso",       valor: dadosFormulario.tipo_curso  || "Não informado" },
 ];


 container.innerHTML = itens.map(({ chave, valor }) => `
   <div class="revisao-item">
     <span class="revisao-chave">${chave}</span>
     <span class="revisao-valor">${valor || "—"}</span>
   </div>
 `).join("");
}


// ─── FOTO DE PERFIL ──────────────────────────────────────────


function configurarFoto() {
 const btnFoto     = document.getElementById("btn-foto");
 const inputFoto   = document.getElementById("input-foto");
 const fotoPreview = document.getElementById("foto-preview");
 const placeholder = document.getElementById("foto-placeholder");


 if (!btnFoto || !inputFoto) return;
 btnFoto.addEventListener("click", () => inputFoto.click());
 inputFoto.addEventListener("change", (e) => {
   const arquivo = e.target.files[0];
   if (!arquivo) return;
   const reader  = new FileReader();
   reader.onload = (ev) => {
     fotoPreview.src           = ev.target.result;
     fotoPreview.style.display = "block";
     placeholder.style.display = "none";
   };
   reader.readAsDataURL(arquivo);
 });
}


// ─── VER/ESCONDER SENHA ──────────────────────────────────────


function configurarVerSenha() {
 document.querySelectorAll(".btn-ver-senha").forEach(btn => {
   btn.addEventListener("click", () => {
     const input     = document.getElementById(btn.dataset.alvo);
     if (!input) return;
     const mostrando = input.type === "text";
     input.type      = mostrando ? "password" : "text";
     btn.textContent = mostrando ? "👁" : "🙈";
   });
 });
}


// ─── MÁSCARA DO CEP ──────────────────────────────────────────


function configurarMascaraCEP() {
 const campoCEP = document.getElementById("campo-cep");
 if (!campoCEP) return;
 campoCEP.addEventListener("input", (e) => {
   let v = e.target.value.replace(/\D/g, "");
   if (v.length > 5) v = v.slice(0, 5) + "-" + v.slice(5, 8);
   e.target.value = v;
 });
}


// ─── EVENTOS DOS BOTÕES ──────────────────────────────────────


document.addEventListener("DOMContentLoaded", () => {
 configurarFoto();
 configurarVerSenha();
 configurarMascaraCEP();
 irParaStep(1);
});


document.getElementById("btn-proximo").addEventListener("click", () => {
 if (!validarStep(stepAtual)) return;
 coletarDadosStep(stepAtual);


 if (stepAtual === TOTAL_STEPS) {
   // passa os dados pra API enviar — não mexe nessa linha
   window.PONTE.enviar(dadosFormulario);
 } else {
   irParaStep(stepAtual + 1);
 }
});


document.getElementById("btn-anterior").addEventListener("click", () => {
 if (stepAtual > 1) irParaStep(stepAtual - 1);
});