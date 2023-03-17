import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Box, Button, Flex, IconButton, Text, VStack } from "@chakra-ui/react";
import { FiCheck, FiPause, FiPlay, FiTrash2 } from "react-icons/fi";

const getItems = (count, prefix) =>
  Array.from({ length: count }, (v, k) => k).map((k) => {
    const randomId = Math.floor(Math.random() * 1000);
    return {
      id: `item-${randomId}`,
      prefix,
      content: `item ${randomId}`,
    };
  });

const removeFromList = (list, index) => {
  console.log(list);
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
  lists.reduce(
    (acc, listKey) => ({ ...acc, [listKey.key]: getItems(10, listKey) }),
    {}
  );

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

export const TodoList = () => {
  const [elements, setElements] = React.useState(generateLists());

  useEffect(() => {
    setElements(generateLists());
  }, []);

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const listCopy = { ...elements };

    console.log(result);

    const sourceList = listCopy[result.source.droppableId];
    const [removedElement, newSourceList] = removeFromList(
      sourceList,
      result.source.index
    );

    listCopy[result.source.droppableId] = newSourceList;
    const destinationList = listCopy[result.destination.droppableId];
    listCopy[result.destination.droppableId] = addToList(
      destinationList,
      result.destination.index,
      removedElement
    );

    setElements(listCopy);
  };

  const handleToggleTask = (item, index, prefix) => {
    console.log({ item, index, prefix });
    const listCopy = { ...elements };

    const source = prefix;
    const destination = prefix === "todo" ? "inProgress" : "todo";

    const sourceList = listCopy[source];
    const [removedElement, newSourceList] = removeFromList(sourceList, index);

    listCopy[source] = newSourceList;
    const destinationList = listCopy[destination];
    listCopy[destination] = addToList(destinationList, index, removedElement);

    setElements(listCopy);
  };

  const handleComplete = (item, index, prefix) => {};
  const handleRemove = (item, index, prefix) => {};

  return (
    <div style={{ display: "flex" }}>
      <div>
        <DragDropContext onDragEnd={onDragEnd}>
          <Flex margin={5}>
            {lists.map((listKey) => (
              <DraggableElement
                elements={elements[listKey.key]}
                key={listKey.key}
                prefix={listKey.key}
                name={listKey.name}
                onComplete={handleComplete}
                onRemove={handleRemove}
                onToggleRun={handleToggleTask}
              />
            ))}
          </Flex>
        </DragDropContext>
      </div>
    </div>
  );
};
