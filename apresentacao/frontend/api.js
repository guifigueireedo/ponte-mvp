// quando Pedro terminar o backend, troca a URL e muda MOCK_MODE pra false
const API_URL   = "https://url-da-api-do-pedro.com/salvar";
const MOCK_MODE = true;

function esperar(ms) {
  return new Promise(r => setTimeout(r, ms));
}

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

// monta o objeto final que vai virar uma linha no Google Sheets de Pedro
async function montarJSON() {
  const idade  = calcularIdade(dadosFormulario._nascimento);
  const bairro = await buscarBairro(dadosFormulario._cep);

  return {
    timestamp:              new Date().toISOString(),
    nome:                   dadosFormulario.nome,
    sobrenome:              dadosFormulario.sobrenome,
    idade,
    bairro,
    experiencias_informais: dadosFormulario.experiencias_informais,
    instituicao:            dadosFormulario.instituicao,
    cidade_curso:           dadosFormulario.cidade_curso,
    tipo_curso:             dadosFormulario.tipo_curso,
    data_inicio:            dadosFormulario.data_inicio,
    data_fim:               dadosFormulario.data_fim,
    contato:                dadosFormulario.contato
  };
}

async function enviarParaAPI(json) {
  mostrarLoading(true);

  try {
    if (MOCK_MODE) {
      console.log("[MOCK] dados que iriam pro Google Sheets:", json);
      await esperar(1500);
    } else {
      const res = await fetch(API_URL, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(json)
      });
      if (!res.ok) throw new Error(`Erro ${res.status}`);
    }

    mostrarToast("Cadastro salvo! Te avisamos quando o PONTE lançar.", "sucesso");
    await esperar(1800);
    // window.location.href = "index.html"; // descomentar quando tiver a tela de confirmação

  } catch (e) {
    const semInternet = e instanceof TypeError && e.message.includes("fetch");
    mostrarToast(
      semInternet
        ? "Sem conexão. Verifica a internet e tenta de novo."
        : "Algo deu errado. Tenta de novo.",
      "erro"
    );
  } finally {
    mostrarLoading(false);
  }
}