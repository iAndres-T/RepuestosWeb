async function Ingresar() {
    let Usuario = document.getElementById('txtUsuario').value;
    let Clave = document.getElementById("txtClave").value;

    DatosLogin =
    {
        Username: Usuario,
        Password: Clave
    }
    
    try {
        const Respuesta = await fetch("http://localhost:50626/api/Login/Ingresar",
            {
                method: "POST",
                mode: "cors",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(DatosLogin)
            }
        );
        const Rpta = await Respuesta.json();
        
        if (Rpta.length == 0) {
            document.cookie = "token=0;path=/";
            
            $("#dvMensaje").removeClass("alert alert-success");
            $("#dvMensaje").addClass("alert alert-danger");
            $("#dvMensaje").html("El usuario no está registrado u olvidó la clave");
        }
        else {
            const extdays = 5;
            const d = new Date();
            d.setTime(d.getTime() + (extdays * 24 * 60 * 60 * 1000));
            let expires = ";expires=" + d.toUTCString();
            
            document.cookie = "token=" + Rpta[0].token + expires + ";path=/";
            getCookie("token");
            $("#dvMensaje").removeClass("alert alert-danger");
            $("#dvMensaje").addClass("alert alert-success");
            $("#dvMensaje").html(Rpta[0].Autenticado);
            window.location.href = Rpta[0].PaginaNavegar;
        }
    }
    catch (error) {
        $("#dvMensaje").removeClass("alert alert-success");
        $("#dvMensaje").addClass("alert alert-danger");
        $("#dvMensaje").html(error);
    }
}