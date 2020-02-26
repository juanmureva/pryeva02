//numero de terremotos en cada localizacion
db.terremotos.aggregate([ {"$group" : {_id:"$properties.localizacion", count:{$sum:1}}} ])

//terremotos agrupados por tipo de magnitud
db.terremotos.aggregate([ {"$group" : {_id:"$properties.tipoMagnitud", count:{$sum:1}}} ])

//terremotos de magnitud 2
db.terremotos.aggregate([{$match:{"properties.magnitud" : 2.0 } } ] );

//cantidades de terremotos de cada magnitud (magnitud mayor que 4)
db.terremotos.aggregate([ {"$group" : {_id:"$properties.magnitud", count:{$sum:1}}} ])

//terremotos gordos
db.terremotos.aggregate([ { $match : { "properties.magnitud" : 4.0 } } , {$count: "terremotos_gordos"}] );

//valor medio de los terremotos en cada localizacion 
db.terremotos.aggregate([ {"$group" : {_id:"$properties.localizacion", media:{$avg:'$properties.magnitud'}}} ])

//valor del mayor terremoto en cada localizacion
db.terremotos.aggregate([ {"$group" : {_id:"$properties.localizacion", maxValue:{$max:'$properties.magnitud'}}} ])

//calculamos la profundidad de cada terremoto en metros
db.terremotos.aggregate([ {$project:{profundidadEnMetros:{'$multiply':['$properties.profundidad',1000]}}}])


//out: localizaciones ordenadas por valor de su mayor terremoto
db.terremotos.aggregate([ {"$group" : {_id:"$properties.localizacion", maxValue:{$max:'$properties.magnitud'}}},{$sort: {'_id.maxValue':1} } ])

//sort: creamos una coleccion nueva con $out con los valores medios de los terremotos
db.terremotos.aggregate([ {"$group" : {_id:"$properties.localizacion", media:{$avg:'$properties.magnitud'}}},{$out: 'valores_medios'} ])