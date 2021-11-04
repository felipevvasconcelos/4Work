import Notify from "../../models/mdlNotify";
import dbConnect from "../../src/dbConfig";
import { jsonify } from '../GlobalClass';

export default class NotifyClass {

    async getMyNotificationsPending(id){
        await dbConnect();
        return await jsonify(Notify.find({ filter: { ready: false, "users.user": id } }))
    }

    async getNotify(id, count){
        await dbConnect();
        return await jsonify(Notify.find({ filter: { ready: true, "users.user": id } }).limit(count))
    }

    async getNotifyById(id){
        return await jsonify(Notify.find({ filter: { _id: id } }).limit(1))
    }

    async saveNotify(notifyData){
        return jsonify(await new Notify(notifyData).save());
    }
}