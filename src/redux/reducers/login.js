import { SAVE_INFO_USER } from '../actions';

const INITIAL_STATE = {
  name: '',
  assertions: 0,
  score: 0,
  gravatarEmail: '',
};

export const userInfo = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case SAVE_INFO_USER:
    return {
      ...state,
      name: action.infoUser.name,
      gravatarEmail: action.infoUser.emailGravatar,
    };
  default:
    return state;
  }
};
