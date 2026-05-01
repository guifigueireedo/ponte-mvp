document.addEventListener("DOMContentLoaded", () => {
  configurarFoto();
  configurarVerSenha();
  configurarMascaraCEP();
  irParaStep(1);

  console.log("🦀 PONTE carregado!");
  if (MOCK_MODE) console.log("🟡 modo mock ativo — nada vai pro servidor ainda");
});

// clicou em "Próximo": valida, coleta e avança (ou envia no último step)
document.getElementById("btn-proximo").addEventListener("click", async () => {
  if (!validarStep(stepAtual)) return;

  coletarDadosStep(stepAtual);

  if (stepAtual === TOTAL_STEPS) {
    const json = await montarJSON();
    await enviarParaAPI(json);
  } else {
    irParaStep(stepAtual + 1);
  }
});

// clicou em "Anterior": volta uma tela sem perder os dados
document.getElementById("btn-anterior").addEventListener("click", () => {
  if (stepAtual > 1) irParaStep(stepAtual - 1);
});