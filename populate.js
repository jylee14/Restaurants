// script to populate the database with restaurantData from csv using csv filename as restaurant name
const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')

const Employee = require('./src/models/Employee')
const Restaurant = require('./src/models/Restaurant')

const dataDir = './restaurantData'

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

async function populate(dir) {
  for (const file of fs.readdirSync(dir)) {
    if (file.endsWith('.csv')) {
      const filePath = path.join(dir, file)

      const restaurantName = file.substring(0, file.indexOf('.csv'))
      const content = fs.readFileSync(filePath).toString().split('\n')

      var headers = content[0].split(',')
      const employees = []
      for (let i = 1; i < content.length; i++) {
        var data = content[i].split(',')
        var employeeData = {}
        for (var j = 0; j < data.length; j++) {
          employeeData[headers[j].trim()] = data[j].trim()
        }

        const employee = processEmployees(employeeData)
        try {
          await employee.save()
          employees.push(employee._id)
        } catch (e) {
          console.error('failed to save employee', e)
        }
      }

      const restaurant = new Restaurant({
        name: restaurantName,
        employees
      })
      await restaurant.save()
    }
  }
  return
}

function processEmployees(datum) {
  if (datum) {
    return new Employee({
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
      bonus: datum.bonus || datum.Bonus
    })
  }
}

(async () => {
  try {
    await connectDB()
    await populate(dataDir)
  } catch (e) {
    console.error(e)
  }
})()