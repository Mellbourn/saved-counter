import React from "react";
import "./App.css";
import { ApolloError, gql } from "apollo-boost";
import { useQuery, useMutation } from "@apollo/react-hooks";

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

  return (
    <div className="App">
      <header className="App-header">
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
