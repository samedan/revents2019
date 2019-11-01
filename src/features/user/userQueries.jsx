import { useRouteMatch } from 'react-router';

export const userDetailedQuery = ({ auth, userUid, match }) => {
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
      },
      {
        collection: 'users',
        doc: auth.uid,
        subcollections: [{ collection: 'following', doc: match.params.id }],
        storeAs: 'following'
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
