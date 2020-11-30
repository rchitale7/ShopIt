const _ = require('lodash');

/**
 * Return the euclidean distance between two items
 * 
 * @param {Object} item1 First item
 * @param {Object} item2 Second item
 * 
 * @returns {Number} Distance between two items
 */
const itemDistance = (item1, item2) => {
    return Math.sqrt(
        Math.pow(Math.abs(item1.posX - item2.posX), 2) + 
        Math.pow(Math.abs(item1.posY - item2.posY), 2));
}

/**
 * Merges items which have similar locations together into one array
 * 
 * @param {Array} items Array of items
 * @param {Number} clusterRadius Radius within which all items will be clustered
 * 
 * @returns {Array} Array of item clusters, each cluster with its own central
 *                  posX and posY
 */
const clusterItems = (items, clusterRadius) => {
    let included = new Set(); // Keeps track of items that have been used
    let res = []

    for (let i = 0; i < items.length; i++) {
        if (!included.has(i)) {
            included.add(i);
            let currCluster = [items[i]];
            let { _id, posX, posY } = items[i]

            for (let j = i + 1; j < items.length; j++) {
                if (!included.has(j)) {
                    if (itemDistance(items[i], items[j]) <= clusterRadius) {
                        included.add(j);
                        currCluster.push(items[j]);
                    }
                }
            }
            
            // We add _id to because apparently React uses keys to track changes
            res.push({
                "_id": _id,
                "posX": posX,
                "posY": posY,
                "cluster": currCluster
            });
        }
    }

    return res;
}

/**
 * Recursively removes an array from a list of clusters and returns new array. 
 * The original array is not altered.
 * 
 * @param {Array} clusters Array of clusters from which to remove an item
 * @param {Object} item Item to be removed
 * 
 * @returns {Array} Array of clusters wit item removed
 */
const removeItemFromClusters = (clusters, item) => {
    let res = _.cloneDeep(clusters);

    for (let i = 0; i < res.length; i++) {
        let cluster = res[i].cluster;
        for (let j = 0; j < cluster.length; j++) {
            if (cluster[j]._id == item._id) {
                res[i].cluster.splice(j, 1);
                return res;
            }
        }
    }

    // Should be returned prior, but just in case something messes up
    return res;
}

/**
 * Scale the x and y positional values by the ratio mobile map height to actual
 * image height ratio
 * 
 * @param {Array} items Array of items
 * @param {Number} mapHeight Desired height of pinchable map region
 * @param {Number} imageHeight Actual height of image
 */
const scaleItemPositions = (items, mapHeight, imageHeight) => {
    let ratio = mapHeight/imageHeight;

    for (let i = 0; i < items.length; i++) {
        items[i].posX = items[i].posX * ratio;
        items[i].posY = items[i].posY * ratio
    }

    return items;
}

module.exports.itemDistance = itemDistance;
module.exports.clusterItems = clusterItems;
module.exports.removeItemFromClusters = removeItemFromClusters;
module.exports.scaleItemPositions = scaleItemPositions;