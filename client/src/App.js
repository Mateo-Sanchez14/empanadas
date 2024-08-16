import { Typography } from '@mui/material';
import './App.css';
import OrderEmpanadas from './OrderEmpanadas';

function App() {
  return (
    <div className="App">
      <Typography variant="h1" component="h2">
 Empanadas para todos
</Typography>
      <OrderEmpanadas />
    </div>
  );
}

export default App;
