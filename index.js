const { ApolloServer } = require('apollo-server');
const gql = require('graphql-tag');
const mongoose = require('mongoose');




const { MONGODB } = require('./config.js');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers/index');

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req }), // now context will store the request header sent by user for decoding the token 
});

mongoose.connect(MONGODB, { useNewUrlParser: true })
    .then(() => {
        console.log("Connected to database");
        return server.listen({ port: 3000 });
    })
    .then(res => {
        console.log(`Server running at ${res.url}`)
    });



