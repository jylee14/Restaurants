const JSONStream = require('JSONStream')
const routes = require('express').Router()

const Employees = require('../models/Employee')
const Restaurant = require('../models/Restaurant')

const bearer = 'keyw9eMTC6oHYMQcJ' // should be hidden in a config file and encrypted but this is a hackathon :)


routes.get('/Employees', async (req, res) => {
    const token = req.token || ''
    if (!token || token != bearer) {
        res.status(403).send({
            message: 'Unauthorized'
        })
        return
    }

    const employeeStream = Restaurant
        .find()
        .populate('employees')
        .sort([['name', 1], ['lastName', 1], ['firstName', 1], ['startDate', 1]])
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
    const token = req.token || ''
    if (!token || token != bearer) {
        res.status(403).send({
            message: 'Unauthorized'
        })
        return
    }

    const name = req.query.restaurant
    const restaurant = await Restaurant
        .findOne({ name })
        .populate('employees', {
            salary: 1
        })

    if (restaurant) {
        const employees = restaurant.employees
        const totalSalary = employees.map(doc => doc.salary)
            .reduce((a, c) => a + c, 0)

        const average = (totalSalary / employees.length).toFixed(2)
        res.json({ average })
    } else {
        res.status(400)
            .json({ message: 'invalid restaurant name' })
    }
    res.end()
})

routes.get('/Bonus', async (req, res) => {
    const token = req.token || ''
    if (!token || token != bearer) {
        res.status(403).send({
            message: 'Unauthorized'
        })
        return
    }

    const name = req.query.restaurant
    const restaurant = await Restaurant
        .findOne({ name })
        .populate('employees', {
            bonus: 1
        })

    if (restaurant) {
        const employees = restaurant.employees
        const bonus = employees.map(doc => doc.bonus)
        const midpoint = Math.floor(bonus.length / 2)

        let median = bonus[midpoint]
        if (bonus.length % 2 === 0) {
            median = Math.floor((median + bonus[midpoint - 1]) / 2)
        }

        median = isNaN(median) ? 0 : median.toFixed(2)
        res.json({ median })
    } else {
        res.status(400)
            .json({ message: 'invalid restaurant name' })
    }
    res.end()
})


module.exports = routes
