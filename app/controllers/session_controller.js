const jwt = require( 'jsonwebtoken' );
const user = require('../models').user;
require( 'dotenv' ).config();

async function set_middleware(req, res, next){
    req.logged = false;
    if(req.headers['token']){
        let curr_user = await user.findOne({where:{token: req.headers.token}})
        if (curr_user){
            try{
                const payload = await jwt.verify( req.headers["token"], process.env.JWT_SECRET);
                req.logged = true;
                req.email = payload;
                return next()
            } catch( err ) {
                return next()
            };
        }
    }
    return next()
}

async function log_in(req, res){
    
    if(!req.body.email || !req.body.password){
        return res.status(400).json({state:"F", error:"Invalid fields"})
    }
    let curr_user = await user.findOne({where: {
        email: req.body.email,
        password: req.body.password
    }})
    if(curr_user){
        let token = jwt.sign(req.body.email, process.env.JWT_SECRET);
        await user.update( {
            token: token}, 
            {where:{email: req.body.email}}
        );
        return res.status(200).json({state:"OK", token: token})
    }
    return res.status(400).json({state:"F", error:"Invalid email or password"})
}

async function log_out(req, res){
    try{
        await user.update({token: null}, {where:{email:req.email}})
        return res.status(200).json({state:"OK"})
    } catch(error){
        return res.status(500).json({state:"F", error: error})
    }
}


async function only_logged(req, res, next){
    if(req.logged){
        return next()
    }
    return res.status(400).json({state: "F", error:"You must be logged to do this"})
}
async function only_unlogged(req, res, next){
    if(!req.logged){
        return next()
    }
    return res.status(400).json({state:"F", error:"You must be unlogged to do this"})
}
module.exports = {
    check_session: set_middleware,
    log_in: log_in,
    log_out: log_out,
    filters: {
        only_logged: only_logged,
        only_unlogged: only_unlogged
    }
}