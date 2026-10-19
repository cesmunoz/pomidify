import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FiCheck, FiPause, FiPlay, FiTrash2 } from "react-icons/fi";
import { v4 as uuidv4 } from "uuid";
import { Button, Input } from "ui";
import { useAppContext } from "../context/app";

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

const generateLists = (todoList) => {
  return lists.reduce(
    (acc, listKey) => ({
      ...acc,
      [listKey.key]: todoList.filter((item) => item.prefix === listKey.key),
    }),
    {}
  );
};

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
      {(provided) => {
        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className="flex flex-col items-center gap-1 rounded-lg bg-pink-500 p-5"
          >
            <span className="text-sm font-bold text-white">
              {getShortDescription(item.title)}
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                className="inline-flex h-6 items-center justify-center rounded-md bg-white px-2"
                aria-label="Run Task"
                onClick={onToggleRun}
              >
                {prefix === "todo" ? <FiPlay /> : <FiPause />}
              </button>
              <button
                type="button"
                className="inline-flex h-6 items-center justify-center rounded-md bg-white px-2"
                aria-label="Complete Task"
                onClick={onComplete}
              >
                <FiCheck />
              </button>
              <button
                type="button"
                className="inline-flex h-6 items-center justify-center rounded-md bg-white px-2"
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

const getShortDescription = (name, length = 10) => {
  if (name.length <= length) {
    return name;
  }

  return `${name.substring(0, length)}...`;
};

const DraggableElement = ({
  prefix,
  elements,
  name,
  onToggleRun,
  onComplete,
  onRemove,
}) => (
  <div className="flex-1 p-2">
    <p className="w-[125px] text-2xl text-pink-600">{name}</p>
    <div className="h-auto min-h-[100px] w-full bg-pink-100">
      <Droppable droppableId={`${prefix}`}>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex flex-col gap-2"
          >
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
  </div>
);

export default function Todo() {
  const [todoTitle, setTodoTitle] = useState("");
  const { setAddTodoItem, todoList, setTodoItemCompleted } = useAppContext();
  const [elements, setElements] = useState(() => generateLists(todoList));

  console.log("elements", elements);

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

  const handleTaskOnChange = (e) => setTodoTitle(e.target.value);

  const handleAddTodo = () => {
    const listCopy = { ...elements };
    const newItem = {
      id: `item-${uuidv4()}`,
      status: "todo",
      title: todoTitle,
      content: "",
    };
    listCopy["todo"] = addToList(listCopy["todo"], 0, newItem);
    setElements(listCopy);
    setAddTodoItem(newItem);
  };

  const handleComplete = (item, index, status) => {
    console.log("Call completed", item);
    setTodoItemCompleted(item.id);
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
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Input
          placeholder="Describe your task"
          name="task"
          id="task"
          onChange={handleTaskOnChange}
        />
        <Button className="shrink-0" onClick={handleAddTodo}>
          Add Task
        </Button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex w-full">
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
        </div>
      </DragDropContext>
    </div>
  );
}
