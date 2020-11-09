var express = require('express');
var router = express.Router();
const PgHelper = require('../helper/pg_helper');

router.get('/decks/:userId', async function(req, res, next) {
  const pgHelper = new PgHelper();
  await pgHelper.client.connect();

  response = await getDecksForUserWithJoinQuery(req.params.userId, pgHelper);

  await pgHelper.client.end();
  res.json(response);
});

async function getDecksForUserWithMultipleQueries(userId, pgHelper) {
  const response = await pgHelper.client.query(`SELECT deck_id FROM userflashcarddeck WHERE user_id = ${userId}`);
  let deckIds = [];
  response.rows.forEach((row) => {
    deckIds.push(row.deck_id)
  })
  const deckResponse = await pgHelper.client.query(`SELECT deck_id, deckname FROM flashcarddeck WHERE deck_id = ANY($1::int[])`, [deckIds]);

  return deckResponse;
}

async function getDecksForUserWithMultipleTableQuery(userId, pgHelper) {
  const queryStr = `
    SELECT FCD.deck_id, FCD.deckname
    FROM flashcarddeck as FCD, userflashcarddeck UFCD
    WHERE UFCD.user_id = ${userId} AND UFCD.deck_id = FCD.deck_id
  `;
  const response = await pgHelper.client.query(queryStr);

  return response;
}

async function getDecksForUserWithJoinQuery(userId, pgHelper) {
  const queryStr = `
    SELECT flashcarddeck.deck_id, deckname
    FROM flashcarddeck INNER JOIN userflashcarddeck on (flashcarddeck.deck_id = userflashcarddeck.deck_id)
    WHERE user_id=${userId}
  `;
  const response = await pgHelper.client.query(queryStr);

  return response;
}

// const response = await pgHelper.client.query('SELECT * FROM flashcarddeck JOIN person ON "User"."id"="Booking"."renter"'');

module.exports = router;