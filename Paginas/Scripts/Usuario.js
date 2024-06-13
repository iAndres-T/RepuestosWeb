var oTabla = $("#tblUsuarios").DataTable();
var idUsuario;

jQuery(function () {

    $("#dvMenu").load("../Paginas/Menu.html");

    $("#btnInsertar").on("click", function () {
        EjecutarComando("POST", "InsertarUsuario");
    });
    $("#btnActualizar").on("click", function () {
        EjecutarComando("PUT", "ActualizarUsuario");
    });

    LlenarTablaUsuarios();
});

function LlenarTablaUsuarios() {
    LlenarTablaServiciosAuth("http://localhost:50626/api/Usuario/ListarUsuariosEmpleados", "#tblUsuarios");
}

function Editar(Documento, Empleado, Cargo, Usuario, UsuarioId) {
    $("#txtDocumento").val(Documento);
    $("#txtNombre").val(Empleado);
    $("#txtCargo").val(Cargo);
    $("#txtUsuario").val(Usuario);

    $("#txtDocumento").prop("disabled", true);

    idUsuario = UsuarioId;
}
async function Buscar() {
    //Solo se captura la información del documento del empleado y se invoca el servicio
    let Documento = $("#txtDocumento").val();
    $("#dvMensaje").html("");
    //Fetch para grabar en la base de datos
    try {
        let ValorCookie = getCookie("token");
        const Respuesta = await fetch("http://localhost:50626/api/Empleado/ConsultarConCargo?id=" + Documento,
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
        $("#txtNombre").val(Resultado[0].NombreEmpleado);
        $("#txtCargo").val(Resultado[0].Cargo);
    }
    catch (error) {
        //Se presenta el error en el "dvMensaje" de la interfaz
        $("#dvMensaje").html(error);
    }
}
async function EjecutarComando(Comando, Metodo) {
    //Se captura la información del empleado
    let Documento = $("#txtDocumento").val();
    let Usuario = $("#txtUsuario").val();
    let Clave = $("#txtClave").val();
    let ClaveRepetida = $("#txtConfirmaClave").val();

    if (Clave == "") {
        $("#dvMensaje").html("Debe ingresar una nueva clave o la actual para actualizar sus datos");
        return;
    }

    if (Clave != ClaveRepetida) {
        $("#dvMensaje").html("Las claves no coinciden, por favor valide la información");
        return;
    }
    //Crear la estructura json
    let DatosUsuario = {
        id: idUsuario, 
        id_empleado: Documento,
        user_name: Usuario,
        clave: Clave,
        salt: ""
    }
    let sURLBase = "http://localhost:50626/api/Usuario/";
    
    //Fetch para grabar en la base de datos
    try {
        let ValorCookie = getCookie("token");
        const Respuesta = await fetch(sURLBase + Metodo,
            {
                method: Comando,
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + ValorCookie
                },
                body: JSON.stringify(DatosUsuario)
            });
        //Se lee la respuesta y se convierte a json
        const Resultado = await Respuesta.json();
        //Presenta el resultado en el html
        $("#dvMensaje").html(Resultado);
        LlenarTablaUsuarios();
    }
    catch (error) {
        //Se presenta el error en el "dvMensaje" de la interfaz
        $("#dvMensaje").html(error);
    }
}