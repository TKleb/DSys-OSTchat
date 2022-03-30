function hashCode(nameToHash) {
    let hash = 0
    for (let i = 0, h = 0; i < nameToHash.length; i++)
        hash = Math.imul(31, h) + nameToHash.charCodeAt(i) | 0;
    return hash;
}



