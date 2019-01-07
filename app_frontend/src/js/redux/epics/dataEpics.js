import { ofType } from 'redux-observable';
import { mapTo, switchMap } from 'rxjs/operators';

import { 
  dataActions as dataAc,
  alertActions as alertAc
} from './../actionTypes'

export const processFile = (action$) => action$.pipe(
  ofType(dataAc.PROCESS_FILE),
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
        // console.log(result)
        const { dataset, message, error } = result
        return ({type: dataAc.INCOMING_DATA, dataset: {...dataset, fileName}, message, error: error })
      })
      .catch((error) => ({type: alertAc.SHOW_ALERT, error: error.message }))
    }
  )
)