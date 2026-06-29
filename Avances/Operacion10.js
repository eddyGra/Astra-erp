function generarEstatusInicial(){
    const estatusInicial = "10";
    document.getElementById('estatus').value = estatusInicial;
    return estatusInicial;
}

document.getElementById('form-wo').addEventListener('submit',function(e){
    e.preventDefault();

    const URL_GOOGLE_SHEETS = "https://script.google.com/macros/s/AKfycbzVAQzNPN9dRo8NBUL9GZlWYUmvXmreSGouXqlTTebyBsOXvzu-0JLPhgJFeB69gmw5/exec";


    const numeroAleatorio = Math.floor(Math.random() * 10000);
    const nuevaWO = "WO-" + numeroAleatorio;

    document.getElementById('wo').value = nuevaWO;

    const estatusActual = generarEstatusInicial();

    const datosFormulario = {
        operador: document.getElementById('nombre-operador').innerText,
        nomina: document.getElementById('nomina-operador').innerText,
        fecha: document.getElementById('fecha').value,
        wo: nuevaWO,
        modelo: document.getElementById('model').value,
        cantidad: document.getElementById('cantidad').value,
        tipo: document.getElementById('tipo').value,
        estatus: estatusActual,
        comentario: document.getElementById('comentario').value,
        info: document.getElementById('info').value
    };

    fetch(URL_GOOGLE_SHEETS, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'appilication/json'
        },
        body: JSON.stringify(datosFormulario)
    })
    .then(() => {
        alert('!Orden de trabajo guardada exitosamente!');

        document.getElementById('model').value = '';
        document.getElementById('cantidad').value = '';
        document.getElementById('fecha').value = '';
        document.getElementById('comentario').value = '';
        document.getElementById('tipo').selectedIndex = 0;
        document.getElementById('info').value = '';
        document.getElementById('wo').value = nuevaWO;
    })
    .catch(error => {
        alert('Hubo un error al intentar guardar los datos');
        console.error('Error',error);
    });
});

document.getElementById('btn-consultar').addEventListener('click', function() {
    const URL_GOOGLE_SHEETS = "https://script.google.com/macros/s/AKfycbzVAQzNPN9dRo8NBUL9GZlWYUmvXmreSGouXqlTTebyBsOXvzu-0JLPhgJFeB69gmw5/exec";

    const woBuscada = prompt("Por favor, ingresa el numero de WO que quieras consultar");

    if (!woBuscada) {
        alert('!Por favor, escribe un numero de WO para consultar.');
        return;
    }
    
    const woLimpia = woBuscada.trim();
    document.getElementById('wo').value = woLimpia;

    fetch(`${URL_GOOGLE_SHEETS}?wo=${woLimpia}`)
    .then(response => response.json())
    .then(data => {
        if (data.encontrado) {
            alert('!Orden de trabajo encontrada.');

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
        alert('No se encontró ninguna WO con ese numero de ID.');
        }
    })
    .catch(error => {
    alert('Hubo un error al consultar los datos.');
    console.error('Error en consulta: ',error);
    });
});
