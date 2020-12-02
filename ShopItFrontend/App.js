import React from 'react';
import ComponentWrapper from './components/ComponentWrapper';
import { GroceryProvider } from './components/GlobalItemStore';

export default function App() {
  return (
    <GroceryProvider>
      <ComponentWrapper/>
    </GroceryProvider>
  );
}

