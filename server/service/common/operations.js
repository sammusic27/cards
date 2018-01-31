Array.prototype.shuffle = function(sourceArray) {
    for (let i = 0; i < sourceArray.length - 1; i++) {
        let j = i + Math.floor(Math.random() * (sourceArray.length - i));

        let temp = sourceArray[j];
        sourceArray[j] = sourceArray[i];
        sourceArray[i] = temp;
    }
    return sourceArray;
};

const cloneDeep = require('lodash').cloneDeep;
const cards = require( '../../constants/cards').cards;

const shuffle = {
    thisDeck: function(deck){
        return deck.shuffle(deck);
    }
};

/**
 * Трефы — clubs
 Бубны — diamonds
 Червы — hearts
 Пики — spades
 * @type {string[]}
 */
const suits = ['clubs', 'diamonds', 'hearts', 'spades'];



module.exports.shuffle = shuffle;

module.exports.buildDeck = {
    54: function(){
        const deck = [];
        for(let i in cards){
            suits.forEach(suit => {
                const newCard = cloneDeep(cards[i]);
                newCard.suit = suit;
                deck.push(newCard);
            });
        }
        return shuffle.thisDeck(deck);
    },
    36: function(){
        const deck = [];
        for(let i in cards){
            if(cards[i].rank > 4){ // fom 6 and more
                suits.forEach(suit => {
                    const newCard = cloneDeep(cards[i]);
                    newCard.suit = suit;
                    deck.push(newCard);
                });
            }
        }
        return shuffle.thisDeck(deck);
    }
};