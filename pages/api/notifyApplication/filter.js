import nc from 'next-connect';
import { all } from "../../../middlewares";
import NotifyClass from '../../../classes/NotifyClass'

const handler = nc().use(all);

handler.post(async (req, res) => {
    try{
        const { id } = req.body;
        const notify = new NotifyClass();

        var notifications = await notify.getMyNotificationsPending(id);
        if(notifications.length < 5){
            notifications.push(...(await notify.getNotify(id, notifications.length - 5)));
        }
        if(notifications){
            
            res.status(200).json(notifications);
		} else {
			res.status(404).end();
		}
    }
    catch (error){
        res.status(500).json({ success: false, error: error.message })
    }
})

export default handler;