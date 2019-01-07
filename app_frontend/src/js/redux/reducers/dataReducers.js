import { dataActions as dataAc } from './../actionTypes';

export const dataset = 
  (state = { dataset: {fileName: '', data: {}, size: 0, currentTrace: 1}, message: null, error: null}, action) => {
    const { type, dataset, message, error } = action

    switch (type) {
      case dataAc.INCOMING_DATA:
        return {
          dataset: {...state.dataset, ...dataset},
          message,
          error
        };
      case dataAc.CLEAR_DATA:
        return {
          dataset: null,
          message: null,
          error: null
        };
      case dataAc.PREVIOUS_TRACE:
        return {
          dataset: {
            ...state.dataset, 
            currentTrace: state.dataset.currentTrace > 1 
              ? state.dataset.currentTrace - 1 
              : 1
          },
          message,
          error
        };
      case dataAc.NEXT_TRACE:
        return {
          dataset: {
            ...state.dataset, 
            currentTrace: state.dataset.currentTrace < state.dataset.size 
              ? state.dataset.currentTrace + 1 
              : state.dataset.size 
          },
          message,
          error
        };
      default:
        return state;
    }
}