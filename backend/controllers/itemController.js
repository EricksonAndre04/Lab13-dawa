const multer = require('multer');
const path = require('path');
const Item = require('../models/item');

// Configuración de multer para la carga de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Obtener todos los elementos
exports.getItems = (req, res) => {
  Item.find()
    .then((items) => {
      res.json(items);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
};

// Obtener un elemento por su ID
exports.getItemById = (req, res) => {
  Item.findById(req.params.id)
    .then((item) => {
      if (!item) {
        return res.status(404).json({ message: 'Elemento no encontrado' });
      }
      res.json(item);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
};

// Crear un nuevo elemento
exports.createItem = (req, res) => {
  const newItem = new Item({
    name: req.body.name,
    description: req.body.description,
    imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
  });

  newItem.save()
    .then((item) => {
      res.status(201).json(item);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
};

// Actualizar un elemento existente
exports.updateItem = (req, res) => {
  const updateData = {
    name: req.body.name,
    description: req.body.description,
  };

  if (req.file) {
    updateData.imageUrl = `/uploads/${req.file.filename}`;
  }

  Item.findByIdAndUpdate(req.params.id, updateData, { new: true })
    .then((item) => {
      if (!item) {
        return res.status(404).json({ message: 'Elemento no encontrado' });
      }
      res.json(item);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
};

// Eliminar un elemento
exports.deleteItem = (req, res) => {
  Item.findByIdAndDelete(req.params.id)
    .then((item) => {
      if (!item) {
        return res.status(404).json({ message: 'Elemento no encontrado' });
      }
      res.json({ message: 'Elemento eliminado con éxito' });
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
};
