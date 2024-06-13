async function LlenarTablaXServicios(URLServicio, TablaLlenar) {
    //Invocamos el servicio a través del fetch, usando el método fetch de javascript
    try {
        const Respuesta = await fetch(URLServicio,
            {
                method: "GET",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                }
            });
        const Rpta = await Respuesta.json();

        if (Rpta && Rpta.length > 0) {
            // Se recorre en un ciclo para llenar la tabla, con encabezados y los campos
            const Columnas = Object.keys(Rpta[0]).map(column => ({
                data: column,
                title: column.replace(/_/g, ' ')
            }));

            // Llena los datos
            $(TablaLlenar).DataTable({
                data: Rpta,
                columns: Columnas,
                destroy: true
            });
        }
    }
    catch (error) {
        //Se presenta la respuesta en el div mensaje
        $("#dvMensaje").html(error);
    }
}

async function LlenarTablaServiciosAuth(url, TablaLlenar) {
    
    try {
        let Token = getCookie("token");
        const Respuesta = await fetch(url,
            {
                method: "GET",
                mode: "cors",
                headers: {
                    "content-type": "application/json",
                    'Authorization': 'Bearer ' + Token
                }
            }
        );
        const Rpta = await Respuesta.json();
        
        if (Rpta && Rpta.length > 0) {
            // Se recorre en un ciclo para llenar la tabla, con encabezados y los campos
            const Columnas = Object.keys(Rpta[0]).map(column => ({
                data: column,
                title: column.replace(/_/g, ' ')
            }));
            $(TablaLlenar).html("");
            // Llena los datos
            $(TablaLlenar).DataTable({
                data: Rpta,
                columns: Columnas,
                destroy: true
            });
        }
        else {
            // Si no hay datos para mostrar, puedes mostrar un mensaje o realizar otra acción
            $(TablaLlenar).html("<p>Sin Repuestos</p>");
        }
    }
    catch (error) {
        $("#dvMensaje").removeClass("alert alert-success");
        $("#dvMensaje").addClass("alert alert-danger");
        $("#dvMensaje").html(error);
    }
}