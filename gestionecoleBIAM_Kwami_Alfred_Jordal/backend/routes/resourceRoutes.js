import { Router } from 'express';
import { createResourceController } from '../controllers/resourceController.js';
import { resources } from '../models/resources.js';

const router = Router();

Object.entries(resources).forEach(([path, config]) => {
  const controller = createResourceController(config);
  router.get(`/${path}`, controller.list);
  router.get(`/${path}/:id`, controller.getById);
  router.post(`/${path}`, controller.create);
  router.put(`/${path}/:id`, controller.update);
  router.delete(`/${path}/:id`, controller.remove);
});

export default router;
