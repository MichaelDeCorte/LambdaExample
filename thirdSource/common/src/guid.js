// inspired by
// https://engineering.instagram.com/sharding-ids-at-instagram-1cf5a71e5a5c
// returns a fairly large fairly random number.  

const EPOCH = 1262304000;  // 1 Jan 2010, 00:00:00 GMT
exports.generateGUID = (subID) => {
    const ts = new Date().getTime() - EPOCH; // limit to recent

    const randID = Math.floor(Math.random() * 65536);

    // TimeStamp (16 bits) : subID (8 bits) : randID (8 bits) 
    return Math.floor(
        ((ts % (256 * 256)) * 256 * 256) +
            ((subID % 256) * 256) +
            (randID % 256));
};
