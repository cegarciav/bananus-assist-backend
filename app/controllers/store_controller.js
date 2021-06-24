const { uuid } = require('uuidv4');
const { store, user } = require('../models');

/**
 * @swagger
 * /stores:
 *  post:
 *    tags:
 *      - Stores
 *    summary: new store
 *    description: Allows to create a new store
 *    operationId: stores.create
 *    produces:
 *      - application/json
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            required:
 *              - name
 *              - address
 *            properties:
 *              name:
 *                type: string
 *              address:
 *                type: string
 *                unique: true
 *    responses:
 *      '201':
 *        description: Store created successfully
 *      '400':
 *        description: Some of the fields sent are not valid or missing
 *      '500':
 *        description: Internal server error
 */
async function screate(req, res) {
  try {
    if (!req.body.name || !req.body.address) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      return;
    }
    const last_store = await store.findOne({ where: { address: req.body.address } });

    if (last_store) {
      res.status(400).json({ state: 'F', error: "There's another store in the same address" });
      return;
    }
    await store.create({
      id: uuid(),
      name: req.body.name,
      address: req.body.address,
    });
    res.status(201).json({
      state: 'OK',
    });
    return;
  } catch (e) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
    });
  }
}

/**
 * @swagger
 * /stores:
 *  get:
 *    tags:
 *      - Stores
 *    summary: list of stores
 *    description: Allows to retrieve a list of stores
 *    operationId: stores.list
 *    produces:
 *      - application/json
 *    responses:
 *      '200':
 *        description: List of stores retrieved successfully
 *      '500':
 *        description: Internal server error
 */
async function sshow_all(req, res) {
  try {
    const stores = await store.findAll({
      include: [
        {
          model: user,
          as: 'assistants',
        },
        {
          model: user,
          as: 'supervisors',
        },
      ],
    });
    res.status(200).json(stores);
    return;
  } catch (e) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
    });
  }
}

/**
 * @swagger
 * /stores/show:
 *  post:
 *    tags:
 *      - Stores
 *    summary: one store
 *    description: Allows to retrieve one store
 *    operationId: stores.show
 *    produces:
 *      - application/json
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            required:
 *              - address
 *            properties:
 *              address:
 *                type: string
 *                unique: true
 *    responses:
 *      '200':
 *        description: Information of the store retrieved successfully
 *      '400':
 *        description: Address not sent or store does not exist
 *      '500':
 *        description: Internal server error
 */
async function sshow(req, res) {
  try {
    if (!req.body.address) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      return;
    }
    const current_store = await store.findOne({
      where: { address: req.body.address },
      include: [
        {
          model: user,
          as: 'assistants',
        },
        {
          model: user,
          as: 'supervisors',
        },
      ],
    });
    if (!current_store) {
      res.status(400).json({ state: 'F', error: 'Store address doesn\'t exist' });
      return;
    }
    res.status(200).json(current_store);
    return;
  } catch (e) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
    });
  }
}

/**
 * @swagger
 * /stores:
 *  patch:
 *    tags:
 *      - Stores
 *    summary: edit one store
 *    description: Allows to modify one store
 *    operationId: stores.modify
 *    produces:
 *      - application/json
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            required:
 *              - address
 *            properties:
 *              address:
 *                type: string
 *                unique: true
 *              new_address:
 *                type: string
 *                unique: true
 *              name:
 *                type: string
 *    responses:
 *      '200':
 *        description: Store updated successfully
 *      '400':
 *        description: Address not sent or some of the fields sent are not valid
 *      '404':
 *        description: Store does not exist
 *      '500':
 *        description: Internal server error
 */
async function update(req, res) {
  try {
    if (!req.body.address) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      return;
    }

    const current_store = await store.findOne({ where: { address: req.body.address } });

    if (!current_store) {
      res.status(404).json({ state: 'F', error: 'Store address doesn\'t exist' });
      return;
    }

    if (req.body.new_address) {
      const last_store = await store.findOne({ where: { address: req.body.new_address } });
      if (last_store) {
        res.status(400).json({ state: 'F', error: 'This address already exist' });
        return;
      }
    }

    await store.update({
      name: ((req.body.name) ? req.body.name : current_store.name),
      address: ((req.body.new_address) ? req.body.new_address : current_store.address),
    }, { where: { address: req.body.address } });

    res.status(200).json({ state: 'OK' });
    return;
  } catch (e) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
    });
  }
}

/**
 * @swagger
 * /stores:
 *  delete:
 *    tags:
 *      - Stores
 *    summary: delete one store
 *    description: Allows to delete one store
 *    operationId: stores.destroy
 *    produces:
 *      - application/json
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            required:
 *              - address
 *            properties:
 *              address:
 *                type: string
 *                unique: true
 *    responses:
 *      '200':
 *        description: Store deleted successfully
 *      '400':
 *        description: Address not sent
 *      '404':
 *        description: Store does not exist
 *      '500':
 *        description: Internal server error
 */
async function sdelete(req, res) {
  try {
    if (!req.body.address) {
      res.status(400).json({ state: 'F', error: 'Invalid fields' });
      return;
    }

    const current_store = await store.findOne({ where: { address: req.body.address } });

    if (!current_store) {
      res.status(404).json({ state: 'F', error: 'Store address doesn\'t exist' });
      return;
    }
    await store.destroy({
      where: {
        address: req.body.address,
      },
    });
    res.status(200).json({
      state: 'OK',
    });
  } catch (e) {
    res.status(500).json({
      state: 'F',
      error: 'Internal server error',
    });
  }
}

module.exports = {
  show_all: sshow_all,
  show_one: sshow,
  create: screate,
  update,
  delete: sdelete,
};
