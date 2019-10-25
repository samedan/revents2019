export const userDetailedQuery = ({ auth, userUid }) => {
  if (userUid !== null) {
    return [
      {
        collection: 'users',
        doc: userUid,
        storeAs: 'profile'
      },
      {
        collection: 'users',
        doc: userUid,
        subcollections: [{ collection: 'photos' }],
        storeAs: 'photos'
      }
    ];
  } else {
    // find if the user has photos in the DBB
    return [
      {
        collection: 'users',
        doc: auth.uid,
        subcollections: [{ collection: 'photos' }],
        storeAs: 'photos'
      }
    ];
  }
};
