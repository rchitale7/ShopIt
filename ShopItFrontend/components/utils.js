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
        Math.pow(Math.abs(item1.xPos - item2.xPos), 2) + 
        Math.pow(Math.abs(item1.yPos - item2.yPos), 2));
}

/**
 * Merges items which have similar locations together into one array
 * 
 * @param {Array} items Array of items
 * @param {Number} clusterRadius Radius within which all items will be clustered
 * 
 * @returns {Array} Array of item clusters, each cluster with its own central
 *                  xPos and yPos
 */
const clusterItems = (items, clusterRadius) => {
    let included = new Set(); // Keeps track of items that have been used
    let res = []

    for (let i = 0; i < items.length; i++) {
        if (!included.has(i)) {
            included.add(i);
            let currCluster = [items[i]];
            let { _id, xPos, yPos } = items[i]

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
                "xPos": xPos,
                "yPos": yPos,
                "cluster": currCluster
            });
        }
    }

    return res;
}

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

module.exports.itemDistance = itemDistance;
module.exports.clusterItems = clusterItems;
module.exports.removeItemFromClusters = removeItemFromClusters;