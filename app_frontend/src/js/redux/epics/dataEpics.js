import { ofType } from 'redux-observable';
import { mapTo, switchMap } from 'rxjs/operators';

import { 
  dataActions,
  alertActions
} from './../actionTypes'

export const processFile = (action$) => action$.pipe(
  ofType(dataActions.PROCESS_FILE),
  switchMap( action => {
    const { fileName, fileData } = action
    const requestOptions = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({ fileData })
    };
    return fetch('/data/process', requestOptions)
      .then(response => response.json())
      .then(result => {
        const { dataset, message, error } = result
        return ({type: dataActions.INCOMING_DATA, metaData: {...dataset, fileName }, message, error: error })
      })
      .catch((error) => ({type: alertActions.SHOW_ALERT, error: error.message }))
    }
  )
)

export const sendDataToFit = (action$) => action$.pipe(
  ofType(dataActions.SEND_DATA_TO_FIT),
  switchMap( action => {
    const { fitSettings: { dataToFit, type } } = action
    const requestOptions = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({ data: { ...dataToFit }, type })
    };
    return fetch('/data/fit', requestOptions)
      .then(response => response.json())
      .then(result => {
        const { data, message, error } = result
        return ({type: 'RESPONSE_FIT', analysis: { fit: data }, message, error: error })
      })
      .catch((error) => ({type: alertActions.SHOW_ALERT, error: error.message }))
    }
  )
)