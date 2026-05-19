// quando Pedro terminar o backend, troca a URL e muda MOCK_MODE pra false
const API_URL = "http://127.0.0.1:8000/auth/cadastro/jovem";
const MOCK_MODE = true;


// converte o CEP em "Bairro, Cidade" usando a API gratuita ViaCEP
async function buscarBairro(cep) {
 const cepLimpo = cep.replace(/\D/g, "");
 if (cepLimpo.length !== 8) return cep;


 try {
   const res   = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
   const dados = await res.json();
   if (dados.erro) return cep;


   const { bairro, localidade } = dados;
   if (bairro && localidade) return `${bairro}, ${localidade}`;
   return localidade || cep;
 } catch {
   return cep;
 }
}


// recebe "2007-03-15" e devolve a idade atual em anos
function calcularIdade(dataString) {
 if (!dataString) return "";
 const hoje       = new Date();
 const nascimento = new Date(dataString);
 let idade        = hoje.getFullYear() - nascimento.getFullYear();


 const aindaNaoFez =
   hoje.getMonth() < nascimento.getMonth() ||
   (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() < nascimento.getDate());


 if (aindaNaoFez) idade--;
 return idade;
}


// monta o objeto final que vai virar uma linha no Google Sheets do Pedro
async function montarJSON(dados) {
 const idade  = calcularIdade(dados._nascimento);
 const bairro = await buscarBairro(dados._cep);


 return {
   timestamp:              new Date().toISOString(),
   nome:                   dados.nome,
   sobrenome:              dados.sobrenome,
   idade,
   bairro,
   experiencias_informais: dados.experiencias_informais || "",
   instituicao:            dados.instituicao,
   cidade_curso:           dados.cidade_curso,
   tipo_curso:             dados.tipo_curso,
   data_inicio:            dados.data_inicio,
   data_fim:               dados.data_fim,
   contato:                dados.contato
 };
}


// envia os dados pro backend de Pedro
async function enviarParaAPI(dados) {
 mostrarToast("Enviando...", "");


 try {
   const json = await montarJSON(dados);


   if (MOCK_MODE) {
     console.log("[MOCK] dados que iriam pro Google Sheets:", json);
     await new Promise(r => setTimeout(r, 1500));
   } else {
     const res = await fetch(API_URL, {
       method:  "POST",
       headers: { "Content-Type": "application/json" },
       body:    JSON.stringify(json)
     });
     if (!res.ok) throw new Error(`Erro ${res.status}`);
   }


   mostrarToast("Cadastro salvo! Te avisamos quando o PONTE lançar.", "sucesso");
   // window.location.href = "index.html"; // descomentar quando tiver a próxima tela


 } catch (e) {
   const semInternet = e instanceof TypeError && e.message.includes("fetch");
   mostrarToast(
     semInternet
       ? "Sem conexão. Verifica a internet e tenta de novo."
       : "Algo deu errado. Tenta de novo.",
     "erro"
   );
 }
}


function mostrarToast(mensagem, tipo = "") {
 const toast = document.getElementById("toast");
 if (!toast) return;
 toast.textContent = mensagem;
 toast.className   = `toast ${tipo} visivel`;
 setTimeout(() => toast.classList.remove("visivel"), 3500);
}


// ─── PONTO DE CONTATO COM AUTH ──────────────────────────────
// chama window.PONTE.enviar(dadosFormulario) quando o usuário clicar em "Finalizar"
// chama window.PONTE.setExperiencias(...) quando o Manguelito terminar a conversa
window.PONTE = {
 enviar(dadosFormulario) {
   enviarParaAPI(dadosFormulario);
 },
 setExperiencias(experiencias) {
   window._experienciasFormulario = experiencias;
   console.log("experiências recebidas do Manguelito:", experiencias);
 }
};
