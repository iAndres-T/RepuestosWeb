
var oTabla = $("#tblEmpleados").DataTable();
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

    LlenarComboCargo();

    LlenarTabla();
});
async function LlenarTabla() {
    LlenarTablaServiciosAuth("http://localhost:50626/api/Empleado", "#tblEmpleados");
}

async function LlenarComboCargo() {
    LlenarComboServiciosAuth("http://localhost:50626/api/Cargo", "#cboCargo");
}

async function EjecutarComando(Comando) {
    
    let documento = $("#txtDocumento").val();
    let nombre = $("#txtNombre").val();
    let primer_apellido = $("#txtPrimerApellido").val();
    let segundo_apellido = $("#txtSegundoApellido").val();
    let fecha_nacimiento = $("#txtFechaNacimiento").val();
    let genero = $("#cboGenero").val();
    let direccion = $("#txtDireccion").val();
    let telefono = $("#txtTelefono").val();
    let correo = $("#txtCorreo").val();
    let fecha_inicio_contrato = $("#txtFechaInicio").val();
    let fecha_fin_contrato = $("#txtFechaFin").val();
    let id_cargo = $("#cboCargo").val();


    let Datos = {
        documento: documento,
        nombre: nombre,
        primer_apellido: primer_apellido,
        segundo_apellido: segundo_apellido,
        fecha_nacimiento: fecha_nacimiento,
        genero: genero,
        direccion: direccion,
        telefono: telefono,
        correo: correo,
        fecha_inicio_contrato: fecha_inicio_contrato,
        fecha_fin_contrato: fecha_fin_contrato,
        id_cargo: id_cargo
    }

    try {
        let ValorCookie = getCookie("token");
        const Respuesta = await fetch("http://localhost:50626/api/Empleado",
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

    let documento = $("#txtDocumento").val();
    $("#dvMensaje").html("");

    try {
        let ValorCookie = getCookie("token");
        const Respuesta = await fetch("http://localhost:50626/api/Empleado?id=" + documento,
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
        $("#txtPrimerApellido").val(Resultado.primer_apellido);
        $("#txtSegundoApellido").val(Resultado.segundo_apellido);
        $("#txtFechaNacimiento").val(Resultado.fecha_nacimiento.split('T')[0]);
        $("#cboGenero").val(Resultado.genero);
        $("#txtDireccion").val(Resultado.direccion);
        $("#txtTelefono").val(Resultado.telefono);
        $("#txtCorreo").val(Resultado.correo);
        $("#txtFechaInicio").val(Resultado.fecha_inicio_contrato.split('T')[0]);
        $("#txtFechaFin").val(Resultado.fecha_fin_contrato.split('T')[0]);
        $("#cboCargo").val(Resultado.id_cargo);

    }
    catch (error) {
        $("#dvMensaje").html(error);
    }
}