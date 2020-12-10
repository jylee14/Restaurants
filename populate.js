// script to populate the database with restaurantData from csv using csv filename as restaurant name
const fs = require('fs')
const parse = require('csv-parse')
const mongoose = require('mongoose')
const { emit } = require('process')

const Employee = require('./src/models/Employee')
const Restaurant = require('./src/models/Restaurant')

const path = './restaurantData'

function connectDB() {
    const MONGO_URI = 'mongodb://127.0.0.1:27017/restaurants'
    return mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log('connected to mongoDB')
        })
        .catch(err => {
            console.error('failed to connect to mongoDB: ', err.message)
        })
}

function processEmployees(restaurantId) {
    parser.on('data', async (datum) => {
        if (datum) {
            const employee = new Employee({
                email: datum.email || datum['Email'],
                firstName: datum.firstName || datum['First Name'],
                lastName: datum.lastName || datum['Last Name'],
                startDate: datum.startDate || datum['Hire Date'],
                terminationDate: datum.terminationDate,
                fulltime: (datum.employmentType || datum['Type']).toLowerCase().includes('time'),
                department: datum.department || datum['Division'],
                level: datum.level,
                city: datum.city,
                country: datum.country || datum.Country,
                gender: (datum.gender || datum.Gender).length > 4,
                salary: datum.salary || datum['Base Pay'],
                bonus: datum.bonus || datum.Bonus,
                restaurant: restaurantId
            })

            try {
                await employee.save()
            } catch (e) {
                emit('error', e)
            }
        }
    })
        .on('end', () => console.log('finished parsing', restaurantId))
}

const parser = parse({ columns: true })

async function populate(path) {
    try {
        const dir = await fs.promises.readdir(path, { withFileTypes: 'csv' })
        for await (const file of dir) {
            if (file.name.endsWith('.csv')) {
                console.log(file)
                return;

                console.log('parsing', file.name)
                const restaurantName = file.name.substring(0, file.name.lastIndexOf('.csv'))
                const filename = `${path}/${file.name}`

                const restaurant = new Restaurant({
                    name: restaurantName
                })
                await restaurant.save()

                const readStream = fs.createReadStream(filename)
                readStream.pipe(parser)

                processEmployees(restaurant._id)
            }
        }
    } catch (e) {
        console.error(e)
    } finally {
        return 0;
    }
}

connectDB().then(() => {
    populate(path)
})