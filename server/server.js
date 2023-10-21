const fs = require('fs')
const express = require('express')
const bcrypt = require("bcrypt")
const crypto = require("crypto")
const app = express()
const port = 3001

var cors = require('cors')
app.use(cors())
var bodyParser = require('body-parser')
app.use(bodyParser.json())
var dataFile = './data.json'
var allData = require(dataFile)
var users = require('./users.json')

// use this to generate a salt and hash for a password...
// for now, manually paste the salt and hash into the users.json file
function genSaltAndHash(password) {
  bcrypt.genSalt(10).then(salt => {
    console.log('Salt: ', salt)
    return bcrypt.hash(password, salt)
  }).then(hash => {
    console.log('Hash: ', hash)
  }).catch(err => console.error(err.message))
}

function checkToken(token) {
  for (var user in users) {
    if (users[user].token == token) {

      // if token is older than 1 week, decline it
      if (Date.now() - users[user].tokenTime > 604800000) {
        return false
      }

      return true
    }
  }
  return false
}

function saveItemData() {
  fs.writeFile(dataFile, JSON.stringify(allData), (error) => {
    if (error) {
      console.log(error)
      return
    }
    console.log('Saved item data')
  })
}

function saveUserData() {
  fs.writeFile('./users.json', JSON.stringify(users), (error) => {
    if (error) {
      console.log(error)
      return
    }
    console.log('Saved user data')
  })
}

app.post('/order', (req, res) => {
  const data = req.body

  // make sure all data is there
  if (!data.items) {
    res.send('missing data')
    return
  }

  // make sure all data is valid
  if (data.items.length < 1) {
    res.send('invalid data')
    return
  }

  // convert items to a string
  var items = ''
  for (const itemName in data.items) {
      const itemData = data.items[itemName];
      
      let itemText = `Item Name: ${itemName}\n`;
      for (const attribute in itemData) {
          itemText += `${attribute}: ${itemData[attribute]}\n`;
      }
      
      items += itemText + '\n';
  }

  //TODO send email
  console.log(items)

  res.send('ok')
})

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

    var token = crypto.randomBytes(50).toString("base64url")

    // save data to memory
    users[data.username].token = token
    users[data.username].tokenTime = Date.now()

    // save data to file
    saveUserData();

    res.send(token)
  })

  
})

app.post('/delCategorie', (req, res) => {
  const data = req.body

  // make sure all data is there
  if (!data.categories || !data.token) {
    res.send('missing data')
    return
  }

  // make sure all data is valid
  if (data.categories.length < 1 || data.token.length < 1) {
    res.send('invalid data')
    return
  }

  // check if token is valid
  if (!checkToken(data.token)) {
    res.send('invalid token')
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
  saveItemData();

  res.send('ok')
})

app.post('/editCategorie', (req, res) => {
  const data = req.body

  // make sure all data is there
  if (!data.categories || !data.description || !data.token) {
    res.send('missing data')
    return
  }

  // make sure all data is valid
  if (data.categories.length < 1 || data.description.length < 1 || data.token.length < 1) {
    res.send('invalid data')
    return
  }

  // check if token is valid
  if (!checkToken(data.token)) {
    res.send('invalid token')
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
  saveItemData();

  res.send('ok')
})

app.post('/delItem', (req, res) => {
  const data = req.body
  
  // make sure all data is there
  if (!data.categories || !data.name || !data.token) {
    res.send('missing data')
    return
  }

  // make sure all data is valid
  if (data.categories.length < 1 || data.name.length < 1 || data.token.length < 1) {
    res.send('invalid data')
    return
  }

  // check if token is valid
  if (!checkToken(data.token)) {
    res.send('invalid token')
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
  saveItemData();

  res.send('ok')
})

app.post('/editItem', (req, res) => {
  const data = req.body
  
  // make sure all data is there
  if (!data.categories || !data.name || !data.description || !data.price || !data.options || !data.token) {
    res.send('missing data')
    return
  }

  // make sure all data is valid
  if (data.categories.length < 1 || data.name.length < 1 || data.description.length < 1 || data.price < 0 || data.options.length < 1 || data.token.length < 1) {
    res.send('invalid data')
    return
  }

  // check if token is valid
  if (!checkToken(data.token)) {
    res.send('invalid token')
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
  saveItemData();

  res.send('ok')
})

// anyone reuesting data
app.get('/', (req, res) => {
  res.send(allData)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})