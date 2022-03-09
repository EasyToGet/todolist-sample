const headers = require('./corsHeader');

function errorHandle(res) {
  res.writeHeader(400, headers);
  res.write(JSON.stringify({
    "status": "false",
    "message": "欄位未填寫正確，或無此 todo id",
  }));
  res.end()
}

module.exports = errorHandle;