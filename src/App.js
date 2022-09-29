import Header from "./components/Header";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import Home from "./components/Home";
import snap_logo_side from "./components/assets/logo_snapraise_small.png"

const client = new ApolloClient({
  uri: "http://localhost:4005/graphql",
  cache: new InMemoryCache(),
});

function App() {
 
  return (
    <>
      <ApolloProvider client={client}>
        <Header />
        <div className="container">
          <div className="mt-5 title-text-right-aligned">
             <img src={snap_logo_side} alt="snap_logo" />
          </div>
          <Home />
        </div>
      </ApolloProvider>
    </>
  );
}

export default App;
