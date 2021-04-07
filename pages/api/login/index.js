import nc from 'next-connect';
import User from '../../../models/mdlUser';
import mongodb from '../../../middlewares/mongodb'

const handler = nc().use(mongodb);

handler.post(async (req, res) => {

    try {
        const { email } = req.body
        const user = await User.findOne({email: email}) 
        
        if(user){
            res.status(200).end();
        } else {
            res.status(401).end();
        }  

    } catch (error) {
        res.status(400).json({ success: false })
    }
    
})

export default handler;