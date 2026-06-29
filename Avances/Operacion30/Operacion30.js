const URL_GOOGLE_SHEETS = "https://script.google.com/macros/s/AKfycbzVAQzNPN9dRo8NBUL9GZlWYUmvXmreSGouXqlTTebyBsOXvzu-0JLPhgJFeB69gmw5/exec";

document.getElementById('btn-consultar').addEventListener('click',function(){
    const woInput = document.getElementById('wo').value;
    const woBuscada = woInput.trim();

    if (!woBuscada) {
        alert('!Por favor, ingresa un número de WO en el campo correspondiente antes de consultar');
        return;
    }
    fetch(`${URL_GOOGLE_SHEETS}?wo=${woBuscada}`)
    .then(response => response.json())
    .then(data => {
        if (data.encontrado) {
            alert('¡Orden de trabajo encontrada!');

            document.getElementById('model').value = data.modelo;
            document.getElementById('cantidad').value = data.cantidad;
            document.getElementById('comentario').value = data.comentario;
            document.getElementById('estatus').value = data.estatus;
            document.getElementById('info').value = data.info;
            document.getElementById('tipo').value = data.tipo.toLowerCase();

            if(data.fecha) {
                const fechaCorta = data.fecha.split('T')[0];
                document.getElementById('fecha').value = fechaCorta;
            }
        } else {
            alert('No se encontró ninguna WO con ese número.');
        }
    })
    .catch(error => {
        alert('Hubo un error al consultar los datos.');
        console.error('Error de consulta: ',error);
    });
});

document.getElementById('btn-avance').addEventListener('click', function() {
    const wo = document.getElementById('wo').value.trim();
    const estatusActual = document.getElementById('estatus').value.trim();

    if (!wo) {
        alert('Primero debes consultar una WO válida.');
        return;
    }

    if (estatusActual === "20") {
        document.getElementById('estatus').value = "30";
    } else {
        alert(`Error de estatus, estatus actual: ${estatusActual}`);
        return;
    }

    const datosActualizados = {
        accion: "actualizarEstatus",
        wo: wo,
        estatus: "30",
        operador: document.getElementById('nombre-operador').textContent.trim(),
        nomina: document.getElementById('nomina-operador').textContent.trim(),
        fecha: document.getElementById('fecha').value,
        modelo: document.getElementById('model').value,
        cantidad: document.getElementById('cantidad').value,
        tipo: document.getElementById('tipo').value,
        comentario: document.getElementById('comentario').value,
        info: document.getElementById('info').value
    };

    fetch(URL_GOOGLE_SHEETS, {
        method: 'POST',
        headers: {
            'Content-type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(datosActualizados)
    })
    .then(response => {
        alert('¡Estatus actualizado!');
    })
    .catch(error => {
        alert('Hubo un error al intentar actualizar el estatus.');
        console.error('Error: ',error);
    });
});
