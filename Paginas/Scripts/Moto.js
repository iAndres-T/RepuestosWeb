
var oTabla = $("#tblMotos").DataTable();
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

    LlenarComboCilindraje();

    LlenarComboMarca();

    LlenarComboPropietario();

    LlenarTabla();
});
async function LlenarTabla() {
    LlenarTablaServiciosAuth("http://localhost:50626/api/Moto", "#tblMotos");
}

async function LlenarComboCilindraje() {
    LlenarComboServiciosAuth("http://localhost:50626/api/Cilindraje", "#cboCilindraje");
}

async function LlenarComboPropietario() {
    LlenarComboServiciosAuth("http://localhost:50626/api/Propietario", "#cboPropietario");
}

async function LlenarComboMarca() {
    LlenarComboServiciosAuth("http://localhost:50626/api/Marca", "#cboMarca");
}

async function EjecutarComando(Comando) {

    let placa = $("#txtPlaca").val();
    let modelo = $("#txtModelo").val();
    let linea = $("#txtLinea").val();
    let id_cilindraje = $("#cboCilindraje").val();
    let id_marca = $("#cboMarca").val();
    let id_cliente = $("#cboPropietario").val();


    let Datos = {
        placa: placa,
        modelo: modelo,
        linea: linea,
        id_cilindraje: id_cilindraje,
        id_marca: id_marca,
        id_cliente: id_cliente
    }

    try {
        let ValorCookie = getCookie("token");
        const Respuesta = await fetch("http://localhost:50626/api/Moto",
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
    let placa = $("#txtPlaca").val();
    $("#dvMensaje").html("");
    
    try {
        let ValorCookie = getCookie("token");
        const Respuesta = await fetch("http://localhost:50626/api/Moto?placa=" + placa,
            {
                method: "GET",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + ValorCookie
                }
            });
        const Resultado = await Respuesta.json();

        $("#txtModelo").val(Resultado.modelo);
        $("#txtLinea").val(Resultado.linea);
        $("#cboCilindraje").val(Resultado.id_cilindraje);
        $("#cboMarca").val(Resultado.id_marca);
        $("#cboPropietario").val(Resultado.id_cliente);

    }
    catch (error) {
        $("#dvMensaje").html(error);
    }
}