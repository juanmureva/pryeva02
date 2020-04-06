"use strict";

var _database = require("../database");

var _mongodb = require("mongodb");

const express = require('express');

const router = express.Router(); // Database connection

router.get('/', async (req, res) => {
  res.render('index');
});
router.get('/libros', async (req, res) => {
  const db = await (0, _database.connect)();
  const result = await db.collection('libros').find({}).toArray();
  res.render('libros', {
    result
  });
}); //Api Rest
// Motrar toda la coleccion

router.get('/api', async (req, res) => {
  const db = await (0, _database.connect)();
  const result = await db.collection('libros').find({}).toArray();
  res.json(result);
}); // Mostrar un solo documento por ID

router.get('/api:id', async (req, res) => {
  const {
    id
  } = req.params;
  const db = await (0, _database.connect)();
  const result = await db.collection('libros').findOne({
    _id: (0, _mongodb.ObjectID)(id)
  });
  res.json(result);
}); // Insertar desde la API

router.post('/api', async (req, res) => {
  const db = await (0, _database.connect)();
  const task = {
    ISBN: req.body.ISBN,
    titulo: req.body.titulo,
    autores: [req.body.autores],
    genero: req.body.genero,
    editorial: req.body.editorial,
    fechaEdicion: new Date(),
    numPaginas: req.body.num,
    edad: req.body.edad,
    premios: {
      wins: req.body.wins,
      nominados: req.body.nominados
    },
    precio: req.body.Precio,
    descatalogado: false
  };
  const result = await db.collection('libros').insert(task);
  res.json(result);
}); // Eliminar desde la API 

router.delete('/api:id', async (req, res) => {
  const {
    id
  } = req.params;
  const db = await (0, _database.connect)();
  const result = await db.collection('libros').deleteOne({
    _id: (0, _mongodb.ObjectID)(id)
  });
  res.json({
    message: `Task ${id} deleted`,
    result
  });
}); //Modificar desde la API

router.put('/api:id', async (req, res) => {
  const {
    id
  } = req.params;
  const update = {
    ISBN: req.body.ISBN,
    titulo: req.body.titulo,
    autores: [req.body.autores],
    genero: req.body.genero,
    editorial: req.body.editorial,
    fechaEdicion: new Date(),
    numPaginas: req.body.num,
    edad: req.body.edad,
    premios: {
      wins: req.body.wins,
      nominados: req.body.nominados
    },
    precio: req.body.Precio,
    descatalogado: false
  };
  const db = await (0, _database.connect)();
  await db.collection('libros').updateOne({
    _id: (0, _mongodb.ObjectID)(id)
  }, {
    $set: update
  });
  res.json({
    message: `Task ${id} Update`
  });
}); // CRUD TIENDAS
// Listar todas las tiendas

router.get('/tiendas', async (req, res) => {
  const db = await (0, _database.connect)();
  const result = await db.collection('tiendas').find({}).toArray();
  res.render('tiendas', {
    result
  });
}); // Eliminar tienda

router.get('/delete/:id', async (req, res) => {
  const {
    id
  } = req.params;
  const db = await (0, _database.connect)();
  await db.collection('tiendas').deleteOne({
    _id: (0, _mongodb.ObjectID)(id)
  });
  res.redirect('/tiendas');
}); // Añadir tiendas

router.get('/add', async (req, res) => {
  const db = await (0, _database.connect)();
  const task = {
    nombre: req.query.nombre,
    sede: parseInt(req.query.sede),
    localizacion: {
      type: 'Point',
      coordinates: [parseFloat(req.query.w), parseFloat(req.query.n)]
    }
  };
  await db.collection('tiendas').insertOne(task);
  res.redirect('/tiendas');
}); // Editar tiendas

router.get('/edit/:id', async (req, res) => {
  const {
    id
  } = req.params;
  const db = await (0, _database.connect)();
  const result = await db.collection('tiendas').findOne({
    _id: (0, _mongodb.ObjectID)(id)
  });
  res.render('edit', {
    result
  });
});
router.get('/update/:id', async (req, res) => {
  const {
    id
  } = req.params;
  const update = {
    nombre: req.query.nombre,
    sede: parseInt(req.query.sede),
    localizacion: {
      type: 'Point',
      coordinates: [parseFloat(req.query.w), parseFloat(req.query.n)]
    }
  };
  const db = await (0, _database.connect)();
  await db.collection('tiendas').updateOne({
    _id: (0, _mongodb.ObjectID)(id)
  }, {
    $set: update
  });
  res.redirect('/tiendas');
}); // Highcharts
// Gráfica de lineas 

router.get('/grafica', async (req, res) => {
  res.render('grafica');
}); // Publicaciones de cada año por género 

router.get('/datos-grafica', async (req, res) => {
  const db = await (0, _database.connect)();
  const result = await db.collection('libros').aggregate([{
    $group: {
      _id: {
        gender: "$genero",
        year: {
          $year: "$fechaEdicion"
        }
      },
      total: {
        $sum: 1
      }
    }
  }, {
    $sort: {
      "_id.gender": 1,
      "_id.year": 1
    }
  }]).toArray();
  res.json(result);
});
router.get('/circle', async (req, res) => {
  const db = await (0, _database.connect)();
  const result = await db.collection('libros').aggregate([{
    $bucket: {
      groupBy: "$edad",
      boundaries: [5, 8, 11, 15, 18, 19],
      output: {
        "count": {
          $sum: 1
        }
      }
    }
  }]).toArray();
  res.render('Cgrafica', {
    result
  });
});
router.get('/barras', async (req, res) => {
  res.render('barras');
});
router.get('/barras-find', async (req, res) => {
  const editorial = req.query.editorial;
  const db = await (0, _database.connect)();
  const result = await db.collection('libros').aggregate([{
    $match: {
      editorial: editorial
    }
  }, {
    $group: {
      _id: {
        genero: "$genero",
        year: {
          $year: "$fechaEdicion"
        }
      },
      total: {
        $sum: 1
      }
    }
  }, {
    $sort: {
      "_id.genero": 1,
      "_id.years": 1
    }
  }]).toArray();
  const allYears = result.map(item => item._id.year);
  let years = allYears.filter((year, index, self) => self.indexOf(year) === index);
  const allGenders = result.map(item => item._id.genero);
  let genders = allGenders.filter((gender, index, self) => self.indexOf(gender) === index);
  let oryears = years.sort(); // Format result

  let resultData = [];
  genders.forEach(gender => {
    resultData = [...resultData, {
      name: gender,
      data: years.map(year => {
        const item = result.find(item => item._id.year === year);
        return item == null ? 0 : item.total;
      })
    }];
  });
  console.log(resultData);
  res.render('HGbarras', {
    result: JSON.stringify(resultData),
    oryears
  });
}); // Mapa

router.get('/mapa', async (req, res) => {
  const db = await (0, _database.connect)();
  const result = await db.collection('tiendas').find({}).toArray(); // Format result

  let resultData = [];
  result.forEach(item => {
    resultData = [...resultData, {
      name: item.nombre,
      lat: parseFloat(item.localizacion.coordinates[1].toFixed(6)),
      lon: parseFloat(item.localizacion.coordinates[0].toFixed(6))
    }];
  });
  console.log(resultData);
  res.render('mapa', {
    result: JSON.stringify(resultData)
  });
}); // Consultas
// Usando switch

router.get('/case', (req, res) => {
  res.render('case');
});
router.get('/case2', async (req, res) => {
  const genero = req.query.genero;
  const precio = parseInt(req.query.precio);
  const db = await (0, _database.connect)();
  const result = await db.collection('libros').aggregate([{
    $match: {
      genero: genero,
      precio: {
        $lt: precio
      }
    }
  }, {
    $project: {
      "titulo": 1,
      "puntuacion": {
        $switch: {
          branches: [{
            case: {
              $eq: ["$premios.nominados", 0]
            },
            then: "0 estrellas"
          }, {
            case: {
              $and: [{
                $ne: ["$premios.nominados", 0]
              }, {
                $eq: ["$premios.wins", 0]
              }]
            },
            then: "1 estrella"
          }, {
            case: {
              $and: [{
                $ne: ["$premios.wins", 0]
              }, {
                $lte: ["$premios.wins", 3]
              }]
            },
            then: "2 estrellas"
          }, {
            case: {
              $and: [{
                $gt: ["$premios.wins", 3]
              }]
            },
            then: "3 estrellas"
          }],
          default: "No cumple las condiciones"
        }
      }
    }
  }]).toArray();
  res.render('tcase', {
    result
  });
}); //usando unwind

router.get('/unwind', async (req, res) => {
  const db = await (0, _database.connect)();
  const result = await db.collection('libros').aggregate([{
    $unwind: "$autores"
  }, {
    $group: {
      _id: "$autores",
      total: {
        $sum: 1
      }
    }
  }, {
    $sort: {
      _id: 1
    }
  }]).toArray();
  res.render('unwind', {
    result
  });
}); //usando lookup

router.get('/join0', (req, res) => {
  res.render('formuJoin');
});
router.get('/join', async (req, res) => {
  const genero = req.query.genero;
  const precio = parseInt(req.query.precio);
  const edad = parseInt(req.query.edad);
  const db = await (0, _database.connect)();
  const result = await db.collection('libros').aggregate([{
    $lookup: {
      from: "tiendas",
      localField: "editorial",
      foreignField: "nombre",
      as: "docs"
    }
  }, {
    $match: {
      genero: genero,
      edad: {
        $lte: edad
      },
      precio: {
        $lte: precio
      }
    }
  }, {
    $project: {
      titulo: 1,
      edad: 1,
      precio: 1,
      "docs.nombre": 1,
      "docs.localizacion.coordinates": 1
    }
  }]).toArray();
  console.log(genero, edad, precio);
  res.render('join', {
    result
  });
});
module.exports = router;