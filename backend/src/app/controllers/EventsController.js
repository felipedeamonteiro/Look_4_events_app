import * as Yup from 'yup';
import Events from '../models/Events';

class EventsController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      address: Yup.string().required(),
      date: Yup.date().required(),
      time: Yup.string().required(),
      price: Yup.number().required(),
      sold: Yup.number().required(),
      unsold: Yup.number().required(),
      category: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const eventExists = await Events.findOne({
      where: { name: req.body.name },
    });
    // Se existir o evento, dou uma 'bad request' => 400
    if (eventExists) {
      return res.status(400).json({ error: 'Event already exists.' });
    }

    const {
      id,
      name,
      address,
      date,
      time,
      price,
      sold,
      unsold,
      category,
    } = await Events.create(req.body);

    return res.json({
      id,
      name,
      address,
      date,
      time,
      price,
      sold,
      unsold,
      category,
    });
  }

  async index(req, res) {
    // Este 'where' é do SQL
    const events = await Events.findAll();

    return res.json(events);
  }
}

export default new EventsController();
