import { FC, useContext, useEffect, useState } from "react";
import { observer } from "mobx-react";
import { useLocation, useNavigate } from "react-router-dom";

import { StoreContext } from "@/store/StoreContext";

import styles from "@/styles/pages/AddTask.module.scss";

const formatDateForInput = (dateString?: string): string => {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (isNaN(date.getTime())) return "";

  // Format to YYYY-MM-DDThh:mm format required by datetime-local input
  return date.toISOString().slice(0, 16);
};

// Updated getCurrentDateTime function to refresh each time it's called
const getCurrentDateTime = (): string => {
  const now = new Date();
  return now.toISOString().slice(0, 16);
};

export const AddTask: FC = observer(() => {
  const store = useContext(StoreContext);
  const { getTaskById, addTask, editTask } = store.TasksStateStore;
  const navigate = useNavigate();
  const location = useLocation();

  const taskId = location.state?.taskId || null;

  const currentTask =
    location.state && location.state.taskId ? getTaskById(taskId) : null;

  // Don't use useState for currentDateTime as we want it to refresh on each render
  // This ensures the minimum time is always "now" and not the time when the component mounted
  const currentDateTime = getCurrentDateTime();
  const [dateError, setDateError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    action: "",
    description: "",
    priority: "medium" as ITaskPriorities,
    rangeStart: "",
    rangeEnd: "",
    estimatedWorkingTime: "",
    estimatedWorkload: "",
    repeating: false,
    frequency: "daily" as ITaskFrequency,
    interval: 1,
    startDate: "",
  });

  useEffect(() => {
    if (currentTask) {
      console.log("Loading task for edit:", currentTask);

      const rangeStart = formatDateForInput(currentTask.range?.start);
      const rangeEnd = formatDateForInput(currentTask.range?.end);
      const repeatStartDate = formatDateForInput(
        currentTask.repeating?.startDate,
      );

      setFormData({
        name: currentTask.name || "",
        action: currentTask.action || "",
        description: currentTask.description || "",
        priority: currentTask.priority || "medium",
        rangeStart,
        rangeEnd,
        estimatedWorkingTime:
          currentTask.estimatedWorkingTime?.toString() || "",
        estimatedWorkload: currentTask.estimatedWorkload?.toString() || "",
        repeating: !!currentTask.repeating,
        frequency: currentTask.repeating?.frequency || "daily",
        interval: currentTask.repeating?.interval || 1,
        startDate: repeatStartDate,
      });
    }
  }, [currentTask]);

  const validateDates = (startDate: string, endDate: string): boolean => {
    setDateError(null);

    if (!startDate && !endDate) return true;

    if (!startDate || !endDate) return true;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    if (start < now && !currentTask) {
      setDateError(`Start date must be in the future`);
      return false;
    }

    if (start > end) {
      setDateError(`Start date cannot be after end date`);
      return false;
    }

    return true;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;

    if (name === "rangeStart" || name === "rangeEnd") {
      if (name === "rangeStart" && !currentTask) {
        const inputDate = new Date(value);
        const now = new Date();

        if (inputDate < now) {
          setDateError("Start date must be in the future");
          return;
        }
      }

      const newData = {
        ...formData,
        [name]: value,
      };

      if (name === "rangeStart") {
        validateDates(value, formData.rangeEnd);
      } else {
        validateDates(formData.rangeStart, value);
      }

      setFormData(newData);
      return;
    }

    if (name === "startDate") {
      if (!currentTask) {
        const inputDate = new Date(value);
        const now = new Date();

        if (inputDate < now) {
          setDateError("Schedule start date must be in the future");
          return;
        }
      }

      validateDates(value, formData.rangeEnd);
    }

    setFormData(prev => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.rangeStart || formData.rangeEnd) {
      if (!validateDates(formData.rangeStart, formData.rangeEnd)) {
        return;
      }
    }

    // Rest of submission code remains the same
    const taskData: Partial<ITask> = {
      name: formData.name,
      action: formData.action,
      description: formData.description,
      priority: formData.priority,
      range:
        formData.rangeStart || formData.rangeEnd
          ? {
            start: formData.rangeStart || undefined,
            end: formData.rangeEnd || undefined,
          }
          : undefined,
      estimatedWorkingTime: formData.estimatedWorkingTime
        ? parseInt(formData.estimatedWorkingTime)
        : undefined,
      estimatedWorkload: formData.estimatedWorkload
        ? parseInt(formData.estimatedWorkload)
        : undefined,
      repeating: formData.repeating
        ? {
          frequency: formData.frequency,
          interval: formData.interval,
          startDate: formData.startDate,
        }
        : undefined,
    };

    if (currentTask) {
      console.log("Updating task:", taskData);
      editTask(
        {
          id: currentTask.id,
          status: currentTask.status,
          ...taskData,
        } as IFormTask,
        currentTask.id,
      );
    } else {
      addTask(taskData as IFormTask);
    }

    navigate("/tasks");
  };

  const handleCancel = () => {
    navigate("/tasks");
  };

  return (
    <div className={styles.addTask}>
      <div className={styles.addTaskFormContainer}>
        <h2>{currentTask ? "Edit Task" : "Add New Task"}</h2>

        <form className={styles.addTaskForm} onSubmit={handleSubmit}>
          <div className={styles.formSection}>
            <h3>Basic Information</h3>

            <div className={styles.formGroup}>
              <label htmlFor="name">Task Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={styles.addTaskFormInput}
                required
                placeholder="Enter task name"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="action">Command/Action *</label>
              <input
                type="text"
                id="action"
                name="action"
                value={formData.action}
                onChange={handleInputChange}
                className={styles.addTaskFormInput}
                required
                placeholder="e.g., /usr/local/bin/backup-script.sh"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={styles.addTaskFormTextarea}
                rows={3}
                placeholder="Enter task description"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className={styles.addTaskFormSelect}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div className={styles.formSection}>
            <h3>Execution Range (Optional)</h3>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="rangeStart">Start Date</label>
                <input
                  type="datetime-local"
                  id="rangeStart"
                  name="rangeStart"
                  value={formData.rangeStart}
                  onChange={handleInputChange}
                  className={styles.addTaskFormInput}
                  min={currentTask ? undefined : currentDateTime}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="rangeEnd">End Date</label>
                <input
                  type="datetime-local"
                  id="rangeEnd"
                  name="rangeEnd"
                  value={formData.rangeEnd}
                  onChange={handleInputChange}
                  className={styles.addTaskFormInput}
                  min={
                    formData.rangeStart ||
                    (currentTask ? undefined : currentDateTime)
                  }
                />
              </div>
            </div>
            {dateError && (
              <div className={styles.errorMessage}>{dateError}</div>
            )}
          </div>

          <div className={styles.formSection}>
            <h3>Estimates</h3>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="estimatedWorkingTime">
                  Working Time (seconds)
                </label>
                <input
                  type="number"
                  id="estimatedWorkingTime"
                  name="estimatedWorkingTime"
                  value={formData.estimatedWorkingTime}
                  onChange={handleInputChange}
                  className={styles.addTaskFormInput}
                  min="0"
                  placeholder="e.g., 3600"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="estimatedWorkload">Workload (%)</label>
                <input
                  type="number"
                  id="estimatedWorkload"
                  name="estimatedWorkload"
                  value={formData.estimatedWorkload}
                  onChange={handleInputChange}
                  className={styles.addTaskFormInput}
                  min="0"
                  max="100"
                  placeholder="e.g., 75"
                />
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <h3>Schedule</h3>

            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="repeating"
                  checked={formData.repeating}
                  onChange={handleInputChange}
                  className={styles.checkbox}
                />
                Repeating Task
              </label>
            </div>

            {formData.repeating && (
              <div className={styles.repeatingOptions}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="frequency">Frequency</label>
                    <select
                      id="frequency"
                      name="frequency"
                      value={formData.frequency}
                      onChange={handleInputChange}
                      className={styles.addTaskFormSelect}>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="interval">Interval</label>
                    <input
                      type="number"
                      id="interval"
                      name="interval"
                      value={formData.interval}
                      onChange={handleInputChange}
                      className={styles.addTaskFormInput}
                      min="1"
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="startDate">Schedule Start Date</label>
                  <input
                    type="datetime-local"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className={styles.addTaskFormInput}
                    min={currentTask ? undefined : currentDateTime} // Refresh the min datetime
                  />
                </div>
              </div>
            )}
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              onClick={handleCancel}
              className={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" className={styles.addTaskFormButton}>
              {currentTask ? "Update Task" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});
