export const initialState = {
  openSideBar: false,
};

export const AppReducer = (state, action) => {
  switch (action.type) {
    case 'openSideBar':
      return { ...state, openSideBar: true };
    case 'closeSideBar':
      return { ...state, openSideBar: false };
    default:
      return state;
  }
};
