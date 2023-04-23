const userName = "####";
const token = "####";

const buildTable = (table, data) => {
  table.replaceChildren();

  const numRows = 7;
  const numCols = 53;

  const daysToPrint = [1, 3, 5];
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  for (let i = 0; i < numRows; i++) {
    let tableRow = document.createElement("tr");
    tableRow.className = "table-row";

     const dayNameParagraph = document.createElement("div");
     dayNameParagraph.className = "table-text";

     if (daysToPrint.includes(i)) dayNameParagraph.innerText = days[i];

     tableRow.appendChild(dayNameParagraph);

    for (let j = 0; j < numCols; j++) {
      let contributionCount = data[i][j];
      if (contributionCount !== undefined) {
        tableRow.appendChild(createCell(contributionCount));
      }
    }

    table.appendChild(tableRow);
  }
};

const createCell = (contributionCount) => {
    let tableCell = document.createElement("td");
    tableCell.className = `table-element ${contributionCount ? "lvl4_contrib" : ""}`;
    return tableCell;
}

const fetchContributionDataFromGithub = async () => {
  const url = "https://api.github.com/graphql";

  const queyrString = `query($userName:String!) { 
        user(login: $userName){
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                }
              }
            }
          }
        }
      }`;

  const variables = {
    userName: userName,
  };

  return await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      query: queyrString,
      variables: variables,
    }),
  })
    .then((res) => res.json());
};

const graphQLResponseToCountsMatrix = (data) => {
    const contribs = data.data.user.contributionsCollection.contributionCalendar.weeks;

    let out = [];

    for (let i = 0; i < 7; i++) {
        out[i] = [];
        
        for (let j = 0; j < 53; j++) {
            out[i][j] = contribs[j]?.contributionDays[i]?.contributionCount;
        }
    }

    return out;
}

const fetchDataAndBuildTable = () => {
  let table = document.getElementById("table");  
  
  fetchContributionDataFromGithub()
  .then(data => {
    const contributionCountsMatrix = graphQLResponseToCountsMatrix(data);
    
    buildTable(table, contributionCountsMatrix);
  });
};

window.onload = () => {
  fetchDataAndBuildTable();

  document.addEventListener('click', function (event) {
    if (!event.target.matches('.reload')) return;
    event.preventDefault();

    fetchDataAndBuildTable();
  });
};