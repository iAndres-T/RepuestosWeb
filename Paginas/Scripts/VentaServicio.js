jQuery(function () {

    $("#dvMenu").load("../Paginas/Menu.html");

    LLenarComboEmpleados();
    LlenarComboServicio();
    $("#txtNumeroVenta").val("0");
    $("#txtTotalCompra").val(FormatoMiles(0));
});

async function LLenarComboEmpleados() {
    await LlenarComboServiciosAuth("http://localhost:50626/api/Encargado", "#cboEmpleado");
}

async function LlenarComboServicio() {
    let rpta = await LlenarComboServiciosAuth("http://localhost:50626/api/Servicio/LlenarCombo", "#cboServicio");
    PresentarValorUnitario();
}

function LlenarTablaVenta(idVenta) {
    LlenarTablaServiciosAuth("http://localhost:50626/api/VentaServicio/LlenarTablaVenta?idVenta=" + idVenta, "#tblVenta");
    let total = parseFloat($("#txtTotalCompra").val().replace(/\s/g, '').replace('$', '').replace(/\./g, ''));
    let ValorUnitario = parseFloat($("#txtValorUnitario").val());
    let suma = ValorUnitario + total;
    $("#txtTotalCompra").val(FormatoMiles(suma));
}

async function ActualizarTabla(idVenta) {
    // Llenar la tabla de venta
    await LlenarTablaServiciosAuth("http://localhost:50626/api/VentaServicio/LlenarTablaVenta?idVenta=" + idVenta, "#tblVenta");
}


function PresentarValorUnitario() {
    let DatosServicio = $("#cboServicio").val();
    let id_servicio = DatosServicio.split('|')[0];
    let ValorUnitario = DatosServicio.split('|')[1];
    let DuracionSinEspacios = DatosServicio.split('|')[2];

    // Aquí separamos el número de la duración de la palabra "Horas"
    let numeroDuracion = DuracionSinEspacios.match(/\d+/)[0]; // Obtiene el número
    let unidadDuracion = DuracionSinEspacios.match(/[a-zA-Z]+/)[0]; // Obtiene la palabra

    let Duracion = numeroDuracion + ' ' + unidadDuracion;

    $("#txtValorUnitarioTexto").val(FormatoMiles(ValorUnitario));
    $("#txtValorUnitario").val(ValorUnitario);
    $("#txtCodigoServicio").val(id_servicio);
    $("#txtDuracion").val(Duracion);
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

async function AgregarServicio() {
    $("#dvMensaje").html("");
    //Venta
    let Numero = $("#txtNumeroVenta").val();
    let Documento = $("#txtDocumento").val();
    let Fecha = "2024/01/01";
    let Pago = $("#txtMedioPago").val();

    //Detalle
    let DatosServicio = $("#cboServicio").val();
    let id_servicio = DatosServicio.split('|')[0];
    let Duracion = $("#txtDuracion").val();
    let ValorUnitario = $("#txtValorUnitario").val();

    //Crear la estructura json
    let DatosVenta = {
        id: Numero,
        id_cliente: Documento,
        fecha_venta: Fecha,
        id_garantia: 0,
        metodo_pago: Pago,
        total: 0
    }

    if (Numero == 0) {
        //Fetch para grabar en la base de datos
        try {
            let ValorCookie = getCookie("token");
            const Respuesta = await fetch("http://localhost:50626/api/VentaServicio/GrabarVenta",
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
        id_servicio: id_servicio,
        duracion: Duracion,
        valor: ValorUnitario
    }
    //Se graba el detalle
    try {
        let ValorCookie = getCookie("token");
        const Respuesta = await fetch("http://localhost:50626/api/VentaServicio/GrabarDetalle",
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

        $("#txtNumeroVenta").val(Resultado);
        LlenarTablaVenta(Numero);
    }
    catch (error) {
        //Se presenta el error en el "dvMensaje" de la interfaz
        $("#dvMensaje").html(error);
    }
}
async function Eliminar(idDetalle, valor) {
    //Fetch para grabar en la base de datos
    try {
        let ValorCookie = getCookie("token");
        const Respuesta = await fetch("http://localhost:50626/api/VentaServicio/EliminarDetalle?idDetalle=" + idDetalle,
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
        let nuevoTotal = total - valor;
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
        const Respuesta = await fetch("http://localhost:50626/api/VentaServicio/GrabarTotal",
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