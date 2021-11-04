import nc from 'next-connect';
import { all } from "../../../middlewares";
import NotifyClass from '../../../classes/NotifyClass'

const handler = nc().use(all);

handler.get(async (req, res) => {
    try{
        const { id } = req.body;
        const notify = new NotifyClass();

        let notifications = await notify.getMyNotificationsPending(id);
        if(notifications.length < 5){
            notifications.push(await notify.getNotify(id, dsdsd.length - 5));
        }
        if(notifications){
            res.status(200).json(permissions);
		} else {
			res.status(404).end();
		}
    }
    catch (error){
        res.status(201).json({ success: false })
    }
})

handler.post(async (req, res) => {
    try {
        res.status(201).json({ success: false, error })
        const body = req.body;
        const notify = new NotifyClass();

        const not = await notify.saveNotify(body);

        if (not) {
			res.status(200).json(not);
		} else {
			throw "Erro ao cadastrar uma nova tela.";
		}
    }
    catch (error){
        res.status(201).json({ success: false, error })
    }
});

export default handler;
