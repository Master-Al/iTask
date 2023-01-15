/**
 * Sever-side controllers for Flow.
 * By default, Yote's server controllers are dynamic relative
 * to their models -- i.e. if you add fields to the Flow
 * model, the create and update controllers below will respect
 * the new schema.
 *
 * NOTE: HOWEVER, you still need to make sure to account for
 * any model changes on the client
 */

let Flow = require('mongoose').model('Flow');

exports.list = (req, res) => {
  if(req.query.page) {
    // paginate on the server
    var page = req.query.page || 1;
    var per = req.query.per || 20;
    Flow.find({}).skip((page-1)*per).limit(per).exec((err, flows) => {
      if(err || !flows) {
        logger.error("ERROR:");
        logger.info(err);
        res.send({success: false, message: err});
      } else {
        res.send({
          success: true
          , flows: flows
          , pagination: {
            per: per
            , page: page
          }
        });
      }
    });
  } else {
    // list all flows
    Flow.find({}).exec((err, flows) => {
      if(err || !flows) {
        logger.error("ERROR:");
        logger.info(err);
        res.send({ success: false, message: err });
      } else {
        res.send({ success: true, flows: flows });
      }
    });
  }
}

exports.listByValues = (req, res) => {
  /**
   * returns list of flows queried from the array of _id's passed in the query param
   *
   * NOTES:
   * node default max request headers + uri size is 80kb.
   */

  if(!req.query[req.params.refKey]) {
    // make sure the correct query params are included
    res.send({success: false, message: `Missing query param(s) specified by the ref: ${req.params.refKey}`});
  } else {
    Flow.find({[req.params.refKey]: {$in: [].concat(req.query[req.params.refKey]) }}, (err, flows) => {
        if(err || !flows) {
          res.send({success: false, message: `Error querying for flows by ${[req.params.refKey]} list`, err});
        } else  {
          res.send({success: true, flows});
        }
    })
  }
}

exports.listByRefs = (req, res) => {
  /**
   * NOTE: This let's us query by ANY string or pointer key by passing in a refKey and refId
   */

   // build query
  let query = {
    [req.params.refKey]: req.params.refId === 'null' ? null : req.params.refId
  }
  // test for optional additional parameters
  const nextParams = req.params['0'];
  if(nextParams.split("/").length % 2 == 0) {
    // can't have length be uneven, throw error
    res.send({success: false, message: "Invalid parameter length"});
  } else {
    if(nextParams.length !== 0) {
      for(let i = 1; i < nextParams.split("/").length; i+= 2) {
        query[nextParams.split("/")[i]] = nextParams.split("/")[i+1] === 'null' ? null : nextParams.split("/")[i+1]
      }
    }
    Flow.find(query, (err, flows) => {
      if(err || !flows) {
        res.send({success: false, message: `Error retrieving flows by ${req.params.refKey}: ${req.params.refId}`});
      } else {
        res.send({success: true, flows})
      }
    })
  }
}

exports.search = (req, res) => {
  // search by query parameters
  // NOTE: It's up to the front end to make sure the params match the model
  let mongoQuery = {};
  let page, per;

  for(key in req.query) {
    if(req.query.hasOwnProperty(key)) {
      if(key == "page") {
        page = parseInt(req.query.page);
      } else if(key == "per") {
        per = parseInt(req.query.per);
      } else {
        logger.debug("found search query param: " + key);
        mongoQuery[key] = req.query[key];
      }
    }
  }

  logger.info(mongoQuery);
  if(page || per) {
    page = page || 1;
    per = per || 20;
    Flow.find(mongoQuery).skip((page-1)*per).limit(per).exec((err, flows) => {
      if(err || !flows) {
        logger.error("ERROR:");
        logger.info(err);
        res.send({ success: false, message: err });
      } else {
        res.send({
          success: true
          , flows: flows
          , pagination: {
            per: per
            , page: page
          }
        });
      }
    });
  } else {
    Flow.find(mongoQuery).exec((err, flows) => {
      if(err || !flows) {
        logger.error("ERROR:");
        logger.info(err);
        res.send({ success: false, message: err });
      } else {
        res.send({ success: true, flows: flows });
      }
    });
  }
}

exports.getById = (req, res) => {
  logger.info('get flow by id');
  Flow.findById(req.params.id).exec((err, flow) => {
    if(err) {
      logger.error("ERROR:");
      logger.info(err);
      res.send({ success: false, message: err });
    } else if (!flow) {
      logger.error("ERROR: Flow not found.");
      res.send({ success: false, message: "Flow not found." });
    } else {
      res.send({ success: true, flow: flow });
    }
  });
}

exports.getSchema = (req, res) => {
  /**
   * This is admin protected and useful for displaying REST api documentation
   */
  logger.info('get flow full mongo schema object');
  res.send({success: true, schema: Flow.getSchema()});
}


exports.getDefault = (req, res) => {
  /**
   * This is an open api call by default (see what I did there?) and is used to
   * return the default object back to the Create components on the client-side.
   */
  logger.info('get flow default object');
  res.send({success: true, defaultObj: Flow.getDefault()});
}

exports.create = (req, res) => {
  logger.info('creating new flow');
  let flow = new Flow({});

  // run through and create all fields on the model
  for(var k in req.body) {
    if(req.body.hasOwnProperty(k)) {
      flow[k] = req.body[k];
    }
  }

  flow.save((err, flow) => {
    if (err) {
      logger.error("ERROR:");
      logger.info(err);
      res.send({ success: false, message: err });
    } else if(!flow) {
      logger.error("ERROR: Could not create Flow.");
      res.send({ success: false, message: "Could not create Flow." });
    } else {
      logger.info("created new flow");
      res.send({ success: true, flow: flow });
    }
  });
}

exports.update = (req, res) => {
  logger.info('updating flow');
  Flow.findById(req.params.id).exec((err, flow) => {
    if(err) {
      logger.error("ERROR:");
      logger.info(err);
      res.send({ success: false, message: err });
    } else if(!flow) {
      logger.error("ERROR: Flow not found.");
      res.send({ success: false, message: "Flow not found." });
    } else {
      // run through and update all fields on the model
      for(var k in req.body) {
        if(req.body.hasOwnProperty(k)) {
          flow[k] = req.body[k];
        }
      }
      // now edit the 'updated' date
      flow.updated = new Date();
      flow.save((err, flow) => {
        if(err) {
          logger.error("ERROR:");
          logger.info(err);
          res.send({ success: false, message: err });
        } else if(!flow) {
          logger.error("ERROR: Could not save flow.");
          res.send({ success: false, message: "Could not save flow."});
        } else {
          res.send({ success: true, flow: flow });
        }
      });
    }
  });
}

exports.delete = (req, res) => {
  logger.warn("deleting flow");
  Flow.findById(req.params.id).remove((err) => {
    if(err) {
      logger.error("ERROR:");
      logger.info(err);
      res.send({ success: false, message: err });
    } else {
      res.send({ success: true, message: "Deleted flow" });
    }
  });
}
