import Cl_mLaboratorio from "../models/Cl_mLaboratorio.js";
import Cl_sLaboratorio from "../services/Cl_sLaboratorio.js";
export default class Cl_cLaboratorioBio {
    laboratorio;
    pantallaBioanalista;
    constructor(pantallaBioanalista) {
        this.pantallaBioanalista = pantallaBioanalista;
        this.laboratorio = new Cl_mLaboratorio();
        let yoMismo = this;
        this.cargarExamenes();
        this.pantallaBioanalista.cuandoCargarResultados(function (id, resultados) {
            yoMismo.guardarResultados(id, resultados);
        });
        this.pantallaBioanalista.cuandoFinalizarExamen(function (id) {
            yoMismo.terminarExamen(id);
        });
    }
    async cargarExamenes() {
        let resultado = await Cl_sLaboratorio.traerDesdeNube();
        if (resultado.ok === true) {
            this.laboratorio = resultado.laboratorio;
            this.refrescarPantalla();
        }
    }
    refrescarPantalla() {
        let pendientes = this.laboratorio.obtenerPendientes();
        let examenesFiltrados = [];
        for (let i = 0; i < pendientes.length; i++) {
            if (pendientes[i].estado !== "listo") {
                examenesFiltrados.push(pendientes[i]);
            }
        }
        this.pantallaBioanalista.mostrarPendientes({ examenes: examenesFiltrados });
    }
    async guardarResultados(idExamen, resultados) {
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
    async terminarExamen(idExamen) {
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
//# sourceMappingURL=Cl_cLaboratorioBio.js.map