const {graphql} = require('graphql');
const schema = require('./query')

function main(query = '{}') {
    return new Promise((resolve, reject) => {
        graphql(schema, query).then(({data}) => resolve(data));
    })
}

module.exports = main;
