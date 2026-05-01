// Ana chama isso quando o Manguelito terminar de conversar com o jovem
// exemplo: window.PONTE.setExperiencias("faz bicos de mototaxi, cuida de animais")
window.PONTE = {
  setExperiencias(experiencias) {
    dadosFormulario.experiencias_informais = experiencias;
    console.log("✅ experiências recebidas do Manguelito:", experiencias);
  },
  getDados() {
    return { ...dadosFormulario };
  }
};