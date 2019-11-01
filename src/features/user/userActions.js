import { toastr } from 'react-redux-toastr';
import {
  asyncActionStart,
  asyncActionFinish,
  asyncActionError
} from '../async/asyncActions';
import cuid from 'cuid';
import firebase from '../../app/config/firebase';
import { FETCH_USER_EVENTS } from '../event/eventConstants';

export const updateProfile = user => async (
  dispatch,
  getState,
  { getFirebase }
) => {
  const firebase = getFirebase();
  // filtering out the props we dont want(isLoaded,isEmpty)
  const { isLoaded, isEmpty, ...updatedUser } = user;
  try {
    await firebase.updateProfile(updatedUser);
    toastr.success('Success', 'Your profile has been updated.');
  } catch (error) {
    console.log(error);
  }
};

export const uploadProfileImage = (file, fileName) => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const imageName = cuid();
  const firebase = getFirebase();
  const firestore = getFirestore();
  const user = firebase.auth().currentUser;
  const path = `${user.uid}/user_images`;
  const options = {
    name: imageName
  };
  try {
    dispatch(asyncActionStart());
    // upload file
    let uploadedFile = await firebase.uploadFile(path, file, null, options);
    // get url of the image back
    let downloadURL = await uploadedFile.uploadTaskSnapshot.ref.getDownloadURL();
    // get userdoc
    let userDoc = await firestore.get(`users/${user.uid}`);
    // check if user has photo, if not update profile
    if (!userDoc.data().photoURL) {
      await firebase.updateProfile({
        photoURL: downloadURL
      });
      await user.updateProfile({
        photoURL: downloadURL
      });
    } else {
      // add image to firestore
      await firestore.add(
        {
          collection: 'users',
          doc: user.uid,
          subcollections: [{ collection: 'photos' }]
        },
        {
          name: imageName,
          url: downloadURL
        }
      );
      dispatch(asyncActionFinish());
    }
  } catch (error) {
    console.log(error);
    dispatch(asyncActionError());
  }
};

export const deletePhoto = photo => async (
  dispatch,
  getState,
  { getFirestore, getFirebase }
) => {
  const firebase = getFirebase();
  const firestore = getFirestore();
  const user = firebase.auth().currentUser;
  try {
    await firebase.deleteFile(`${user.uid}/user_images/${photo.name}`);
    await firestore.delete({
      collection: 'users',
      doc: user.uid,
      subcollections: [{ collection: 'photos', doc: photo.id }]
    });
  } catch (error) {
    console.log(error);
    throw new Error('Problem deleting the photo');
  }
};

export const setMainPhoto = photo => async (dispatch, getState) => {
  const firestore = firebase.firestore();
  const user = firebase.auth().currentUser;
  const today = new Date();
  let userDocRef = firestore.collection('users').doc(user.uid);
  let eventAttendeeRef = firestore.collection('event_attendee');
  try {
    dispatch(asyncActionStart());
    let batch = firestore.batch();

    batch.update(userDocRef, {
      photoURL: photo.url
    });

    let eventQuery = await eventAttendeeRef
      .where('userUid', '==', user.uid)
      .where('eventDate', '>=', today);
    // getting the Snaphot out of firebase
    let eventQuerySnap = await eventQuery.get();

    for (let i = 0; i < eventQuerySnap.docs.length; i++) {
      let eventDocRef = await firestore
        .collection('events')
        .doc(eventQuerySnap.docs[i].data().eventId);
      let event = await eventDocRef.get();
      // checkif the photos ar host or attendee
      // if HOST
      if (event.data().hostUid === user.uid) {
        batch.update(eventDocRef, {
          hostPhotoURL: photo.url,
          [`attendees.${user.uid}.photoURL`]: photo.url
        });
      } else {
        // if ATTENDEE
        batch.update(eventDocRef, {
          [`attendees.${user.uid}.photoURL`]: photo.url
        });
      }
    }
    // console.log(batch);
    await batch.commit(); // commited to firestore
    dispatch(asyncActionFinish());
  } catch (error) {
    dispatch(asyncActionError());
    throw new Error('Problem setting main photo');
  }
};

export const goingToEvent = event => async (dispatch, getState) => {
  dispatch(asyncActionStart());
  const firestore = firebase.firestore();
  const user = firebase.auth().currentUser;
  const photoURL = getState().firebase.profile.photoURL;
  const attendee = {
    going: true,
    joinDate: Date.now(), // new Date() || Date.now()
    photoURL: photoURL || '/assets/user.png',
    displayName: user.displayName,
    host: false
  };
  try {
    let eventDocRef = firestore.collection('events').doc(event.id);
    let eventAttendeeDocRef = firestore
      .collection('event_attendee')
      .doc(`${event.id}_${user.uid}`);

    await firestore.runTransaction(async transaction => {
      // 'eventDocRef' is tracked for changes
      await transaction.get(eventDocRef);
      await transaction.update(eventDocRef, {
        [`attendees.${user.uid}`]: attendee
      });
      await transaction.set(eventAttendeeDocRef, {
        eventId: event.id,
        userUid: user.uid,
        eventDate: event.date,
        host: false
      });
    });

    dispatch(asyncActionFinish());
    toastr.success('Success', 'You have signed up to the event.');
  } catch (error) {
    console.log(error);
    dispatch(asyncActionError());
    toastr.success('oops', 'Problem signing up to the event.');
  }
};

export const cancelGoingToEvent = event => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const firestore = getFirestore();
  const firebase = getFirebase();
  const user = firebase.auth().currentUser;
  try {
    // events
    await firestore.update(`events/${event.id}`, {
      [`attendees.${user.uid}`]: firestore.FieldValue.delete()
    });
    // event_attendee
    await firestore.delete(`event_attendee/${event.id}_${user.uid}`);
    toastr.success('Success', 'You have removed yourself from the event');
  } catch (error) {
    console.log(error);
    toastr.error('Oops', 'Something went wrong');
  }
};

// the Profile page, FILTER/QUERY EVENTS in Firestore
export const getUserEvents = (userUid, activeTab) => async (
  dispatch,
  getState
) => {
  dispatch(asyncActionStart());
  const firestore = firebase.firestore();
  const today = new Date(Date.now());
  let eventsRef = firestore.collection('event_attendee');
  let query;
  switch (activeTab) {
    case 1: // past events
      query = eventsRef
        .where('userUid', '==', userUid)
        .where('eventDate', '<=', today)
        .orderBy('eventDate', 'desc');
      break;
    case 2: //fitire events
      query = eventsRef
        .where('userUid', '==', userUid)
        .where('eventDate', '>=', today)
        .orderBy('eventDate');
      break;
    case 3: // hosted by the user
      query = eventsRef
        .where('userUid', '==', userUid)
        .where('host', '==', true)
        .orderBy('eventDate', 'desc');
      break;
    default:
      query = eventsRef
        .where('userUid', '==', userUid)
        .orderBy('eventDate', 'desc');
      break;
  }
  try {
    let querySnap = await query.get();
    // run the query, get the raw data 'QuerySnapshot'
    let events = [];
    for (let i = 0; i < querySnap.docs.length; i++) {
      let evt = await firestore
        .collection('events')
        .doc(querySnap.docs[i].data().eventId)
        .get();
      // after extracting the actual event data, get the new []
      events.push({ ...evt.data(), id: evt.id });
    }
    // put the refined events in State
    dispatch({ type: FETCH_USER_EVENTS, payload: { events } });

    dispatch(asyncActionFinish());
  } catch (error) {
    console.log(error);
    dispatch(asyncActionError());
  }
};

// FOLLOW User
export const followUser = userToFollow => async (
  dispatch,
  getState,
  { getFirestore }
) => {
  const firestore = getFirestore();
  const user = firestore.auth().currentUser;
  const following = {
    photoURL: userToFollow.photoURL || '/assets/user.png',
    city: userToFollow.city || 'Unknown city',
    displayName: userToFollow.displayName
  };
  try {
    await firestore.set(
      {
        collection: 'users',
        doc: user.uid,
        subcollections: [{ collection: 'following', doc: userToFollow.id }]
      },
      following
    );
  } catch (error) {
    console.log(error);
  }
};

// Un-Follow user
export const unfollowUser = userToUnfollow => async (
  dispatch,
  getstate,
  { getFirestore }
) => {
  const firestore = getFirestore();
  const user = firestore.auth().currentUser;
  try {
    await firestore.delete({
      collection: 'users',
      doc: user.uid,
      subcollections: [{ collection: 'following', doc: userToUnfollow.id }]
    });
  } catch (error) {
    console.log(error);
  }
};
