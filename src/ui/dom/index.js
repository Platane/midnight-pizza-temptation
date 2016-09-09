const create = ( className, type ) => {
    const dom = document.createElement( type || 'div')
    dom.setAttribute('class', className )
    return dom
}

module.exports = { create }
