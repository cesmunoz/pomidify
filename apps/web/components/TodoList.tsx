import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
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
      {(provided) => {
        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className="my-2 flex flex-col items-center gap-1 rounded-lg bg-pink-500 p-5"
          >
            <span className="text-sm font-bold text-white">{item.content}</span>
            <div className="flex gap-1">
              <button
                type="button"
                className="inline-flex h-8 items-center justify-center rounded-md bg-white px-2"
                aria-label="Run Task"
                onClick={onToggleRun}
              >
                {prefix === "todo" ? <FiPlay /> : <FiPause />}
              </button>
              <button
                type="button"
                className="inline-flex h-8 items-center justify-center rounded-md bg-white px-2"
                aria-label="Complete Task"
                onClick={onComplete}
              >
                <FiCheck />
              </button>
              <button
                type="button"
                className="inline-flex h-8 items-center justify-center rounded-md bg-white px-2"
                aria-label="Search database"
                onClick={onRemove}
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
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
  <div className="m-10">
    <p className="text-2xl text-pink-600">{name}</p>
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
  </div>
);

export const TodoList = () => {
  const [elements, setElements] = React.useState(generateLists());

  useEffect(() => {
    // The demo board reshuffles once on mount. This predates the React 19 hooks rule.
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
          <div className="m-5 flex">
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
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};
