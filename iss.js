const request = require('request')

const fetchMyIP = function(callback) {
  request('https://api.ipify.org/?format=json', (error, response, body) => {
    if (error) return callback(error, null);
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`
      callback(Error(msg), null)
      return;
    }
    const ip = JSON.parse(body).ip
    callback(null, ip)
  });
};
///////////////////////////////////////////////////////////////
const fetchCoordsByIP = function(MyIp, callback) {
  request(`https://freegeoip.app/json/${MyIp}`, (error, response, body) => {
    if (error) return callback(error, null);
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching location. Response: ${body}`;
      callback(Error(msg), null)
      return;
    }
    const {
      latitude,
      longitude
    } = JSON.parse(body)
    callback(null, {
      latitude,
      longitude
    })
  })
};
///////////////////////////////////////////////////////////
const fetchISSFlyOverTimes = function(coords, callback) {
  request(`http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {
    if (error) return callback(error, null);
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when getting pass times. Response: ${body}`;
      callback(Error(msg), null)
      return;
    }
    const whereISSat = JSON.parse(body).response
    callback(null, whereISSat)
  })
};
//////////////////////////////////////////////////////////////////////////////////
const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }
    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }
      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }
        callback(null, nextPasses);
      });
    });
  });
};
//////////////////////////////////////////////////////////////////
module.exports = {
  nextISSTimesForMyLocation
}