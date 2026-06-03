export default class Cl_vAdmin {
    divFinalizados;
    divFormulario;
    botonNuevoExamen = null;
    avisarImprimir = null;
    avisarWhatsApp = null;
    constructor() {
        this.divFinalizados = document.getElementById("admin_finalizados");
        this.divFormulario = document.getElementById("admin_formulario");
        this.mostrarFormulario();
    }
    cuandoClicEnNuevoExamen(avisar) {
        if (this.botonNuevoExamen !== null) {
            this.botonNuevoExamen.onclick = avisar;
        }
    }
    cuandoClicEnImprimir(avisar) {
        this.avisarImprimir = avisar;
    }
    cuandoClicEnEnviarWhatsApp(avisar) {
        this.avisarWhatsApp = avisar;
    }
    mostrarFormulario() {
        if (this.divFormulario === null)
            return;
        this.divFormulario.innerHTML = `
      <button id="botonAbrirModal" style="width:100%; padding:12px; background:linear-gradient(135deg, #764ba2 0%, #667eea 100%); color:white; border:none; border-radius:8px; font-weight:bold; cursor:pointer; font-size:1rem;">
        + Registrar Orden de Examen
      </button>
    `;
        this.botonNuevoExamen = document.getElementById("botonAbrirModal");
    }
    mostrarFinalizados(datos) {
        if (this.divFinalizados === null)
            return;
        if (datos.examenes.length === 0) {
            this.divFinalizados.innerHTML = "<div class='mensaje-vacio'>No hay examenes listos para imprimir</div>";
            return;
        }
        let html = `
      <table style="width:100%; border-collapse:collapse; text-align:left;">
        <thead>
          <tr style="background:#f4f6f9; border-bottom:2px solid #eee;">
            <th style="padding:12px;">Paciente</th>
            <th style="padding:12px;">Cedula</th>
            <th style="padding:12px;">Estudios Realizados</th>
            <th style="padding:12px;">Total Cobrado</th>
            <th style="padding:12px; text-align:center;">Acciones</th>
          </tr>
        </thead>
        <tbody>
    `;
        for (let i = 0; i < datos.examenes.length; i++) {
            let ex = datos.examenes[i];
            html = html + `
        <tr style="border-bottom:1px solid #f9f9f9;">
          <td style="padding:12px; font-weight:500;">${ex.nombrePaciente}</td>
          <td style="padding:12px; color:#666;">${ex.cedulaPaciente}</td>
          <td style="padding:12px;"><span style="background:#e8eaf6; color:#3f51b5; padding:4px 10px; border-radius:12px; font-size:0.85rem; font-weight:500;">${ex.nombreEstudio}</span></td>
          <td style="padding:12px; font-weight:bold; color:#2e7d32;">$${ex.precioEstudio}.00</td>
          <td style="padding:12px; text-align:center;">
            <button class="btn-imprimir" data-id="${ex.id}" style="padding:6px 14px; background:#764ba2; color:white; border:none; border-radius:6px; cursor:pointer; font-weight:bold; margin-right:5px;">
              Imprimir
            </button>
            <button class="btn-whatsapp" data-id="${ex.id}" style="padding:6px 14px; background:#25D366; color:white; border:none; border-radius:6px; cursor:pointer; font-weight:bold;">
              WhatsApp
            </button>
          </td>
        </tr>
      `;
        }
        html = html + "</tbody></table>";
        this.divFinalizados.innerHTML = html;
        let botonesImprimir = this.divFinalizados.querySelectorAll(".btn-imprimir");
        let botonesWhatsApp = this.divFinalizados.querySelectorAll(".btn-whatsapp");
        let yoMismo = this;
        for (let i = 0; i < botonesImprimir.length; i++) {
            let btn = botonesImprimir[i];
            btn.onclick = function () {
                let id = btn.getAttribute("data-id") || "";
                if (yoMismo.avisarImprimir !== null) {
                    yoMismo.avisarImprimir(id);
                }
            };
        }
        for (let i = 0; i < botonesWhatsApp.length; i++) {
            let btn = botonesWhatsApp[i];
            btn.onclick = function () {
                let id = btn.getAttribute("data-id") || "";
                if (yoMismo.avisarWhatsApp !== null) {
                    yoMismo.avisarWhatsApp(id);
                }
            };
        }
    }
    mostrarReporte(reporte) {
        let ventana = window.open("", "_blank");
        if (ventana !== null) {
            ventana.document.write("<html><head><title>Impresion de Resultados</title></head><body>" + reporte + "</body></html>");
            ventana.document.close();
            ventana.print();
        }
    }
}
//# sourceMappingURL=Cl_vAdmin.js.map