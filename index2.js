const { printPassTimes } = require('./index')
const { nextISSTimesForMyLocation } = require('./iss_promised')

nextISSTimesForMyLocation()
    .then((pass) => {
      printPassTimes(pass);
 })
.catch((error) => {
    console.log("It did not work:", error.message)
})