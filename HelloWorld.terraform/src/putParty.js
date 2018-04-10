exports.handler = (event, context, callback) => {
    console.log(event);
    callback(null, String.prototype.concat('Lambda, ', event.message));
};
