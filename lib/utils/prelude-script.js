//   ###               ##             #
//   #  #               #             #
//   #  #  ###    ##    #    #  #   ###   ##
//   ###   #  #  # ##   #    #  #  #  #  # ##
//   #     #     ##     #    #  #  #  #  ##
//   #     #      ##   ###    ###   ###   ##

// clone regexp
function cloneRegExp(pattern) {
  return new RegExp(pattern.source, (pattern.global     ? 'g' : '') +
                                    (pattern.ignoreCase ? 'i' : '') +
                                    (pattern.multiline  ? 'm' : '') +
                                    (pattern.sticky     ? 'y' : '') +
                                    (pattern.unicode    ? 'u' : ''))
}

// whitespace characters (must be trimmed)
const ws = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002' +
           '\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F' +
           '\u205F\u3000\u2028\u2029\uFEFF'

// zero width character (must not be trimmed)
const zw = '\u200b'

// validate trim function
const validTrim = ((typeof String.prototype.trim === 'function') &&
                   (ws.trim() === '') && (zw.trim() === zw))

// trim at left and at right regexpes
const ltrimReg = new RegExp('^[' + ws + '][' + ws + ']*')
const rtrimReg = new RegExp('[' + ws + '][' + ws + ']*$')

// module
const λ = module.exports = {

  //   #  #        ##
  //   #  #         #
  //   #  #   ###   #    #  #   ##    ###
  //   #  #  #  #   #    #  #  # ##  ##
  //    ##   # ##   #    #  #  ##      ##
  //    ##    # #  ###    ###   ##   ###

  // placeholder object to be used with partial application
  _: Object.create(null),

  // nil value
  nil: null,

  // returns a placeholder object, an accessible null type
  placeholder() {
    return Object.create(null)
  },

  //   ###                      ##                 #
  //    #                      #  #                #
  //    #    #  #  ###    ##   #      ###   ###   ###
  //    #    #  #  #  #  # ##  #     #  #  ##      #
  //    #     # #  #  #  ##    #  #  # ##    ##    #
  //    #      #   ###    ##    ##    # #  ###      ##
  //          #    #

  // casts to: Boolean
  toBoolean(a) {
    return λ.isBool(a) ? λ.isTrue(a) : λ.notNil(a)
  },

  //   ###                      ##   #                 #
  //    #                      #  #  #                 #
  //    #    #  #  ###    ##   #     ###    ##    ##   # #
  //    #    #  #  #  #  # ##  #     #  #  # ##  #     ##
  //    #     # #  #  #  ##    #  #  #  #  ##    #     # #
  //    #      #   ###    ##    ##   #  #   ##    ##   #  #
  //          #    #

  /* Simple Types */

  // is: b instanceof a
  is(a, b) {
    if (b instanceof a) {
      return true
    } else if (λ.isArray(b.extends)) {
      return b.extends.indexOfunc(a) > -1
    } else {
      return false
    }
  },

  // is: True
  isTrue(a) {
    return (typeof a === 'boolean') && (a === true)
  },

  // is: False
  isFalse(a) {
    return (typeof a === 'boolean') && (a === false)
  },

  // is: null
  isPlaceholder(a) {
    return ((a instanceof Object) === false)
  },

  // is: Boolean
  isBool(a) {
    return (typeof a === 'boolean')
  },

  // is: Number
  isNumber(a) {
    return (typeof a === 'number')
  },

  // is: String
  isString(a) {
    return (typeof a === 'string')
  },

  // is: Array
  isArray(a) {
    return Array.isArray(a)
  },

  // is: Object
  isObject(a) {
    if (λ.notNil(a)) {
      return a.constructor === Object
    } else {
      return false
    }
  },

  // is: Error
  isError(a) {
    return a instanceof Error
  },

  // is: Function
  isFunction(a) {
    return a instanceof Function
  },

  // is: NaN
  isNaN(n){
    if (λ.isNumber(n)) {
      return n !== n // (NaN !== NaN) === True
    } else {
      return true
    }
  },

  // not: Error
  notError(a) {
    return !λ.isError(a)
  },

  /* Composed Types */

  // is: Nil (undefined | null)
  isNil(a) {
    return (a === undefined) || (a === null) || λ.isPlaceholder(a)
  },

  // not: Nil | Error
  isValid(a) {
    if (λ.notNil(a)) {
      return λ.notError(a)
    } else {
      return false
    }
  },

  // not: Nil
  notNil(a) {
    return !λ.isNil(a)
  },

  // is: Nil | Error
  notValid(a) {
    return !λ.isValid(a)
  },

  //   ###           #    #           #     #     #
  //   #  #         # #                     #
  //   #  #   ##    #    ##    ###   ##    ###   ##     ##   ###
  //   #  #  # ##  ###    #    #  #   #     #     #    #  #  #  #
  //   #  #  ##     #     #    #  #   #     #     #    #  #  #  #
  //   ###    ##    #    ###   #  #  ###     ##  ###    ##   #  #

  // receives a variable number of arguments, the latest is always
  // a closure called with the previous arguments
  let() {
    const args = []
    let closure

    for(let i = 0, len = arguments.length - 1; i <= len; ++i) {
      if (i === len) {
        closure = arguments[i]
      } else {
        args[i] = arguments[i]
      }
    }

    return closure.apply(this, args)
  },

  // calls a function with a object that is return in the end
  expose(func) {
    const externs = {}
    externs.returns = func(externs)
    return externs
  },

  // just do it
  do() {
    let output = null

    for(let i = 0, len = arguments.length; i < len; ++i) {
      output = arguments[i]()
    }

    return output
  },

  //    ##                  #   #     #     #
  //   #  #                 #         #
  //   #      ##   ###    ###  ##    ###   ##     ##   ###    ###
  //   #     #  #  #  #  #  #   #     #     #    #  #  #  #  ##
  //   #  #  #  #  #  #  #  #   #     #     #    #  #  #  #    ##
  //    ##    ##   #  #   ###  ###     ##  ###    ##   #  #  ###

  // calls L when A is truthy and R when A is falsy
  if(a, l, r) {
    const bool = λ.toBoolean(a)
    return bool ? l(a) : (λ.isFunction(r) ? r(a) : false)
  },

  // calls L when A is falsy and R when A is truthy
  unless(a, l, r) {
    const bool = !λ.toBoolean(a)
    return bool ? l(a) : (λ.isFunction(r) ? r(a) : true)
  },

  // like a switch statement, but using closures
  cond() {
    let condition
      , clause
      , output

    for(let i = 0, len = arguments.length - 1; i <= len; ++i) {
      if ((i % 2) === 0) {
        condition = arguments[i]
      } else {
        clause = arguments[i]
        if (λ.toBoolean(condition)) {
          output = clause(condition)
          break
        }
      }
    }

    return output
  },

  // like cond, but instead of calling closures, it just returns the match
  spot() {
    let condition
      , clause
      , index

    for(let i = 0, len = arguments.length - 1; i <= len; ++i) {
      if ((i % 2) === 0) {
        condition = arguments[i]
      } else {
        clause = arguments[i]
        if (λ.toBoolean(condition)) {
          clause(condition)
          index = ((i - 1) / 2)
          break
        }
      }
    }

    return index
  },

  //   ###          #     #
  //   #  #         #     #
  //   #  #   ###  ###   ###    ##   ###   ###
  //   ###   #  #   #     #    # ##  #  #  #  #
  //   #     # ##   #     #    ##    #     #  #
  //   #      # #    ##    ##   ##   #     #  #
  //
  //   #  #         #          #      #
  //   ####         #          #
  //   ####   ###  ###    ##   ###   ##    ###    ###
  //   #  #  #  #   #    #     #  #   #    #  #  #  #
  //   #  #  # ##   #    #     #  #   #    #  #   ##
  //   #  #   # #    ##   ##   #  #  ###   #  #  #
  //                                              ###

  // returns the value of a simple match
  match(a, c, fail) {
    const test = c[a]
    return λ.notNil(test) ? test : fail
  },

  // like match, but the clauses are functions to call
  when(a, c, fail) {
    const test = c[a]
    return λ.notNil(test) ? test(a) : (λ.isFunction(fail) ? fail(a) : null)
  },

  //         ###
  //         #  #
  //         #  #  ###    ##    ##
  //         ###   #  #  #  #  #
  //    ##   #     #     #  #  #
  //    ##   #     #      ##    ##
  //

  Proc: {
    // console.log
    log: console.log.bind(console),

    // console.warn
    warn: console.warn.bind(console),

    // console.error
    error: console.error.bind(console)
  },

  //         ####
  //         #
  //         ###   #  #  ###    ##
  //         #     #  #  #  #  #
  //    ##   #     #  #  #  #  #
  //    ##   #      ###  #  #   ##

  Func: {

    // chains a value through functions, returns result
    chain() {
      let data = arguments[0]

      for(let i = 1, l = arguments.length; i < l; ++i) {
        data = arguments[i](data)
      }

      return data
    },

    // like chain, but returns a function
    pipe() {
      let funcs = []

      for(let i = 0, l = arguments.length; i < l; ++i) {
        funcs[i] = arguments[i]
      }

      return (data) => {
        for(let i = 0, l = funcs.length; i < l; ++i) {
          data = funcs[i](data)
        }
        return data
      }

    },

    // swaps the first with the last argument, supports up to 6 arguments
    flip(func) {
      const len = func.length

      if (len === 1) {
        return func
      } else if (len === 0) {
        return function(){
          let i    = 1
            , l    = arguments.length - 1
            , args = []

          // swap order
          args[0] = arguments[l]
          args[l] = arguments[0]

          // add remaining arguments
          for(; i < l; ++i) { args[i] = arguments[i] }

          // call function with flipped arguments
          return func.apply(this, args)
        }
      } else if (len === 2) {
        return function(a, b){
          return func(b, a)
        }
      } else if (len === 3) {
        return function(a, b, c){
          return func(c, b, a)
        }
      } else if (len === 4) {
        return function(a, b, c, d){
          return func(d, b, c, a)
        }
      } else if (len === 5) {
        return function(a, b, c, d, e){
          return func(e, b, c, d, a)
        }
      } else if (len === 6) {
        return function(a, b, c, d, e, f){
          return func(f, b, c, d, e, a)
        }
      } else {
        console.error("Flip has no support for arities greater than 6.")
      }
    },

    // partially applies a function, supports up to 6 arguments
    partial(func) {
      if (!λ.isFunction(func)) {
        return func
      }

      const len  = func.length
          , len2 = arguments.length - 1
          , args = []
          , need = []

      for(let i = 0; i < len; ++i) {
        const idx = i + 1

        if (idx > len2) {
          need.push(i)
        } else {
          const data = arguments[idx]
          if (data === λ._) {
            need[i] = i
          } else {
            args[i] = data
          }
        }
      }

      let left = need.length

      if (left <= 0) {
        return func.apply(this, args)
      } else if (left === 1) {
        return function(a) {
          args[need[0]] = a
          return func.apply(this, args)
        }
      } else if (left === 2) {
        return function(a, b) {
          args[need[0]] = a
          args[need[1]] = b
          return func.apply(this, args)
        }
      } else if (left === 3) {
        return function(a, b, c) {
          args[need[0]] = a
          args[need[1]] = b
          args[need[2]] = c
          return func.apply(this, args)
        }
      } else if (left === 4) {
        return function(a, b, c, d) {
          args[need[0]] = a
          args[need[1]] = b
          args[need[2]] = c
          args[need[3]] = d
          return func.apply(this, args)
        }
      } else if (left === 5) {
        return function(a, b, c, d, e) {
          args[need[0]] = a
          args[need[1]] = b
          args[need[2]] = c
          args[need[3]] = d
          args[need[4]] = e
          return func.apply(this, args)
        }
      } else if (left === 6) {
        return function(a, b, c, d, e, f) {
          args[need[0]] = a
          args[need[1]] = b
          args[need[2]] = c
          args[need[3]] = d
          args[need[4]] = e
          args[need[5]] = f
          return func.apply(this, args)
        }
      } else {
        console.error("Partial has no support for arities greater than 6.")
      }
    },

    // calls F when A is not nil
    maybe(a, func) {
      return (λ.notNil(a)) ? func(a) : null
    },

    // calls F with R, defaults to L when R is nil
    either(l, r, func) {
      return λ.notNil(r) ? func(r) : func(l)
    },

    // calls F a value or null, value is the last value from XS that is not nil
    option(xs, func) {
      let value = null

      for(let i = xs.length; i > 0; ++i) {
        let data = xs[i]
        if (λ.notNil(data)) {
          value = data
          break
        }
      }

      return func(value)
    }
  },

  //         #      #            #
  //         #                   #
  //         #     ##     ###   ###
  //         #      #    ##      #
  //    ##   #      #      ##    #
  //    ##   ####  ###   ###      ##

  List: {

    // applies function to list
    map(xs, func) {
      let output = []

      for(let i=0, l=xs.length; i < l; ++i) {
        output[i] = λ.partial(func, xs[i])
      }

      return output
    },

    // transforms a list using a function, left to right, needs initial value
    reduce(xs, output, func) {
      for(let i=0, l=xs.length; i < l; ++i) {
        output = λ.partial(func, output, xs[i])
      }

      return output
    },

    // transforms a list using a function, right to left, needs initial value
    reduceR(xs, output, func) {
      for(let i=xs.length; i >= 0; --i) {
        output = λ.partial(func, output, xs[i])
      }

      return output
    },

    // transforms a list using a function, left to right
    fold(xs, func) {
      let output = xs[0]

      for(let i=1, l=xs.length; i < l; ++i) {
        output = λ.partial(func, output, xs[i])
      }

      return output
    },

    // transforms a list using a function, right to left
    foldR(xs, func) {
      const len = xs.length - 1
      let output = xs[len]

      for(let i=(len - 1); i >= 0; --i) {
        output = λ.partial(func, output, xs[i])
      }

      return output
    },

    // filters a list using a function
    filter(xs, func) {
      let output = []

      for(let i=0, l=xs.length; i < l; ++i) {
        const data = xs[i]

        if (λ.toBoolean(λ.partial(func, data))) {
          output.push(data)
        }
      }

      return output
    },

    // flattens a list, no recursion is use
    flatten(xs){
      const walk = []
          , out  = []

      let curr = xs
        , len  = xs.length
        , idx  = 0
        , wlen = 0

      while (wlen > -1){
        let item = curr[idx]

        if (item instanceof Array) {
          walk.push(idx+1)
          wlen++
          curr = item
          len  = curr.length
          idx  = 0
        } else {
          out.push(item)
          idx++

          while (idx == len) {
            idx = walk.pop()
            wlen--
            curr = this
            for (let i = 0; i < wlen; ++i) {
              curr = curr[walk[i]-1]
            }
            len = curr.length
          }
        }
      }
      return out
    },

    // applies a function N times, applying the current try to the function,
    // returns a list of outputs
    // returns a
    times(n, func) {
      const output = []

      for(let i = 0; i < n; ++i) {
        ouput[i] = func(i)
      }

      return output
    }
  },

  //         ###    #           #
  //         #  #               #
  //         #  #  ##     ##   ###
  //         #  #   #    #      #
  //    ##   #  #   #    #      #
  //    ##   ###   ###    ##     ##

  Dict: {

    // returns dictionary keys
    keys: Object.keys

  },

  //         #  #
  //         ## #
  //         ## #  #  #  # #
  //         # ##  #  #  ####
  //    ##   # ##  #  #  #  #
  //    ##   #  #   ###  #  #

  Num: {

    even(n) {
      return ((n % 2) === 0)
    },

    odd(n) {
      return ((n % 2) === 1)
    },

    sum(x, y) {
      return x + y
    },

    sub(x, y) {
      return x - y
    },

    mult(x, y) {
      return x * y
    },

    div(x, y) {
      return x / y
    },

    rem(x, y) {
      return x % y
    },

    mod(x, y) {
      return ((x % y) + y) % y
    },

    recip(n) {
      return 1 / n
    },

    quot(x, y) {
      return ~~(x / y)
    },

    negate(n){
      return -n
    },

    max(x, y) {
      return x > y ? x : y
    },

    min(x, y) {
      return x < y ? x : y
    },

    truncate(n) {
      return ~~n
    },

    lcm(x, y) {
      return Math.abs(Math.floor(x / gcd(x, y) * y))
    },

    signum(n) {
      if (n === 0) {
        return 0
      }

      return (n < 0) ? -1 : 1
    },

    gcd(x, y) {
      x = Math.abs(x)
      y = Math.abs(y)

      while (y !== 0) {
        let z = x % y
        x = y
        y = z
      }

      return x
    },

    pi:    Math.PI,
    tau:   Math.PI * 2,
    exp:   Math.exp,
    sqrt:  Math.sqrt,
    ln:    Math.log,
    sin:   Math.sin,
    tan:   Math.tan,
    cos:   Math.cos,
    asin:  Math.asin,
    acos:  Math.acos,
    atan:  Math.atan,
    atan2: Math.atan2,
    round: Math.round,
    ceil:  Math.ceil,
    floor: Math.floor,
    abs:   Math.abs,
    pow:   Math.pow,
    sqrt:  Math.sqrt,
  },

  //          ##    #
  //         #  #   #
  //          #    ###   ###
  //           #    #    #  #
  //    ##   #  #   #    #
  //    ##    ##     ##  #

  Str: {

    join(sep, xs) {
      return xs.join(sep)
    },

    prefix(a, b) {
      return a + b
    },

    suffix(a, b) {
      return b + a
    },

    repeat(str, n) {
      str = λ.isString(str) ? str : str.toString()
      n   = λ.isNaN(n) ? 0 : λ.ceil(n)

      if (n === 0) {
        return ''
      }

      let output = ''

      for(let i = 0; i < n; ++i) {
        output = output + str
      }

      return output
    },

    split(str, a) {
      return str.split(a)
    },

    lines(str) {
      if (str.length === 0) {
        return []
      }

      return str.split('\n')
    },

    words(str) {
      if (str.length === 0) {
        return []
      }

      return str.split(/[ ]+/)
    },

    unwords(str) {
      return str.join(' ')
    },

    chars(str) {
      return str.split('')
    },

    unchars(str) {
      return str.join('')
    },

    reverse(str) {
      return str.split('').reverse().join('')
    },

    toLower(str) {
      return str.toLowerCase()
    },

    toUpper(str) {
      return str.toUpperCase()
    },

    replace(str, reg, rep) {
      return str.replace(reg, rep)
    },

    capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    },


    camelize(str) {
      return str.replace(
        /[-_]+(.)?/g,
        (arg, c) => (λ.isNil(c) ? '' : c).toUpperCase()
      )
    },

    dasherize(str) {
      return str.replace(
        /([^-A-Z])([A-Z]+)/g,
        (arg, lower, upper) =>
          (lower + '-' + (upper.length) > 1) ? upper
                                             : upper.toLowerCase()
      ).replace(
        /^([A-Z]+)/,
        (arg, upper) => (upper.length > 1) ? upper + '-'
                                           : upper.toLowerCase()
      )
    },

    match(str, reg) {
      let out = str.match(reg)
      return λ.isNil(out) ? [] : out
    },

    test(str, reg) {
      return cloneRegExp(reg).test(str)
    },

    trimL(str) {
      return str.replace(ltrimReg, '')
    },

    trimR(str) {
      return str.replace(rtrimReg, '')
    },

    // fastest trim available
    trim: (validTrim ? (str => str.trim()) : (str => λ.trimR(λ.trimL(str))))
  }
}

//    ##   ##     #
//   #  #   #
//   #  #   #    ##     ###   ###    ##    ###
//   ####   #     #    #  #  ##     # ##  ##
//   #  #   #     #    # ##    ##   ##      ##
//   #  #  ###   ###    # #  ###     ##   ###

// func
λ.chain   = λ.Func.chain
λ.pipe    = λ.Func.pipe
λ.flip    = λ.Func.flip
λ.partial = λ.Func.partial
λ.maybe   = λ.Func.maybe
λ.either  = λ.Func.either
λ.option  = λ.Func.option

// list
λ.map     = λ.List.map
λ.reduce  = λ.List.reduce
λ.fold    = λ.List.fold
λ.filter  = λ.List.filter
λ.flatten = λ.List.flatten
λ.times   = λ.List.times
λ.reduceR = λ.List.reduceR
λ.foldR   = λ.List.foldR

// dict
λ.keys = λ.Dict.keys

// num (done)
λ.even     = λ.Num.even
λ.odd      = λ.Num.odd
λ.sum      = λ.Num.sum
λ.sub      = λ.Num.sub
λ.mult     = λ.Num.mult
λ.div      = λ.Num.div
λ.rem      = λ.Num.rem
λ.mod      = λ.Num.mod
λ.recip    = λ.Num.recip
λ.quot     = λ.Num.quot
λ.negate   = λ.Num.negate
λ.max      = λ.Num.max
λ.min      = λ.Num.min
λ.truncate = λ.Num.truncate
λ.lcm      = λ.Num.lcm
λ.signum   = λ.Num.signum
λ.gcd      = λ.Num.gcd
λ.pi       = λ.Num.pi
λ.tau      = λ.Num.tau
λ.exp      = λ.Num.exp
λ.sqrt     = λ.Num.sqrt
λ.ln       = λ.Num.ln
λ.sin      = λ.Num.sin
λ.tan      = λ.Num.tan
λ.cos      = λ.Num.cos
λ.asin     = λ.Num.asin
λ.acos     = λ.Num.acos
λ.atan     = λ.Num.atan
λ.atan2    = λ.Num.atan2
λ.round    = λ.Num.round
λ.ceil     = λ.Num.ceil
λ.floor    = λ.Num.floor
λ.abs      = λ.Num.abs
λ.pow      = λ.Num.pow

// str (done)
λ.join       = λ.Str.join
λ.prefix     = λ.Str.prefix
λ.suffix     = λ.Str.suffix
λ.split      = λ.Str.split
λ.lines      = λ.Str.lines
λ.words      = λ.Str.words
λ.unwords    = λ.Str.unwords
λ.chars      = λ.Str.chars
λ.unchars    = λ.Str.unchars
λ.toLower    = λ.Str.toLower
λ.toUpper    = λ.Str.toUpper
λ.replace    = λ.Str.replace
λ.capitalize = λ.Str.capitalize
λ.camelize   = λ.Str.camelize
λ.dasherize  = λ.Str.dasherize
λ.test       = λ.Str.test
λ.trimL      = λ.Str.trimL
λ.trimR      = λ.Str.trimR
λ.trim       = λ.Str.trim
λ.charAt     = λ.Str.charAt
λ.repeatSt   = λ.Str.repeat
λ.reverseStr = λ.Str.reverse
λ.matchStr   = λ.Str.match

//    # #   # #   # #   # #   # #   # #   # #   # #   # #   # #   # #   # #
//   # #   # #   # #   # #   # #   # #   # #   # #   # #   # #   # #   # #

