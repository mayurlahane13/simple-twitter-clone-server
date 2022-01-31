const { AuthenticationError, UserInputError } = require('apollo-server');
const Post = require('../../models/Post');
const User = require('../../models/User');
const checkAuth = require('../../util/checkAuth');

module.exports = {
    Mutation: {
        async createComment(_, { postId, body }, context) {
            const { username } = checkAuth(context);
            if (body.trim() === '') {
                throw new UserInputError('Comment cannot be empty', {
                    errors: {
                        body: 'Comment cannot be empty'
                    }
                });
            }
            const post = await Post.findById(postId);
            console.log(post);
            if (post) {
                post.comments.unshift({
                    body,
                    username,
                    createdAt: new Date().toISOString()
                });
                await post.save();
                return post;
            }
            throw new UserInputError('Post not found');
        },
        async deleteComment(_, { postId, commentId }, context) {
            const { username } = checkAuth(context);
            // try {
            const post = await Post.findById(postId);
            if (post) {
                const commentIndex = post.comments.findIndex(comment => comment.id === commentId);
                if (commentIndex === -1) {
                    throw new UserInputError('Comment not found');
                }
                if (post.comments[commentIndex].username === username) {
                    post.comments.splice(commentIndex, 1);
                    await post.save();
                    return post;
                } else {
                    throw new AuthenticationError('Comment cannot be deleted');
                }
            }
            throw new UserInputError('Post not found');
            // } catch (err) {
            //     throw new UserInputError('Post not found');
            // }
        }
    }
};