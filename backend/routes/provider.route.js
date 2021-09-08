const express = require('express');
const providerRoute = express.Router();

let ProviderModel = require('../models/Provider');
let ClientModel = require('../models/Client');

// Get Provider
providerRoute.route('/').get((req, res) => {
  ProviderModel.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Add Provider
providerRoute.route('/add-provider').post((req, res, next) => {
  ProviderModel.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
});

// Delete Provider
providerRoute.route('/delete-provider/:id/:name').delete((req, res, next) => {
  ProviderModel.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      
      ClientModel.update(
        {  },
        { $pull: { providers: { name: req.params.name } } },
        { multi: true }
      ).then((res) => {
        console.log("res", res);
      })
      
      ClientModel.find((err, cliData) => {
        if (err) {
          return next(err)
        } else {
          res.status(200).json({
            msg: data,
            cliData
          })
        }
      })
      
    }
  })
})

module.exports = providerRoute;
