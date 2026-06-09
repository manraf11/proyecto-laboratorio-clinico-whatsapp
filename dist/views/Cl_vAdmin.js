import Cl_mEstudio from "../models/Cl_mEstudio.js";
export default class Cl_vAdmin {
    divFinalizados;
    divFormulario;
    botonNuevoExamen = null;
    botonFiltrarEstudios = null;
    botonCalcularPorcentaje = null;
    inputFiltroFecha = null;
    selectFiltroTipo = null;
    selectPorcentajeTipo = null;
    avisarImprimir = null;
    avisarWhatsApp = null;
    avisarFiltrarEstudios = null;
    avisarCalcularPorcentaje = null;
    constructor() {
        this.divFinalizados = document.getElementById("admin_finalizados");
        this.divFormulario = document.getElementById("admin_formulario");
        this.mostrarFormulario();
    }
    cuandoClicEnNuevoExamen(avisar) {
        if (this.botonNuevoExamen)
            this.botonNuevoExamen.onclick = avisar;
    }
    cuandoClicEnFiltrarEstudios(avisar) {
        this.avisarFiltrarEstudios = avisar;
    }
    cuandoClicEnCalcularPorcentaje(avisar) {
        this.avisarCalcularPorcentaje = avisar;
    }
    cuandoClicEnImprimir(avisar) {
        this.avisarImprimir = avisar;
    }
    cuandoClicEnEnviarWhatsApp(avisar) {
        this.avisarWhatsApp = avisar;
    }
    mostrarResultadoFiltro(cantidad, tipoEstudio, fechaSeleccionada) {
        const divResultado = document.getElementById("resultadoFiltroEstudios");
        if (!divResultado)
            return;
        divResultado.innerHTML = `
      <div class="resultado-item">
        <strong>${cantidad}</strong> estudio(s) de tipo <strong>${tipoEstudio}</strong> en fecha <strong>${fechaSeleccionada}</strong>
      </div>
    `;
    }
    mostrarResultadoPorcentaje(porcentaje, tipoEstudio) {
        const divResultado = document.getElementById("resultadoPorcentajeEstudios");
        if (!divResultado)
            return;
        divResultado.innerHTML = `
      <div class="resultado-item" style="background:#e8f5e9; border-left-color:#4caf50;">
        📊 <strong>${porcentaje}%</strong> de los estudios son <strong>${tipoEstudio}</strong>
      </div>
    `;
    }
    actualizarListaEstudios() {
        if (!this.selectFiltroTipo)
            return;
        const estudios = Cl_mEstudio.obtenerTodos();
        const valorActual = this.selectFiltroTipo.value;
        const valorActualPorcentaje = this.selectPorcentajeTipo ? this.selectPorcentajeTipo.value : "";
        this.selectFiltroTipo.innerHTML = '<option value="">-- Seleccione un estudio --</option>';
        if (this.selectPorcentajeTipo) {
            this.selectPorcentajeTipo.innerHTML = '<option value="">-- Seleccione un estudio --</option>';
        }
        for (let i = 0; i < estudios.length; i++) {
            const optionFiltro = document.createElement("option");
            optionFiltro.value = estudios[i].nombre;
            optionFiltro.textContent = `${estudios[i].nombre} ($${estudios[i].precio})`;
            this.selectFiltroTipo.appendChild(optionFiltro);
            if (this.selectPorcentajeTipo) {
                const optionPorcentaje = document.createElement("option");
                optionPorcentaje.value = estudios[i].nombre;
                optionPorcentaje.textContent = `${estudios[i].nombre} ($${estudios[i].precio})`;
                this.selectPorcentajeTipo.appendChild(optionPorcentaje);
            }
        }
        if (valorActual && this.selectFiltroTipo.querySelector(`option[value="${valorActual}"]`)) {
            this.selectFiltroTipo.value = valorActual;
        }
        if (valorActualPorcentaje && this.selectPorcentajeTipo &&
            this.selectPorcentajeTipo.querySelector(`option[value="${valorActualPorcentaje}"]`)) {
            this.selectPorcentajeTipo.value = valorActualPorcentaje;
        }
    }
    mostrarFormulario() {
        if (!this.divFormulario)
            return;
        this.botonNuevoExamen = document.getElementById("botonAbrirModal");
        this.botonFiltrarEstudios = document.getElementById("botonFiltrarEstudios");
        this.botonCalcularPorcentaje = document.getElementById("botonCalcularPorcentaje");
        this.inputFiltroFecha = document.getElementById("filtro_fecha");
        this.selectFiltroTipo = document.getElementById("filtro_tipo_estudio");
        this.selectPorcentajeTipo = document.getElementById("porcentaje_tipo_estudio");
        this.actualizarListaEstudios();
        if (this.botonFiltrarEstudios) {
            this.botonFiltrarEstudios.onclick = () => {
                const tipo = this.selectFiltroTipo?.value || "";
                const fecha = this.inputFiltroFecha?.value || "";
                if (!tipo) {
                    alert("Seleccione un estudio");
                    return;
                }
                if (!fecha) {
                    alert("Seleccione una fecha");
                    return;
                }
                if (this.avisarFiltrarEstudios)
                    this.avisarFiltrarEstudios(tipo, fecha);
            };
        }
        if (this.botonCalcularPorcentaje) {
            this.botonCalcularPorcentaje.onclick = () => {
                const tipo = this.selectPorcentajeTipo?.value || "";
                if (!tipo) {
                    alert("Seleccione un estudio");
                    return;
                }
                if (this.avisarCalcularPorcentaje)
                    this.avisarCalcularPorcentaje(tipo);
            };
        }
    }
    mostrarFinalizados(datos) {
        if (!this.divFinalizados)
            return;
        if (datos.examenes.length === 0) {
            this.divFinalizados.innerHTML = "<div class='mensaje-vacio'>📭 No hay exámenes listos</div>";
            return;
        }
        let html = `
      <table style="width:100%; border-collapse:collapse;">
        <thead>
          <tr style="background:#1a5f7a; color:white;">
            <th style="padding:12px;">ID</th>
            <th style="padding:12px;">Paciente</th>
            <th style="padding:12px;">Cédula</th>
            <th style="padding:12px;">Teléfono</th>
            <th style="padding:12px;">Estado</th>
            <th style="padding:12px;">Estudios</th>
            <th style="padding:12px;">Total</th>
            <th style="padding:12px;">Acciones</th>
          </tr>
        </thead>
        <tbody>
    `;
        for (const ex of datos.examenes) {
            const idMostrar = ex.id ? (ex.id.length > 6 ? ex.id.slice(-6) : ex.id) : "N/A";
            html += `
        <tr style="border-bottom:1px solid #eee;">
          <td style="padding:12px; font-family:monospace;">#${idMostrar}</td>
          <td style="padding:12px;">${this.escapeHtml(ex.nombrePaciente)}</td>
          <td style="padding:12px;">${this.escapeHtml(ex.cedulaPaciente)}</td>
          <td style="padding:12px;">${ex.telefonoPaciente || "No registrado"}</td>
          <td style="padding:12px;"><span style="background:#28a745; color:white; padding:4px 10px; border-radius:12px;">LISTO</span></td>
          <td style="padding:12px;"><span style="background:#e8eaf6; padding:4px 10px; border-radius:12px;">${this.escapeHtml(ex.nombreEstudio)}</span></td>
          <td style="padding:12px;">$${ex.precioEstudio}</td>
          <td style="padding:12px;">
            <button class="btn-imprimir" data-id="${ex.id}">📄 Imprimir</button>
            <button class="btn-whatsapp" data-id="${ex.id}">💬 WhatsApp</button>
          </td>
        </tr>
      `;
        }
        html += "</tbody></table>";
        this.divFinalizados.innerHTML = html;
        const yoMismo = this;
        document.querySelectorAll(".btn-imprimir").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-id") || "";
                if (yoMismo.avisarImprimir)
                    yoMismo.avisarImprimir(id);
            });
        });
        document.querySelectorAll(".btn-whatsapp").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-id") || "";
                if (yoMismo.avisarWhatsApp)
                    yoMismo.avisarWhatsApp(id);
            });
        });
    }
    mostrarReporte(reporte) {
        const ventana = window.open("", "_blank");
        if (ventana) {
            ventana.document.write(`<html><head><title>Resultados</title></head><body>${reporte}</body></html>`);
            ventana.document.close();
            ventana.print();
        }
    }
    mostrarMensajeExitoConId(idExamen) {
        const idCorto = idExamen.length > 6 ? idExamen.slice(-6) : idExamen;
        alert(`✅ Examen registrado con éxito!\nNúmero de orden: #${idCorto}`);
    }
    escapeHtml(text) {
        if (!text)
            return "";
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
//# sourceMappingURL=Cl_vAdmin.js.map