import { ITaskDetail } from '../../server/core/types';
import { TaskType } from '../../server/core/enums';
import { callRemote } from './index';

export enum TriggerState {
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL',
}

export interface IExecResult {
  triggerState: TriggerState;
  errMsg?: string;
  result?: ITaskDetail;
}

const runTask = async (taskType: TaskType) => {
  let result = {};
  let errMsg = '';
  let triggerState = TriggerState.SUCCESS;

  try {
    result = await callRemote({
      type: 'tasks/run',
      payload: {
        type: taskType
      },
    });
  } catch (e) {
    errMsg = e.message;
    triggerState = TriggerState.FAIL;
  }

  return {
    triggerState,
    result,
    errMsg,
  };
};

const cancelTask = async (taskType: TaskType) => {
  let result = {};
  let errMsg = '';
  let triggerState = TriggerState.SUCCESS;

  try {
    result = await callRemote({
      type: 'tasks/cancel',
      payload: {
        type: taskType
      },
    });
  } catch (e) {
    errMsg = e.stack;
    triggerState = TriggerState.FAIL;
  }

  return {
    triggerState,
    result,
    errMsg,
  };
};

const getTaskDetail = async (taskType: TaskType) => {
  let result = {};
  let errMsg = '';
  let triggerState = TriggerState.SUCCESS;

  try {
    result = await callRemote({
      type: 'tasks/detail',
      payload: {
        type: taskType
      },
    });
  } catch (e) {
    errMsg = e.message;
    triggerState = TriggerState.FAIL;
  }

  return {
    triggerState,
    result,
    errMsg,
  };
};

const exec = async (taskType: TaskType): Promise<IExecResult> => {
  const { triggerState: runTaskTriggerState, errMsg } = await runTask(taskType);
  if (runTaskTriggerState === TriggerState.FAIL) {
    return {
      triggerState: TriggerState.FAIL,
      errMsg,
      result: null,
    };
  }

  const { result, triggerState: getTaskDetailTriggerState, errMsg: errorMessage }
    = await getTaskDetail(taskType);

  if (getTaskDetailTriggerState === TriggerState.FAIL) {
    return {
      triggerState: TriggerState.FAIL,
      errMsg: errorMessage,
      result: null,
    };
  }

  return {
    triggerState: TriggerState.SUCCESS,
    errMsg: '',
    result: result as ITaskDetail,
  };
};

const cancel = async (taskType: TaskType): Promise<IExecResult> => {
  const { triggerState: runTaskTriggerState, errMsg } = await cancelTask(taskType);
  if (runTaskTriggerState === TriggerState.FAIL) {
    return {
      triggerState: TriggerState.FAIL,
      errMsg,
      result: null,
    };
  }
  const { result, triggerState: getTaskDetailTriggerState, errMsg: errorMessage }
    = await getTaskDetail(taskType);
  if (getTaskDetailTriggerState === TriggerState.FAIL) {
    return {
      triggerState: TriggerState.FAIL,
      errMsg: errorMessage,
      result: null,
    };
  }
  return {
    triggerState: TriggerState.SUCCESS,
    errMsg: '',
    result: result as ITaskDetail,
  }
};

export {
  // base
  runTask,
  cancelTask,
  getTaskDetail,

  exec,
  cancel
};
