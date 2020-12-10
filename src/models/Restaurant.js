const mongoose = require('mongoose')

const schema = new mongoose.Schema({ 
  name: { 
    type: String,
    required: true
  },
  // employees: [{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Employee'
  // }]
})

schema.set('toJSON', { 
  transform: (doc, ret) => {
    ret.id = ret._id.toString(), 
    delete ret._id,
    delete ret.__v
  }
})

module.exports = new mongoose.model('Restaurant', schema)