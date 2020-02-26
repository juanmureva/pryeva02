function magnitudesTerremotos() {
    $("data").val("Magnitud Terremotos")
    fetch('/pryeva02/historico/queries/magnitudesTerremotos/')
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            console.log(myJson);
            buildHtmlTable(myJson, '#excelDataTable')
        });
}


function tiposTerremotos() {
    alert($("data").val())
    $("data").val("Tipos Terremotos")

    fetch('/pryeva02/historico/queries/tiposTerremotos/')
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            console.log(myJson);
            buildHtmlTable(myJson, '#excelDataTable')
        });
}


function terremotoslocalizacion() {
    fetch('/pryeva02/historico/queries/terremotoslocalizacion/')
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            console.log(myJson);
            buildHtmlTable(myJson, '#excelDataTable')
        });
}


function grandesTerremotos() {
    fetch('/pryeva02/historico/queries/grandesTerremotos/')
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            console.log(myJson);
            buildHtmlTable(myJson, '#excelDataTable')
        });
}


function tiposTerremotos() {
    fetch('/pryeva02/historico/queries/tiposTerremotos/')
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            console.log(myJson);
            buildHtmlTable(myJson, '#excelDataTable')
        });
}

function magnitudesTerremotos() {
    fetch('/pryeva02/historico/queries/magnitudesTerremotos/')
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            console.log(myJson);
            buildHtmlTable(myJson, '#excelDataTable')
        });
}



// Builds the HTML Table out of myList.
function buildHtmlTable(myList, selector) {
    var columns = addAllColumnHeaders(myList, selector);

    for (var i = 0; i < myList.length; i++) {
        var row$ = $('<tr/>');
        for (var colIndex = 0; colIndex < columns.length; colIndex++) {
            var cellValue = myList[i][columns[colIndex]];
            if (cellValue == null) cellValue = "";
            row$.append($('<td/>').html(cellValue));
        }
        $(selector).append(row$);
    }
}

// Adds a header row to the table and returns the set of columns.
// Need to do union of keys from all records as some records may not contain
// all records.
function addAllColumnHeaders(myList, selector) {
    var columnSet = [];
    var headerTr$ = $('<tr/>');

    for (var i = 0; i < myList.length; i++) {
        var rowHash = myList[i];
        for (var key in rowHash) {
            if ($.inArray(key, columnSet) == -1) {
                columnSet.push(key);
                headerTr$.append($('<th/>').html(key));
            }
        }
    }
    $(selector).html("")
    $(selector).append(headerTr$);

    return columnSet;
}