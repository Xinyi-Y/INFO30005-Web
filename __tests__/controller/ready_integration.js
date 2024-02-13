// include supertest to be able to send HTTP reuests to app
const supertest = require('supertest');

// require app
const app = require('../../app');

// if the server takes a long time to process
// DB reuests that we could wait for longer
// than the default timeout value of 5 seconds
jest.setTimeout(10000);

//inspiration drawn from workshop and lecture code

describe('integration - quit', function() {
    describe('quit', function() {
        test('check if we can quit', async function() {
  
            let newVendor = {vendorId:3,vendorName:'ar',status:'ready-for-orders'};
            let finalVendor= {vendorId:3,vendorName:'ar',status:'not-ready'}
            let crap = 'hi'
            const res = await supertest(app)
                .post('/vendor/quit')
                .send(newVendor);

                expect(res.statusCode).toBe(200); 

                console.log();
                expect(res.body).toEqual(expect.objectContaining(finalVendor));
        })
    })
})
