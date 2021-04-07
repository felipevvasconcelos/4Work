import dbConnect from '../src/dbConfig'
const mongoose = require('mongoose');

export default async function mongodb(req, res, next) {
  
  await dbConnect();

  var afterResponse = function() { mongoose.connection.close(); }
  res.on('finish', afterResponse);
  res.on('close', afterResponse);

  return next();
  
}