import Cl_mEstudio from "../models/Cl_mEstudio.js";
export default class Cl_vExamen {
    modal;
    contenidoModal;
    botonCancelar;
    botonAceptar;
    avisarAceptar = null;
    avisarCancelar = null;
    constructor() {
        this.modal = document.getElementById("modalExamen");
        this.contenidoModal = document.getElementById("modal_contenido");
        this.botonCancelar = document.getElementById("modal_btnCancelar");
        this.botonAceptar = document.getElementById("modal_btnAceptar");
        if (this.modal)
            this.modal.style.display = "none";
        let yoMismo = this;
        if (this.botonCancelar) {
            this.botonCancelar.onclick = () => {
                if (yoMismo.avisarCancelar)
                    yoMismo.avisarCancelar();
                yoMismo.ocultar();
            };
        }
        if (this.botonAceptar) {
            this.botonAceptar.onclick = () => {
                const nombre = document.getElementById("modal_nombre")?.value || "";
                const cedula = document.getElementById("modal_cedula")?.value || "";
                const telefono = document.getElementById("modal_telefono")?.value || "";
                const metodoPago = document.getElementById("modal_metodoPago")?.value || "";
                const estudiosMarcados = [];
                const checkboxes = document.querySelectorAll(".modal-check-estudio:checked");
                for (let i = 0; i < checkboxes.length; i++) {
                    estudiosMarcados.push(checkboxes[i].value);
                }
                if (nombre.trim() === "") {
                    alert("⚠️ El nombre del paciente es obligatorio.");
                    return;
                }
                if (cedula.trim() === "") {
                    alert("⚠️ La cédula del paciente es obligatoria.");
                    return;
                }
                if (telefono.trim() === "") {
                    alert("⚠️ El número de teléfono es obligatorio.");
                    return;
                }
                const telefonoValido = yoMismo.validarTelefonoVenezuela(telefono);
                if (!telefonoValido.valido) {
                    alert(telefonoValido.mensaje);
                    return;
                }
                if (estudiosMarcados.length === 0) {
                    alert("⚠️ Debe seleccionar al menos un estudio.");
                    return;
                }
                if (yoMismo.avisarAceptar) {
                    yoMismo.avisarAceptar({
                        nombrePaciente: nombre,
                        cedulaPaciente: cedula,
                        telefonoPaciente: telefono,
                        estudiosSeleccionados: estudiosMarcados,
                        formaPago: metodoPago
                    });
                }
            };
        }
    }
    validarTelefonoVenezuela(telefono) {
        if (!telefono || telefono.trim() === "") {
            return { valido: false, mensaje: "El teléfono es obligatorio." };
        }
        let telefonoLimpio = telefono.trim().replace(/[\s\-\.]/g, "");
        let numeroLimpio = telefonoLimpio;
        if (telefonoLimpio.startsWith("+58"))
            numeroLimpio = telefonoLimpio.substring(3);
        else if (telefonoLimpio.startsWith("58"))
            numeroLimpio = telefonoLimpio.substring(2);
        if (!/^\d+$/.test(numeroLimpio)) {
            return { valido: false, mensaje: "Solo números y opcionalmente +58" };
        }
        const prefijosValidos = ["412", "414", "424", "426", "416", "422"];
        if (numeroLimpio.length === 10) {
            const prefijo = numeroLimpio.substring(0, 3);
            if (prefijosValidos.includes(prefijo))
                return { valido: true, mensaje: "" };
            return { valido: false, mensaje: "Prefijo inválido" };
        }
        if (numeroLimpio.length === 11 && numeroLimpio.startsWith("0")) {
            const prefijo = numeroLimpio.substring(1, 4);
            if (prefijosValidos.includes(prefijo))
                return { valido: true, mensaje: "" };
            return { valido: false, mensaje: "Prefijo inválido" };
        }
        if (numeroLimpio.length === 7)
            return { valido: true, mensaje: "" };
        return { valido: false, mensaje: "Teléfono inválido. Ej: 04121234567" };
    }
    cuandoDenCancelar(callback) {
        this.avisarCancelar = callback;
    }
    cuandoDenAceptar(callback) {
        this.avisarAceptar = callback;
    }
    mostrar() {
        if (!this.contenidoModal || !this.modal)
            return;
        let checkboxesHtml = "";
        const estudios = Cl_mEstudio.obtenerTodos();
        for (let i = 0; i < estudios.length; i++) {
            const est = estudios[i];
            checkboxesHtml += `
        <div class="checkbox-item">
          <input type="checkbox" class="modal-check-estudio" id="mod_est_${est.id}" value="${est.nombre}" data-precio="${est.precio}">
          <label for="mod_est_${est.id}">${est.nombre} ($${est.precio})</label>
        </div>
      `;
        }
        if (estudios.length === 0) {
            checkboxesHtml = "<p>Cargando catálogo...</p>";
        }
        this.contenidoModal.innerHTML = `
      <div class="campo">
        <label>Nombre Completo: <span style="color:#c0392b;">*</span></label>
        <input type="text" id="modal_nombre" placeholder="Ej: Manuel Flores">
      </div>
      <div class="campo">
        <label>Cédula de Identidad: <span style="color:#c0392b;">*</span></label>
        <input type="text" id="modal_cedula" placeholder="Ej: V-12345678">
      </div>
      <div class="campo">
        <label>Teléfono: <span style="color:#c0392b;">*</span></label>
        <input type="tel" id="modal_telefono" placeholder="Ej: 04121234567">
        <small>Válidos: 0412, 0414, 0424, 0426, 0416, 0422</small>
      </div>
      <div class="campo">
        <label>Estudios Solicitados: <span style="color:#c0392b;">*</span></label>
        <div class="checkbox-group">
          ${checkboxesHtml}
        </div>
      </div>
      <div class="campo">
        <label>Total Provisional ($):</label>
        <input type="number" id="modal_precio" value="0" readonly style="background:#f0f0f0; font-weight:bold; color:#2e7d32;">
      </div>
      <div class="campo">
        <label>Método de Pago: <span style="color:#c0392b;">*</span></label>
        <select id="modal_metodoPago">
          <option value="Efectivo">Efectivo</option>
          <option value="Transferencia">Transferencia</option>
          <option value="Pago Móvil">Pago Móvil</option>
        </select>
      </div>
    `;
        const inputPrecio = document.getElementById("modal_precio");
        const checkboxes = document.querySelectorAll(".modal-check-estudio");
        for (let i = 0; i < checkboxes.length; i++) {
            const chk = checkboxes[i];
            chk.onchange = () => {
                let total = 0;
                const marcados = document.querySelectorAll(".modal-check-estudio:checked");
                for (let j = 0; j < marcados.length; j++) {
                    const chkMarcado = marcados[j];
                    total += parseFloat(chkMarcado.getAttribute("data-precio") || "0");
                }
                if (inputPrecio)
                    inputPrecio.value = total.toString();
            };
        }
        this.modal.style.display = "flex";
    }
    ocultar() {
        if (this.modal)
            this.modal.style.display = "none";
    }
}
//# sourceMappingURL=Cl_vExamen.js.map