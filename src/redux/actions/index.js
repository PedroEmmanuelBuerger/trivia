export const SAVE_INFO_USER = 'SAVE_INFO_USER';
export const SAVE_TOKEN = 'SAVE_TOKEN';
export const ADD_SCORE = 'ADD_SCORE';

export const saveInfoUser = (infoUser) => ({
  type: SAVE_INFO_USER,
  infoUser,
});

export const saveToken = (token) => ({
  type: SAVE_TOKEN,
  token,
});

export function AddToken() {
  const api = 'https://opentdb.com/api_token.php?command=request';
  return (dispatch) => fetch(api)
    .then((response) => response.json())
    .then((token) => console.log(dispatch(saveToken(token))));
}

export const addScore = (score) => ({
  type: ADD_SCORE,
  score,
});
