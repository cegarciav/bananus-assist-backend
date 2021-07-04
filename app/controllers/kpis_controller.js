const { user, call} = require('../models');
const Sequelize = require("sequelize")
//KPI: Number of calls per month, per assistant
async function calls_per_month(req, res){
    try{
        if (!req.body.email){
        res.status(400).json({ state: 'F', error: 'Invalid fields' });
        return;
        }
        let current_assistant = await user.findOne({where: {email: req.body.email}})
        if(!current_assistant){
        return res.status(400).json({ state: 'F', error: 'Invalid email' });
        }
        let kpis = await call.findAll({attributes: { exclude: ['id'] },where: {
        userId: current_assistant.id
        }, order: [['date', 'DESC']]})

        res.status(200).json({data: kpis})
    } catch {
        res.status(500).json({
        state: 'F',
        error: "Internal server error",
        });
    }
}
  
//KPI Total calls per month, GLOBAL

async function calls_per_month_globally(req, res){
    try{
        let kpi = await call.findAll({
        attributes: [
            [Sequelize.fn('YEAR', Sequelize.col('date')), 'current_year'],
            [Sequelize.fn('MONTH', Sequelize.col('date')), 'current_month'],
            [Sequelize.fn('SUM', Sequelize.col('calls')), 'calls']
        ],
        group: [Sequelize.literal('current_year'),  Sequelize.literal('current_month')],
        order: [[Sequelize.literal('current_year'), 'DESC'],[Sequelize.literal('current_month'), 'DESC']]
        });
        
        res.status(200).json({data: kpi})
    } catch (error){
        console.log(error)
        res.status(500).json({
        state: 'F',
        error: "Internal server error",
        });
    } 
}
module.exports = {
    single_kpi: calls_per_month,
    global_kpi: calls_per_month_globally
}
  