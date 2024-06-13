
var oTabla = $("#tblClientes").DataTable();
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

    LlenarTabla();
});

async function LlenarTabla() {
    LlenarTablaServiciosAuth("http://localhost:50626/api/Cliente", "#tblClientes");
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
    let ultima_compra = $("#txtUltimaCompra").val();
    let tipo_persona = $("#cboTipoPersona").val();

    
    let DatosCliente = {
        documento: documento,
        nombre: nombre,
        primer_apellido: primer_apellido,
        segundo_apellido: segundo_apellido,
        fecha_nacimiento: fecha_nacimiento,
        genero: genero,
        direccion: direccion,
        telefono: telefono,
        correo: correo,
        ultima_compra: ultima_compra,
        tipo_persona: tipo_persona
    }
    
    try {
        let ValorCookie = getCookie("token");
        const Respuesta = await fetch("http://localhost:50626/api/Cliente",
            {
                method: Comando,
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + ValorCookie
                },
                body: JSON.stringify(DatosCliente)
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
        const Respuesta = await fetch("http://localhost:50626/api/Cliente?id=" + documento,
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
        $("#cboTipoPersona").val(Resultado.tipo_persona);
        $("#txtUltimaCompra").val(Resultado.ultima_compra.split('T')[0]);
    }
    catch (error) {
        $("#dvMensaje").html(error);
    }
}