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
        return ({type: dataActions.INCOMING_DATA, dataset: {...dataset, fileName, currentTrace: 1}, message, error: error })
      })
      .catch((error) => ({type: alertActions.SHOW_ALERT, error: error.message }))
    }
  )
)