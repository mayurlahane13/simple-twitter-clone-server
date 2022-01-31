const { gql } = require('apollo-server');

module.exports = gql`
    type Post {
        id: ID!
        body: String!
        username: String!
        createdAt: String!
        comments: [Comment]!
        likes: [Like]!
        likeCount: Int!
        commentCount: Int!
    },
    type Query {
        getPosts: [Post]
        getPost(postId: ID!): Post
    },
    input RegisterInput { 
        username: String!
        password: String!
        confirmPassword: String!
        email: String!
    },
    type User {
        id: ID!
        token: String!
        username: String!
        email: String!
        password: String! 
        createdAt: String!
    },
    type Comment {
        id: ID!
        body: String!
        createdAt: String!
        username: String!
    }, 
    type Like {
        id: ID!
        username: String!
        createdAt: String!
    }
    type Mutation {
        register(registerInput: RegisterInput): User!
        login(username:String!, password:String!): User!
        createPost(body: String!): Post!
        deletePost(postId: ID!): String! 
        createComment(postId: ID!, body: String!): Post!
        deleteComment(postId: ID!, commentId: ID!): Post!
        likePost(postId: ID!): Post! 
    }
`; 