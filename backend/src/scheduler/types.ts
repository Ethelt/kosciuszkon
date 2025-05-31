export type Task = {
  priority: number;
  range: {
    from: Date;
    to: Date;
  };
  action: string;
  estimatedTime: number;
  repeating: string;
};

