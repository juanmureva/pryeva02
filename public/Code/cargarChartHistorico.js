Highcharts.chart('container', { // indicamos el elemento donde se cargará la grafica.
    chart: {
        // indicamos el tipo de grafica a generar.
        type: 'spline'
    },
    data: {
        csv: datosChart,      // indicamos de donde tomará los datos la grafica.
        itemDelimiter: ',',   // indicamos que el separador de los datos será una coma ","
        lineDelimiter: '\n',  // indicamos el separador de lineas (será un salto de linea).
        decimalPoint: '.'     // indicamos que el punto decimal será un punto "."
        
    },
    yAxis: {
        title: { // titulo del eje Y de la grafica.
            text: 'Escala AQI'
        }
    },
    plotOptions: {
        series: {
            marker: { // parametro para mostrar los puntos en la linea de la grafica.
                enabled: true
            }
        }
    },
    title: { // titulo de la grafica, obtenido dinamicamente al generarla.
        text: document.getElementById('estacion').innerHTML
    },
    subtitle: { // subtitulos de la grafica, obtenidos dinamicamente al generarla.
        text:   $("#contaminante option:selected").text() +  ' // '  +
                document.getElementById('fechaInicial').value +  ' <----> '  +
                document.getElementById('fechaFinal').value + ' // idx: ' +
                document.getElementById('estacion').value
    }
});

