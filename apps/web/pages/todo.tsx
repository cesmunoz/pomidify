import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  VStack,
  Text,
  IconButton,
} from "@chakra-ui/react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FiCheck, FiPause, FiPlay, FiTrash2 } from "react-icons/fi";
import { v4 as uuidv4 } from "uuid";

const removeFromList = (list, index) => {
  const result = Array.from(list);
  const [removed] = result.splice(index, 1);
  return [removed, result];
};

const addToList = (list, index, element) => {
  const result = Array.from(list);
  result.splice(index, 0, element);
  return result;
};

const lists = [
  {
    key: "todo",
    name: "To do",
  },
  {
    key: "inProgress",
    name: "In Progress",
  },
  {
    key: "done",
    name: "Done",
  },
];

const generateLists = () =>
  lists.reduce((acc, listKey) => ({ ...acc, [listKey.key]: [] }), {});

const moveItem = (list, source, sourceIndex, destination, destinationIndex) => {
  const listCopy = { ...list };
  const sourceList = listCopy[source];
  const [removedElement, newSourceList] = removeFromList(
    sourceList,
    sourceIndex
  );

  listCopy[source] = newSourceList;
  const destinationList = listCopy[destination];
  listCopy[destination] = addToList(
    destinationList,
    destinationIndex,
    removedElement
  );
  return listCopy;
};

const ListItem = ({
  item,
  index,
  prefix,
  onToggleRun,
  onComplete,
  onRemove,
}) => {
  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided, snapshot) => {
        return (
          <VStack
            ref={provided.innerRef}
            snapshot={snapshot}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            backgroundColor="pink.500"
            padding={5}
            my={2}
            borderRadius="lg">
            <Text textColor="white" fontSize="sm" fontWeight="bold">
              {item.content}
            </Text>
            <Flex gap={1}>
              <IconButton
                aria-label="Run Task"
                icon={prefix === "todo" ? <FiPlay /> : <FiPause />}
                onClick={onToggleRun}
              />
              <IconButton
                aria-label="Complete Task"
                icon={<FiCheck />}
                onClick={onComplete}
              />
              <IconButton
                aria-label="Search database"
                icon={<FiTrash2 />}
                onClick={onRemove}
              />
            </Flex>
          </VStack>
        );
      }}
    </Draggable>
  );
};

const DraggableElement = ({
  prefix,
  elements,
  name,
  onToggleRun,
  onComplete,
  onRemove,
}) => (
  <Box m={10}>
    <Text fontSize="2xl" color="pink.600">
      {name}
    </Text>
    <Droppable droppableId={`${prefix}`}>
      {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef}>
          {elements.map((item, index) => (
            <ListItem
              key={item.id}
              item={item}
              index={index}
              prefix={prefix}
              onToggleRun={() => onToggleRun(item, index, prefix)}
              onComplete={() => onComplete(item, index, prefix)}
              onRemove={() => onRemove(item, index, prefix)}
            />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  </Box>
);

export default function Todo() {
  const [todo, setTodo] = useState("");
  const [elements, setElements] = React.useState(generateLists());

  useEffect(() => {
    setElements(generateLists());
  }, []);

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const { source, destination } = result;

    const list = moveItem(
      elements,
      source.droppableId,
      source.index,
      destination.droppableId,
      destination.index
    );
    setElements(list);
  };

  const handleTaskOnChange = (e) => {
    setTodo(e.target.value);
  };

  const handleAddTodo = () => {
    const listCopy = { ...elements };
    listCopy["todo"] = addToList(listCopy["todo"], 0, {
      id: `item-${uuidv4()}`,
      prefix: "todo",
      content: todo,
    });
    setElements(listCopy);
  };

  const handleComplete = (item, index, prefix) => {
    const list = moveItem(elements, prefix, index, "done", index);
    setElements(list);
  };

  const handleToggleTask = (item, index, prefix) => {
    const destination = prefix === "todo" ? "inProgress" : "todo";
    const list = moveItem(elements, prefix, index, destination, index);
    setElements(list);
  };

  const handleRemoveTask = (item, index, prefix) => {
    const listCopy = { ...elements };
    const sourceList = listCopy[prefix];
    const [, newSourceList] = removeFromList(sourceList, index);
    listCopy[prefix] = newSourceList;
    setElements(listCopy);
  };

  return (
    <VStack>
      <HStack>
        <Input
          placeholder="Describe your task"
          name="task"
          id="task"
          onChange={handleTaskOnChange}
        />
        <Button colorScheme="pink" onClick={handleAddTodo}>
          Add Task
        </Button>
      </HStack>
      <HStack>
        <DragDropContext onDragEnd={onDragEnd}>
          <Flex margin={5}>
            {lists.map((listKey) => (
              <DraggableElement
                elements={elements[listKey.key]}
                key={listKey.key}
                prefix={listKey.key}
                name={listKey.name}
                onComplete={handleComplete}
                onRemove={handleRemoveTask}
                onToggleRun={handleToggleTask}
              />
            ))}
          </Flex>
        </DragDropContext>
      </HStack>
    </VStack>
  );
}
