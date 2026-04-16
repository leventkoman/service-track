import cron from 'node-cron';
import {expireSubscriptions} from "./expire-subscriptions";

export default function startScheduler () {
    cron.schedule('0 0 * * * ', async () => {
        console.log("cron start", new Date().toISOString());
        await expireSubscriptions();
    })
}