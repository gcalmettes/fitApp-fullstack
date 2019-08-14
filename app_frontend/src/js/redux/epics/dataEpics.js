import { ofType } from 'redux-observable';
import { mapTo, switchMap } from 'rxjs/operators';

import { makeAuthHeader } from '../../helpers';

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
        const { data: { model, components }, message, error } = result

        const regex = /Model\((?<name>\w+)(, prefix=['|"](?<prefix>.*?)['|"])?\)/
        const regexGlobal = new RegExp(regex, "g")

        ///////////////////
        // COMPOSITE MODEL
        ///////////////////

        // extract model structure
        let matchObj, 
            modelStructure = ''
        while ((matchObj = regexGlobal.exec(model.name)) != null ) {
          const { groups: { name, prefix } } = matchObj
          const toAdd = prefix ? prefix : ''
          modelStructure += `${toAdd}${name} + `
        } 
        modelStructure = modelStructure.slice(0, modelStructure.length-3)

        // combine arrays to array of objects
        const modelData =  model.x.map((x, i) => ({ x, x0: model.x0[i], y: model.y[i] }))


        ///////////////////
        // COMPONENTS
        ///////////////////

        const componentsArray = components.reduce((acc, comp) => {
          const matchObj = regex.exec(comp.name)
          const { groups: { name, prefix } } = matchObj
          const compData = typeof(comp.y) == 'number'
            ? model.x0.map((x, i) => ({ x, y: comp.y }))
            : comp.y.map((y, i) => ({ x: model.x0[i], y }))
          acc.push({
            name: prefix ? `${prefix}${name}` : name,
            params: comp.params,
            data: compData
          })
          return acc
        }, [])

        return ({
          type: dataActions.INCOMING_FIT_DATA, 
          analysis: { 
            model: {
              name: modelStructure,
              params: model.params,
              data: modelData,
            },
            components: componentsArray
          }, message, error: error })
      })
      .catch((error) => ({type: alertActions.SHOW_ALERT, error: error.message }))
    }
  )
)


export const sendDataToCorrection = (action$) => action$.pipe(
  ofType(dataActions.SEND_DATA_TO_CORRECTION),
  switchMap( action => {
    const { correctionSettings: { trace, startIdx } } = action
    const requestOptions = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({ data: { ...trace }, startIdx })
    };
    return fetch('/data/correct', requestOptions)
      .then(response => response.json())
      .then(result => {
        const { data, message, error } = result

        return ({
          type: dataActions.REPLACE_TRACE, 
          analysis: { ...data }, 
          message, error: error })
      })
      .catch((error) => ({type: alertActions.SHOW_ALERT, error: error.message }))
    }
  )
)


export const saveDataToDatabase = (action$) => action$.pipe(
  ofType(dataActions.SAVE_DATA_TO_DATABASE),
  switchMap( action => {
    const { data, authentication: { username, access_token } } = action
    const requestOptions = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        ...makeAuthHeader(access_token)
      },
      body: JSON.stringify({ data, username })
    };
    return fetch('/data/save', requestOptions)
      .then(response => response.json())
      .then(result => {
        const { data, message, error } = result
        return ({type: 'DATA SAVED', message, error: error })
      })
      .catch((error) => ({type: alertActions.SHOW_ALERT, error: error.message }))
    }
  )
)