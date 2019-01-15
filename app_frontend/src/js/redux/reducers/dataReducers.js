import { dataActions } from './../actionTypes';

export const dataset = (
  state = { 
    dataset: {
      fileName: '', 
      data: {}, 
      size: 0, 
      currentTrace: 1,
      focusRange: null,
      fitRange: null,
    }, 
    message: null, 
    error: null}, 
  action
  ) => {
    const { type, dataset, message, error } = action

    switch (type) {
      case dataActions.INCOMING_DATA:
        return {
          dataset: {...state.dataset, ...dataset},
          message,
          error
        };
      case dataActions.CLEAR_DATA:
        return {
          dataset: null,
          message: null,
          error: null
        };
      case dataActions.PREVIOUS_TRACE:
        return {
          dataset: {
            ...state.dataset, 
            focusRange: null,
            fitRange: null,
            currentTrace: state.dataset.currentTrace > 1 
              ? state.dataset.currentTrace - 1 
              : 1
          },
          message,
          error
        };
      case dataActions.NEXT_TRACE:
        return {
          dataset: {
            ...state.dataset, 
            focusRange: null,
            fitRange: null,
            currentTrace: state.dataset.currentTrace < state.dataset.size 
              ? state.dataset.currentTrace + 1 
              : state.dataset.size 
          },
          message,
          error
        };
      case dataActions.SET_FOCUS_RANGE:
        return {
          dataset: {
            ...state.dataset, 
            ...dataset
          },
          message,
          error
        };
      case dataActions.SET_FIT_RANGE:
        return {
          dataset: {
            ...state.dataset, 
            ...dataset
          },
          message,
          error
        };
      default:
        return state;
    }
}