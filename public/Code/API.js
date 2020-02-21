// funcion que se inicia al escribir la ultima letra del texto a buscar y recoge los datos introducidos. 
function init(tokenId, inputId, outputId) {
	console.log("Estoy en API init")
	token.id = tokenId;

	var input = $(inputId);
	var timer = null;
	var output = $(outputId);

	input.on("keyup", function () {

		/* Debounce */
		if (timer) clearTimeout(timer);
		timer = setTimeout(function () {
			search(input.val(), output);
		}, 500);
	})
}

// funcion que incia el procedimiento de busqueda de la estación con el texto indicado
// y genera dinamicamente una tabla con el resultado de las estaciones encontradas.
function search(keyword, output) {

	output.html("<h2>Resultado:</h2>")
	output.append($("<div/>").html("Cargando..."))
	output.append($("<div/>").addClass("cp-spinner cp-meter"))

	$.getJSON("//api.waqi.info/search/?token=" + token() + "&keyword=" + keyword, function (result) {

		output.html("<h2>Resultado:</h2>")
		if (!result || (result.status != "ok")) {
			output.append("Disculpe, ha ocurrido un problema: ")
			if (result.data) output.append($("<code>").html(result.data))
			return
		}

		if (result.data.length == 0) {
			output.append("Disculpe, no existen resultados para su busqueda")
			return
		}

		var table = $("<table/>").addClass("table table-sm table-dark table-bordered")
		output.append(table)

		var stationInfo = $("<div/>")
		output.append(stationInfo)

		result.data.forEach(function (station, i) {
			var tr = $("<tr>");
			tr.append($("<td>").html(station.station.name))
			tr.append($("<td>").html(colorize(station.aqi)))
			tr.append($("<td>").html(station.time.stime).attr('style', 'text-align:center'))
			tr.on("click", function () {
				showStation(station, stationInfo)
			})
			table.append(tr)
			if (i == 0) showStation(station, stationInfo)
		})
	});
}

// funcion que obtiene los datos de la estación que seleccionamos y
// genera la tabla de sus contaminantes e informacion meteorologica.
function showStation(station, output) {
	output.html("<h2>Polución & Condiciones Climaticas:</h2>")
	output.append($("<div/>").html("Cargando..."))
	output.append($("<div/>").addClass("cp-spinner cp-meter"))

	$.getJSON("//api.waqi.info/feed/@" + station.uid + "/?token=" + token(), function (result) {

		output.html("<h2>Polución & Condiciones Climaticas:</h2>")
		if (!result || (result.status != "ok")) {
			output.append("Disculpe, ha ocurrido un problema: ")
			if (result.data) output.append($("<code>").html(result.data))
			return
		}

		var names = {
			pm25: "PM<sub>2.5</sub>",
			pm10: "PM<sub>10</sub>",
			o3: "Ozono",
			no2: "Dióxido de Nitrogeno",
			so2: "Dióxido de Azufre",
			co: "Monóxido de Carbono",
			t: "Temperatura",
			w: "Viento",
			r: "Lluvia (precipitación)",
			h: "Humedad Relativa",
			d: "Rocío",
			p: "Présión Atmosférica"
		}

		output.append($("<div>").html(
				"Estación idx: " + result.data.idx + 
				"<br> Nombre: " + result.data.city.name + 
				"<br> Time: " + result.data.time.s)
			.attr('id', 'estacion')
			.attr('style', 'color: white')
			.attr('class', 'estacion'))

		var table = $("<table/>").addClass("table table-sm table-dark table-bordered")
		$(table).attr('id', 'tabla');
		output.append(table)

		for (var specie in result.data.iaqi) {
			var aqi = result.data.iaqi[specie].v
			var tr = $("<tr>");
			tr.append($("<td>").html(names[specie] || specie))
			tr.append($("<td>").html(colorize(aqi, specie)).attr('style', 'text-align:center'))
			table.append(tr)
		}

		// generamos la atribución a la World Air Quality Index Project.
		for (var i in result.data.attributions) {
			// recorremos el array de atribuciones que recibimos de la API.
			var name = result.data.attributions[i].name
			var url = result.data.attributions[i].url

			if (name == "World Air Quality Index Project") {
				// si el nombre coincide con el de WAQI Project, genera el texto con sus datos.
				output.append($("<div>").html("© " + name + ":  &nbsp; - &nbsp;" +
					'<a href="' + url + '" style="color:white">' + url + '</a>')
					.attr('id', 'estacion')
					.attr('style', 'color: white; padding-bottom:20px')
					.attr('class', 'estacion')
				)
			}
		}

		// guardamos el codigo de la estación en el almacén local del navegador
		// para luego utilizarlo en la pagina HTML.
		localStorage.setItem('estacion', result.data.idx);
		/** ASS
		console.log("en API.js generando el botón guardar datos")
		// generamos el boton para guardar los datos en la BD.
		output.append($("<button/>").html("Guardar Datos en MongoDB.")
			.attr('id', 'botonGuardar')
			.attr('type', 'button')
			.attr('onClick', 'guardaDatos()') // al pulsarlo inicia la funcion de guardado.
			.addClass("btn btn-primary"));
		** FIN ASS QUITAMOS EL BOTÓN */
		// generamos la tabla final que contendrá solo las columnas de 
		// los contaminantes y sus valores, HighCharts se alimentará de
		// esta tabla para generar la grafica.
		var table = $("<table/>").addClass("result")
		$(table).attr('id', 'datos');
		output.append(table)
		var tr = $("<tr>");
		tr.append($("<th>").html("Contaminante"));
		tr.append($("<th>").html("Valor").attr('style', 'text-align: center'));
		table.append(tr);

		for (var specie in result.data.iaqi) {

			switch (specie) {
				case 'co':
				case 'no2':
				case 'o3':
				case 'pm10':
				case 'pm25':
				case 'so2':

					var aqi = result.data.iaqi[specie].v
					var tr2 = $("<tr>");
					tr2.append($("<td>").html(names[specie] || specie))
					tr2.append($("<td>").html(aqi, specie))
					table.append(tr2)
			}
		}

		// cuando la tabla final es generada, la ocultamos y 
		// luego cargamos la grafica.
		$(document.getElementById("datos")).ready(function () {
			document.getElementById("datos").style.visibility = "hidden",
				$.getScript('/pryEva02/public/Code/cargarChartAPI.js', 
					function () { }
					)
		});
	})
}

function token() {
	return $(token.id).val() || "2925a12d6716caa9e5eff975b281dd6eb985552c";
}

function colorize(aqi, specie) {
	specie = specie || "aqi"
	if (["pm25", "pm10", "no2", "so2", "co", "o3", "aqi"].indexOf(specie) < 0) return aqi;

	var spectrum = [
		{ a: 0, b: "#cccccc", f: "#ffffff" },
		{ a: 50, b: "#009966", f: "#ffffff" },
		{ a: 100, b: "#ffde33", f: "#000000" },
		{ a: 150, b: "#ff9933", f: "#000000" },
		{ a: 200, b: "#cc0033", f: "#ffffff" },
		{ a: 300, b: "#660099", f: "#ffffff" },
		{ a: 500, b: "#7e0023", f: "#ffffff" }
	];

	var i = 0;
	for (i = 0; i < spectrum.length - 2; i++) {
		if (aqi == "-" || aqi <= spectrum[i].a) break;
	};
	return $("<div/>")
		.html(aqi)
		.css("font-size", "100%")
		.css("min-width", "20px")
		.css("text-align", "center")
		.css("background-color", spectrum[i].b)
		.css("color", spectrum[i].f)

}
