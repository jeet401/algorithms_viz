
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHead, TableBody, TableHeader, TableRow, TableCell } from "@/components/ui/table";

type Item = { id: string; value: number; weight: number };

export default function KnapsackInput({
  items,
  setItems,
  capacity,
  setCapacity,
}: {
  items: Item[];
  setItems: (items: Item[]) => void;
  capacity: number;
  setCapacity: (c: number) => void;
}) {
  const [newItem, setNewItem] = useState<Item>({ id: '', value: 0, weight: 0 });

  const addItem = () => {
    if (!newItem.id || newItem.value <= 0 || newItem.weight <= 0) return;
    setItems([...items, newItem]);
    setNewItem({ id: '', value: 0, weight: 0 });
  };
  const removeItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <Input placeholder="ID" value={newItem.id} onChange={e=>setNewItem({...newItem, id: e.target.value})} className="w-18" />
        <Input placeholder="Value" type="number" value={newItem.value} onChange={e=>setNewItem({...newItem, value: Number(e.target.value)})} className="w-18" />
        <Input placeholder="Weight" type="number" value={newItem.weight} onChange={e=>setNewItem({...newItem, weight: Number(e.target.value)})} className="w-18" />
        <Button onClick={addItem} variant="outline">Add</Button>
        <Input placeholder="Knapsack Capacity" type="number" value={capacity} onChange={e=>setCapacity(Number(e.target.value))} className="w-28" />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Weight</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, idx) => (
            <TableRow key={idx}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.value}</TableCell>
              <TableCell>{item.weight}</TableCell>
              <TableCell><Button size="sm" variant="ghost" onClick={() => removeItem(idx)}>Remove</Button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
