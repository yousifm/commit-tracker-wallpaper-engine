const userName = "#####";
const token = "#####";

const buildTable = (table, data) => {
  const numRows = 7;
  const numCols = 52;

  const daysToPrint = [1, 3, 5];
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  for (let i = 0; i < numRows; i++) {
    let tableRow = document.createElement("tr");
    tableRow.className = "table-row";

    // const dayNameParagraph = document.createElement("div");
    // dayNameParagraph.className = "table-text";

    // if (daysToPrint.includes(i)) dayNameParagraph.innerText = days[i];

    // tableRow.appendChild(dayNameParagraph);

    for (let j = 0; j < numCols; j++) {
      let tableCell = document.createElement("td");
      let contributionCount = data[j].contributionDays[i].contributionCount;
      let contributionClass = contributionCount === 0 ? "" : "lvl4_contrib";

      tableCell.className = `table-element ${contributionClass}`;

      tableRow.appendChild(tableCell);
    }

    table.appendChild(tableRow);
  }

  buildFinalWeek(table);
};

const buildFinalWeek = (table) => {
  const day = new Date().getDay();
  const children = table.children;

  for (let i = 0; i < day + 1; i++) {
    let tableCell = document.createElement("td");
    tableCell.className = "table-element lvl_contrib_1";

    children[i].appendChild(tableCell);
  }
};

const getContributions = async () => {
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

window.onload = () => {
  let table = document.getElementById("table");
  getContributions()
  .then(data => {
    const contribs = data.data.user.contributionsCollection.contributionCalendar.weeks;
    buildTable(table, contribs);
  });
};
