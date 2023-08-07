import { useState, useEffect } from 'react';
import './App.css';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { LineChart } from '@mui/x-charts/LineChart';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { cyan } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: '#512da8',
    },
    secondary: cyan,
    mode: "dark"
  },
});


function MakeChart({ type, data, dates }) {
  return (
    <LineChart
      width={500}
      height={300}

      xAxis={[{
        scaleType: 'time',
        data: dates,
      }]}

      series={[
        {
          id: "Data",
          label: type,
          data: data,
          color: theme.palette.primary.main
        },
      ]}

      sx={{
        '.MuiLineElement-root': {
          strokeWidth: 2,
          stroke: theme.palette.primary.main
        },
        '.MuiMarkElement-root': {
          display: 'none'
        }
      }}
    />
  )
}

function MakeButton({ type, value, setButton }) {

  const handleChange = (_, newValue) => {
    if (newValue !== null) {
      setButton(newValue);
    }
  }
  let buttons;
  let exclusive;
  if (type === "stock") {
    buttons = [
      <ToggleButton
        key="AAPL"
        value="AAPL">AAPL</ToggleButton>,
      <ToggleButton
        key="MSFT"
        value="MSFT">MSFT</ToggleButton>,
      <ToggleButton
        key="AMZN"
        value="AMZN">AMZN</ToggleButton>,
      <ToggleButton
        key="TSLA"
        value="TSLA">TSLA</ToggleButton>
    ];
    exclusive = true
  } else if (type === "predict") {
    buttons = [<ToggleButton
      key="Monte Carlo"
      value="Monte Carlo">Monte Carlo</ToggleButton>]
    {/* <ToggleButton
      key="Black-Scholes"
      value="Black-Scholes">Black-Scholes</ToggleButton>,] */}
    exclusive = false
  } else {
    buttons = []
  }





  return (
    <ToggleButtonGroup
      color="primary"
      value={value}
      exclusive
      orientation="vertical"
      onChange={handleChange}
    >{buttons}</ToggleButtonGroup>
  )
}

function App() {
  let [dates, setDates] = useState([1]);
  let [stocks, setStocks] = useState([1]);
  let [stock, setStock] = useState("AAPL");
  let [type, setType] = useState("stock");

  useEffect(function () {
    fetch("http://ec2-34-235-103-161.compute-1.amazonaws.com:8181/" + type + "/" + stock + "/2012-01-01/2013-12-31")
      .then((response) => {
        return response.json();
      }).then((parsed_response) => {
        const dates =
          parsed_response.dates.map((date_string) => (
            new Date(date_string)
          ));
        setDates(dates);
        setStocks(parsed_response.stocks);
      });
  }, [stock])


  return (
    <div className="App">
      <header className="App-header">
        <h1>STOCK DASHBOARD RAAH</h1>
        <div className="Row">
          <ThemeProvider theme={theme}>
            <MakeButton type={"stock"} value={stock} setButton={setStock} />
            <MakeChart dates={dates} data={stocks} type={stock} />
            <MakeButton type={"predict"} value={type} setButton={setType} />
          </ThemeProvider>
        </div>
      </header>
    </div >
  );
}



export default App;
