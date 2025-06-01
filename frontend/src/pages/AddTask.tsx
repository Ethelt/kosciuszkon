import { FC, useContext, useEffect, useState } from "react";
import { observer } from "mobx-react";
import { useNavigate } from "react-router-dom";

import { StoreContext } from "@/store/StoreContext";

import styles from "@/styles/pages/AddTask.module.scss";

export const AddTask: FC = observer(() => {
  const store = useContext(StoreContext);
  const { currentTask, setCurrentTask, addTask } = store.TasksStateStore;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    action: "",
    description: "",
    priority: "medium" as ITaskPriorities,
    rangeStart: undefined as string | undefined,
    rangeEnd: undefined as string | undefined,
    estimatedWorkingTime: "",
    estimatedWorkload: "",
    repeating: false,
    frequency: "daily" as ITaskFrequency,
    interval: 1,
    startDate: "",
  });

  // Fill form with currentTask data if editing
  useEffect(() => {
    if (currentTask) {
      setFormData({
        name: currentTask.name || "",
        action: currentTask.action || "",
        description: currentTask.description || "",
        priority: currentTask.priority || "medium",
        rangeStart: currentTask.range?.start || undefined,
        rangeEnd: currentTask.range?.end || undefined,
        estimatedWorkingTime:
          currentTask.estimatedWorkingTime?.toString() || "",
        estimatedWorkload: currentTask.estimatedWorkload?.toString() || "",
        repeating: !!currentTask.repeating,
        frequency: currentTask.repeating?.frequency || "daily",
        interval: currentTask.repeating?.interval || 1,
        startDate: currentTask.repeating?.startDate || "",
      });
    }
  }, [currentTask]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const taskData: Partial<ITask> = {
      name: formData.name,
      action: formData.action,
      description: formData.description,
      priority: formData.priority,
      range: {
        start: formData.rangeStart,
        end: formData.rangeEnd,
      },
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
      // Update existing task
      console.log("Updating task:", taskData);
      // TODO: Implement update API call
    } else {
      addTask(taskData as IFormTask);
    }

    // Reset form and navigate back
    setCurrentTask(null);
    navigate("/tasks");
  };

  const handleCancel = () => {
    setCurrentTask(null);
    navigate("/tasks");
  };

  return (
    <div className={styles.addTask}>
      <div className={styles.addTaskFormContainer}>
        <h2>{currentTask ? "Edit Task" : "Add New Task"}</h2>

        <form className={styles.addTaskForm} onSubmit={handleSubmit}>
          {/* Basic Information */}
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

          {/* Time Range */}
          <div className={styles.formSection}>
            <h3>Execution Range</h3>

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
                />
              </div>
            </div>
          </div>

          {/* Estimates */}
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

          {/* Repeating Schedule */}
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
                  />
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
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
