function getMeta(url) {
    return new Promise((resolve, reject) => {
        let img = new Image();

        img.onload = () => resolve(img);
        img.onerror = () => reject();
        img.src = url;
    });
}

function getRemoteImageDimensions(uri) {
    return getMeta(uri)
        .then((img) => {
            let w = img.width;
            let h = img.height; 

            return { 'width': w, 'height': h };
        })
        .catch(() => {
            throw new Error('Could not load image');
        })
}

module.exports.getRemoteImageDimensions = getRemoteImageDimensions;