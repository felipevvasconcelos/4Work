import Notify from "../../models/mdlNotify";
import dbConnect from "../../src/dbConfig";
import { jsonify } from '../GlobalClass';

export default class NotifyClass {

    async getMyNotificationsPending(id){
        await dbConnect();
        return await Notify.find({ ready: false, users: id });
    }

    async getNotify(id, count){
        await dbConnect();
        const res = await Notify.find({ filter: { ready: true, users: id } }).limit(count)
        return res;
    }

    async getNotifyById(id){
        return await Notify.find({ filter: { _id: id } }).limit(1)
    }

    async saveNotify(notifyData){
        return jsonify(await new Notify(notifyData).save());
    }
}