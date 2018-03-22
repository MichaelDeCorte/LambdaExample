exports.handler = (event, context, callback) => {
    callback(null, String.prototype.concat('Lambda, ', event.message));
};
