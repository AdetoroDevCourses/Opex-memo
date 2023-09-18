const express = require("express");
const router = express.Router();
const memoController = require("../controller/memoController");

router.route("/")
    .get(memoController.getAllMemo)
    .post(memoController.createMemo)
    .patch(memoController.updateMemo)
    .delete(memoController.deleteMemo)

module.exports = router