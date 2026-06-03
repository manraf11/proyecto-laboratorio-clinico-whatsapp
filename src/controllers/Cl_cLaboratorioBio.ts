import Cl_mLaboratorio from "../models/Cl_mLaboratorio.js";
import Cl_mExamen from "../models/Cl_mExamen.js";
import Cl_sLaboratorio from "../services/Cl_sLaboratorio.js";
import { I_vBioanalista } from "../interfaces/I_vBioanalista.js";

export default class Cl_cLaboratorioBio {
  private laboratorio: Cl_mLaboratorio;
  private pantallaBioanalista: I_vBioanalista;

  constructor(pantallaBioanalista: I_vBioanalista) {
    this.pantallaBioanalista = pantallaBioanalista;
    this.laboratorio = new Cl_mLaboratorio();
    
    let yoMismo = this;
    this.cargarExamenes();
    
    this.pantallaBioanalista.cuandoCargarResultados(function(id, resultados) {
      yoMismo.guardarResultados(id, resultados);
    });
    
    this.pantallaBioanalista.cuandoFinalizarExamen(function(id) {
      yoMismo.terminarExamen(id);
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
    let pendientes = this.laboratorio.obtenerPendientes();
    let examenesFiltrados = [];
    for (let i = 0; i < pendientes.length; i++) {
      if (pendientes[i].estado !== "listo") {
        examenesFiltrados.push(pendientes[i]);
      }
    }
    this.pantallaBioanalista.mostrarPendientes({ examenes: examenesFiltrados });
  }

  private async guardarResultados(idExamen: string, resultados: string[]) {
    let examen = this.laboratorio.buscarPorId(idExamen);
    if (examen !== null && examen.id !== undefined) {
      examen.resultadoExamen = resultados.join(", ");
      
      if (examen.estado === "preparacion") {
        examen.avanzarEstado();
      }
      
      let exito = await Cl_sLaboratorio.actualizarEnNube(examen.id, examen);
      if (exito.ok === true) {
        alert("Resultados guardados. Estado: " + examen.estadoMostrar);
        await this.cargarExamenes();
      }
    }
  }

  private async terminarExamen(idExamen: string) {
    let examen = this.laboratorio.buscarPorId(idExamen);
    if (examen !== null && examen.id !== undefined) {
      if (examen.resultadoExamen === "") {
        alert("No se puede finalizar sin resultados");
        return;
      }
      
      if (examen.estado === "preparacion") {
        alert("Primero debe guardar los resultados");
        return;
      }
      
      if (examen.estado === "pendiente") {
        examen.avanzarEstado();
      }
      
      let exito = await Cl_sLaboratorio.actualizarEnNube(examen.id, examen);
      if (exito.ok === true) {
        alert("Examen completado. Estado: " + examen.estadoMostrar);
        await this.cargarExamenes();
      }
    }
  }
}