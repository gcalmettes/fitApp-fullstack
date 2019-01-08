import { 
  dataActions
} from './actionTypes' 

export const processFile = ( { fileName, fileData } ) => ({
  type: dataActions.PROCESS_FILE,
  fileName,
  fileData
})
