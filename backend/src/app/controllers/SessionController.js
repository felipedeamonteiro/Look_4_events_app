import * as Yup from 'yup';
import jwt from 'jsonwebtoken';

import authConfig from '../../config/auth';
import File from '../models/File';
import User from '../models/User';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }
    // Aqui vamos verificar se o usuário existe e fazer a autenticação com o jwt
    const { name, password } = req.body;

    const user = await User.findOne({
      where: { name },
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found.' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match.' });
    }

    // Se chegou até aqui, deu tudo certo
    const { id, avatar, issuer } = user;

    return res.json({
      user: { id, name, avatar, issuer },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    }); // 1o: id do usuário, 2o: mblabsaplication => usado para gerar o hash no MD5 online, 3o: em quanto tempo acaba este token
  }
}

export default new SessionController();
