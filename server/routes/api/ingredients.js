'use strict';

const requireLogin = require('../../middlewares/requireLogin');
const axios = require('axios');
const router = require('express').Router();

router.get('/', requireLogin, async (req, res) => {
  const query = encodeURI(req.query.q);
  if (!query) {
    res.status(400).json({
      error: 'no food query was given'
    });
    return 0;
  }

  try {
    const fineli = await axios.get(
      `https://fineli.fi/fineli/api/v1/foods?q=${query}`
    );
    const filteredData = fineli.data.map(ingredient => {
      return {
        fineliId: ingredient.id,
        name: ingredient.name.fi,
        protein: ingredient.protein,
        carbohydrate: ingredient.carbohydrate,
        kcal: ingredient.energyKcal,
        fat: ingredient.fat
      };
    });
    res.json({
      data: filteredData
    });
  } catch (err) {
    res.status(500).json({ error: 'fineli: ' + err });
  }
});

module.exports = router;
