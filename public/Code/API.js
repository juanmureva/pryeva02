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

	markers.forEach(marker => {
		map.removeLayer(marker);
	});

	//$.getJSON("//api.waqi.info/search/?token=" + token() + "&keyword=" + keyword, function (result) {
	$.getJSON("http://localhost:3000/pryeva02/localizaciones/search/" + keyword, function (result) {

		

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

		var locationInfo = $("<div/>")
		output.append(locationInfo)
		result.data.forEach(function (location, i) {

			map.setView([location.location.coordinates[0], location.location.coordinates[1]],
				15);
			//L.marker([location.location.coordinates[0], location.location.coordinates[1]], { draggable: true }).addTo(map);

			let marker = L.marker([location.location.coordinates[0], location.location.coordinates[1]], { draggable: true });
			marker.addTo(map);
			markers.push(marker);


			console.log("localiacion: " + location.localizacion)
			var tr = $("<tr>");
			tr.append($("<td>").html(location.localizacion))
			//tr.append($("<td>").html(colorize(station.aqi)))
			//tr.append($("<td>").html(station.time.stime).attr('style', 'text-align:center'))
			tr.on("click", function () {
				showLocation(location, locationInfo)
			})

			table.append(tr)
			//if (i == 0) showLocation(location, locationInfo)
		})
	});
}

// funcion que obtiene los datos de la estación que seleccionamos y
// genera la tabla de sus contaminantes e informacion meteorologica.
function showLocation(localizacion, output) {
	output.html("<h2>Localización:</h2>")
	output.append($("<div/>").html("Cargando..."))
	output.append($("<div/>").addClass("cp-spinner cp-meter"))

	markers.forEach(marker => {
		map.removeLayer(marker);
	});

	$.getJSON("http://localhost:3000/pryeva02/localizaciones/" + localizacion.localizacion, function (result) {

		output.html("<h2>Localización:</h2>")
		if (!result || (result.status != "ok")) {
			output.append("Disculpe, ha ocurrido un problema: ")
			if (result.data) output.append($("<code>").html(result.data))
			return
		}


		//------
		console.log(JSON.stringify(localizacion))

		markers.forEach(marker => {
			map.removeLayer(marker);
		});

		L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
			maxZoom: 18
		}).addTo(map);
		map.setView([localizacion.location.coordinates[0], localizacion.location.coordinates[1]],
			15);
		L.marker([localizacion.location.coordinates[0], localizacion.location.coordinates[1]], { draggable: true }).addTo(map);
		//------




		// guardamos el codigo de la estación en el almacén local del navegador
		// para luego utilizarlo en la pagina HTML.
		localStorage.setItem('localizacion', localizacion._id);
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
		var table = $("<table/>").addClass("table table-sm table-dark table-bordered")
		$(table).attr('id', 'datos');
		output.append(table)
		var tr = $("<tr>");
		tr.append($("<th>").html(localizacion.localizacion));
		tr.append($("<th>").html("<a href='/pryeva02/editlocation/"+localizacion.localizacion+"'>ver</a>").attr('style', 'text-align: center'));
		table.append(tr);

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
