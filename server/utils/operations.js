const cloneDeep = require('lodash').cloneDeep;
const cards = require( '../constants/cards').cards;

/**
 * Трефы — clubs
 Бубны — diamonds
 Червы — hearts
 Пики — spades
 * @type {string[]}
 */
const suits = ['clubs', 'diamonds', 'hearts', 'spades'];

function buildDeck(maxRank = 2){
    const deck = [];
    for(const card of cards){
        if(card.rank >= maxRank){
            suits.forEach(suit => {
                const newCard = cloneDeep(cards);
                newCard.suit = suit;
                deck.push(newCard);
            });
        }
    }
    return deck.shuffle();
}

module.exports.buildStandardDeck = buildDeck;
module.exports.buildExtendDeck = buildDeck.bind(null, 6);
