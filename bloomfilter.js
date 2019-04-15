/**
 * Bloomfilter implementation using Murmurhash3, hashing 7 times.
 * 
 * @author spelgubbe
 * @see http://github.com/spelgubbe/bloomfilter-js
 * 
 * @param {number} load Number of elements
 * @param {number} errorRate Percentage of false positives
 */

class BloomFilter {

  // TODO: make it scale up automatically

  /**
   * Initialize an instance of the Bloomfilter class
   */
  constructor (load, errorRate) {
    // math from https://hur.st/bloomfilter/
    var capacity = Math.ceil((load * Math.log(errorRate)) / Math.log(1 / Math.pow(2, Math.log(2))))
    this.bloomfilter = new Array(capacity)
    this.nInserts = 0
  }

  static get N_HASHES () {
    return 7
  }

  insertElement (element) {
    for (var i = 0; i < BloomFilter.N_HASHES; i++) {
      var hash = murmurhash3(element, i)
      var index = hash % this.bloomfilter.length
      this.bloomfilter[index] = true
    }
    this.nInserts++
    return true
  }

  /**
   * Check if a string MAY exist in the set.
   * 
   * @param {*} string Some ASCII string
   */
  contains (string) {
    for (var i = 0; i < BloomFilter.N_HASHES; i++) {
      var hash = murmurhash3(string, i)
      var index = hash % this.bloomfilter.length
      if (this.bloomfilter[index] !== true) {
        return false
      }
    }
    return true
  }

  /**
   * Add either a single string or multiple strings to the bloomfilter
   * 
   * @param {String, Array(String)} object String(s) to add to the bloomfilter.
   */
  insert (object) {
    if (object instanceof Array) {
      for (var i = 0; i < object.length; i++) {
        this.insertElement(object[i], this.bloomfilter)
      }
      return true
    } else {
      return this.insertElement(object)
    }
  }
}
