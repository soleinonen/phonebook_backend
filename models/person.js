const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI
console.log('connecting to', url)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: {
    type:String,
    minlength: 3},
  number: {
    type: String,
    validate: {
      validator: function(number) {
        console.log(number)
        if (number.length < 8) {
          return false
        }
        return /^\d{2,3}-\d+/.test(number)
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)