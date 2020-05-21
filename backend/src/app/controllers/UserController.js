import * as Yup from 'yup'; // esta lib serve para a validação dos campos de entrada
import User from '../models/User';
import File from '../models/File';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    // Aqui eu faço a verificação de existência de usuário
    const userExists = await User.findOne({ where: { name: req.body.name } });
    // Se existir o usuário, dou uma 'bad request' => 400
    if (userExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const { id, name, issuer } = await User.create(req.body);

    return res.json({ id, name, issuer });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { name, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (name !== user.name) {
      // Aqui eu faço a verificação de existência de usuário. É a mesma de lá de cima do store
      const userExists = await User.findOne({ where: { name: req.body.name } });
      // Se existir o usuário, dou uma 'bad request' => 400
      if (userExists) {
        return res.status(400).json({ error: 'User already exists.' });
      }
    }
    // Aqui eu só verifico se o oldPassword for informado
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match.' });
    }

    await user.update(req.body);

    const { id, issuer, avatar } = await User.findByPk(req.userId, {
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json({ id, name, avatar, issuer });
  }
}

export default new UserController();
