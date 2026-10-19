import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button, Input } from "ui";
import { useAppContext } from "../context/app";

export const TodoForm = () => {
  const { setAddTodoItem } = useAppContext();

  const [todoItem, setTodoItem] = useState("");

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (!todoItem) {
      return;
    }

    setAddTodoItem({
      id: uuidv4(),
      name: todoItem,
      completed: false,
    });
    setTodoItem("");
  };

  const handleOnChange = async (event: any) => {
    setTodoItem(event.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex gap-2">
        <Input
          id="todo"
          type="text"
          onChange={handleOnChange}
          value={todoItem}
          className="bg-white"
          placeholder="Add a todo title"
        />
        <Button type="submit" size="sm" className="shrink-0">
          ADD
        </Button>
      </div>
    </form>
  );
};
