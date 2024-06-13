jQuery(function () {

    $("#dvMenu").load("../Paginas/Menu.html");

    LlenarTablaGarantias();

});

function LlenarTablaGarantias() {
    LlenarTablaServiciosAuth("http://localhost:50626/api/Garantia", "#tblGarantias");
}