
var oTabla = $("#tblRepuestos").DataTable();
jQuery(function () {
    $("#dvMenu").load("../Paginas/Menu.html");

    $("#btnInsertar").on("click", function () {
        EjecutarComando("POST");
    });
    $("#btnActualizar").on("click", function () {
        EjecutarComando("PUT");
    });
    $("#btnEliminar").on("click", function () {
        EjecutarComando("DELETE");
    });
    $("#btnConsultar").on("click", function () {
        Consultar();
    });

    LlenarComboTipoRepuesto();

    LlenarComboMarca();

    LlenarComboProveedor();

    LlenarTabla();
});
async function LlenarTabla() {
    LlenarTablaServiciosAuth("http://localhost:50626/api/Repuesto", "#tblRepuestos");
}

async function LlenarComboTipoRepuesto() {
    LlenarComboServiciosAuth("http://localhost:50626/api/TipoRepuesto", "#cboTipoRepuesto");
}

async function LlenarComboProveedor() {
    LlenarComboServiciosAuth("http://localhost:50626/api/Proveedor", "#cboProveedor");
}

async function LlenarComboMarca() {
    LlenarComboServiciosAuth("http://localhost:50626/api/Marca", "#cboMarca");
}

async function EjecutarComando(Comando) {
    
    let id = $("#txtId").val();
    let nombre = $("#txtNombre").val();
    let descripcion = $("#txtDescripcion").val();
    let numero_referencia = $("#txtNumeroReferencia").val();
    let numero_serie = $("#txtNumeroSerie").val();
    let precio = $("#txtPrecio").val();
    let stock = $("#txtStock").val();
    let fecha_actualizacion = $("#txtFechaActualizacion").val();
    let id_tipo_repuesto = $("#cboTipoRepuesto").val();
    let id_marca = $("#cboMarca").val();
    let id_proveedor = $("#cboProveedor").val();
    

    let Datos = {
        id: id,
        nombre: nombre,
        descripcion: descripcion,
        numero_referencia: numero_referencia,
        numero_serie: numero_serie,
        precio: precio,
        stock: stock,
        fecha_actualizacion: fecha_actualizacion,
        id_tipo_repuesto: id_tipo_repuesto,
        id_marca: id_marca,
        id_proveedor: id_proveedor
    }

    try {
        let ValorCookie = getCookie("token");
        const Respuesta = await fetch("http://localhost:50626/api/Repuesto",
            {
                method: Comando,
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + ValorCookie
                },
                body: JSON.stringify(Datos)
            });

        const Resultado = await Respuesta.json();

        LlenarTabla();

        $("#dvMensaje").html(Resultado);
    }
    catch (error) {
        $("#dvMensaje").html(error);
    }
}
async function Consultar() {
    let id = $("#txtId").val();
    $("#dvMensaje").html("");

    try {
        let ValorCookie = getCookie("token");
        const Respuesta = await fetch("http://localhost:50626/api/Repuesto?id=" + id,
            {
                method: "GET",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + ValorCookie
                }
            });
        const Resultado = await Respuesta.json();

        $("#txtNombre").val(Resultado.nombre);
        $("#txtDescripcion").val(Resultado.descripcion);
        $("#txtNumeroReferencia").val(Resultado.numero_referencia);
        $("#txtNumeroSerie").val(Resultado.numero_serie);
        $("#txtPrecio").val(Resultado.precio);
        $("#txtStock").val(Resultado.stock);
        $("#txtFechaActualizacion").val(Resultado.fecha_actualizacion.split('T')[0]);
        $("#cboTipoRepuesto").val(Resultado.id_tipo_repuesto);
        $("#cboMarca").val(Resultado.id_marca);
        $("#cboProveedor").val(Resultado.id_proveedor);
        
    }
    catch (error) {
        $("#dvMensaje").html(error);
    }
}