function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function ascii (a) {
  return a.charCodeAt(0);
}

function add(a, b) {
    return a + b
}

function randomPhrase(phrases) {
  return phrases[phrases.length * Math.random() << 0]
}

function getName(fullname, pokemonList, pokemonListLength) {
  if (pokemonList[fullname] !== undefined) {
    return fullname
  } else {
    var keys = Object.keys(pokemonList)
    var pokemonNumber = fullname.split('').map(ascii).reduce(add, 0) % pokemonListLength
    return capitalizeFirstLetter(pokemonList[keys[pokemonNumber]][0])
  }
}

/**
 * Get the closest matching element up the DOM tree.
 * @private
 * @param  {Element} elem     Starting element
 * @param  {String}  selector Selector to match against
 * @return {Boolean|Element}  Returns null if not match found
 */
var getClosest = function ( elem, selector ) {
  // Element.matches() polyfill
  if (!Element.prototype.matches) {
    Element.prototype.matches =
      Element.prototype.webkitMatchesSelector ||
      function(s) {
        var matches = (this.document || this.ownerDocument).querySelectorAll(s),
            i = matches.length;
        while (--i >= 0 && matches.item(i) !== this) {}
        return i > -1;
      };
  }

  // Get closest match
  for ( ; elem && elem !== document; elem = elem.parentNode ) {
    if ( elem.matches( selector ) ) return elem;
  }

  return null;
};

// TODO: load this from separate file
var pokemonList = {
  "Bulbasaur": ["bulbasaur", "bul", "ba", "saur"],
  "Ivysaur": ["ivysaur", "ivy", "saur"],
  "Venusaur": ["venusaur", "venu", "saur"],
  "Charmander": ["charmander", "char", "man"],
  "Charmeleon": ["charmeleon", "char", "mel", "meleon"],
  "Charizard": ["charizard", "char", "zard"],
  "Squirtle": ["squirtle", "squirt"],
  "Wartortle": ["wartortle", "war", "tort"],
  "Blastoise": ["blastoise", "blast", "toise"],
  "Caterpie": ["caterpie", "ca", "cater", "pi"],
  "Metapod": ["metapod", "me", "meta", "pod"],
  "Butterfree": ["butter", "free", "ee"],
  "Weedle": ["weedle", "weed"],
  "Kakuna": ["kakuna", "ka", "ku", "na"],
  "Beedrill": ["beedrill", "bee", "drill"],
  "Pidgey": ["pidgey", "pid", "gey"],
  "Pidgeotto": ["pidgeotto", "pidgeo", "to"],
  "Pidgeot": ["pidgeot", "pid", "geot"],
  "Rattata": ["rattata", "rat", "tata", "ta"],
  "Raticate": ["raticate", "rat", "cate"],
  "Spearow": ["spearow", "spear", "row"],
  "Fearow": ["fearow", "fear", "row"],
  "Ekans": ["ekans", "ek", "kans", "sss"],
  "Arbok": ["arbok", "ar", "bok"],
  "Pikachu": ["pikachu", "pi", "pika", "chu"]
}

var pokemonListLength = Object.keys(pokemonList).length

var tweets = document.getElementsByClassName('tweet-text'),
  retweets = document.querySelectorAll('[data-retweet-id] .tweet-text'),
  tags = document.getElementsByClassName('twitter-hashtag'),
  users = document.querySelectorAll('.fullname, .ProfileHeaderCard-nameLink, .js-retweet-text .js-user-profile-link'),
  hashtags = {}

for (var tweetsIndex = 0; tweetsIndex < tweets.length; tweetsIndex++) {
  var tweet = tweets[tweetsIndex]
  var childCount = tweet.childElementCount

  for (var childIndex = 0; childIndex < childCount; childIndex++) {
    var node = tweet.childNodes[childIndex]
    if (node.nodeType == 3) {
      var text = node.nodeValue.replace(/\"/g, '&quot;')
      span = Object.assign(document.createElement('span'), {
	       className: 'regular-text',
	       innerHTML: text
      })

      tweet.replaceChild(span, node)
    }
  }
}

var regularTextNodes = document.getElementsByClassName('regular-text')

for (var usersIndex = 0; usersIndex < users.length; usersIndex++) {
  var fullname = users[usersIndex].innerText
  users[usersIndex].innerText = getName(fullname, pokemonList, pokemonListLength)
}

for (var tagsIndex = 0; tagsIndex < tags.length; tagsIndex++) {
  var tag = tags[tagsIndex]
  var tagText = tag.innerText
  var user = getClosest(tag, '.content').querySelector('.fullname').innerText

  if (hashtags[user] == undefined) {
    hashtags[user] = {}
  }

  if (hashtags[user][tagText] == undefined) {
    var phrases = pokemonList[user]
    var newTag = ''

    while (tagText.length > newTag.length) {
      newTag += capitalizeFirstLetter(randomPhrase(phrases))
    }

    hashtags[user][tagText] = newTag
  }

  tag.innerText = "#" + hashtags[user][tagText] + ' '
}

for (var textIndex = 0; textIndex < regularTextNodes.length; textIndex++) {
  var textNode = regularTextNodes[textIndex]
  var user = getClosest(textNode, '.content').querySelector('.fullname').innerText
  var text = textNode.innerText
  var phrases = pokemonList[user]

  var newText = capitalizeFirstLetter(randomPhrase(phrases)) + ' '

  while (text.length > newText.length) {
    newText += randomPhrase(phrases) + ' '
  }
  textNode.innerText = newText
}

for (var retweetsIndex = 0; retweetsIndex < retweets.length; retweetsIndex++) {
  var retweet = retweets[textIndex]
  var user = getClosest(retweet, '.content').querySelector('.fullname').innerText
  var text = retweet.innerText
  var phrases = pokemonList[user]

  var newText = capitalizeFirstLetter(randomPhrase(phrases)) + ' '

  while (text.length > newText.length) {
    newText += randomPhrase(phrases) + ' '
  }
  retweet.innerText = newText
}
