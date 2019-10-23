import { toastr } from 'react-redux-toastr';

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
