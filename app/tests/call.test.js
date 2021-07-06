const request = require('supertest');
const { Op } = require('sequelize');
const { uuid } = require('uuidv4');
const { call } = require('../models');
const { Interval } = require('../utils/Time');
const app = require('../server');
const { user } = require('../models');

describe('Session endpoints testing', () => {
  let current_assistant;
  let current_assistant_2;
  let token;
  beforeAll(async () => {
    await user.create({
      id: uuid(),
      name: 'admin',
      password: '123',
      email: 'admin@hotmail.cl',
      rol: 'administrator',
    });

    const login = await request(app)
      .post('/sessions')
      .send({
        email: 'admin@hotmail.cl',
        password: '123',
      });

    token = login.body.token;
    // Create assistant to test

    await request(app)
      .post('/users')
      .send({
        name: 'Assistant',
        email: 'assist@test.cl',
        rol: 'assistant',
      }).set({
        authorization: token,
      });

    await request(app)
      .patch('/users')
      .send({
        email: 'assist@test.cl',
        password: '1233',
      }).set({
        authorization: token,
      });

    await request(app)
      .post('/users')
      .send({
        name: 'Assistant2',
        email: 'assist@test2.cl',
        rol: 'assistant',
      }).set({
        authorization: token,
      });

    await request(app)
      .patch('/users')
      .send({
        email: 'assist@test2.cl',
        password: '1233',
      }).set({
        authorization: token,
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

    current_assistant = await user.findOne({
      where: { email: 'assist@test.cl' },
    });
    current_assistant_2 = await user.findOne({
      where: { email: 'assist@test2.cl' },
    });
  });

  // CREATE
  it('should fail in accept a new call because token not send', async () => {
    const res4 = await request(app)
      .patch('/assistants')
      .send();
    expect(res4.statusCode).toEqual(400);
    expect(res4.body.state).toEqual('F');
    expect(res4.body.error).toEqual('Only users can do this action');
  });

  it('should fail in accept a new call because token is invalid', async () => {
    const res4 = await request(app)
      .patch('/assistants')
      .set({
        authorization: 'INVALID-TOKEN',
      })
      .send();
    expect(res4.statusCode).toEqual(400);
    expect(res4.body.state).toEqual('F');
    expect(res4.body.error).toEqual('Only users can do this action');
  });

  it('should create a new row on calls table', async () => {
    const res4 = await request(app)
      .patch('/assistants')
      .set({
        authorization: current_assistant.token,
      })
      .send();
    const [today, first_day] = await Interval();

    const last_record = await call.findOne({
      where: {
        date: {
          [Op.between]: [first_day, today],
        },
        userId: current_assistant.id,
      },
    });
    expect(res4.statusCode).toEqual(200);
    expect(last_record).toBeTruthy();
    expect(last_record.calls).toEqual(1);
  });

  // The same test with other assistant
  it('should create a new row on calls table for a second assistant', async () => {
    const res4 = await request(app)
      .patch('/assistants')
      .send()
      .set('authorization', current_assistant_2.token);
    const [today, first_day] = await Interval();

    const last_record = await call.findOne({
      where: {
        date: {
          [Op.between]: [first_day, today],
        },
        userId: current_assistant_2.id,
      },
    });

    expect(res4.statusCode).toEqual(200);
    expect(last_record).toBeTruthy();
    expect(last_record.calls).toEqual(1);
  });

  it('should update last row on calls table to 2 calls in this month', async () => {
    const res4 = await request(app)
      .patch('/assistants')
      .send()
      .set('authorization', current_assistant.token);
    const [today, first_day] = await Interval();
    const last_record = await call.findOne({
      where: {
        date: {
          [Op.between]: [first_day, today],
        },
        userId: current_assistant.id,
      },
    });

    expect(res4.statusCode).toEqual(200);
    expect(last_record).toBeTruthy();
    expect(last_record.calls).toEqual(2);
  });

  // The same test with other assistant
  it('should update last row on calls table to 2 calls in this month for a second assistant', async () => {
    const res4 = await request(app)
      .patch('/assistants')
      .send()
      .set('authorization', current_assistant_2.token);
    const [today, first_day] = await Interval();

    const last_record = await call.findOne({
      where: {
        date: {
          [Op.between]: [first_day, today],
        },
        userId: current_assistant_2.id,
      },
    });

    expect(res4.statusCode).toEqual(200);
    expect(last_record).toBeTruthy();
    expect(last_record.calls).toEqual(2);
  });

  // KPI TESTS
  it('should fail in get specific kpi because fields not sent', async () => {
    const res4 = await request(app)
      .post('/kpis')
      .send({}).set({
        authorization: token,
      });
    expect(res4.statusCode).toEqual(400);
    expect(res4.body.state).toEqual('F');
    expect(res4.body.error).toEqual('Invalid fields');
  });

  it('should fail in get specific kpi because email doesnt exists', async () => {
    const res4 = await request(app)
      .post('/kpis')
      .send({
        email: 'm342h54hj35gj34hg',
      }).set({
        authorization: token,
      });
    expect(res4.statusCode).toEqual(400);
    expect(res4.body.state).toEqual('F');
    expect(res4.body.error).toEqual('Invalid email');
  });

  it('should get kpi for a specific assistant', async () => {
    const res5 = await request(app)
      .post('/kpis')
      .send({
        email: current_assistant.email,
      }).set({
        authorization: token,
      });
    expect(res5.statusCode).toEqual(200);
    expect(res5.body.data).toBeTruthy();
  });

  it('should get the global kpi', async () => {
    const res5 = await request(app)
      .get('/kpis')
      .send().set({
        authorization: token,
      });
    expect(res5.statusCode).toEqual(200);
    expect(res5.body.data[0].calls).toEqual('4');
  });

  afterAll(async () => {
    // Delete all users
    const users = await request(app)
      .get('/users').set({
        authorization: token,
      });

    await Promise.all(users.body
      .map(async (u) => {
        await request(app)
          .delete('/users')
          .send({
            email: u.email,
          }).set({
            authorization: token,
          });
      }));

    await user.destroy({
      where: { email: 'admin@hotmail.cl' },
    });

    // Delete records created on calls table
    await call.destroy({
      where: {
        userId: current_assistant_2.id,
      },
    });
    await call.destroy({
      where: {
        userId: current_assistant.id,
      },
    });
    const [today, first_day] = await Interval();

    await call.destroy({
      where: {
        date: {
          [Op.between]: [first_day, today],
        },
        userId: current_assistant_2.id,
      },
    });
  });
});
