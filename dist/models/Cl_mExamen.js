import Cl_mEstudio from "./Cl_mEstudio.js";
export default class Cl_mExamen {
    id;
    nombrePaciente;
    cedulaPaciente;
    telefonoPaciente;
    nombreEstudio;
    resultadoExamen;
    precioEstudio;
    formaPago;
    estaFinalizado;
    fechaRegistro;
    _estado;
    constructor(datos) {
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
        }
        else {
            this._estado = "preparacion";
        }
        if (datos.estudiosSeleccionados && Array.isArray(datos.estudiosSeleccionados)) {
            this.nombreEstudio = datos.estudiosSeleccionados.join(", ");
            this.precioEstudio = Cl_mEstudio.calcularPrecioTotal(datos.estudiosSeleccionados);
        }
        else if (datos.nombreEstudio) {
            this.nombreEstudio = datos.nombreEstudio;
            this.precioEstudio = Number(datos.precioEstudio) || 0;
        }
        else {
            this.nombreEstudio = "";
            this.precioEstudio = 0;
        }
    }
    obtenerArregloEstudios() {
        if (this.nombreEstudio === "") {
            return [];
        }
        return this.nombreEstudio.split(", ").map(item => item.trim());
    }
    obtenerArregloResultados() {
        if (this.resultadoExamen === "") {
            return [];
        }
        return this.resultadoExamen.split(", ").map(item => item.trim());
    }
    get estado() {
        return this._estado;
    }
    set estado(nuevoEstado) {
        if (nuevoEstado === "preparacion" || nuevoEstado === "pendiente" || nuevoEstado === "listo") {
            this._estado = nuevoEstado;
            if (this._estado === "listo") {
                this.estaFinalizado = true;
            }
        }
    }
    get estadoMostrar() {
        if (this._estado === "preparacion") {
            return "En preparacion";
        }
        if (this._estado === "pendiente") {
            return "Pendiente de resultados";
        }
        return "Resultados listos";
    }
    avanzarEstado() {
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
//# sourceMappingURL=Cl_mExamen.js.map