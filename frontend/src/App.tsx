import { useEffect, useState } from 'react';
import { deleteKeyValueItem, getKeyValueItems } from './api';
import './App.css';
import CreateKeyValueDiv from './CreateKeyValueDiv';
import KeyValueDiv from './KeyValueDiv';

function App() {
  const [itemNames, setItemNames] = useState<string[]>([]);

  const loadItems = () => {
    getKeyValueItems().then((res: any) => setItemNames(res.data));
  }

  useEffect(() => loadItems(), []);

  const deleteItem = async (name: string) => {
    await deleteKeyValueItem(name);
    loadItems();
  }

  return (
    <div className="App">
      <div className="max-w-4xl mx-auto py-12 sm:px-6 lg:px-8">
        <p className="text-center text-5xl pt-12 pb-5"> KeyValue Storage </p>

        <p className="text-3xl my-4">New Record</p>
        <CreateKeyValueDiv onSave={loadItems}/>

        <hr className="my-8"/>
        <p className="text-3xl mb-4">Existing Item Records</p>

        <div className="flex flex-col space-y-6">
          { itemNames.map((name, idx) => <KeyValueDiv key={name} name={name} onDelete={deleteItem}/>) }
        </div>
      </div>
    </div>
  );
}

export default App;
