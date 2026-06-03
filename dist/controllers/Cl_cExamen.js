import Cl_mExamen from "../models/Cl_mExamen.js";
import Cl_sEstudio from "../services/Cl_sEstudio.js";
export default class Cl_cExamen {
    pantallaExamen;
    avisar = null;
    constructor(pantallaExamen) {
        this.pantallaExamen = pantallaExamen;
        let yoMismo = this;
        this.pantallaExamen.cuandoDenCancelar(function () {
            yoMismo.alCancelar();
        });
        this.pantallaExamen.cuandoDenAceptar(function (datos) {
            yoMismo.alAceptar(datos);
        });
        if (this.pantallaExamen.cuandoRegistrenNuevoEstudio !== undefined) {
            this.pantallaExamen.cuandoRegistrenNuevoEstudio(function (nuevoEstudio) {
                yoMismo.alRegistrarEstudioCatalogo(nuevoEstudio);
            });
        }
    }
    async pedirDatosExamen(avisar) {
        this.avisar = avisar;
        await Cl_sEstudio.cargarCatalogo();
        this.pantallaExamen.mostrar();
    }
    alCancelar() {
        if (this.avisar !== null) {
            this.avisar(null);
        }
        this.pantallaExamen.ocultar();
    }
    alAceptar(datos) {
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
    async alRegistrarEstudioCatalogo(estudio) {
        let exito = await Cl_sEstudio.guardarNuevoEstudio(estudio);
        if (exito === true) {
            alert("Estudio registrado con exito");
            await Cl_sEstudio.cargarCatalogo();
            let inputNombre = document.getElementById("modal_nombre")?.value;
            let inputCedula = document.getElementById("modal_cedula")?.value;
            let inputTelef = document.getElementById("modal_telefono")?.value;
            this.pantallaExamen.mostrar();
            if (inputNombre !== undefined) {
                document.getElementById("modal_nombre").value = inputNombre;
            }
            if (inputCedula !== undefined) {
                document.getElementById("modal_cedula").value = inputCedula;
            }
            if (inputTelef !== undefined) {
                document.getElementById("modal_telefono").value = inputTelef;
            }
        }
        else {
            alert("Error al guardar el estudio");
        }
    }
}
//# sourceMappingURL=Cl_cExamen.js.map