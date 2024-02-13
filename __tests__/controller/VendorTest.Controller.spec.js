//inspiration drawn from workshop code
const mongoose = require('mongoose')

 
const testController = require("../../controllers/testController")


const VendorTest = require("../../models/VendorTest");



describe("Unit testing update vendor", () => {

    const req = {
        params: {"vendorId":3},
    };

    const res = {
        render: jest.fn()
    };


    beforeAll(() => {
        res.render.mockClear();

        VendorTest.updateOne = jest.fn().mockResolvedValue([{
            _id: '60741060d14008bd0efff9d5',
            vendorId: 3,
            vendorName: 'ar',
            status: 'ready-for-orders',
            __v: 0
        }]);


        testController.ready(req, res);
      });


    test("Test case 1: testing with existing vendor id \
        60741060d14008bd0efff9d5, ", () => {

        expect(res.render).toHaveBeenCalledTimes(1);

        expect(res.render).toHaveBeenCalledWith('Vhome');
    });
  });


describe("Unit testing update incorret", () => {

    const req = {

        params: {id:'1234'},

        isAuthenticated: jest.fn().mockReturnValue('True')
    };


    const res = {
        render: jest.fn()
    };

    beforeAll(() => {

        res.render.mockClear();

        VendorTest.updateOne = jest.fn().mockResolvedValue();

        VendorTest.updateOne.mockImplementationOnce(() => {
            throw new Error();
          });

        testController.ready(req, res);
      });


    test("Test case 1: , expecting error message", () => {

        expect(res.render).toHaveBeenCalledTimes(1);

        expect(res.render).toHaveBeenCalledWith('Vhome');
    });
  });