
var oTabla = $("#tblServicios").DataTable();
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

    LlenarComboEncargado();

    LlenarTabla();
});
async function LlenarTabla() {
    LlenarTablaServiciosAuth("http://localhost:50626/api/Servicio", "#tblServicios");
}

async function LlenarComboEncargado() {
    LlenarComboServiciosAuth("http://localhost:50626/api/Encargado", "#cboEncargado");
}


async function EjecutarComando(Comando) {

    let id = $("#txtId").val();
    let descripcion = $("#txtDescripcion").val();
    let valor = $("#txtValor").val();
    let duracion = $("#txtDuracion").val();
    let id_empleado = $("#cboEncargado").val();


    let Datos = {
        id: id,
        descripcion: descripcion,
        valor: valor,
        duracion: duracion,
        id_empleado: id_empleado
    }

    try {
        let ValorCookie = getCookie("token");
        const Respuesta = await fetch("http://localhost:50626/api/Servicio",
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
        const Respuesta = await fetch("http://localhost:50626/api/Servicio?id=" + id,
            {
                method: "GET",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + ValorCookie
                }
            });
        const Resultado = await Respuesta.json();

        $("#txtDescripcion").val(Resultado.descripcion);
        $("#txtValor").val(Resultado.valor);
        $("#txtDuracion").val(Resultado.duracion);
        $("#cboEncargado").val(Resultado.id_empleado);

    }
    catch (error) {
        $("#dvMensaje").html(error);
    }
}