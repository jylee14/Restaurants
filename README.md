# Restaurants

Backend implemented using Express + node.js + mongoDB/mongoose

## API

200 + Data if successful

400 if invalid search query

403 if missing token

#### GET /Employees 
##### Returns ALL the data stored in the database in the following format
```
[{
  name: 'foo' // restaurantName,
  employees: [ {...}] // full data of each employee at the given restaurant
}, {
...
}]
```

#### GET /Salary?restaurant={name} 
##### Returns the average salary of all employees working at the restaurant
```
{
  average: 5000.10
}
```

#### GET /Bonus?restaurant={name} 
##### Returns the median bonus of all employees working at the restaurant
```
will return 0 if no bonus data is found
{
  median: 5000.10
}
```



