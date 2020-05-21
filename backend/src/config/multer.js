// Aqui fica a configuração da parte de upload de arquivos
import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

// essa cb no filename serve para lidar com os nomes dos arquivos
export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err);

        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
