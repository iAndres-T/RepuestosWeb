jQuery(function () {

    $("#dvMenu").load("../Paginas/Menu.html");

    LLenarComboEmpleados();
    LLenarComboTipoRepuesto();
    $("#txtNumeroVenta").val("0");
    $("#txtTotalCompra").val(FormatoMiles(0));
});
function LLenarComboEmpleados() {
    LlenarComboServiciosAuth("http://localhost:50626/api/Encargado", "#cboEmpleado");
}

async function LLenarComboTipoRepuesto() {
    let rpta = await LlenarComboServiciosAuth("http://localhost:50626/api/TipoRepuesto", "#cboTipoRepuesto");
    LlenarComboRepuesto();
}

async function LlenarComboRepuesto() {
    let idTipoRepuesto = $("#cboTipoRepuesto").val();

    let rpta = await LlenarComboServiciosAuth("http://localhost:50626/api/Repuesto/LlenarComboXTipoRepuesto?idTipoRepuesto=" + idTipoRepuesto, "#cboRepuesto");
    PresentarValorUnitario();
}

function LlenarTablaVenta(idVenta) {
    LlenarTablaServiciosAuth("http://localhost:50626/api/VentaRepuesto/LlenarTablaVenta?idVenta=" + idVenta, "#tblVenta");
    let total = parseFloat($("#txtTotalCompra").val().replace(/\s/g, '').replace('$', '').replace(/\./g, ''));
    let Cantidad = parseInt($("#txtCantidad").val());
    let ValorUnitario = parseFloat($("#txtValorUnitario").val());
    let suma = (Cantidad * ValorUnitario) + total;
    $("#txtTotalCompra").val(FormatoMiles(suma));
}

async function ActualizarTabla(idVenta) {
    // Llenar la tabla de venta
    await LlenarTablaServiciosAuth("http://localhost:50626/api/VentaRepuesto/LlenarTablaVenta?idVenta=" + idVenta, "#tblVenta");
}


function PresentarValorUnitario() {
    let DatosRepuesto = $("#cboRepuesto").val();
    let id_repuesto = DatosRepuesto.split('|')[0];
    let ValorUnitario = DatosRepuesto.split('|')[1];

    $("#txtValorUnitarioTexto").val(FormatoMiles(ValorUnitario));
    $("#txtValorUnitario").val(ValorUnitario);
    $("#txtCodigoProducto").val(id_repuesto);
    CalcularSubtotal();
}

function CalcularSubtotal() {
    let Cantidad = $("#txtCantidad").val();
    let ValorUnitario = $("#txtValorUnitario").val();
    $("#txtSubtotal").val(FormatoMiles(Cantidad * ValorUnitario));
}

async function ConsultarCliente() {
    //Solo se captura la información del documento del empleado y se invoca el servicio
    let Documento = $("#txtDocumento").val();
    //Fetch para grabar en la base de datos
    try {
        let ValorCookie = getCookie("token");
        const Respuesta = await fetch("http://localhost:50626/api/Cliente?id=" + Documento,
            {
                method: "GET",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + ValorCookie
                }
            });
        //Se lee la respuesta y se convierte a json
        const Resultado = await Respuesta.json();
        //Las respuestas se escriben en el html
        $("#txtNombreCliente").val(Resultado.nombre + " " + Resultado.primer_apellido + " " + Resultado.segundo_apellido);
    }
    catch (error) {
        //Se presenta el error en el "dvMensaje" de la interfaz
        $("#dvMensaje").html(error);
    }
}

async function AgregarProducto() {
    $("#dvMensaje").html("");
    //Venta
    let Numero = $("#txtNumeroVenta").val();
    let Documento = $("#txtDocumento").val();
    let Fecha = "2024/01/01";
    let CodigoEmpleado = $("#cboEmpleado").val();
    let Pago = $("#txtMedioPago").val();

    //Detalle
    let DatosRepuesto = $("#cboRepuesto").val();
    let id_repuesto = DatosRepuesto.split('|')[0];
    let Cantidad = $("#txtCantidad").val();
    let ValorUnitario = $("#txtValorUnitario").val();

    //Crear la estructura json
    let DatosVenta = {
        id: Numero,
        id_cliente: Documento,
        fecha_venta: Fecha,
        id_empleado: CodigoEmpleado,
        metodo_pago: Pago,
        total: 0
    }

    if (Numero == 0) {
        //Fetch para grabar en la base de datos
        try {
            let ValorCookie = getCookie("token");
            const Respuesta = await fetch("http://localhost:50626/api/VentaRepuesto/GrabarVenta",
                {
                    method: "POST",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': 'Bearer ' + ValorCookie
                    },
                    body: JSON.stringify(DatosVenta)
                });
            //Se lee la respuesta y se convierte a json
            const Resultado = await Respuesta.json();
            //Presenta el resultado en el html
            $("#txtNumeroVenta").val(Resultado.split("|")[0]);
            $("#txtFechaCompra").val(Resultado.split("|")[1]);
        }
        catch (error) {
            //Se presenta el error en el "dvMensaje" de la interfaz
            $("#dvMensaje").html(error);
        }
    }
    Numero = $("#txtNumeroVenta").val();
    let DatosDetalle = {
        codigo: 0,
        id_venta: Numero,
        id_repuesto: id_repuesto,
        cantidad: Cantidad,
        valor_unitario: ValorUnitario
    }
    //Se graba el detalle
    try {
        let ValorCookie = getCookie("token");
        const Respuesta = await fetch("http://localhost:50626/api/VentaRepuesto/GrabarDetalle",
            {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + ValorCookie
                },
                body: JSON.stringify(DatosDetalle)
            });
        //Se lee la respuesta y se convierte a json
        const Resultado = await Respuesta.json();
        //Presenta el resultado en el html
        if (Resultado != "0") {
            $("#txtNumeroVenta").val(Resultado);
            LlenarTablaVenta(Numero);
        }
        else {
            $("#dvMensaje").html("No hay suficiente stock");
        }
    }
    catch (error) {
        //Se presenta el error en el "dvMensaje" de la interfaz
        $("#dvMensaje").html(error);
    }
}
async function Eliminar(idDetalle, valor, cantidad) {
    //Fetch para grabar en la base de datos
    try {
        let ValorCookie = getCookie("token");
        const Respuesta = await fetch("http://localhost:50626/api/VentaRepuesto/EliminarDetalle?idDetalle=" + idDetalle,
            {
                method: "DELETE",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + ValorCookie
                }
            });
        //Se lee la respuesta y se convierte a json
        const Resultado = await Respuesta.json();
        //Presenta el resultado en el html
        let Numero = $("#txtNumeroVenta").val();
        let total = parseFloat($("#txtTotalCompra").val().replace(/\s/g, '').replace('$', '').replace(/\./g, ''));
        let nuevoTotal = total - (valor*cantidad);
        $("#txtTotalCompra").val(FormatoMiles(nuevoTotal));
        ActualizarTabla(Numero);
    }
    catch (error) {
        //Se presenta el error en el "dvMensaje" de la interfaz
        $("#dvMensaje").html(error);
    }
}

async function Vender() {
    let Numero = $("#txtNumeroVenta").val();
    let total = parseFloat($("#txtTotalCompra").val().replace(/\s/g, '').replace('$', '').replace(/\./g, ''));

    let DatosVenta = {
        id: Numero,
        total: total
    }

    try {
        let ValorCookie = getCookie("token");
        const Respuesta = await fetch("http://localhost:50626/api/VentaRepuesto/GrabarTotal",
            {
                method: "PUT",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + ValorCookie
                },
                body: JSON.stringify(DatosVenta)
            });
        //Se lee la respuesta y se convierte a json
        const Resultado = await Respuesta.json();
        //Presenta el resultado en el html
        $("#dvMensaje").html("Se realizó la venta el total a pagar es: " + FormatoMiles(parseFloat(Resultado)));
    }
    catch (error) {
        //Se presenta el error en el "dvMensaje" de la interfaz
        $("#dvMensaje").html(error);
    }

    $("#txtNumeroVenta").val("0");
    $("#txtTotalCompra").val(FormatoMiles(0));
    $("#txtDocumento").val("");
    $("#txtNombreCliente").val("");
    $("#txtFechaCompra").val("");
    var table = new DataTable('#tblVenta');
    table.clear().draw();
}