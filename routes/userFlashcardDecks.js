var express = require('express');
const { Client } = require('pg')
var router = express.Router();

const client = new Client({
  user: 'judy',
  host: 'localhost',
  database: 'Flashcard',
  port: 5432,
})
router.get('/getFlashcardDecks/:userId', async function(req, res, next) {
    // (async () => {
      console.log("connecting");
      await client.connect()
      console.log("Connected");
      const response = await client.query('SELECT * FROM flashCardDeck')
      console.log(response.rows[0].message) // Hello world!
      await client.end()

      res.json(response);
      // res.send('Something here')
    // })()
});

module.exports = router;