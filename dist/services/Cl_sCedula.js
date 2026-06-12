// services/Cl_sCedula.ts
export default class Cl_sCedula {
    static API_URL = "https://api.cedula.com.ve/api/v1";
    static APP_ID = "9217";
    static TOKEN = "1b0611917be24be6131b02be8be356f4";
    /**
     * Consulta los datos de una persona por su cédula
     * @param cedulaCompleta Cédula con o sin letra (ej: V-12345678, 12345678)
     * @returns DatosCedula con la información obtenida
     */
    static async consultarPorCedula(cedulaCompleta) {
        // Limpiar y extraer nacionalidad y número
        const cedulaLimpia = cedulaCompleta.trim().toUpperCase();
        console.log("🔍 Consultando cédula:", cedulaLimpia);
        // Determinar nacionalidad (V, E, J, P, etc.)
        let nacionalidad = "V"; // Por defecto venezolano
        let numeroCedula = cedulaLimpia;
        // Si tiene letra al inicio (ej: V-12345678 o V12345678)
        const matchLetra = cedulaLimpia.match(/^([VEJPG])\-?(\d+)$/i);
        if (matchLetra) {
            nacionalidad = matchLetra[1].toUpperCase();
            numeroCedula = matchLetra[2];
        }
        console.log("📋 Nacionalidad:", nacionalidad, "Número:", numeroCedula);
        // Validar que solo queden números
        if (!/^\d+$/.test(numeroCedula)) {
            return {
                exito: false,
                mensaje: "Formato de cédula inválido. Use solo números o formato V-12345678"
            };
        }
        try {
            const url = `${this.API_URL}?app_id=${this.APP_ID}&token=${this.TOKEN}&nacionalidad=${nacionalidad}&cedula=${numeroCedula}`;
            console.log("🌐 URL de consulta:", url);
            const respuesta = await fetch(url);
            console.log("📡 Respuesta HTTP:", respuesta.status, respuesta.statusText);
            if (!respuesta.ok) {
                return {
                    exito: false,
                    mensaje: `Error HTTP ${respuesta.status}: ${respuesta.statusText}`
                };
            }
            const datos = await respuesta.json();
            console.log("📦 Datos recibidos:", datos);
            // Verificar si la API devuelve error
            if (datos.error === true) {
                return {
                    exito: false,
                    mensaje: datos.error_str || "Error en la consulta de la API"
                };
            }
            // Verificar si tiene datos
            if (!datos.data) {
                return {
                    exito: false,
                    mensaje: "No se encontraron datos para esta cédula"
                };
            }
            // Extraer la información
            const data = datos.data;
            const primerNombre = data.primer_nombre || "";
            const segundoNombre = data.segundo_nombre || "";
            const primerApellido = data.primer_apellido || "";
            const segundoApellido = data.segundo_apellido || "";
            // Construir nombre completo
            const partesNombre = [primerNombre, segundoNombre, primerApellido, segundoApellido];
            const nombreCompleto = partesNombre.filter(p => p && p.trim() !== "").join(" ");
            console.log("✅ Nombre construido:", nombreCompleto);
            if (!nombreCompleto) {
                return {
                    exito: false,
                    mensaje: "La API no devolvió nombre para esta cédula"
                };
            }
            return {
                exito: true,
                mensaje: "Datos obtenidos correctamente",
                nombreCompleto: nombreCompleto,
                primerNombre: primerNombre || undefined,
                segundoNombre: segundoNombre || undefined,
                primerApellido: primerApellido || undefined,
                segundoApellido: segundoApellido || undefined,
                nacionalidad: data.nacionalidad || nacionalidad,
                cedula: data.cedula || parseInt(numeroCedula, 10)
            };
        }
        catch (error) {
            console.error("❌ Error consultando API de cédula:", error);
            return {
                exito: false,
                mensaje: `Error de conexión: ${error instanceof Error ? error.message : "Error desconocido"}`
            };
        }
    }
    /**
     * Valida si una cédula tiene formato venezolano válido
     */
    static validarFormatoCedula(cedula) {
        const limpia = cedula.trim().toUpperCase();
        const regex = /^([VEJPG])\-?(\d{6,8})$/i;
        return regex.test(limpia) || /^\d{6,8}$/.test(limpia);
    }
}
//# sourceMappingURL=Cl_sCedula.js.map