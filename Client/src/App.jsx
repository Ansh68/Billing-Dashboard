import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import InvoiceDetails from "./pages/InvoiceDetails";
import Master from "./pages/Master";
import CustomerList from "./pages/CustomerList";
import AddCustomer from "./pages/AddCustomer";
import ItemList from "./pages/ItemList";
import AddItem from "./pages/AddItem";
import Billing from "./pages/Billing";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {/* Dashboard */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/invoice/:invoiceId" element={<InvoiceDetails />} />

          {/* Master */}
          <Route path="/master" element={<Master />} />
          <Route path="/master/customers" element={<CustomerList />} />
          <Route path="/master/customers/add" element={<AddCustomer />} />
          <Route path="/master/items" element={<ItemList />} />
          <Route path="/master/items/add" element={<AddItem />} />

          {/* Billing */}
          <Route path="/billing" element={<Billing />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
