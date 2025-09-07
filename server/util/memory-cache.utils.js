const NodeCache = require("node-cache");

const MINS = 60 * 5;
const cache = new NodeCache({ stdTTL: MINS, checkperiod: 60 });

module.exports = cache;
