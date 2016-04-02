var nodeify = require('nodeify'),
    request = require('request-promise'),
    _ = require('lazy.js');

var BiblesOrg = function (opts) {
  if (this instanceof BiblesOrg === false) {
    return new BiblesOrg(opts);
  }

  if (typeof opts === 'string') {
    this.apiKey = opts;
    this.responseType = 'json';
  } else {
    this.apiKey = opts.apiKey;
    this.responseType = opts.responseType || 'json';
  }

  this.baseUrl = 'https://' + this.apiKey + '@bibles.org/v2/';
  this.extension = this.responseType === 'json' ? '.js' : '.xml';
};

BiblesOrg.prototype.serializeQuery = function serializeQuery(object) {
  if (!object || typeof object !== 'object' || !Object.keys(object).length) {
    return '';
  }

  var queryArr = [];

  for (var key in object) {
    if (object.hasOwnProperty(key)) {
      queryArr.push(encodeURI(key) + '=' + encodeURI(object[key]));
    }
  }

  return '?' + queryArr.join('&');
};

BiblesOrg.prototype.search = function search(opts, callback) {
  var query = typeof opts === 'string' ? this.serializeQuery({query: opts}) : this.serializeQuery(opts);

  return nodeify(request.get(this.baseUrl + 'search' + this.extension + query), callback);
};

BiblesOrg.prototype.versions = function versions(opts, callback) {
  var query = this.serializeQuery(opts);

  return nodeify(request.get(this.baseUrl + 'versions' + this.extension + query), callback);
};

BiblesOrg.prototype.version = function version(versionId, callback) {
  return nodeify(request.get(this.baseUrl + 'versions/' + versionId + this.extension), callback);
};

BiblesOrg.prototype.books = function books(opts, callback) {
  var version = typeof opts === 'string' ? opts : opts.version,
      query = this.serializeQuery(_(opts).omit(['version']).toObject());

  return nodeify(request.get(this.baseUrl + 'versions/' + version + '/books' + this.extension + query), callback);
};

BiblesOrg.prototype.book = function book(opts, callback) {
  return nodeify(request.get(this.baseUrl + 'books/' + opts.version + ':' + opts.book + this.extension), callback);
};

BiblesOrg.prototype.chapters = function chapters(opts, callback) {
  return nodeify(request.get(this.baseUrl + 'books/' + opts.version + ':' + opts.book + '/chapters' + this.extension), callback);
};

BiblesOrg.prototype.chapter = function chapter(opts, callback) {
  var query = this.serializeQuery(_(opts).omit(['version', 'book', 'chapter']).toObject());

  return nodeify(request.get(this.baseUrl + 'chapters/' + opts.version + ':' + opts.book + '.' + opts.chapter + this.extension + query), callback);
};

BiblesOrg.prototype.verses = function verses(opts, callback) {
  var query = this.serializeQuery(_(opts).omit(['version', 'book', 'chapter']).toObject());

  return nodeify(request.get(this.baseUrl + 'chapters/' + opts.version + ':' + opts.book + '.' + opts.chapter + '/verses' + this.extension + query), callback);
};

BiblesOrg.prototype.verse = function verse(opts, callback) {
  var query = this.serializeQuery(_(opts).omit(['version', 'book', 'chapter', 'verse']).toObject());

  return nodeify(request.get(this.baseUrl + 'verses/' + opts.version + ':' + opts.book + '.' + opts.chapter + '.' + opts.verse + this.extension + query), callback);
};

BiblesOrg.prototype.verseSearch = function verseSearch(opts, callback) {
  return nodeify(request.get(this.baseUrl + 'verses' + this.extension + this.serializeQuery(opts)), callback);
};

BiblesOrg.prototype.passage = function passage(opts, callback) {
  opts['q[]'] = opts['q[]'] || opts.passage;
  var query = this.serializeQuery(opts);

  return nodeify(request.get(this.baseUrl + 'passages' + this.extension + query), callback);
};

BiblesOrg.prototype.bookGroups = function bookGroups(callback) {
  return nodeify(request.get(this.baseUrl + 'bookgroups' + this.extension), callback);
};

BiblesOrg.prototype.bookGroup = function bookGroup(opts, callback) {
  var groupId = typeof opts === 'string' ? opts : opts.group;

  return nodeify(request.get(this.baseUrl + 'bookgroups/' + groupId + this.extension), callback);
};

BiblesOrg.prototype.bookGroupBooks = function bookGroupBooks(opts, callback) {
  // This is written as documented here: https://bibles.org/pages/api/documentation/books
  // but it returns a 404
  var groupId = typeof opts === 'string' ? opts : opts.group;

  return nodeify(request.get(this.baseUrl + 'bookgroups/' + groupId + '/books' + this.extension), callback);
};

BiblesOrg.prototype.tags = function tags(callback) {
  return nodeify(request.get(this.baseUrl + 'tags' + this.extension), callback);
};

BiblesOrg.prototype.tag = function tag(opts, callback) {
  var tag = typeof opts === 'string' ? opts : opts.tag;

  return nodeify(request.get(this.baseUrl + 'tags/' + encodeURI(tag) + this.extension), callback);
};

module.exports = BiblesOrg;
