import { HStack, FormControl, Input, Button } from "@chakra-ui/react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useAppContext } from "../context/app";

export const TodoForm = () => {
  const { setAddTodoItem } = useAppContext();

  const [todoItem, setTodoItem] = useState("");

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if(!todoItem) {
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
      <HStack>
        <FormControl>
          <Input
            id="todo"
            type="todo"
            onChange={handleOnChange}
            value={todoItem}
            bg="white"
            placeholder="Add a todo title"
          />
        </FormControl>
        <Button type="submit" colorScheme="pink" size="sm">
          ADD
        </Button>
      </HStack>
    </form>
  );
};

