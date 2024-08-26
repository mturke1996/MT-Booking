import React, { useState } from 'react';
import './TravelBudgetPlanner.css';

const TravelBudgetPlanner = () => {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [itemCost, setItemCost] = useState('');
  const [totalCost, setTotalCost] = useState(0);

  const handleAddItem = () => {
    if (itemName && itemCost) {
      const newItem = { name: itemName, cost: parseFloat(itemCost) };
      setItems([...items, newItem]);
      setTotalCost(totalCost + newItem.cost);
      setItemName('');
      setItemCost('');
    }
  };

  const handleRemoveItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    const removedCost = items[index].cost;
    setItems(updatedItems);
    setTotalCost(totalCost - removedCost);
  };

  return (
    <div className="budget-planner-container" style={{marginTop:"150px"}}>
      <h1>Travel Budget Planner</h1>
      <div className="form-container">
        <input
          type="text"
          placeholder="Item Name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Cost"
          value={itemCost}
          onChange={(e) => setItemCost(e.target.value)}
        />
        <button onClick={handleAddItem}>Add Item</button>
      </div>
      <div className="items-list">
        {items.length > 0 ? (
          <ul>
            {items.map((item, index) => (
              <li key={index}>
                {item.name}: ${item.cost.toFixed(2)}
                <button onClick={() => handleRemoveItem(index)}>Remove</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No items added yet.</p>
        )}
      </div>
      <div className="total-cost">
        <h2>Total Estimated Cost: ${totalCost.toFixed(2)}</h2>
      </div>
    </div>
  );
};

export default TravelBudgetPlanner;
