import Cl_mEstudio from "./Cl_mEstudio.js";

export default class Cl_mExamen {
  public id: string;
  public nombrePaciente: string;
  public cedulaPaciente: string;
  public telefonoPaciente: string;
  public nombreEstudio: string;      
  public resultadoExamen: string;    
  public precioEstudio: number;
  public formaPago: string;
  public estaFinalizado: boolean;
  public fechaRegistro: string;
  private _estado: string;

  constructor(datos: {
    id?: string;
    nombrePaciente?: string;
    cedulaPaciente?: string;
    telefonoPaciente?: string;
    estudiosSeleccionados?: string[];
    nombreEstudio?: string;
    resultadoExamen?: string;
    precioEstudio?: number;
    formaPago?: string;
    estaFinalizado?: boolean;
    fechaRegistro?: string;
    estado?: string;
  }) {
    this.id = datos.id || "";
    this.nombrePaciente = datos.nombrePaciente || "";
    this.cedulaPaciente = datos.cedulaPaciente || "";
    this.telefonoPaciente = datos.telefonoPaciente || "";
    this.formaPago = datos.formaPago || "";
    this.resultadoExamen = datos.resultadoExamen || "";
    this.estaFinalizado = datos.estaFinalizado || false;
    this.fechaRegistro = datos.fechaRegistro || new Date().toISOString();
    
    if (datos.estado === "preparacion" || datos.estado === "pendiente" || datos.estado === "listo") {
      this._estado = datos.estado;
    } else {
      this._estado = "preparacion";
    }

    if (datos.estudiosSeleccionados && Array.isArray(datos.estudiosSeleccionados)) {
      this.nombreEstudio = datos.estudiosSeleccionados.join(", ");
      this.precioEstudio = Cl_mEstudio.calcularPrecioTotal(datos.estudiosSeleccionados);
    } else if (datos.nombreEstudio) {
      this.nombreEstudio = datos.nombreEstudio;
      this.precioEstudio = Number(datos.precioEstudio) || 0;
    } else {
      this.nombreEstudio = "";
      this.precioEstudio = 0;
    }
  }

  public obtenerArregloEstudios(): string[] {
    if (this.nombreEstudio === "") {
      return [];
    }
    return this.nombreEstudio.split(", ").map(item => item.trim());
  }

  public obtenerArregloResultados(): string[] {
    if (this.resultadoExamen === "") {
      return [];
    }
    return this.resultadoExamen.split(", ").map(item => item.trim());
  }

  get estado(): string {
    return this._estado;
  }

  set estado(nuevoEstado: string) {
    if (nuevoEstado === "preparacion" || nuevoEstado === "pendiente" || nuevoEstado === "listo") {
      this._estado = nuevoEstado;
      if (this._estado === "listo") {
        this.estaFinalizado = true;
      }
    }
  }

  get estadoMostrar(): string {
    if (this._estado === "preparacion") {
      return "En preparacion";
    }
    if (this._estado === "pendiente") {
      return "Pendiente de resultados";
    }
    return "Resultados listos";
  }

  public avanzarEstado(): boolean {
    if (this._estado === "preparacion") {
      this._estado = "pendiente";
      return true;
    }
    if (this._estado === "pendiente") {
      this._estado = "listo";
      this.estaFinalizado = true;
      return true;
    }
    return false;
  }
}