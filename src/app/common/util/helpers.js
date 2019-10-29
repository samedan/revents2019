// transform the Object of attendees from firebase (...map...) to []
export const objectToArray = object => {
  if (object) {
    return Object.entries(object).map(e =>
      // first element in [] will be id
      // second element in [] will be value
      Object.assign({}, e[1], { id: e[0] })
    );
    // to new object{} is assign the value e[1] (1st object)
    // and the id {id: e[0]} (2nd object on new object)
  }
};

export const createNewEvent = (user, photoURL, event) => {
  return {
    ...event,
    hostUid: user.uid,
    hostedBy: user.displayName,
    hostPhotoURL: photoURL || '/assets/user.png',
    created: new Date(),
    attendees: {
      [user.uid]: {
        going: true,
        joinDate: new Date(),
        photoURL: photoURL || '/assets/user.png',
        displayName: user.displayName,
        host: true
      }
    }
  };
};

// Sort the comments and replies
export const createDataTree = dataset => {
  let hashTable = Object.create(null);
  dataset.forEach(a => (hashTable[a.id] = { ...a, childNodes: [] }));
  let dataTree = [];
  dataset.forEach(a => {
    if (a.parentId) {
      hashTable[a.parentId].childNodes.push(hashTable[a.id]);
    } else {
      dataTree.push(hashTable[a.id]);
    }
  });
  return dataTree;
};
