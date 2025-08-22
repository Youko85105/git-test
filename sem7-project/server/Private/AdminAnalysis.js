import Base from "../models/Base.js";
import Subscription from "../models/Subscription.js"
import { checkAuthorization } from "./Authorization.js";

export const getAdminDashboard = async(req,res) => {// This will response with an object
    checkAuthorization(req,res);
    try{
        if(req.user.role === 'admin'){
            const users = Base.countDocuments({$or : [{role : "user"},{role : "creator"}]});
            const creators = Base.countDocuments({role: "creator"});
            const subscriptions = Subscription.countDocuments({active: true});
            const dashboardData = {
                users,
                creators,
                subscriptions
            }
            return res.status(200).json(dashboardData);
        }else{
            return res.status(401).json({message : "Unauthorized access"});
        }
    }catch(err){
        console.log(err);
        return res.status(500).json({message: "Cannot get Total Users"});
    }
};