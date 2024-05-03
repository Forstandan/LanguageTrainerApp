export const Reducer = (state, action) => {
    switch (action.type) {
      case "LOGIN":
        return {
          ...state,
          auth: {
            id: action.payload.auth.uid,
            username: action.payload.auth.displayName,
            email: action.payload.auth.email,
          },
          user: action.payload.user,
        };
      case "UPDATE_USER":
        return {
          ...state,
          auth: {
            username: action.payload.username,
            email: action.payload.email,
          },
          user: {
            username: action.payload.username,
            email: action.payload.email,
          },
        };
      case "LOAD_USERS":
        return {
          ...state,
          users: action.payload,
        };
      case "LOAD_CHATS":
        return {
          ...state,
          chats: action.payload,
        };
      case "SET_CURRENT_CHAT":
        return {
          ...state,
          currentChat: action.payload,
        };
      case "LOGOUT":
        return {
          ...state,
          auth: null,
          user: null,
        };
      default:
        return state;
    }
  };