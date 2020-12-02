const utils = require('../components/utils');


const rawData = [
  {
      _id: '5fb91ef4a75df917718cd3ff',
      posX: 110,
      posY: 100,
      name: "Big Peach",
      brand: "Sunkist",
      category: "Fruit",
      price: 3.99,
      imageURL: 'https://shopit-item-images.s3-us-west-2.amazonaws.com/peach.png'
  },
  {
      _id: '5fb91ef4a75df917718cd3fz',
      posX: 110,
      posY: 110,
      name: "Garden Peach",
      brand: "Garden of Eden",
      category: "Fruit",
      price: 6.99,
      imageURL: 'https://shopit-item-images.s3-us-west-2.amazonaws.com/peach.png'
  },
  {
      _id: '5fb91ef4a75df917718cd3fq',
      posX: 110,
      posY: 90,
      name: "Thicc Peach",
      brand: "Homegrown",
      category: "Fruit",
      price: 10.99,
      imageURL: 'https://shopit-item-images.s3-us-west-2.amazonaws.com/peach.png'
  },
  {
      _id: '5fb91efe6697712645c5ca8f',
      posX: 110,
      posY: 124,
      name: "Small Peach",
      brand: "Trader Joe's",
      category: "Fruit",
      price: 6.99,
      imageURL: 'https://shopit-item-images.s3-us-west-2.amazonaws.com/peach.png'
  },
  {
      _id: '5fb91f1727849d4eb446c8fe',
      posX: 110,
      posY: 148,
      name: "Juicy Peach",
      brand: "Minute Maid",
      category: "Fruit",
      price: 5.99,
      imageURL: 'https://shopit-item-images.s3-us-west-2.amazonaws.com/peach.png'
  },
  {
      _id: '5fb91f214b8c5dd70ce5b57e',
      posX: 300,
      posY: 105,
      name: "Healthy Apple",
      brand: "Signature",
      category: "Fruit",
      price: 2.99,
      imageURL: 'https://lh3.googleusercontent.com/proxy/Y-SKDCNcvBVEtbPntgj9Ehitr28Wagbg5nOk1ZakpLaIcOzuRNRFUYXxWDNVUBwoDIA7HkaSf4LaQlRHwV0om_vy'
  },
  {
      _id: '5fb91f28301528be1054d9b1',
      posX: 197,
      posY: 400,
      name: "Rotten Peach",
      brand: "No Name",
      category: "Fruit",
      price: 1.99,
      imageURL: 'https://shopit-item-images.s3-us-west-2.amazonaws.com/peach.png'
  }
]
/*
Feasible jest testing could testing all the methods in utils.js

- For now, testing react components is not working possibly compiling issues.
*/

describe('Utils tests', () => {
  test('itemDistance - euclidean distance between 2 items', () => {
    const result = utils.itemDistance(rawData[0], rawData[1]);
    expect(result).toBe(10);
  });
  
  test('clusterItems - no items to cluster', () =>{
    const pinSize = 20;
    const results = utils.clusterItems([], pinSize);
    expect(results).toEqual([]);
  });

  test('clusterItems - contains multiple items to cluster', () =>{
    const pinSize = 20;
    const results = utils.clusterItems(rawData, pinSize);
    let clusters = []
    //count the size of each cluster
    for(let i = 0; i < results.length; i++){
      clusters.push(results[i].cluster.length);
    }

    expect(clusters).toEqual([3,1,1,1,1]);
  });

  test('removeItemFromClusters - no clusters with valid item', () => {
    const pinSize = 20;
    const item = {
      _id: '5fb91ef4a75df917718cd3fz',
      xPos: 110,
      yPos: 110,
      name: "Garden Peach",
      brand: "Garden of Eden",
      category: "Fruit",
      price: 6.99,
      imageURL: 'https://shopit-item-images.s3-us-west-2.amazonaws.com/peach.png'
    };
    const result = utils.removeItemFromClusters([], item);
    expect(result).toEqual([]);
  });

  test('removeItemFromClusters - contains multiple clusters and valid item', () => {
    const pinSize = 20;
    const results = utils.clusterItems(rawData, pinSize);

    const item = {
      _id: '5fb91ef4a75df917718cd3fz',
      xPos: 110,
      yPos: 110,
      name: "Garden Peach",
      brand: "Garden of Eden",
      category: "Fruit",
      price: 6.99,
      imageURL: 'https://shopit-item-images.s3-us-west-2.amazonaws.com/peach.png'
    };
    const updatedResults = utils.removeItemFromClusters(results,item);
    let clusters = []
    for(let i = 0; i < updatedResults.length; i++){
      clusters.push(updatedResults[i].cluster.length);
    }

    expect(clusters).toEqual([2,1,1,1,1]);

  });

  test('scaleItemPositions', () => {
    const mapHeight = 100;
    const imageHeight = 50;
    let rawDataCopy = JSON.parse(JSON.stringify(rawData));
    const scaled  = utils.scaleItemPositions(rawDataCopy, mapHeight, imageHeight);
    let results = []
    let inputFiltered = []
    for(let i = 0; i < scaled.length; i++){
      results.push({posX: scaled[i].posX, posY: scaled[i].posY});
    }
    const multiplier = mapHeight / imageHeight;
    for(let i =0; i < rawData.length; i++){
      inputFiltered.push({posX: rawData[i].posX * multiplier, posY: rawData[i].posY * multiplier})
    } 

    expect(inputFiltered).toEqual(results);

  });

});