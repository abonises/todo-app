import './index.scss'
import Task from "../Task/index.jsx";
import Loader from "../UI/Loader/index.jsx";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import cn from 'classnames';
import {useAuth} from "../../context/auth.jsx";
import {updateStatus} from "../../utils/task-handlers.js";

const Index = ({ tasks, isLoading }) => {
  
  const { user, setUserData } = useAuth();
  const todoTasks = tasks.filter((item) => !item.isCompleted)
  const doneTasks = tasks.filter((item) => item.isCompleted)
  
  const onDragEnd = async (result) => {
    if (!result.destination) return;
    
    const { source, destination, draggableId } = result;
    
    if (source.droppableId === destination.droppableId) return;
    
    const previousUserData = user;
    
    if (source.droppableId !== destination.droppableId) {
      
      setUserData((prev) => {
        const updatedTasks = prev.tasks.map((task) =>
            task.id === draggableId ? { ...task, isCompleted: !task.isCompleted } : task
        );
        
        return { ...prev, tasks: updatedTasks };
      });
    }
    
    try {
      const updatedUserObject = await updateStatus(draggableId, user.id);
      
      if (updatedUserObject) {
        setUserData(updatedUserObject);
      } else {
        console.log('error')
      }
    } catch (err) {
      console.error(err.message)
      setUserData(previousUserData);
    }
  };
  
  
  return (
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="tasks">
          <Droppable droppableId="todo" direction="vertical" isDropDisabled={false}>
            {(provided) => (
                <div
                    className="todo-column column"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                >
                  <h3 className="tasks__title">To Do</h3>
                  <div className="tasks__list">
                    {isLoading ? (
                        <Loader />
                    ) : tasks.length === 0 ? (
                        <span className="tasks__list-info">Create your first task!</span>
                    ) : (
                        todoTasks.map((item, index) => (
                            <Draggable key={item.id} draggableId={item.id} index={index}>
                              {(provided, snapshot) => (
                                  <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={cn('task-placeholder', snapshot.isDragging && 'dragging')}
                                  >
                                    <Task key={item.id} item={item} />
                                  </div>
                              )}
                            </Draggable>
                        ))
                    )}
                    {provided.placeholder}
                  </div>
                </div>
            )}
          </Droppable>
          
          <div className="tasks__separator"></div>
          
          <Droppable droppableId="done" direction="vertical" isDropDisabled={false}>
            {(provided) => (
                <div
                    className="done-column column"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                >
                  <h3 className="tasks__title">Done</h3>
                  <div className="tasks__list">
                    {isLoading ? (
                        <Loader />
                    ) : (
                        doneTasks.map((item, index) => (
                            <Draggable key={item.id} draggableId={item.id} index={index}>
                              {(provided, snapshot) => (
                                  <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={`task-placeholder ${snapshot.isDragging ? 'dragging' : ''}`}
                                  >
                                    <Task key={item.id} item={item} />
                                  </div>
                              )}
                            </Draggable>
                        ))
                    )}
                    {provided.placeholder}
                  </div>
                </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
  );
};

export default Index;