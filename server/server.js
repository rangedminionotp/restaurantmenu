const fs = require('fs')
const express = require('express')
const bcrypt = require("bcrypt")
const crypto = require("crypto")
var nodemailer = require('nodemailer')
const app = express()
const port = 3001

var cors = require('cors')
app.use(cors())
var bodyParser = require('body-parser')
app.use(bodyParser.json())
var dataFile = './data.json'
var allData = require(dataFile)
var users = require('./users.json')

// gmail setup
/*
  1. enable 2FA
  2. generate password from here https://myaccount.google.com/apppasswords
  3. paste gmail / generated password into gmail.json
*/
var gmailUser = require('./gmail.json')
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: gmailUser.login
});

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

  // make sure there's at least 1 item
  if (data.length < 1) {
    res.send('empty order')
    return
  }

  var emailText = '';

  // convert items to a string
  for(item of data) {
    console.log(item)
    if (!item.categorieID || !item.itemID) {
      res.send('missing data')
      return
    }

    var itemName = allData.categories[item.categorieID].items[item.itemID].name
    var itemPrice = allData.categories[item.categorieID].items[item.itemID].price
    var itemInstructions = item.instructions
    var itemQuantity = item.quantity
    var itemOptions = item.options

    var itemText = `${itemName} $${itemPrice} x${itemQuantity}\n`
    if (itemInstructions) {
      itemText += `Instructions: ${itemInstructions}\n`
    }

    //add options
    for (option in itemOptions) {
      for(selection of itemOptions[option]) {
        var name = allData.options[option].name
        var price = allData.options[option].values[selection]
        if (price == 0) price = "" // don't show $0
        else price = `$${price}`

        itemText += `${name}: ${selection} ${price}\n`
      }
    }

    emailText += itemText + '\n'
  }

  //send email
  var mailOptions = {
    from: gmailUser.login.user,
    to: gmailUser.sendto,
    subject: 'Sending Email using Node.js',
    text: emailText
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.send('failed to send email') // TODO notify user to call store
    } else {
      console.log('Email sent:', info.messageId);
      res.send('ok')
    }
  });

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
  if (!data.token || !data.categorieID) {
    res.send('missing data')
    return
  }

  // make sure all data is valid
  if (data.token.length < 1 || data.categorieID.length < 1) {
    res.send('invalid data')
    return
  }

  // check if token is valid
  if (!checkToken(data.token)) {
    res.send('invalid token')
    return
  }

  // if catagory doesn't exist
  if (!allData.categories[data.categorieID]) {
    res.send('unknown category')
    return
  }

  // delete data from memory
  delete allData.categories[data.categorieID]

  // save data to file
  saveItemData();

  res.send('ok')
})

app.post('/editCategorie', (req, res) => {
  const data = req.body

  // make sure all data is there
  if (!data.categorieID || !data.description || !data.token) {
    res.send('missing data')
    return
  }

  // make sure all data is valid
  if (data.categorieID.length < 1 || data.description.length < 1 || data.token.length < 1) {
    res.send('invalid data')
    return
  }

  // check if token is valid
  if (!checkToken(data.token)) {
    res.send('invalid token')
    return
  }

  // if catagory doesn't exist, create it
  if (!allData.categories[data.categorieID]) {
    allData.categories[data.categorieID] = {
      items: {}
    }
  }

  // save data to memory
  allData.categories[data.categorieID].description = data.description

  // save data to file
  saveItemData();

  res.send('ok')
})

app.post('/delItem', (req, res) => {
  const data = req.body
  
  // make sure all data is there
  if (!data.categorieID || !data.itemID || !data.token) {
    res.send('missing data')
    return
  }

  // make sure all data is valid
  if (data.categorieID.length < 1 || data.itemID.length < 1 || data.token.length < 1) {
    res.send('invalid data')
    return
  }

  // check if token is valid
  if (!checkToken(data.token)) {
    res.send('invalid token')
    return
  }

  // if catagory doesn't exist
  if (!allData.categories[data.categorieID]) {
    res.send('unknown category')
    return
  }

  // if item doesn't exist
  if (!allData.categories[data.categorieID].items[data.itemID]) {
    res.send('unknown item')
    return
  }

  // delete data from memory
  delete allData.categories[data.categorieID].items[data.itemID]

  // save data to file
  saveItemData();

  res.send('ok')
})

app.post('/editItem', (req, res) => {
  const data = req.body
  
  // make sure all data is there
  if (!data.categorieID || !data.itemID || !data.description || !data.price || !data.options || !data.token) {
    res.send('missing data')
    return
  }

  // make sure all data is valid
  if (data.categorieID.length < 1 || data.itemID.length < 1 || data.description.length < 1 || data.price < 0 || data.options.length < 1 || data.token.length < 1) {
    res.send('invalid data')
    return
  }

  // check if token is valid
  if (!checkToken(data.token)) {
    res.send('invalid token')
    return
  }

  // if catagory doesn't exist
  if (!allData.categories[data.categorieID]) {
    res.send('unknown category')
    return
  }

  // save data to memory
  allData.categories[data.categorieID].items[data.itemID].price = data.price
  allData.categories[data.categorieID].items[data.itemID].description = data.description
  allData.categories[data.categorieID].items[data.itemID].options = data.options

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