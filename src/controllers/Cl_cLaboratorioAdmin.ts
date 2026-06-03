import Cl_mLaboratorio from "../models/Cl_mLaboratorio.js";
import Cl_mExamen from "../models/Cl_mExamen.js";
import Cl_mEstudio from "../models/Cl_mEstudio.js";
import Cl_sLaboratorio from "../services/Cl_sLaboratorio.js";
import { I_vAdmin } from "../interfaces/I_vAdmin.js";
import Cl_cExamen from "./Cl_cExamen.js";

export default class Cl_cLaboratorioAdmin {
  private laboratorio: Cl_mLaboratorio;
  private pantallaAdmin: I_vAdmin;
  private controladorExamen: Cl_cExamen;

  constructor(pantallaAdmin: I_vAdmin, controladorExamen: Cl_cExamen) {
    this.pantallaAdmin = pantallaAdmin;
    this.controladorExamen = controladorExamen;
    this.laboratorio = new Cl_mLaboratorio();
    
    let yoMismo = this;
    this.cargarExamenes();
    
    this.pantallaAdmin.cuandoClicEnNuevoExamen(function() {
      yoMismo.guardarNuevoExamen();
    });
    
    this.pantallaAdmin.cuandoClicEnImprimir(function(id) {
      yoMismo.imprimirReporte(id);
    });
    
    this.pantallaAdmin.cuandoClicEnEnviarWhatsApp(function(id) {
      yoMismo.enviarWhatsApp(id);
    });
  }

  private async cargarExamenes() {
    let resultado = await Cl_sLaboratorio.traerDesdeNube();
    if (resultado.ok === true) {
      this.laboratorio = resultado.laboratorio;
      this.refrescarPantalla();
    }
  }

  private refrescarPantalla() {
    let finalizados = this.laboratorio.obtenerFinalizados();
    this.pantallaAdmin.mostrarFinalizados({ examenes: finalizados });
  }

  private guardarNuevoExamen() {
    let yoMismo = this;
    this.controladorExamen.pedirDatosExamen(async function(examen: Cl_mExamen | null) {
      if (examen !== null) {
        let guardado = await Cl_sLaboratorio.guardarEnNube(examen);
        if (guardado.ok === true) {
          alert("Orden de examen registrada con exito");
          await yoMismo.cargarExamenes();
        }
      }
    });
  }

  private imprimirReporte(idExamen: string) {
    let examen = this.laboratorio.buscarPorId(idExamen);
    if (examen === null) return;

    let listaEstudios = examen.obtenerArregloEstudios();
    let listaResultados = examen.obtenerArregloResultados();

    let filasHtml = "";
    for (let i = 0; i < listaEstudios.length; i++) {
      let nombreEst = listaEstudios[i];
      let resultadoVal = "Pendiente";
      if (i < listaResultados.length && listaResultados[i] !== "") {
        resultadoVal = listaResultados[i];
      }
      
      let refInfo = Cl_mEstudio.obtenerValoresReferencia(nombreEst);
      let unidadMedida = Cl_mEstudio.obtenerUnidad(nombreEst);

      filasHtml = filasHtml + `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 12px; font-weight: 600;">${nombreEst}</td>
          <td style="padding: 12px; font-weight: 600;">${resultadoVal} ${unidadMedida}</td>
          <td style="padding: 12px;">${refInfo}</td>
        </tr>
      `;
    }

    let plantilla = `
      <div style="font-family: Arial, sans-serif; padding: 30px; max-width: 650px; margin: auto; border: 2px solid #1a5f7a; border-radius: 12px; background: white;">
        <div style="text-align: center; border-bottom: 3px solid #ffc107; padding-bottom: 15px;">
          <h2 style="color: #1a5f7a;">LABORATORIO CLINICO</h2>
          <p>Reporte de Resultados</p>
        </div>
        <div style="margin-bottom: 20px; padding: 15px; background: #f0f6fa; border-radius: 8px;">
          <div><strong>Paciente:</strong> ${examen.nombrePaciente}</div>
          <div><strong>Cedula:</strong> ${examen.cedulaPaciente}</div>
          <div><strong>Telefono:</strong> ${examen.telefonoPaciente}</div>
          <div><strong>Fecha:</strong> ${new Date(examen.fechaRegistro).toLocaleDateString()}</div>
        </div>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #1a5f7a; color: white;">
              <th style="padding: 12px;">Estudio</th>
              <th style="padding: 12px;">Resultado</th>
              <th style="padding: 12px;">Referencia</th>
            </tr>
          </thead>
          <tbody>
            ${filasHtml}
          </tbody>
        </table>
        <div style="text-align: center; margin-top: 40px; padding-top: 15px; border-top: 1px dashed #ccc;">
          Resultados validados por Bioanalistas
        </div>
      </div>
    `;

    this.pantallaAdmin.mostrarReporte(plantilla);
  }

  private enviarWhatsApp(idExamen: string) {
    let examen = this.laboratorio.buscarPorId(idExamen);
    if (examen === null) {
      return;
    }
    
    if (examen.estado !== "listo") {
      alert("El examen debe estar en estado listo para enviar resultados");
      return;
    }
    
    if (examen.telefonoPaciente === "" || examen.telefonoPaciente === undefined) {
      alert("El paciente no tiene numero de telefono");
      return;
    }
    
    let estudios = examen.obtenerArregloEstudios();
    let resultados = examen.obtenerArregloResultados();
    
    let mensaje = "LABORATORIO CLINICO\n";
    mensaje = mensaje + "========================\n";
    mensaje = mensaje + "Paciente: " + examen.nombrePaciente + "\n";
    mensaje = mensaje + "Fecha: " + new Date(examen.fechaRegistro).toLocaleDateString() + "\n";
    mensaje = mensaje + "Total: Bs. " + examen.precioEstudio + "\n\n";
    mensaje = mensaje + "RESULTADOS:\n";
    mensaje = mensaje + "========================\n";
    
    for (let i = 0; i < estudios.length; i++) {
      let valor = "Pendiente";
      if (i < resultados.length && resultados[i] !== "") {
        valor = resultados[i];
      }
      mensaje = mensaje + estudios[i] + ": " + valor + "\n";
    }
    
    mensaje = mensaje + "\n========================\n";
    mensaje = mensaje + "Gracias por confiar en nosotros";
    
    let telefono = examen.telefonoPaciente;
    let soloNumeros = "";
    for (let i = 0; i < telefono.length; i++) {
      let caracter = telefono[i];
      if (caracter >= "0" && caracter <= "9") {
        soloNumeros = soloNumeros + caracter;
      }
    }
    
    if (soloNumeros.length === 10) {
      soloNumeros = "58" + soloNumeros;
    }
    
    if (soloNumeros.length === 11 && soloNumeros[0] === "0") {
      let sinCero = "";
      for (let i = 1; i < soloNumeros.length; i++) {
        sinCero = sinCero + soloNumeros[i];
      }
      soloNumeros = "58" + sinCero;
    }
    
    let url = "https://wa.me/" + soloNumeros + "?text=" + encodeURIComponent(mensaje);
    window.open(url, "_blank");
  }
}