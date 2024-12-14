const express = require('express');
const attractionsController = require('../controllers/attractionsController');

const router = express.Router();

router.post('/', attractionsController.createAttraction);
router.get('/', attractionsController.getAllAttractions);
router.get('/:id', attractionsController.getAttractionById);
router.put('/:id', attractionsController.updateAttraction);
router.delete('/:id', attractionsController.deleteAttraction);

module.exports = router;

 
