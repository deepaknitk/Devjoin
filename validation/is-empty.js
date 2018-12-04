const isEmpty = (value) => {
    if(value === undefined || 
        value === null || 
        (typeof(value) === 'object' && Object.keys(value).length === 0) ||
        (typeof(value) === 'string' && value.length === 0)) 
        return true
    else return false

}

module.exports = isEmpty;