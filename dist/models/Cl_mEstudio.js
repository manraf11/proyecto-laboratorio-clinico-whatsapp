export default class Cl_mEstudio {
    static listaEstudios = [];
    id;
    _nombre;
    _precio;
    _unidad;
    _valoresReferencia;
    constructor(datos) {
        this.id = datos.id || "";
        this._nombre = datos.nombre;
        this._precio = datos.precio;
        this._unidad = datos.unidad;
        this._valoresReferencia = datos.valoresReferencia;
    }
    get nombre() { return this._nombre; }
    get precio() { return this._precio; }
    get unidad() { return this._unidad; }
    get valoresReferencia() { return this._valoresReferencia; }
    static obtenerTodos() {
        return [...this.listaEstudios];
    }
    static limpiar() {
        this.listaEstudios = [];
    }
    static agregarEstudio(estudio) {
        this.listaEstudios.push(estudio);
    }
    static buscarPorNombre(nombre) {
        for (let i = 0; i < this.listaEstudios.length; i++) {
            if (this.listaEstudios[i].nombre === nombre) {
                return this.listaEstudios[i];
            }
        }
        return undefined;
    }
    static buscarPorId(id) {
        for (let i = 0; i < this.listaEstudios.length; i++) {
            if (this.listaEstudios[i].id === id) {
                return this.listaEstudios[i];
            }
        }
        return undefined;
    }
    static calcularPrecioTotal(nombresEstudios) {
        let total = 0;
        for (let i = 0; i < nombresEstudios.length; i++) {
            const estudio = this.buscarPorNombre(nombresEstudios[i]);
            if (estudio !== undefined) {
                total = total + estudio.precio;
            }
        }
        return total;
    }
    static obtenerValoresReferencia(nombreEstudio) {
        const estudio = this.buscarPorNombre(nombreEstudio);
        if (estudio !== undefined) {
            return estudio.valoresReferencia;
        }
        return "No especificado";
    }
    static obtenerUnidad(nombreEstudio) {
        const estudio = this.buscarPorNombre(nombreEstudio);
        if (estudio !== undefined) {
            return estudio.unidad;
        }
        return "";
    }
}
//# sourceMappingURL=Cl_mEstudio.js.map