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
  case 'ADD_SCORE':
    return {
      ...state,
      score: state.score + action.score,
      assertions: state.assertions + 1,
    };
  default:
    return state;
  }
};
