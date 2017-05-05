function main() {
  renameUsers()
  translateTweets()
  translateTags()
}

function renameUsers() {
  var users = document.querySelectorAll('.fullname, .ProfileHeaderCard-nameLink, \
                                        .js-retweet-text .js-user-profile-link')

  for (var usersIndex = 0; usersIndex < users.length; usersIndex++) {
    var fullname = users[usersIndex].innerText
    users[usersIndex].innerText = getName(fullname, pokemonList, pokemonListLength)
  }
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

function translateTweets() {
  var tweets = document.getElementsByClassName('tweet-text')

  for (var tweetsIndex = 0; tweetsIndex < tweets.length; tweetsIndex++) {
    var tweet = tweets[tweetsIndex]
    if (tweet.classList.contains('pika-pika')) { continue }

    replaceTweet(tweet)
  }
}

function replaceTweet(tweet) {
  var user = getClosest(tweet, '.content').querySelector('.fullname').innerText
  var childCount = tweet.childNodes.length

  if (childCount == 0) {
    tweet.innerText = replaceText(tweet.innerText, user)
  }

  for (var childIndex = 0; childIndex < childCount; childIndex++) {
    checkNode(tweet, user, childIndex)
  }
  tweet.classList.add('pika-pika')
}

function replaceText(text, user) {
  var phrases = pokemonList[user]

  var newText = capitalizeFirstLetter(randomPhrase(phrases)) + ' '

  while (text.length > newText.length) {
    newText += randomPhrase(phrases) + ' '
  }

  return newText
}

function checkNode(tweet, user, childIndex) {
  var node = tweet.childNodes[childIndex]
  if (node.nodeType == 3) {
    node.nodeValue = replaceText(node.nodeValue, user)
  }
}

function randomPhrase(phrases) {
  return phrases[phrases.length * Math.random() << 0]
}

function translateTags() {
  var tags = document.getElementsByClassName('twitter-hashtag'),
  hashtags = {}

  for (var tagsIndex = 0; tagsIndex < tags.length; tagsIndex++) {
    replaceTag(tags[tagsIndex], hashtags)
  }
}

function replaceTag(tag, hashtags) {
  if (tag.classList.contains('pika-pika')) { return }

  var tagText = tag.innerText
  var user = getClosest(tag, '.content').querySelector('.fullname').innerText

  if (hashtags[user] === undefined) { hashtags[user] = {} }

  if (hashtags[user][tagText] === undefined) {
    hashtags[user][tagText] = getNewTag(tagText, user)
  }

  tag.innerText = "#" + hashtags[user][tagText] + ' '
  tag.classList.add('pika-pika')
}

function getNewTag(tagText, user) {
  var phrases = pokemonList[user]
  var newTag = ''

  while (tagText.length > newTag.length) {
    newTag += capitalizeFirstLetter(randomPhrase(phrases))
  }

  return newTag
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function ascii (a) {
  return a.charCodeAt(0);
}

function add(a, b) {
    return a + b
}

/**
 * Get the closest matching element up the DOM tree.
 * @private
 * @param  {Element} elem     Starting element
 * @param  {String}  selector Selector to match against
 * @return {Boolean|Element}  Returns null if not match found
 */
function getClosest(elem, selector) {
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
}

main()
