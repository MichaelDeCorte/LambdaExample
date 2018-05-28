/* eslint-disable */
function func1(event, context, callback) {
    event.mapPre = 'mapPre';
    console.log('mapPre');
    return { event, context, callback };
}

module.exports = func1;
