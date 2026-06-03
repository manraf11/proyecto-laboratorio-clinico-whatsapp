import { I_vBioanalista } from "../interfaces/I_vBioanalista.js";
import Cl_mExamen from "../models/Cl_mExamen.js";

export default class Cl_vBioanalista implements I_vBioanalista {
  private divPendientes: HTMLElement;
  private avisarCargar: ((idExamen: string, resultados: string[]) => void) | null = null;
  private avisarFinalizar: ((idExamen: string) => void) | null = null;

  constructor() {
    this.divPendientes = document.getElementById("listaPendientes") as HTMLElement;
  }

  public cuandoCargarResultados(callback: (idExamen: string, resultados: string[]) => void): void {
    this.avisarCargar = callback;
  }

  public cuandoFinalizarExamen(callback: (idExamen: string) => void): void {
    this.avisarFinalizar = callback;
  }

  public mostrarPendientes(datos: { examenes: Cl_mExamen[] }): void {
    if (this.divPendientes === null) {
      return;
    }
    
    if (datos.examenes.length === 0) {
      this.divPendientes.innerHTML = '<div class="mensaje-vacio">No hay examenes pendientes</div>';
      return;
    }

    this.divPendientes.innerHTML = "";

    for (let i = 0; i < datos.examenes.length; i++) {
      let examen = datos.examenes[i];
      let listaEstudios = examen.obtenerArregloEstudios();
      let listaResultadosGuardados = examen.obtenerArregloResultados();

      let card = document.createElement("div");
      card.style.background = "white";
      card.style.border = "1px solid #ddd";
      card.style.borderRadius = "8px";
      card.style.padding = "15px";
      card.style.marginBottom = "15px";

      let estadoColor = "#ff9800";
      if (examen.estado === "pendiente") {
        estadoColor = "#2196f3";
      }
      if (examen.estado === "listo") {
        estadoColor = "#4caf50";
      }

      let html = `
        <div style="border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 10px;">
          <h3>Paciente: ${examen.nombrePaciente}</h3>
          <p>Cedula: ${examen.cedulaPaciente} | Telefono: ${examen.telefonoPaciente}</p>
          <p style="color: ${estadoColor}; font-weight: bold;">Estado: ${examen.estadoMostrar}</p>
        </div>
      `;

      for (let j = 0; j < listaEstudios.length; j++) {
        let nombreEstudio = listaEstudios[j];
        let valorPrevio = "";
        if (j < listaResultadosGuardados.length) {
          valorPrevio = listaResultadosGuardados[j];
        }

        html = html + `
          <div style="margin-bottom: 10px;">
            <label style="font-weight: bold;">${nombreEstudio}:</label>
            <input type="text" class="resultado-input-${examen.id}" data-indice="${j}" value="${valorPrevio}" placeholder="Ingrese valor" style="width: 100%; padding: 6px; margin-top: 5px; border: 1px solid #ccc; border-radius: 4px;">
          </div>
        `;
      }

      html = html + `
        <div style="display: flex; gap: 10px; margin-top: 15px;">
          <button class="btn-cargar" data-id="${examen.id}" style="flex: 1; padding: 8px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Guardar Progreso</button>
          <button class="btn-finalizar" data-id="${examen.id}" style="flex: 1; padding: 8px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">Finalizar Orden</button>
        </div>
      `;

      card.innerHTML = html;
      this.divPendientes.appendChild(card);

      let btnCargar = card.querySelector(".btn-cargar") as HTMLButtonElement;
      let btnFinalizar = card.querySelector(".btn-finalizar") as HTMLButtonElement;
      let yoMismo = this;

      if (btnCargar !== null) {
        btnCargar.onclick = function() {
          let inputs = card.querySelectorAll(".resultado-input-" + examen.id);
          let resultadosArreglo = [];
          for (let k = 0; k < inputs.length; k++) {
            let inp = inputs[k] as HTMLInputElement;
            let valor = inp.value.trim();
            if (valor === "") {
              valor = "No realizado";
            }
            resultadosArreglo.push(valor);
          }
          if (yoMismo.avisarCargar !== null) {
            yoMismo.avisarCargar(examen.id, resultadosArreglo);
          }
        };
      }

      if (btnFinalizar !== null) {
        btnFinalizar.onclick = function() {
          let inputs = card.querySelectorAll(".resultado-input-" + examen.id);
          let todosLlenos = true;
          for (let k = 0; k < inputs.length; k++) {
            let inp = inputs[k] as HTMLInputElement;
            if (inp.value.trim() === "") {
              todosLlenos = false;
              break;
            }
          }
          if (todosLlenos === false) {
            alert("Debe rellenar todos los resultados antes de finalizar");
            return;
          }
          if (confirm("Esta seguro de finalizar la orden de " + examen.nombrePaciente + "?")) {
            if (yoMismo.avisarFinalizar !== null) {
              yoMismo.avisarFinalizar(examen.id);
            }
          }
        };
      }
    }
  }
}