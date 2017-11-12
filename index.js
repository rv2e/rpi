const tempSensor = new require('rpi-dht-sensor').DHT22(22);
const Gpio = require('onoff').Gpio;
const RaspiCam = require("raspicam");

const pirSensor = new Gpio(7, 'in', 'both');

const takePhoto = () => new RaspiCam({
  mode: 'photo',
  output: `/home/pi/pictures/picture_${(new Date).toISOString()}.jpeg`,
  log: () => {},
}).start();

const getTemperature = (retry = 3) => {
  if (retry < 1) return {};
  const result = tempSensor.read();
  return result.errors ? getTemperature(retry-1) : result;
};

console.log('Get photo: ' + takePhoto());
console.log('Get temperature: ' + getTemperature().temperature);
console.log('Start tracking movement...');

pirSensor.watch((err, value) => {
  if (err) return console.log('An error occurred when watching pir');
  if (value == 1) {
    console.log(`Something moved, the  temparture is ${getTemperature().temperature}`);
    if (takePhoto()) console.log(`A photo has been taken correctly`);
  }
});
