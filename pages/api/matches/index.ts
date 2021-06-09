import { NextApiHandler } from 'next';
import dayjs from 'dayjs';

const get: NextApiHandler = async (req, res) => {
  console.log(dayjs().format('YYYY-MM-DD HH:mm:ss'));
  res.end();
};

export default get;
