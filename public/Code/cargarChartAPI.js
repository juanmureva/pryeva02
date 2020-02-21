Highcharts.chart('container', { // indicamos el elemento donde se cargará la grafica.
    data: { // indicamos que la grafica tomará los datos de una tabla dentro de la pagina HTML. 
      table: 'datos'
    },
    legend: { // deshabilitamos la leyenda.
      enabled: false
    },
    chart: { // indicamos el tipo de grafica a generar.
      type: 'bar'
    },
    title: { // titulo de la grafica, obtenido dinamicamente al generarla.
      text: '<b>' + document.getElementById("estacion").innerText + '</b>'
    },
    yAxis: { // parametro para mostrar los valores enteros.
      allowDecimals: false,

      title: { // titulo del eje Y de la grafica.
        text: 'Escala AQI'
      },
      plotBands: [{ // parametro para indicar el rango horizontal
        from: 0,    // de colores del fondo de la grafica.
        to: 50,
        color: '#cfffbc'
      }, {
        from: 50,
        to: 100,
        color: '#ffffbf'
      }, {
        from: 100,
        to: 150,
        color: "#ffd4bf"
      }]
    },
    plotOptions: {                  // parametro para indicar el rango horizontal
          bar: {                    // de colores de las barras de la grafica.
              colorByPoint: true
          },
          series: {
              zones: [{
                  color: '#4CAF50',
                  value: 0
              }, {
                  color: '#3bd817',
                  value: 10
              }, {
                  color: '#abe539',
                  value: 20
              }, {
                  color: '#CDDC39',
                  value: 30
              }, {
                  color: '#f8ff3a',
                  value: 40
              }, {
                  color: '#FFEB3B',
                  value: 50
              }, {
                  color: '#ffd107',
                  value: 60
              }, {
                  color: '#ffaa00',
                  value: 70
              }, {
                  color: '#ff8c20',
                  value: 80
              }, {
                  color: '#f47836',
                  value: 90
              }, {
                  color: '#F44336',
                  value: Number.MAX_VALUE
              }],
              dataLabels: { // parametros para indicar el valor al final de las barras.
                  enabled: true,
                  format: '{point.y:.0f}'
              }
          }
      },
    tooltip: { // parametros para mostrar la leyenda al pasar el raton por las barras.
      formatter: function() {
        return '<b>' + this.point.name + '</b><br/>' +
          this.point.y + '<br/>  ';
      }
    }
  });