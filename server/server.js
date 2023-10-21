const fs = require('fs')
const express = require('express')
const bcrypt = require("bcrypt")
const app = express()
const port = 3000

var cors = require('cors')
app.use(cors())
var bodyParser = require('body-parser')
app.use(bodyParser.json())
var dataFile = './data.json'
var allData = require(dataFile)
var users = require('./users.json')

app.post('/auth', (req, res) => {
  const data = req.body

  // make sure all data is there
  if (!data.username || !data.password) {
    res.send('missing data')
    return
  }

  // make sure all data is valid
  if (data.username.length < 1 || data.password.length < 1) {
    res.send('invalid data')
    return
  }

  var salt = users[data.username].salt;
  bcrypt.hash(data.password, salt).then(hash => {

    // if password is wrong
    if (users[data.username].password != hash) {
      res.send('invalid login')
      return
    }

    res.send('pog!')
  })

  
})

app.post('/delCategorie', (req, res) => {
  const data = req.body

  // make sure all data is there
  if (!data.categories) {
    res.send('missing data')
    return
  }

  // make sure all data is valid
  if (data.categories.length < 1) {
    res.send('invalid data')
    return
  }

  // if catagory doesn't exist
  if (!allData.categories[data.categories]) {
    res.send('unknown category')
    return
  }

  // delete data from memory
  delete allData.categories[data.categories]

  // save data to file
  fs.writeFile(dataFile, JSON.stringify(allData), (error) => {
    if (error) {
      res.send('failed to save.. server issue')
      console.log(error)
      return
    }
    console.log('The file was saved!')
  })

  res.send('ok')
})

app.post('/editCategorie', (req, res) => {
  const data = req.body

  // make sure all data is there
  if (!data.categories || !data.description) {
    res.send('missing data')
    return
  }

  // make sure all data is valid
  if (data.categories.length < 1 || data.description.length < 1) {
    res.send('invalid data')
    return
  }

  // if catagory doesn't exist, create it
  if (!allData.categories[data.categories]) {
    allData.categories[data.categories] = {
      items: {}
    }
  }

  // save data to memory
  allData.categories[data.categories].description = data.description

  // save data to file
  fs.writeFile(dataFile, JSON.stringify(allData), (error) => {
    if (error) {
      res.send('failed to save.. server issue')
      console.log(error)
      return
    }
    console.log('The file was saved!')
  })

  res.send('ok')


})

app.post('/delItem', (req, res) => {
  const data = req.body
  
  // make sure all data is there
  if (!data.categories || !data.name) {
    res.send('missing data')
    return
  }

  // make sure all data is valid
  if (data.categories.length < 1 || data.name.length < 1) {
    res.send('invalid data')
    return
  }

  // if catagory doesn't exist
  if (!allData.categories[data.categories]) {
    res.send('unknown category')
    return
  }

  // if item doesn't exist
  if (!allData.categories[data.categories].items[data.name]) {
    res.send('unknown item')
    return
  }

  // delete data from memory
  delete allData.categories[data.categories].items[data.name]

  // save data to file
  fs.writeFile(dataFile, JSON.stringify(allData), (error) => {
    if (error) {
      res.send('failed to save.. server issue')
      console.log(error)
      return
    }
    console.log('The file was saved!')
  })

  res.send('ok')
})

app.post('/editItem', (req, res) => {
  const data = req.body
  
  // make sure all data is there
  if (!data.categories || !data.name || !data.description || !data.price || !data.options) {
    res.send('missing data')
    return
  }

  // make sure all data is valid
  if (data.categories.length < 1 || data.name.length < 1 || data.description.length < 1 || data.price < 0 || data.options.length < 1) {
    res.send('invalid data')
    return
  }

  // if catagory doesn't exist
  if (!allData.categories[data.categories]) {
    res.send('unknown category')
    return
  }

  // save data to memory
  allData.categories[data.categories].items[data.name].price = data.price
  allData.categories[data.categories].items[data.name].description = data.description
  allData.categories[data.categories].items[data.name].options = data.options

  // save data to file
  fs.writeFile(dataFile, JSON.stringify(allData), (error) => {
    if (error) {
      res.send('failed to save.. server issue')
      console.log(error)
      return
    }
    console.log('The file was saved!')
  })

  res.send('ok')
})

// anyone reuesting data
app.get('/', (req, res) => {
  res.send(allData)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})