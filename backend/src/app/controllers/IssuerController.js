import User from '../models/User';
import File from '../models/File';

class IssuerController {
  async index(req, res) {
    // Este 'where' é do SQL
    const issuers = await User.findAll({
      where: { issuer: true },
      attributes: ['id', 'name', 'avatar_id'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    return res.json(issuers);
  }
}

export default new IssuerController();
