var express = require('express');
var router = express.Router();
const PgHelper = require('../helper/pg_helper');

router.get('/cards/:deckId', async function(req, res, next) {
    const pgHelper = new PgHelper();
    await pgHelper.client.connect();

    response = await getFlashcards(req.params.deckId, pgHelper);

    await pgHelper.client.end();
    res.json(response.rows);
});

async function getFlashcards(deckId, pgHelper) {
    const queryString = `
        SELECT card_id, value, answer
        FROM flashcard
        WHERE deck_id = ${deckId}`;

    const response = await pgHelper.client.query(queryString);

    return response;
}

module.exports = router;