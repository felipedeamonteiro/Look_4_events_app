// Esse middleware serve para verificar se o usuário está logado.
import jwt from 'jsonwebtoken';
// Esse promisify é uma função que pega uma função de callback e transforma em async e await
// Vou usá-la no veriry do jwt, pq ele retorn um callback e não quero utilizar ela como um callback
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided.' });
  }

  const [, token] = authHeader.split(' ');

  try {
    // jwt.verify(token, secret, ()) => esse seria o verify sem o promisify
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    // Aqui, se deu tudo certo o decoded retorna 3 parâmetros num objeto e um deles é o id. Eu posso pegar o id e incluir no req.
    // E dessa maneira eu pego o id do usuário e vou usar lá no update do usercontroller.
    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid.' });
  }
};
