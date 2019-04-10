let class2type = {}
'Array Date RegExp Object Error'.split(' ').forEach(e => class2type['[object ' + e + ']'] = e.toLowerCase())

function type(obj) {
    if (obj == null) return String(obj)
    return typeof obj === 'object' ? class2type[Object.prototype.toString.call(obj)] || 'object' : typeof obj
}
