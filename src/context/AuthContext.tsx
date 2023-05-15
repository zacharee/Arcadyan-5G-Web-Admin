import React, { createContext, useState } from "react";
// createContext is used to create a new context

export interface UserContext {
  user: User;
  setUser: (User) => void;
}

export interface User {
  token: string;
  password: string;
}

export const AuthContext = createContext<UserContext>({
  user: {
    token: null,
    password: null,
  },
  setUser: (_) => {},
});
// AppContext is the name of my context and can be renamed

export const AuthProvider = (props) => {
  const [user, setUser] = useState<User>(null);

  return (
    // Whatever we pass into value will be available throughout your app
    <AuthContext.Provider value={{ user, setUser: (u) => {setUser(u)} }}>
      {props.children}
    </AuthContext.Provider>
  );
};
