/* eslint-disable no-unused-expressions */
const request = require('supertest');
const { call } = require('../models');
const { Op } = require("sequelize")
const Interval = require('../controllers/assistant_controller').interval
const app = require('../server');

describe('Session endpoints testing', () => {
  let current_assistant;
  let current_assistant_2;
  beforeAll(async () => {
    //create assistant to test

    await request(app)
      .post('/users')
      .send({
        name: 'Assistant',
        email: 'assist@test.cl',
        rol: 'assistant',
      });

    await request(app)
        .patch('/users')
        .send({
        email: 'assist@test.cl',
        password: '1233',
    });

    await request(app)
      .post('/users')
      .send({
        name: 'Assistant2',
        email: 'assist@test2.cl',
        rol: 'assistant',
      });

    await request(app)
        .patch('/users')
        .send({
        email: 'assist@test2.cl',
        password: '1233',
    });

    await request(app)
        .post('/sessions')
        .send({
        email: 'assist@test.cl',
        password: '1233',
    });



    await request(app)
        .post('/sessions')
        .send({
        email: 'assist@test2.cl',
        password: '1233',
    }); 


    

    const assistants2 = await request(app)
      .get('/users');
    [current_assistant, current_assistant_2] = assistants2.body;
  });

  // CREATE
  it('should fail in accept a new call because token not send', async () => {
    let res4 = await request(app)
      .patch('/assistants').send()
    expect(res4.statusCode).toEqual(400);
    expect(res4.body.state).toEqual('F');
    expect(res4.body.error).toEqual('You must be logged to do this');
  });

  it('should fail in accept a new call because token is invalid', async () => {
    let res4 = await request(app)
      .patch('/assistants')
      .send().set('token', "INVALID-TOKEN");
    expect(res4.statusCode).toEqual(400);
    expect(res4.body.state).toEqual('F');
    expect(res4.body.error).toEqual('You must be logged to do this');
  });

  it('should create a new row on calls table', async () => {
    let res4 = await request(app)
      .patch('/assistants')
      .send()
      .set('token', current_assistant.token);
    let [today, first_day] = await Interval();
    
    let last_record = await call.findOne({where:{
      createdAt: {
            [Op.between]: [first_day, today]
        },
        userId: current_assistant.id
    }})
    
    expect(res4.statusCode).toEqual(200);
    expect(last_record).toBeTruthy();
    expect(last_record.calls).toEqual(1)
  });

  //The same test with other assistant
  it('should create a new row on calls table', async () => {
    let res4 = await request(app)
      .patch('/assistants')
      .send()
      .set('token', current_assistant_2.token);
    let [today, first_day] = await Interval();
    
    let last_record = await call.findOne({where:{
      createdAt: {
            [Op.between]: [first_day, today]
        },
        userId: current_assistant_2.id
    }})
    
    expect(res4.statusCode).toEqual(200);
    expect(last_record).toBeTruthy();
    expect(last_record.calls).toEqual(1)
  });

  it('should update last row on calls table to 2 calls in this month', async () => {
    let res4 = await request(app)
      .patch('/assistants')
      .send()
      .set('token', current_assistant.token);
    let [today, first_day] = await Interval();
    
    let last_record = await call.findOne({where:{
      createdAt: {
            [Op.between]: [first_day, today]
        },
        userId: current_assistant.id
    }})
    
    expect(res4.statusCode).toEqual(200);
    expect(last_record).toBeTruthy();
    expect(last_record.calls).toEqual(2)
  });

  //The same test with other assistant
  it('should update last row on calls table to 2 calls in this month', async () => {
    let res4 = await request(app)
      .patch('/assistants')
      .send()
      .set('token', current_assistant_2.token);
    let [today, first_day] = await Interval();
    
    let last_record = await call.findOne({where:{
      createdAt: {
            [Op.between]: [first_day, today]
        },
        userId: current_assistant_2.id
    }})
    
    expect(res4.statusCode).toEqual(200);
    expect(last_record).toBeTruthy();
    expect(last_record.calls).toEqual(2)
  });

  //KPI TESTS
  it('should fail in get specific kpi because fields not sent', async () => {
    let res4 = await request(app)
      .post('/assistants/kpi')
      .send({});
    expect(res4.statusCode).toEqual(400);
    expect(res4.body.state).toEqual('F');
    expect(res4.body.error).toEqual('Invalid fields');
  });

  it('should fail in get specific kpi because email doesnt exists', async () => {
    let res4 = await request(app)
    .post('/assistants/kpi')
      .send({
        email: 'm342h54hj35gj34hg',
      });
    expect(res4.statusCode).toEqual(400);
    expect(res4.body.state).toEqual('F');
    expect(res4.body.error).toEqual('Invalid email');
  });

  it('should get kpi for a specific assistant', async () => {
    let res5 = await request(app)
      .post('/assistants/kpi')
      .send({
        email: current_assistant.email
      })
    expect(res5.statusCode).toEqual(200);
    expect(res5.body.data).toBeTruthy();
  });

  it('should get the global kpi', async () => {
    let res5 = await request(app)
      .get('/assistants/kpi')
      .send()
    expect(res5.statusCode).toEqual(200);
    expect(res5.body.data[0].calls).toEqual("4")
  });

  afterAll(async () => {
    //Delete all users
    const users = await request(app)
    .get('/users');

    users.body.forEach(async (u) => {
        await request(app)
        .delete('/users')
        .send({
            email: u.email,
        });
    });

    //Delete records created on calls table
    await call.destroy({where: {
        userId:{[Op.or]:[current_assistant_2.id, current_assistant.id]}
    }})
  

    

    
  });
});
