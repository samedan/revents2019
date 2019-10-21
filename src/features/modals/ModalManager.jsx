import React from 'react';
import { connect } from 'react-redux';
import TestModal from './TestModal';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

const modalLookup = {
  TestModal,
  LoginModal,
  RegisterModal
};

const ModalManager = ({ currentModal }) => {
  let renderedModal;

  if (currentModal) {
    const { modalType, modalProps } = currentModal;
    const ModalComponent = modalLookup[modalType];

    renderedModal = <ModalComponent {...modalProps} />;
  }
  return <span>{renderedModal}</span>;
};

const mapsStateToProps = state => ({
  // initially null
  currentModal: state.modals
});

export default connect(mapsStateToProps)(ModalManager);
