const JSONStream = require('JSONStream')
const routes = require('express').Router()

const Employees = require('../models/Employee')
const Restaurant = require('../models/Restaurant')

routes.get('/Employees', async (req, res) => {
    const employeeStream = Employees
        .find()
        .populate('restaurant', { restaurantName: 1 })
        .sort([['restaurant', 1], ['lastName', 1], ['firstName', 1], ['startDate', 1]])
        .cursor()
        .pipe(JSONStream.stringify())
        .pipe(res.type('json'))

    employeeStream.on('end', () => {
        res.status(200).end()
    })

    employeeStream.on('error', () => {
        res.status(500).end()
    })
})

routes.get('/Salary', async (req, res) => {
    const name = req.query.restaurant
    const restaurant = await Restaurant.findOne({ name })
    if (restaurant) {
        const id = restaurant._id

        const employees = await Employees.find({ restaurant: id })
        console.log(employees.length)
        const totalSalary = employees.map(doc => doc.salary)
            .reduce((a, c) => a + c, 0)

        const average = (totalSalary / employees.length).toFixed(2)
        res.json({ average }).end()
    } else {
        res.status(400)
        .json({
            message: 'invalid restaurant name'
        })
        .send()
    }
})

module.exports = routes
