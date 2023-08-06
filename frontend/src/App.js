import { useState } from "react";
import MainPage from "./Main";
import DetailsPage from "./Details";

const MAIN_PAGE = "main";
const DETAILS_PAGE = "details_page";

function App() {
  const [page, setPage] = useState(MAIN_PAGE);
  const [log, setLog] = useState(undefined);

  if (page === MAIN_PAGE)
    return (
      <MainPage
        onLogClicked={(url, date) => {
          setLog({ url, date });
          setPage(DETAILS_PAGE);
        }}
      />
    );
  else {
    return (
      <DetailsPage
        onBackClicked={() => {
          setPage(MAIN_PAGE);
          setLog(undefined);
        }}
        {...log}
      />
    );
  }
}

export default App;
