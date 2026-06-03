import { I_vExamen } from "../interfaces/I_vExamen.js";
import Cl_mExamen from "../models/Cl_mExamen.js";
import Cl_mEstudio from "../models/Cl_mEstudio.js";
import Cl_sEstudio from "../services/Cl_sEstudio.js";

export default class Cl_cExamen {
  private pantallaExamen: I_vExamen;
  private avisar: ((examen: Cl_mExamen | null) => void) | null = null;

  constructor(pantallaExamen: I_vExamen) {
    this.pantallaExamen = pantallaExamen;
    let yoMismo = this;
    
    this.pantallaExamen.cuandoDenCancelar(function() {
      yoMismo.alCancelar();
    });
    
    this.pantallaExamen.cuandoDenAceptar(function(datos) {
      yoMismo.alAceptar(datos);
    });

    if (this.pantallaExamen.cuandoRegistrenNuevoEstudio !== undefined) {
      this.pantallaExamen.cuandoRegistrenNuevoEstudio(function(nuevoEstudio) {
        yoMismo.alRegistrarEstudioCatalogo(nuevoEstudio);
      });
    }
  }

  public async pedirDatosExamen(avisar: (examen: Cl_mExamen | null) => void) {
    this.avisar = avisar;
    await Cl_sEstudio.cargarCatalogo();
    this.pantallaExamen.mostrar();
  }

  private alCancelar() {
    if (this.avisar !== null) {
      this.avisar(null);
    }
    this.pantallaExamen.ocultar();
  }

  private alAceptar(datos: {
    nombrePaciente: string;
    cedulaPaciente: string;
    telefonoPaciente?: string;
    estudiosSeleccionados: string[];
    formaPago: string;
  }) {
    if (this.avisar !== null) {
      let nuevoExamen = new Cl_mExamen({
        nombrePaciente: datos.nombrePaciente,
        cedulaPaciente: datos.cedulaPaciente,
        telefonoPaciente: datos.telefonoPaciente,
        estudiosSeleccionados: datos.estudiosSeleccionados,
        formaPago: datos.formaPago
      });
      this.avisar(nuevoExamen);
    }
    this.pantallaExamen.ocultar();
  }

  private async alRegistrarEstudioCatalogo(estudio: Cl_mEstudio) {
    let exito = await Cl_sEstudio.guardarNuevoEstudio(estudio);
    if (exito === true) {
      alert("Estudio registrado con exito");
      await Cl_sEstudio.cargarCatalogo();
      
      let inputNombre = (document.getElementById("modal_nombre") as HTMLInputElement)?.value;
      let inputCedula = (document.getElementById("modal_cedula") as HTMLInputElement)?.value;
      let inputTelef = (document.getElementById("modal_telefono") as HTMLInputElement)?.value;
      
      this.pantallaExamen.mostrar();
      
      if (inputNombre !== undefined) {
        (document.getElementById("modal_nombre") as HTMLInputElement).value = inputNombre;
      }
      if (inputCedula !== undefined) {
        (document.getElementById("modal_cedula") as HTMLInputElement).value = inputCedula;
      }
      if (inputTelef !== undefined) {
        (document.getElementById("modal_telefono") as HTMLInputElement).value = inputTelef;
      }
    } else {
      alert("Error al guardar el estudio");
    }
  }
}