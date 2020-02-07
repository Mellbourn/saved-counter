import React from "react";
import "./App.css";
import { ApolloError, gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";

const GET_COUNTERS = gql`
  query Counters {
    counters {
      name
      value
    }
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
      </header>
    </div>
  );
};

export default App;
