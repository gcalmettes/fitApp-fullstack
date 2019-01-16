import { dataActions } from './../actionTypes';

export const dataset = (
  state = { 
    metaData: {
      fileName: '', 
      data: {}, 
      size: 0,
    }, 
    display: {
      currentTrace: 1,
      focusRange: null,
    },
    analysis: {
      fitRange: null,
    },
    message: null, 
    error: null}, 
  action
  ) => {
    const { type, metaData, display, analysis, message, error } = action

    switch (type) {
      case dataActions.INCOMING_DATA:
        return {
          metaData: {...state.metaData, ...metaData},
          display: {
            currentTrace: 1,
            focusRange: null,
          },
          analysis: {...state.analysis},
          message,
          error
        };
      case dataActions.CLEAR_DATA:
        return {
          metaData: null,
          display: null,
          analysis: null,
          message: null,
          error: null
        };
      case dataActions.PREVIOUS_TRACE:
        return {
          metaData: {...state.metaData},
          display: {
            focusRange: null,
            currentTrace: state.display.currentTrace > 1 
              ? state.display.currentTrace - 1 
              : 1
          },
          analysis: {
            ...state.analysis,
            fitRange: null,
          },
          message,
          error
        };
      case dataActions.NEXT_TRACE:
        return {
          metaData: {...state.metaData},
          display: {
            focusRange: null,
            currentTrace: state.display.currentTrace < state.metaData.size 
              ? state.display.currentTrace + 1 
              : state.metaData.size 
          },
          analysis: {
            ...state.analysis,
            fitRange: null,
          },
          message,
          error
        };
      case dataActions.SET_FOCUS_RANGE:
        return {
          metaData: {...state.metaData},
          display: {
            ...state.display,
            ...display
          },
          analysis: { ...state.analysis },
          message,
          error
        };
      case dataActions.SET_FIT_RANGE:
        return {
          metaData: {...state.metaData},
          display: {...state.display},
          analysis: {
            ...state.analysis, 
            ...analysis
          },
          message,
          error
        };
      default:
        return state;
    }
}