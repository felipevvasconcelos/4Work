import nc from 'next-connect';
import { all } from '../../middlewares/index'

const handler = nc().use(all);

handler.post(async (req, res) => {

  res.status(200).json({success: "Api em Execução"})

})

handler.get(async (req, res) => {

  res.status(200).json({success: "Api em Execução"})
  
})

export default handler;

