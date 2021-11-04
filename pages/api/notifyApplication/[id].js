import nc from 'next-connect';
import { all } from "../../../middlewares";
import NotifyClass from '../../../classes/NotifyClass'

const handler = nc().use(all);

handler.get(async (req, res) => {
    try{
        const { id } = req.query;
        const notify = new NotifyClass();

        const notifications = await notify.getNotifyById(id);
        if(notifications){
            res.status(200).json(permissions);
		} else {
			res.status(404).end();
		}
    }
    catch (error){
        res.status(500).json({ success: false })
    }
})

export default handler;