import React, { useState } from "react";
import "./App.css";
import { ApolloError, gql } from "apollo-boost";
import { useQuery, useMutation } from "@apollo/react-hooks";
import {
  GoogleLogin,
  GoogleLoginResponseOffline,
  GoogleLoginResponse,
  GoogleLogout
} from "react-google-login";

const GET_COUNTERS = gql`
  query Counters {
    counters {
      name
      value
    }
  }
`;

const INCREASE = gql`
  mutation {
    increase
  }
`;

const DECREASE = gql`
  mutation {
    decrease
  }
`;

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const {
    data,
    loading,
    error
  }: { data: any; loading: boolean; error?: ApolloError } = useQuery(
    GET_COUNTERS
  );

  const [increase] = useMutation(INCREASE, {
    update(cache, { data: { increase } }) {
      cache.writeQuery({
        query: GET_COUNTERS,
        data: {
          counters: [
            { name: "default", value: increase, __typename: "Counter" }
          ]
        }
      });
    }
  });

  const [decrease] = useMutation(DECREASE, {
    update(cache, { data: { decrease } }) {
      cache.writeQuery({
        query: GET_COUNTERS,
        data: {
          counters: [
            { name: "default", value: decrease, __typename: "Counter" }
          ]
        }
      });
    }
  });

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    console.log("error", error);
    return <h2>Error: {error.message}</h2>;
  }

  const onSuccess: (
    response: GoogleLoginResponse | GoogleLoginResponseOffline
  ) => void = () => setIsLoggedIn(true);

  const onFailure: (error: any) => void = error => {
    setIsLoggedIn(false);
    console.log(`failed to log in, error: ${error}`);
  };

  const onLogoutSuccess = () => setIsLoggedIn(false);

  return (
    <div className="App">
      {isLoggedIn ? (
        <GoogleLogout
          clientId="964149166585-0308rmbkkfgrvgcekis3lipbe7o0om40.apps.googleusercontent.com"
          onLogoutSuccess={onLogoutSuccess}
        ></GoogleLogout>
      ) : (
        <GoogleLogin
          clientId="964149166585-0308rmbkkfgrvgcekis3lipbe7o0om40.apps.googleusercontent.com"
          onSuccess={onSuccess}
          onFailure={onFailure}
        ></GoogleLogin>
      )}

      <header className="App-header">
        <div>{isLoggedIn ? "Logged in" : "not logged in"}</div>
        {data.counters.map(
          ({ name, value }: { name: string; value: number }) => (
            <div key={name}>
              {name}: {value}
            </div>
          )
        )}
        <span>
          <button onClick={() => decrease()}>-</button>
          <button onClick={() => increase()}>+</button>
        </span>
      </header>
    </div>
  );
};

export default App;
