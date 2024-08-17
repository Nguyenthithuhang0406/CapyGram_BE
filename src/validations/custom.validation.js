const ObjectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('ID is invalid!');
  }
  return value;
};

module.exports = { ObjectId };