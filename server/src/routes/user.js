const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.patch('/:id', userController.updateUser);
router.put('/:id', userController.partialUpdateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
