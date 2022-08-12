import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import ProfileController from '../controllers/ProfileController';
import isAuthenticated from '@shared/http/middlewares/isAuthenticated';

const profileRouter = Router();
const profileController = new ProfileController();

profileRouter.use(isAuthenticated);

profileRouter.get('/', profileController.show);
profileRouter.put(
    '/',
    celebrate({
        [Segments.BODY]: {
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            old_password: Joi.string(),
            password: Joi.string().when('old_password', {
                is: Joi.exist(),
                then: Joi.required(),
            }),
            password_confirmation: Joi.string().when('old_password', {
                is: Joi.exist(),
                then: Joi.required().valid(Joi.ref('password')),
            }),
        },
    }),
    profileController.update,
);

export default profileRouter;
