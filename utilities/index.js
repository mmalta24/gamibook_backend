exports.generateDate = () => {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
}

exports.cleanEmptyObjectKeys = (obj) => {
    for (let propName in obj) {
        if (
            obj[propName] === null ||
            obj[propName] === undefined ||
            obj[propName] === ""
        ) {
            delete obj[propName];
        }
    }
    return obj;
};

exports.trimObjectStrings = (obj) => {
    const newObj = {};

    for (const [key, value] of Object.entries(obj)) {
        newObj[key] = typeof value === "string" ? value.trim() : value
    }

    return newObj;
}